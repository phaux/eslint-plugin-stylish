import { ESLintUtils } from "@typescript-eslint/utils"
import { findProjectFiles } from "./findProjectFiles.js"
import { regexpEscape } from "./regexpEscape.js"

/**
 * Finds all references to a given class name in the module map.
 * @param {string} className The class name to search for.
 * @param {string} root The root directory to search for files.
 * @returns {Generator<string>} A generator of filenames
 * where the class name is referenced.
 */
function* findClassNameDefinitions(className, root) {
  const searchStr = className.replace(/[^\w-]/g, "\\$&")
  const regexp = new RegExp(`\\.${regexpEscape(searchStr)}(?!\\w)`, "g")
  for (const { path, contents } of findProjectFiles("**/*.css", root)) {
    if (contents.match(regexp)) {
      yield path
    }
  }
}

const rule =
  /** @type {typeof ESLintUtils.RuleCreator.withoutDocs<[], "undefinedClass">} */ (
    ESLintUtils.RuleCreator.withoutDocs
  )({
    meta: {
      type: "suggestion",
      docs: {
        description: "Disallow classes in JSX which aren't defined in CSS.",
      },
      schema: [],
      messages: {
        undefinedClass: 'Class "{{className}}" is not defined in any CSS file.',
      },
    },
    create(context) {
      return {
        JSXAttribute(attrNode) {
          // Only check 'class' and 'className' attributes
          if (
            (attrNode.name.name !== "class" &&
              attrNode.name.name !== "className") ||
            !attrNode.value ||
            attrNode.value.type !== "Literal" ||
            typeof attrNode.value.value !== "string"
          ) {
            return
          }

          const attrValueNode = attrNode.value
          const attrValue = attrValueNode.value

          const classMatches = attrValue.matchAll(/\S+(?!\S)/g)

          for (const classMatch of classMatches) {
            const className = classMatch[0]
            const references = Array.from(
              findClassNameDefinitions(className, context.cwd),
            )
            if (references.length === 0) {
              const { line, column } = attrValueNode.loc.start
              const classStart = column + 1 + classMatch.index
              const classEnd = classStart + className.length
              context.report({
                loc: {
                  start: { line: line, column: classStart },
                  end: { line: line, column: classEnd },
                },
                messageId: "undefinedClass",
                data: { className },
              })
            }
          }
        },
      }
    },
  })

export default /** @type {import("eslint").JSRuleDefinition} */ (
  /** @type {unknown} */ (rule)
)
