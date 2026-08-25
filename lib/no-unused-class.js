import { cssUnescape } from "./cssEscape.js"
import { findProjectFiles } from "./findProjectFiles.js"
import { regexpEscape } from "./regexpEscape.js"

/**
 * Finds all references to a given class name in the module map.
 * @param {string} className The class name to search for.
 * @param {string} root The root directory to search in.
 * @returns {Generator<string>} A generator of filenames
 * where the class name is referenced.
 */
function* findClassNameReferences(className, root) {
  const regexp = new RegExp(`(?<!\\w)${regexpEscape(className)}(?!\\w)`, "g")
  for (const { path, contents } of findProjectFiles(
    "**/*.{js,ts,jsx,tsx}",
    root,
  )) {
    if (contents.match(regexp)) {
      yield path
    }
  }
}

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
        const references = Array.from(
          findClassNameReferences(className, context.cwd),
        )
        if (references.length === 0) {
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
