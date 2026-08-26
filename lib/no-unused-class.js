import { cssUnescape } from "./cssEscape.js"
import { findProjectFiles } from "./findProjectFiles.js"
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
      ClassSelector: (node) => {
        const className = cssUnescape(node.name)
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
        if (!found) {
          context.report({
            node,
            messageId: "classNotUsed",
            data: { className },
          })
        }
      },
    }
  },
}

export default rule
