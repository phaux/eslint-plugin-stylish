import css from "@eslint/css"
import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"
import stylish from "./lib/index.js"

export default defineConfig([
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["fixtures/**", "types/**"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      stylish.configs.js,
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ["**/*.css"],
    ignores: ["fixtures/**"],
    language: "css/css",
    extends: [css.configs.recommended, stylish.configs.css],
  },
])
