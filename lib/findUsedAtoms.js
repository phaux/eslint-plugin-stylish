import { defaultAtoms } from "./defaultAtoms.js"
import { defaultModifiers } from "./defaultModifiers.js"
import { findProjectFiles } from "./findProjectFiles.js"
import { regexpEscape } from "./regexpEscape.js"

/**
 * Finds used atomic classes in the project.
 * @param {{ settings: Record<string, unknown>, cwd: string }} context The rule context.
 * @returns {Generator<import("./types.ts").UsedAtom>} A generator of class occurrences.
 */
export function* findUsedAtoms(context) {
  for (const { path, contents } of findProjectFiles(
    "**/*.{js,ts,jsx,tsx}",
    context,
  )) {
    // TODO: ignore quotes in comments
    // TODO: handle inner template expressions
    const stringMatches = contents.matchAll(
      /\/\/.*?\n|\/\*.*?\*\/|(["'`])(.*?)\1/gs,
    )
    for (const stringMatch of stringMatches) {
      const stringContent = stringMatch[2]
      if (!stringContent) continue
      const words = stringContent.matchAll(/[^\s'"`,;{}<>]*\w+[^\s'"`,;{}<>]*/g)
      for (const wordMatch of words) {
        const word = wordMatch[0]
        const atomMatch = matchAtom(word)
        if (atomMatch)
          yield {
            ...atomMatch,
            filePath: path,
          }
      }
    }
  }
}

/**
 * Checks if the given word string is a defined atom,
 * potentially prefixed with one or more modifiers.
 * @param {string} word The string to check.
 * @returns {import("./types.ts").AtomMatch | undefined} The matched atom or undefined.
 */
export function matchAtom(word) {
  atoms: for (const atom of defaultAtoms) {
    const [pattern, flags] =
      typeof atom.name == "string"
        ? [regexpEscape(atom.name), ""]
        : [atom.name.source, atom.name.flags]
    const atomRegexp = new RegExp(`(?<!\\w)(?:${pattern})$`, flags)
    const atomMatch = word.match(atomRegexp)
    if (atomMatch) {
      let atomName = atomMatch[0]
      const atomOrder =
        typeof atom.order == "function" ? atom.order(atomMatch) : atom.order
      let order = [atomOrder ?? atomName]
      let prefix = word.substring(0, atomMatch.index)
      let ruleBody =
        typeof atom.body == "function" ? atom.body(atomMatch) : atom.body
      repeat: while (prefix.length > 0) {
        for (const modifier of defaultModifiers) {
          const [pattern, flags] =
            typeof modifier.prefix == "string"
              ? [regexpEscape(modifier.prefix), ""]
              : [modifier.prefix.source, modifier.prefix.flags]
          const modifierRegexp = new RegExp(
            `(?<!\\w)(?:${pattern})(?=:$)`,
            flags,
          )
          const modifierMatch = prefix.match(modifierRegexp)
          if (modifierMatch) {
            const modifierName = modifierMatch[0]
            atomName = `${modifierName}:${atomName}`
            const modifierOrder =
              typeof modifier.order == "function"
                ? modifier.order(modifierMatch)
                : modifier.order
            order.unshift(modifierOrder ?? modifierName)
            prefix = prefix.substring(0, modifierMatch.index ?? 0)
            const selector =
              typeof modifier.selector == "function"
                ? modifier.selector(modifierMatch)
                : modifier.selector
            ruleBody = `${selector} { ${ruleBody} }`
            continue repeat
          }
        }
        continue atoms
      }
      return {
        className: atomName,
        order: order,
        ruleBody: ruleBody,
      }
    }
  }
}
