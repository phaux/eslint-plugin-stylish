import noMissingAtom from "./no-missing-atom.js"
import noUndefinedClass from "./no-undefined-class.js"
import noUndefinedVar from "./no-undefined-var.js"
import noUnusedClass from "./no-unused-class.js"
import noUnusedVar from "./no-unused-var.js"

const js = /** @satisfies {import("eslint/config").ConfigObject} */ ({
  files: ["**/*.{js,jsx,ts,tsx}"],
  plugins: /** @type {{ stylish: import("eslint").ESLint.Plugin }} */ ({}),
  rules: {
    "stylish/no-undefined-class": "error",
  },
})

const css = /** @satisfies {import("eslint/config").ConfigObject} */ ({
  files: ["**/*.css"],
  language: "css/css",
  plugins: /** @type {{ stylish: import("eslint").ESLint.Plugin }} */ ({}),
  rules: {
    "css/no-invalid-properties": ["error", { allowUnknownVariables: true }],
    "stylish/no-missing-atom": "warn",
    "stylish/no-undefined-var": "error",
    "stylish/no-unused-class": "warn",
    "stylish/no-unused-var": "warn",
  },
})

const recommended = /** @satisfies {import("eslint/config").ConfigObject[]} */ (
  /** @type {const} */ ([js, css])
)

const stylish = /** @satisfies {import("eslint").ESLint.Plugin} */ ({
  rules: {
    "no-missing-atom": noMissingAtom,
    "no-undefined-class": noUndefinedClass,
    "no-undefined-var": noUndefinedVar,
    "no-unused-class": noUnusedClass,
    "no-unused-var": noUnusedVar,
  },
  configs: {
    recommended,
    js,
    css,
  },
})

Object.assign(js.plugins, { stylish })
Object.assign(css.plugins, { stylish })

export default stylish
