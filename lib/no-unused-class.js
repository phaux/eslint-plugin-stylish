import { cssUnescape } from "./cssEscape.js"
import { findProjectFiles } from "./findProjectFiles.js"
import { matchAtom } from "./findUsedAtoms.js"
import { regexpEscape } from "./regexpEscape.js"

/** @type {import("@eslint/css").CSSRuleDefinition<{ RuleOptions: [], MessageIds: "classNotUsed" }>} */
const rule = {
  meta: {
    languages: ["css/css"],
    type: "suggestion",
    docs: {
      description: "Report class definitions which aren't referenced in JS.",
    },
    fixable: "code",
    schema: [],
    messages: {
      classNotUsed: 'Class "{{className}}" is not referenced in any JS file.',
    },
  },

  create(context) {
    return {
      ClassSelector: (classNode) => {
        const className = cssUnescape(classNode.name)
        let found = false
        const regexp = new RegExp(
          `(?<!\\w)${regexpEscape(className)}(?!\\w)`,
          "g",
        )
        for (const { contents } of findProjectFiles(
          "**/*.{js,ts,jsx,tsx}",
          context,
        )) {
          if (contents.match(regexp)) {
            found = true
            break
          }
        }
        if (found) return

        // Check if it's a Tailwind class.
        const atom = matchAtom(className)
        if (atom) {
          const selectorNode = context.sourceCode.getParent(classNode)
          if (
            selectorNode?.type === "Selector" &&
            selectorNode.children.length === 1
          ) {
            const listNode = context.sourceCode.getParent(selectorNode)
            if (
              listNode?.type === "SelectorList" &&
              listNode.children.length === 1
            ) {
              const ruleNode = context.sourceCode.getParent(listNode)
              if (ruleNode?.type === "Rule") {
                const ruleText = context.sourceCode
                  .getText(ruleNode.block)
                  .replace(/\W+/g, " ")
                  .trim()
                const atomText = atom.ruleBody.replace(/\W+/g, " ").trim()
                if (ruleText === atomText) {
                  // Automatically remove Tailwind classes, because
                  // they can be re-added again trivially.
                  return context.report({
                    node: classNode,
                    messageId: "classNotUsed",
                    data: { className },
                    *fix(fixer) {
                      yield fixer.remove(ruleNode)
                    },
                  })
                }
              }
            }
          }
        }
        // Not a Tailwind class – report without auto fix.
        context.report({
          node: classNode,
          messageId: "classNotUsed",
          data: { className },
        })
      },
    }
  },
}

export default rule
