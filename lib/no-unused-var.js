import { findProjectFiles } from "./findProjectFiles.js"
import { regexpEscape } from "./regexpEscape.js"

/** @type {import("@eslint/css").CSSRuleDefinition<{ RuleOptions: [], MessageIds: "varNotUsed" }>} */
const rule = {
  meta: {
    languages: ["css/css"],
    type: "suggestion",
    docs: {
      description: "Reports unused CSS custom properties.",
    },
    fixable: "code",
    schema: [],
    messages: {
      varNotUsed: 'Unused custom property "{{varName}}".',
    },
  },

  create(context) {
    return {
      Declaration: (declNode) => {
        const varName = declNode.property
        if (!varName.startsWith("--")) return
        let found = false
        const regexp = new RegExp(
          `(?<!\\w)var\\(\\s*${regexpEscape(varName)}\\s*[,)]`,
          "g",
        )
        for (const { contents } of findProjectFiles("**/*.css", context)) {
          if (contents.match(regexp)) {
            found = true
            break
          }
        }
        if (found) return
        const declLoc = context.sourceCode.getLoc(declNode)
        context.report({
          loc: {
            start: declLoc.start,
            end: {
              line: declLoc.start.line,
              column: declLoc.start.column + varName.length,
            },
          },
          messageId: "varNotUsed",
          data: { varName },
        })
      },
    }
  },
}

export default rule
