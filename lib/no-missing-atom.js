import { basename, relative } from "node:path"
import { cssEscape, cssUnescape } from "./cssEscape.js"
import { findUsedAtoms, matchAtom } from "./findUsedAtoms.js"

/** @type {import("@eslint/css").CSSRuleDefinition<{ RuleOptions: [], MessageIds: "atomMissing" }>} */
const rule = {
  meta: {
    languages: ["css/css"],
    type: "suggestion",
    docs: {
      description: "Report missing atomic classes in your utilities CSS file.",
    },
    fixable: "code",
    schema: [],
    messages: {
      atomMissing:
        'Atomic class "{{className}}" is referenced in "{{fileName}}", ' +
        "but not found in the utilities CSS file.",
    },
  },

  create(context) {
    if (basename(context.filename) !== "utilities.css") return {}
    return {
      StyleSheet: (sheetNode) => {
        const reportedClasses = new Set([""])
        const usedAtoms = findUsedAtoms(context)
        for (const usedAtom of usedAtoms) {
          let isDefined = false
          let afterIdx = -1
          for (
            let childIdx = 0;
            childIdx < sheetNode.children.length;
            childIdx++
          ) {
            const childNode = sheetNode.children[childIdx]
            if (
              childNode.type !== "Rule" ||
              childNode.prelude.type !== "SelectorList"
            ) {
              continue
            }
            const definedClasses = childNode.prelude.children.flatMap(
              (item) => {
                if (item.type !== "Selector") return []
                return item.children.flatMap((part) => {
                  if (part.type !== "ClassSelector") return []
                  return [cssUnescape(part.name)]
                })
              },
            )
            if (definedClasses.includes(usedAtom.className)) {
              isDefined = true
              break
            }
            const definedClass = definedClasses[0]
            if (definedClass == null) continue
            const definedAtom = matchAtom(definedClass)
            const definedOrder = definedAtom?.order ?? definedClass.split(":")
            const usedOrder = usedAtom.order
            if (definedOrder.length < usedOrder.length) afterIdx = childIdx
            if (definedOrder.length !== usedOrder.length) continue
            for (let partIdx = 0; partIdx < usedOrder.length; partIdx++) {
              const definedPart = definedOrder[partIdx]
              const usedPart = usedOrder[partIdx]
              const order = definedPart.localeCompare(usedPart, undefined, {
                numeric: true,
              })
              if (order < 0) afterIdx = childIdx
              if (order !== 0) break
            }
          }
          if (isDefined) continue
          if (reportedClasses.has(usedAtom.className)) continue
          reportedClasses.add(usedAtom.className)
          const fileName = relative(context.cwd, usedAtom.filePath)
          const afterNode = afterIdx >= 0 ? sheetNode.children[afterIdx] : null
          /** @type {import("@eslint/core").Position} */
          const afterPos = afterNode?.loc
            ? afterNode.loc.end
            : { line: 1, column: 1 }
          const afterOffset = context.sourceCode.getIndexFromLoc(afterPos)
          const emptyLinesAfter = Array.from(
            context.sourceCode.text
              .substring(afterOffset)
              .match(/^\s*/)?.[0]
              .matchAll(/\n/g) ?? [],
          ).length
          const beforePadding = afterNode ? "\n\n" : ""
          const afterPadding =
            emptyLinesAfter === 0 ? "\n\n" : emptyLinesAfter === 1 ? "\n" : ""
          const reportLine =
            afterNode && emptyLinesAfter > 0 ? afterPos.line + 1 : afterPos.line
          const reportStart = { line: reportLine, column: 1 }
          const reportOffset = context.sourceCode.getIndexFromLoc(reportStart)
          const reportEnd = context.sourceCode.getLocFromIndex(
            Math.min(reportOffset + 1, context.sourceCode.text.length),
          )
          context.report({
            loc: { start: reportStart, end: reportEnd },
            messageId: "atomMissing",
            data: {
              className: usedAtom.className,
              fileName,
            },
            *fix(fixer) {
              const ruleCss =
                beforePadding +
                `.${cssEscape(usedAtom.className)} { ${usedAtom.ruleBody} }` +
                afterPadding
              yield fixer.insertTextAfterRange(
                [afterOffset, afterOffset],
                ruleCss,
              )
            },
          })
        }
      },
    }
  },
}

export default rule
