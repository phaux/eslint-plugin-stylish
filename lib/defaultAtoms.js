import { breakpoints } from "./breakpoints.js"

/**
 * Default atom definitions.
 * Based on Tailwind CSS.
 * @type {import("./types.js").AtomDef[]}
 */
export const defaultAtoms = [
  {
    name: /aspect-(\d+)\/(\d+)/,
    body: ([, n1, n2]) => `aspect-ratio: ${n1} / ${n2}`,
  },
  { name: "aspect-square", body: "aspect-ratio: 1 / 1" },
  {
    name: /columns-(\d+)/,
    body: ([, n]) => `column-count: ${n}`,
  },
  {
    name: /columns-(\w+)/,
    body: ([, word]) => `column-width: ${breakpoints[word] ?? 0}rem`,
  },
  {
    name: /box-(border|content)/,
    body: ([, word]) => `box-sizing: ${word}-box`,
  },
  {
    name: /hidden|inline|(?:(?:inline-)?block|flex|grid)|flow-root|contents/,
    body: ([word]) => `display: ${word === "hidden" ? "none" : word}`,
  },
  {
    name: /(float|clear)-(left|right|both|start|end|none)/,
    body: ([, prop, word]) =>
      `${prop}: ${
        {
          left: "left",
          right: "right",
          both: "both",
          start: "inline-start",
          end: "inline-end",
          none: "none",
        }[word]
      }`,
  },
  { name: "isolate", body: "isolation: isolate" },
  {
    name: /overflow(-[xy])?-(\w+)/,
    body: ([, axis = "", word]) => `overflow${axis}: ${word}`,
  },
  {
    name: /overscroll(-[xy])?-(\w+)/,
    body: ([, axis = "", word]) => `overscroll-behavior${axis}: ${word}`,
  },
  {
    name: /static|fixed|absolute|relative|sticky/,
    body: ([word]) => `position: ${word}`,
  },
  {
    name: /(-)?(inset(?:-x|-y|-s|-e|-bs|-be)?|top|right|bottom|left)-(?:(\d+)(?:\/(\d+))?|(auto|px|full))/,
    body: ([, minus = "", prop, n1, n2, word]) => {
      const prop2 = {
        inset: "inset",
        "inset-x": "inset-block",
        "inset-y": "inset-inline",
        "inset-s": "inset-inline-start",
        "inset-e": "inset-inline-end",
        "inset-bs": "inset-block-start",
        "inset-be": "inset-block-end",
        top: "top",
        right: "right",
        bottom: "bottom",
        left: "left",
      }[prop]
      if (n1 && n2) return `${prop2}: calc(${n1} / ${n2} * ${minus}100%)`
      if (n1) return `${prop2}: calc(var(--spacing) * ${minus}${n1})`
      if (word === "px") return `${prop2}: ${minus}1px`
      if (word === "full") return `${prop2}: ${minus}100%`
      return `${prop2}: auto`
    },
  },
  {
    name: /visible|invisible|collapse/,
    body: ([word]) =>
      `visibility: ${
        {
          visible: "visible",
          invisible: "hidden",
          collapse: "collapse",
        }[word]
      }`,
  },
  {
    name: /z-(\d+)/,
    body: ([, n]) => `z-index: ${n}`,
  },
  {
    name: /flex-((?:row|col)(?:-reverse)?)/,
    body: ([, word]) =>
      `flex-direction: ${
        {
          row: "row",
          col: "column",
        }[word]
      }`,
  },
  {
    name: /flex-(wrap|nowrap|wrap-reverse)/,
    body: ([, word]) => `flex-wrap: ${word}`,
  },
  {
    name: /flex-(\d+)/,
    body: ([, n]) => `flex: ${n}`,
  },
  {
    name: /flex-(auto|none)/,
    body: ([, word]) => `flex: ${word}`,
  },
  { name: "flex-initial", body: "flex: 0 auto" },
  { name: /grow|shrink/, body: ([prop]) => `flex-${prop}: 1` },
  {
    name: /(grow|shrink)-(\d+)/,
    body: ([, prop, n]) => `flex-${prop}: ${n}`,
  },
  { name: /order-(\d+)/, body: ([, n]) => `order: ${n}` },
  { name: "order-first", body: "order: -9999" },
  { name: "order-last", body: "order: 9999" },
  {
    name: /gap(-x|-y)?-(?:(\d)|(px))/,
    body: ([, axis = "", n, word]) =>
      `${
        {
          "": "gap",
          "-x": "row-gap",
          "-y": "column-gap",
        }[axis]
      }: ${word || `calc(var(--spacing) * ${n})`}`,
  },
  {
    name: /(justify(?:-items|-self)?|content|items|self|place-(?:content|items|self))-(start|(?:end|center)(?:-safe)?|between|around|evenly|stretch|baseline|normal)/,
    body: ([, prop, word]) =>
      `${
        {
          justify: "justify-content",
          "justify-items": "justify-items",
          "justify-self": "justify-self",
          content: "align-content",
          items: "align-items",
          self: "align-self",
          "place-content": "place-content",
          "place-items": "place-items",
          "place-self": "place-self",
        }[prop]
      }: ${
        {
          start: "flex-start",
          end: "flex-end",
          "end-safe": "safe flex-end",
          center: "center",
          "center-safe": "safe center",
          between: "space-between",
          around: "space-around",
          evenly: "space-evenly",
          stretch: "stretch",
          baseline: "baseline",
          normal: "normal",
        }[word]
      }`,
  },
  {
    name: /([pm])(x|y|s|e|bs|be|t|r|b|l)?-(?:(\d+)|(auto|px))/,
    body: ([, prop, axis = "", n, word]) =>
      `${
        {
          p: "padding",
          m: "margin",
        }[prop]
      }${
        {
          "": "",
          x: "-inline",
          y: "-block",
          s: "-inline-start",
          e: "-inline-end",
          bs: "-block-start",
          be: "-block-end",
          t: "-top",
          r: "-right",
          b: "-bottom",
          l: "-left",
        }[axis]
      }: ${word ? { auto: "auto", px: "1px" }[word] : `calc(var(--spacing) * ${n})`}`,
  },
  {
    name: /(min-|max-)?(w|h|size|inline-size|block-size)-(?:(\d+(?:\/(\d+)))|(auto|px|full|screen|[dls]v[hw]|min|max|fit|))/,
    body: ([, prefix = "", prop, n1, n2, word]) => {
      const props =
        {
          w: ["width"],
          h: ["height"],
          size: ["width", "height"],
          "inline-size": ["inline-size"],
          "block-size": ["block-size"],
        }[prop] ?? []
      const value =
        n1 && n2
          ? `calc(${n1} / ${n2} * 100%)`
          : n1
            ? `calc(var(--spacing) * ${n1})`
            : {
                auto: "auto",
                px: "1px",
                full: "100%",
                screen: "100vw",
                dvh: "100dvh",
                dvw: "100dvw",
                svh: "100svh",
                svw: "100svw",
                lvh: "100lvh",
                lvw: "100lvw",
                min: "min-content",
                max: "max-content",
                fit: "fit-content",
              }[word]
      let css = ""
      for (const prop of props) {
        css += `${prefix}${prop}: ${value}; `
      }
      return css
    },
  },
]
