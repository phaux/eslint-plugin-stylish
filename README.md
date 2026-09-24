# eslint-plugin-stylish

**Tailwind in vanilla CSS.**

ESLint rules for keeping atomic class names in JavaScript and CSS in sync.
Reports unused CSS classes and suggests adding missing utility classes automatically.

Use Tailwind utility classes in JS/TS,
run ESLint with `--fix`, and commit the generated `utilities.css` file.
No Tailwind build step or other special CSS tooling is required.

## Quick start

```sh
npm install --save-dev eslint @eslint/js @eslint/css eslint-plugin-stylish
```

Example `eslint.config.js`:

```js
import css from "@eslint/css"
import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import stylish from "eslint-plugin-stylish"

export default defineConfig([
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [js.configs.recommended, stylish.configs.js],
  },
  {
    files: ["**/*.css"],
    language: "css/css",
    extends: [css.configs.recommended, stylish.configs.css],
  },
])
```

This config will already warn about undeclared classes in JS and unused classes in CSS.

Additionally, you can create an **empty `utilities.css` file** and import it from your main CSS file,
for example:

```css
@layer base, components, utilities;

@import "./utilities.css" layer(utilities);

@layer base {
  /* Example reset styles (plugin doesn't add any) */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
  }
  :root {
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }
}
```

Then, use Tailwind classes in you JS files.
For example, this JSX:

```jsx
export function Card() {
  return <article className="flex gap-4 flex-col md:flex-row" />
}
```

will suggest an auto fix which adds the missing classes to `utilities.css`:

```css
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.gap-4 {
  gap: calc(var(--spacing) * 4);
}

.md\:flex-row {
  @media (width >= 48rem) {
    flex-direction: row;
  }
}
```

You can setup your editor to run ESLint autofix on save:

`.zed/settings/json`

```json
{
  "code_actions_on_format": {
    "source.fixAll.eslint": true
  },
  "format_on_save": "on",
  "languages": {
    "CSS": {
      "language_servers": ["eslint"]
    }
  }
}
```

`.vscode/settings.json`

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["css"]
}
```

or run it manually:

```sh
npx eslint . --fix
```

## Advantages over Tailwind CSS

- **No build step.** The utility classes are part of the project source.
- **Easy customization.** No need to tinker with non-standard Tailwind config format.
  If you don't like what Tailwind generates for a given utility class,
  you can simply change it in `utilities.css` after it's generated.
- **Simple to extend.** No need to install custom Tailwind plugins as dependencies.
  You can simply add your own utility classes to `utilities.css`
  and they will be available to use in your project.

## FAQ

<dl>
  <dt>What if I don't use Tailwind?</dt>
  <dd>
    You don't have to use Tailwind classes.
    You can create your own completely custom utility classes.
    This plugin will still help you keep your classes organized and in sync.
    You can even use it with regular (non-atomic) classes (for example BEM).
  </dd>
  <dt>Won't the utilities file get too big?</dt>
  <dd>
      It will get as big as it would if it was built by Tailwind.
      It will gradually slow down getting bigger as your app grows,
      because the needed utility classes will be already there.
  </dd>
  <dt>Is scanning the whole project performant enough?</dt>
  <dd>
      ESLint doesn't support cross-file analysis natively.
      This plugin searches all project files using glob pattern
      and uses a simple but smart regexp to scan for classes in each file.
  </dd>
</dl>

## Rules

### `stylish/no-undefined-class`

Reports class names used in JavaScript that do not appear in any CSS file.
It checks class-related properties such as `className`, `class`, `classes`, and `classNames`.

### `stylish/no-undefined-var`

Reports undefined custom property references like `var(--foo)`.

Unlike the built-in rule, it checks references across files.
Add `"css/no-invalid-properties": ["error", { allowUnknownVariables: true }]` to your custom config
or use this plugin's recommended config to disable the built-in check.

### `stylish/no-unused-class`

Reports CSS class selectors that are not referenced in any JavaScript file.
If it's a Tailwind class, it will automatically remove it with an autofix.

### `stylish/no-unused-var`

Reports unused CSS custom properties.

### `stylish/no-missing-atom`

Runs only on file named `utilities.css`.
Finds supported utility classes used in project source files but missing from that file.
With ESLint autofix, it suggests to add the corresponding CSS declarations.

## TODOs

- [ ] A rule which enforces a consistent order for utility classes.
- [ ] A rule which checks CSS modules if you use those.
