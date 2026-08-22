import { globIterateSync } from "glob/raw"
import { readFileSync } from "node:fs"

/**
 * Iterates over all project files matching the given pattern.
 * @param {string} pattern The glob pattern to match files.
 * @param {string} root The root directory to search for files.
 * @returns {Generator<{ path: string; contents: string }>}
 * Generator that yields the path and contents of each file.
 */
export function* findProjectFiles(pattern, root) {
  const iter = globIterateSync(pattern, {
    absolute: true,
    cwd: root,
    root: "",
    ignore: [".*/**", "node_modules/**"],
    nodir: true,
  })
  for (const path of iter) {
    const contents = readFileSync(path, "utf8")
    yield { path, contents }
  }
}
