import { globIterateSync } from "glob/raw"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

/**
 * File contents cache.
 * @type {Map<string, { mtimeMs: number, contents: string }>}
 */
const fileCache = new Map()

/**
 * Iterates over all project files matching the given pattern.
 * @param {string} pattern The glob pattern to match files.
 * @param {string} root The root directory to search for files.
 * @returns {Generator<{ path: string; contents: string }>}
 * Generator that yields the path and contents of each file.
 */
export function* findProjectFiles(pattern, root) {
  const iter = globIterateSync(pattern, {
    cwd: root,
    root: "",
    ignore,
    nodir: true,
    withFileTypes: true,
    stat: true,
  })
  for (const entry of iter) {
    assert(typeof entry == "object")
    const path = entry.fullpath()
    const cached = fileCache.get(path)
    if (cached != null && cached.mtimeMs == entry.mtimeMs) {
      yield { path, contents: cached.contents }
      continue
    }
    const contents = readFileSync(path, "utf8")
    if (entry.mtimeMs != null) {
      fileCache.set(path, { mtimeMs: entry.mtimeMs, contents })
    }
    yield { path, contents }
  }
}

const ignore = [
  ".*/**",
  "node_modules/**",
  "dist/**",
  "build/**",
  "output/**",
  "test/**",
  "tests/**",
  "spec/**",
  "fixtures/**",
  "coverage/**",
]
