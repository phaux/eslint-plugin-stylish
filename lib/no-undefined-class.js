import { ESLintUtils } from "@typescript-eslint/utils"
import { cssEscape } from "./cssEscape.js"
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
  const searchStr = cssEscape(className)
  const regexp = new RegExp(`\\.${regexpEscape(searchStr)}(?!\\w)`, "g")
  for (const { path, contents } of findProjectFiles("**/*.css", root)) {
    if (contents.match(regexp)) {
      yield path
    }
  }
}

const classPropRegexp = /[cC]lass(Name)?$/

const rule =
  /** @type {typeof ESLintUtils.RuleCreator.withoutDocs<[], "classNotDefined">} */ (
    ESLintUtils.RuleCreator.withoutDocs
  )({
    meta: {
      type: "suggestion",
      docs: {
        description: "Report class references which aren't defined in CSS.",
      },
      schema: [],
      messages: {
        classNotDefined:
          'Class "{{className}}" is not defined in any CSS file.',
      },
    },
    create(context) {
      let isInsideClassProp = false
      return {
        JSXAttribute(attrNode) {
          if (typeof attrNode.name.name != "string") return
          if (attrNode.name.name.match(classPropRegexp)) {
            isInsideClassProp = true
          }
        },
        "JSXAttribute:exit"() {
          isInsideClassProp = false
        },

        Property(propNode) {
          if (propNode.computed) return
          if (propNode.key.type !== "Identifier") return
          if (propNode.key.name.match(classPropRegexp)) {
            isInsideClassProp = true
          }
        },
        "Property:exit"() {
          isInsideClassProp = false
        },

        VariableDeclarator(declNode) {
          if (declNode.id.type !== "Identifier") return
          if (declNode.id.name.match(classPropRegexp)) {
            isInsideClassProp = true
          }
        },
        "VariableDeclarator:exit"() {
          isInsideClassProp = false
        },

        ":function"() {
          isInsideClassProp = false
        },
        JSXElement() {
          isInsideClassProp = false
        },

        Literal(node) {
          if (!isInsideClassProp) return
          if (typeof node.value != "string") return
          checkString(node.value, node.raw, node.loc.start)
        },
        TemplateElement(node) {
          if (!isInsideClassProp) return
          checkString(node.value.cooked ?? "", node.value.raw, node.loc.start)
        },
      }

      /**
       *
       * @param {string} value
       * @param {string} _raw
       * @param {import("estree").Position} start
       */
      function checkString(value, _raw, start) {
        const classMatches = value.matchAll(/\S+(?!\S)/g)
        // TODO: account for escaped characters and new lines
        for (const classMatch of classMatches) {
          const className = classMatch[0]
          const references = Array.from(
            findClassNameDefinitions(className, context.cwd),
          )
          if (references.length === 0) {
            const { line, column } = start
            const classStart = column + 1 + classMatch.index
            const classEnd = classStart + className.length
            context.report({
              loc: {
                start: { line: line, column: classStart },
                end: { line: line, column: classEnd },
              },
              messageId: "classNotDefined",
              data: { className },
            })
          }
        }
      }
    },
  })

export default /** @type {import("eslint").JSRuleDefinition} */ (
  /** @type {unknown} */ (rule)
)
