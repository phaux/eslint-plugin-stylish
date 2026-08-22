import noUndefinedClass from "./no-undefined-class.js"
import noUnusedClass from "./no-unused-class.js"

const js = /** @satisfies {import("eslint/config").ConfigObject} */ ({
  files: ["**/*.{js,jsx,ts,tsx}"],
  plugins: /** @type {{ stylish: import("eslint").ESLint.Plugin }} */ ({}),
  rules: {
    "stylish/no-undefined-class": "warn",
  },
})

const css = /** @satisfies {import("eslint/config").ConfigObject} */ ({
  files: ["**/*.css"],
  language: "css/css",
  plugins: /** @type {{ stylish: import("eslint").ESLint.Plugin }} */ ({}),
  rules: {
    "stylish/no-unused-class": "warn",
  },
})

const recommended = /** @satisfies {import("eslint/config").ConfigObject[]} */ (
  /** @type {const} */ ([js, css])
)

const stylish = /** @satisfies {import("eslint").ESLint.Plugin} */ ({
  rules: {
    "no-undefined-class": noUndefinedClass,
    "no-unused-class": noUnusedClass,
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
