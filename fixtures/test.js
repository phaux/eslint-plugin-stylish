import css from "@eslint/css"
import js from "@eslint/js"
import { Linter } from "eslint"
import { readdirSync, readFileSync } from "node:fs"
import { test } from "node:test"
import stylish from "../lib/index.js"

const fixturesPath = `${import.meta.dirname}`

const fixtureDirs = readdirSync(fixturesPath, {
  withFileTypes: true,
}).filter((entry) => entry.isDirectory())

for (const fixtureDir of fixtureDirs) {
  const fixturePath = `${fixturesPath}/${fixtureDir.name}`
  const fixtureFiles = readdirSync(fixturePath, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile())
    .filter((entry) => entry.name.match(/\.(js|jsx|ts|tsx|css)$/i))

  for (const fixtureFile of fixtureFiles) {
    test(`test ${fixtureDir.name}/${fixtureFile.name}`, (t) => {
      const fileName = `${fixturePath}/${fixtureFile.name}`
      const source = readFileSync(fileName, "utf8")
      const linter = new Linter({ cwd: fixturePath })
      const result = linter.verify(
        source,
        [
          {
            basePath: fixturePath,
            files: ["**/*.{js,jsx,ts,tsx}"],
            languageOptions: {
              sourceType: "module",
              parserOptions: {
                ecmaFeatures: {
                  jsx: true,
                },
              },
            },
            plugins: { js, stylish },
            rules: {
              ...stylish.configs.js.rules,
            },
          },
          {
            files: ["**/*.css"],
            language: "css/css",
            plugins: { css, stylish },
            rules: {
              ...stylish.configs.css.rules,
            },
          },
        ],
        fileName,
      )
      t.assert.fileSnapshot(
        result,
        `fixtures/${fixtureDir.name}/${fixtureFile.name}.json`,
      )
    })
  }
}
