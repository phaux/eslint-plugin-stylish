import { findProjectFiles } from "./findProjectFiles.js"
import { regexpEscape } from "./regexpEscape.js"

/** @type {import("@eslint/css").CSSRuleDefinition<{ RuleOptions: [], MessageIds: "varNotDefined" }>} */
const rule = {
  meta: {
    languages: ["css/css"],
    type: "problem",
    docs: {
      description: "Reports undefined custom property references.",
    },
    fixable: "code",
    schema: [],
    messages: {
      varNotDefined: 'Undefined custom property "{{varName}}".',
    },
  },

  create(context) {
    return {
      Function: (funcNode) => {
        if (funcNode.name !== "var") return
        const varIdent = funcNode.children[0]
        if (varIdent?.type !== "Identifier") return
        const varName = varIdent.name
        if (!varName.startsWith("--")) return
        checkVar(varName, context.sourceCode.getLoc(varIdent))
      },
      Raw: (rawNode) => {
        const rawText = rawNode.value
        const rawOffset = context.sourceCode.getIndexFromLoc(
          context.sourceCode.getLoc(rawNode).start,
        )
        const matches = rawText.matchAll(/(?<!\w)var\(\s*(--[^\s),]+)\s*[,)]/dg)
        for (const match of matches) {
          const varName = match[1]
          const varIndex = match.indices?.[1]?.[0] ?? 0
          const start = context.sourceCode.getLocFromIndex(rawOffset + varIndex)
          const end = context.sourceCode.getLocFromIndex(
            rawOffset + varIndex + varName.length,
          )
          checkVar(varName, { start, end })
        }
      },
    }

    /**
     * @param {string} varName
     * @param {import("eslint").AST.SourceLocation} loc
     */
    function checkVar(varName, loc) {
      let found = false
      const regexp = new RegExp(`(?<!\\w)${regexpEscape(varName)}\\s*:`, "g")
      for (const { contents } of findProjectFiles("**/*.css", context)) {
        if (contents.match(regexp)) {
          found = true
          break
        }
      }
      if (found) return
      context.report({
        loc,
        messageId: "varNotDefined",
        data: { varName },
      })
    }
  },
}

export default rule
