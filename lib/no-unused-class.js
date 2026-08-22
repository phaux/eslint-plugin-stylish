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

/** @type {import("@eslint/css").CSSRuleDefinition} */
const rule = {
  meta: {
    languages: ["css/css"],
    type: "suggestion",
    docs: {
      description: "Disallow CSS classes which aren't referenced in JS.",
    },
    fixable: "code",
    schema: [],
    messages: {
      unusedClass: 'Class "{{className}}" is not referenced in any JS file.',
    },
  },

  create(context) {
    return {
      ClassSelector: (node) => {
        const className = node.name.replace(/\\(.)/g, "$1")
        const references = Array.from(
          findClassNameReferences(className, context.cwd),
        )
        if (references.length === 0) {
          context.report({
            node,
            messageId: "unusedClass",
            data: { className },
          })
        }
      },
    }
  },
}

export default rule
