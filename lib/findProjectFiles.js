import { globSync, readFileSync, statSync } from "node:fs"

/**
 * Memoized projects and their file entries.
 * @type {Map<string, { timestamp: number, files: Map<string, { mtimeMs: number }> }>}
 */
const projectCache = new Map()

/**
 * Memoized files and their contents.
 * @type {Map<string, { mtimeMs: number, contents: string }>}
 */
const fileCache = new Map()

/**
 * Iterates over all project files matching the given pattern.
 * @param {string} pattern The glob pattern to match files.
 * @param {{ settings: Record<string, unknown>, cwd: string }} context The rule context.
 * @returns {Generator<{ path: string; contents: string }>}
 * Generator that yields the path and contents of each file.
 */
export function* findProjectFiles(pattern, context) {
  const root = String(context.settings.root ?? context.cwd)
  const projectKey = `${root}/${pattern}`
  let project = projectCache.get(projectKey)
  if (!project) {
    project = {
      timestamp: -Infinity,
      files: new Map(),
    }
    projectCache.set(projectKey, project)
  }
  if (Date.now() > project.timestamp + 1_000) {
    project.files.clear()
    const entries = globSync(pattern, {
      cwd: root,
      exclude: ignore,
      withFileTypes: true,
    })
    for (const entry of entries) {
      const path = `${entry.parentPath}/${entry.name}`
      const stats = statSync(path)
      project.files.set(path, { mtimeMs: stats.mtimeMs })
    }
    project.timestamp = Date.now()
  }
  for (const [path, { mtimeMs }] of project.files) {
    const file = fileCache.get(path)
    if (file != null && file.mtimeMs === mtimeMs) {
      yield { path, contents: file.contents }
      continue
    }
    const contents = readFileSync(path, "utf8")
    if (mtimeMs != null) {
      fileCache.set(path, { mtimeMs, contents })
    }
    yield { path, contents }
  }
}

const ignore = [
  "**/.*/",
  "**/node_modules/",
  "**/dist/",
  "**/build/",
  "**/output/",
  "**/test/",
  "**/tests/",
  "**/spec/",
  "**/fixtures/",
  "**/coverage/",
]
