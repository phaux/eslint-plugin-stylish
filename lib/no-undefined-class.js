import { ESLintUtils } from "@typescript-eslint/utils"
import { cssEscape } from "./cssEscape.js"
import { findProjectFiles } from "./findProjectFiles.js"
import { regexpEscape } from "./regexpEscape.js"

const classPropRegexp = /[cC]lass(?:Names?|es)?$/

const rule =
  /** @type {typeof ESLintUtils.RuleCreator.withoutDocs<[], "classNotDefined">} */ (
    ESLintUtils.RuleCreator.withoutDocs
  )({
    meta: {
      type: "problem",
      docs: {
        description: "Reports class references which aren't defined in CSS.",
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
        // TODO: account for escaped characters
        for (const classMatch of classMatches) {
          const className = classMatch[0]
          let found = false
          const searchStr = cssEscape(className)
          const regexp = new RegExp(`\\.${regexpEscape(searchStr)}(?!\\w)`, "g")
          for (const { contents } of findProjectFiles("**/*.css", context)) {
            if (contents.match(regexp)) {
              found = true
              break
            }
          }
          if (!found) {
            const startOffset = context.sourceCode.getIndexFromLoc(start)
            const classStartOffset = startOffset + 1 + classMatch.index
            const classEndOffset = classStartOffset + className.length
            const classStart =
              context.sourceCode.getLocFromIndex(classStartOffset)
            const classEnd = context.sourceCode.getLocFromIndex(classEndOffset)
            context.report({
              loc: {
                start: classStart,
                end: classEnd,
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
