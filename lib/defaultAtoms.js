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
    name: /(min-|max-)?(w|h|size|inline-size|block-size)-(?:(\d+(?:\/(\d+)))|(auto|px|full|screen|[dls]v[hw]|min|max|fit|(?:(?:screen-)?(?:\d?xs|sm|md|lg|\d?xl))))/,
    body: ([, prefix = "", prop, n1, n2, word]) => {
      const props =
        {
          w: ["width"],
          h: ["height"],
          size: ["width", "height"],
          "inline-size": ["inline-size"],
          "block-size": ["block-size"],
        }[prop] ?? []
      let value = "auto"
      if (n1 && n2) value = `calc(${n1} / ${n2} * 100%)`
      else if (n1) value = `calc(var(--spacing) * ${n1})`
      else {
        const kw = {
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
        if (kw) {
          value = kw
        } else {
          const w = word.startsWith("screen-") ? word.slice(7) : word
          const size = breakpoints[w]
          if (size != null) {
            value = `${size}rem`
          }
        }
      }
      let css = ""
      for (const prop of props) {
        css += `${prefix}${prop}: ${value}; `
      }
      return css
    },
  },
  {
    name: /font-(sans|serif|title|mono)/,
    body: ([, word]) =>
      `font-family: var(--font-${word}, ${
        {
          sans: "system-ui, sans-serif",
          serif: "serif",
          title: "ui-rounded, sans-serif",
          mono: "monospace, monospace",
        }[word]
      })`,
  },
  {
    name: /text-(\d?xs|sm|base|lg|\d?xl)/,
    body: ([, word]) => {
      const size =
        {
          xs: 0.75,
          sm: 0.875,
          base: 1,
          lg: 1.125,
          xl: 1.25,
          "2xl": 1.5,
          "3xl": 1.875,
          "4xl": 2.25,
          "5xl": 3,
          "6xl": 3.75,
          "7xl": 4.5,
          "8xl": 6,
          "9xl": 8,
        }[word] ?? 1
      const height =
        {
          xs: 1,
          sm: 1.25,
          base: 1.5,
          lg: 1.75,
          xl: 1.75,
          "2xl": 2,
          "3xl": 2.25,
          "4xl": 2.5,
        }[word] ?? size
      const sizeStr = `${size}rem`
      const heightStr = height === size ? "1" : `calc(${height} / ${size})`
      return [
        `font-size: var(--text-${word}, ${sizeStr})`,
        `line-height: var(--text-${word}--line-height, ${heightStr})`,
      ].join("; ")
    },
  },
  { name: "italic", body: "font-style: italic" },
  { name: "not-italic", body: "font-style: normal" },
  {
    name: /font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/,
    body: ([, word]) =>
      `font-weight: ${
        {
          thin: 100,
          extralight: 200,
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
          extrabold: 800,
          black: 900,
        }[word]
      }`,
  },
  {
    name: /tracking-(tighter|tight|normal|wide|wider|widest)/,
    body: ([, word]) =>
      `letter-spacing: ${
        {
          tighter: -0.05,
          tight: -0.025,
          normal: 0,
          wide: 0.025,
          wider: 0.05,
          widest: 0.1,
        }[word]
      }em`,
  },
  {
    name: /line-clamp-(\d+)/,
    body: ([, n]) =>
      [
        "overflow: hidden",
        "display: -webkit-box",
        "-webkit-box-orient: vertical",
        `-webkit-line-clamp: ${n}`,
      ].join("; "),
  },
  {
    name: "line-clamp-none",
    body: [
      "overflow: visible",
      "display: block",
      "-webkit-box-orient: horizontal",
      "-webkit-line-clamp: unset",
    ].join("; "),
  },
  { name: "leading-none", body: "line-height: 1" },
  {
    name: /list-(inside|outside)/,
    body: ([, word]) => `list-style-position: ${word}`,
  },
  {
    name: /text-(left|center|right|justify|start|end)/,
    body: ([, word]) => `text-align: ${word}`,
  },
  {
    name: /underline|overline|line-through/,
    body: ([, word]) => `text-decoration: ${word}`,
  },
  { name: "no-underline", body: "text-decoration: none" },
  {
    name: /uppercase|lowercase|capitalize/,
    body: ([, word]) => `text-transform: ${word}`,
  },
  { name: "normal-case", body: "text-transform: none" },
  {
    name: "truncate",
    body: [
      "overflow: hidden",
      "text-overflow: ellipsis",
      "white-space: nowrap",
    ].join("; "),
  },
  {
    name: /text-(ellipsis|clip)/,
    body: ([, word]) => `text-overflow: ${word}`,
  },
  {
    name: /text-(wrap|nowrap|balance|pretty)/,
    body: ([, word]) => `text-wrap: ${word}`,
  },
  {
    name: /text-([\w-]+)(?:\/([\w-]+))?/,
    body: ([, word, n]) => `color: ${getColor(word, n)}`,
  },
  {
    name: /(-)?indent-(\d+)/,
    body: ([, minus = "", n]) =>
      `text-indent: calc(var(--spacing) * ${minus}${n})`,
  },
  {
    name: /tab-(\d+)/,
    body: ([, n]) => `tab-size: ${n}`,
  },
  {
    name: /align-(baseline|top|middle|bottom|text-top|text-bottom|sub|super)/,
    body: ([, word]) => `vertical-align: ${word}`,
  },
  {
    name: /whitespace-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)/,
    body: ([, word]) => `white-space: ${word}`,
  },
  { name: "break-normal", body: "word-break: normal" },
  { name: "break-all", body: "word-break: break-all" },
  { name: "break-keep", body: "word-break: keep-all" },
  {
    name: /wrap-(break-word|anywhere|normal)/,
    body: ([, word]) => `overflow-wrap: ${word}`,
  },
  {
    name: /hyphens-(auto|none|manual)/,
    body: ([, word]) => `hyphens: ${word}`,
  },
  {
    name: /content-\[(.*?)\]/,
    body: ([, s]) => `content: ${s}`,
  },
  {
    name: /bg-([\w-]+)(?:\/([\w-]+))?/,
    body: ([, word, n]) => `background-color: ${getColor(word, n)}`,
  },
  // TODO: more background properties
  {
    name: /rounded-(-[setrbl]|-[se]{2}|-[tb][lr])?(?:(\d?xs|sm|md|lg|\dxl)|(none|full))/,
    body: ([, axis = "", name, word]) => {
      const axis2 = {
        "": [""],
        "-s": ["-start-start", "-end-start"],
        "-e": ["-start-end", "-end-end"],
        "-t": ["-top-left", "-top-right"],
        "-r": ["-top-right", "-bottom-right"],
        "-b": ["-bottom-left", "-bottom-right"],
        "-l": ["-top-left", "-bottom-left"],
        "-ss": ["-start-start"],
        "-se": ["-start-end"],
        "-es": ["-end-start"],
        "-ee": ["-end-end"],
        "-tl": ["-top-left"],
        "-tr": ["-top-right"],
        "-bl": ["-bottom-left"],
        "-br": ["-bottom-right"],
      }[axis]

      if (word) {
        const value = {
          none: "0",
          full: "calc(infinity * 1px)",
        }[word]
        return `border${axis2}-radius: ${value}`
      } else {
        const value =
          {
            xs: 0.125,
            sm: 0.25,
            md: 0.375,
            lg: 0.5,
            xl: 0.75,
            "2xl": 1,
            "3xl": 1.5,
            "4xl": 2,
          }[name] ?? 0
        return `border${axis2}-radius: var(--radius-${name}, ${value}rem)`
      }
    },
  },
  {
    name: /border(-[xy]|-b?[se]|-[trbl])?(?:-(\d+))?/,
    body: ([, axis = "", n]) => {
      const value = n != null ? `${n}px` : "1px"
      const axis2 = expandBorderAxis(axis)
      return `border${axis2}-width: ${value}`
    },
  },
  {
    name: /border-(solid|dashed|dotted|double|hidden|none)/,
    body: ([, word]) => `border-style: ${word}`,
  },
  {
    name: /border(-[xy]|-b?[se]|-[trbl])?-([\w-]+)(?:\/([\w-]+))?/,
    body: ([, axis = "", word, n]) =>
      `border${expandBorderAxis(axis)}-color: ${getColor(word, n)}`,
  },
  {
    name: /outline(?:-(\d+))?/,
    body: ([, n]) => {
      const value = n != null ? `${n}px` : "1px"
      return `outline-width: ${value}`
    },
  },
  {
    name: /outline-(solid|dashed|dotted|double|hidden|none)/,
    body: ([, word]) => `outline-style: ${word}`,
  },
  {
    name: /(-)?outline-offset-(\d+)/,
    body: ([, minus = "", n]) => `outline-offset: ${minus}${n}px`,
  },
  {
    name: /outline-([\w-]+)(?:\/([\w-]+))?/,
    body: ([, word, n]) => `outline-color: ${getColor(word, n)}`,
  },
  {
    name: /shadow-(none|\d?xs|sm|md|lg|\d?xl)/,
    body: ([, word]) => {
      const none = "0 0 #0000"
      if (word === "none") return `box-shadow: ${none}`
      const sc = (/** @type {number} */ o) =>
        `var(--shadow-color, rgb(0 0 0 / ${o}))`
      const shadow = {
        "2xs": `0 1px ${sc(0.05)}`,
        xs: `0 1px 2px 0 ${sc(0.05)}`,
        sm: `0 1px 3px 0 ${sc(0.1)}, 0 1px 2px -1px ${sc(0.1)}`,
        md: `0 4px 6px -1px ${sc(0.1)}, 0 2px 4px -2px ${sc(0.1)}`,
        lg: `0 10px 15px -3px ${sc(0.1)}, 0 4px 6px -4px ${sc(0.1)}`,
        xl: `0 20px 25px -5px ${sc(0.1)}, 0 8px 10px -6px ${sc(0.1)}`,
        "2xl": `0 25px 50px -12px ${sc(0.25)}`,
      }[word]
      return `box-shadow: var(--shadow-${word}, ${shadow ?? none})`
    },
  },
  {
    name: /shadow-([\w-]+)(?:\/([\w-]+))?/,
    body: ([, word, n]) => `--shadow-color: ${getColor(word, n)}`,
  },
  {
    name: /text-shadow-(none|\d?xs|sm|md|lg|\d?xl)/,
    body: ([, word]) => {
      if (word === "none") return `text-shadow: none`
      const sc = (/** @type {number} */ o) =>
        `var(--text-shadow-color, rgb(0 0 0 / ${o}))`
      const shadow = {
        "2xs": `0 1px 0 ${sc(0.15)}`,
        xs: `0 1px 1px ${sc(0.2)}`,
        sm: `0 1px 0 ${sc(0.075)}, 0 1px 1px ${sc(0.075)}, 0 2px 2px ${sc(0.075)}`,
        md: `0px 1px 1px ${sc(0.1)}, 0px 1px 2px ${sc(0.1)}, 0px 2px 4px ${sc(0.1)}`,
        lg: `0px 1px 2px ${sc(0.1)}, 0px 3px 2px ${sc(0.1)}, 0px 4px 8px ${sc(0.1)}`,
      }[word]
      return `text-shadow: var(--text-shadow-${word}, ${shadow ?? "none"})`
    },
  },
  {
    name: /text-shadow-([\w-]+)(?:\/([\w-]+))?/,
    body: ([, word, n]) => `--text-shadow-color: ${getColor(word, n)}`,
  },
  {
    name: /opacity-([\w-]+)/,
    body: ([, word]) => {
      if (word.match(/^[\d.]+$/)) {
        return `opacity: ${word}%`
      }
      return `opacity: var(--opacity-${word})`
    },
  },
  {
    name: /mix-blend-(normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity|plus-darker|plus-lighter)/,
    body: ([, word]) => `mix-blend-mode: ${word}`,
  },
  {
    name: /bg-blend-(normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity)/,
    body: ([, word]) => `background-blend-mode: ${word}`,
  },
  { name: "filter-none", body: "filter: none" },
  {
    name: /(backdrop-)?blur-(?:(\d?xs|sm|md|lg|\dxl)|(\d+))/,
    body: ([, bd = "", word, n]) => {
      if (n != null) return `filter: blur(${n}px)`
      const blur = {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        "2xl": 40,
        "3xl": 64,
      }[word]
      if (blur == null) return `${bd}filter: blur(var(--blur-${word}))`
      return `${bd}filter: blur(var(--blur-${word}, ${blur}px))`
    },
  },
  {
    name: /(backdrop-)?brightness-(?:(lightest|lighter|light|dark|darker|darkest)|(\d+))/,
    body: ([, bd = "", word, n]) => {
      if (n != null) return `${bd}filter: brightness(${n}%)`
      const brightness = {
        lightest: 150,
        lighter: 125,
        light: 110,
        dark: 90,
        darker: 75,
        darkest: 50,
      }[word]
      if (brightness == null)
        return `${bd}filter: brightness(var(--brightness-${word}))`
      return `${bd}filter: brightness(var(--brightness-${word}, ${brightness}%))`
    },
  },
  {
    name: /(backdrop-)?contrast-(\d+)/,
    body: ([, bd = "", n]) => `${bd}filter: contrast(${n}%)`,
  },
  {
    name: /(backdrop-)?grayscale/,
    body: ([, bd = ""]) => `${bd}filter: grayscale(100%)`,
  },
  {
    name: /(backdrop-)?hue-rotate-(\d+)/,
    body: ([, bd = "", n]) => `${bd}filter: hue-rotate(${n}deg)`,
  },
  {
    name: /(backdrop-)?invert/,
    body: ([, bd = ""]) => `${bd}filter: invert(100%)`,
  },
  {
    name: /(backdrop-)?saturate-(\d+)/,
    body: ([, bd = "", n]) => `${bd}filter: saturate(${n}%)`,
  },
  {
    name: /(backdrop-)?sepia-(\d+)/,
    body: ([, bd = "", n]) => `${bd}filter: sepia(${n}%)`,
  },
  {
    name: /transition(?:-(all|colors|opacity|shadow|transform|none))?/,
    body: ([, word = ""]) => {
      if (word === "none") return "transition-property: none"
      const properties = {
        "":
          "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, " +
          "opacity, box-shadow, transform, translate, rotate, scale, " +
          "filter, backdrop-filter, display, content-visibility, overlay, pointer-events",
        all: "all",
        colors:
          "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
        opacity: "opacity",
        shadow: "box-shadow",
        transform: "transform, translate, rotate, scale",
      }[word]
      return (
        `transition-property: ${properties}; ` +
        "transition-duration: var(--default-transition-duration, 150ms)"
      )
    },
    order: ([, word]) => `transition-base-${word}`,
  },
  { name: "transition-discrete", body: "transition-behavior: allow-discrete" },
  {
    name: /transition-(?:(initial|fastest|faster|fast|slow|slower|slowest)|(\d+))/,
    body: ([, word, n]) => {
      if (word === "initial") return "transition-duration: initial"
      if (n != null) return `transition-duration: ${n}ms`
      const duration = {
        fastest: 50,
        faster: 100,
        fast: 150,
        slow: 250,
        slower: 350,
        slowest: 500,
      }[word]
      return `transition-duration: var(--duration-${word}, ${duration}ms))`
    },
    order: ([, word]) => `transition-duration-${word}`,
  },
  {
    name: /ease-(linear|in|out|in-out|initial)/,
    body: ([, word]) => {
      if (["initial", "linear"].includes(word))
        return `transition-timing-function: ${word}`
      const easing = {
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      }[word]
      return `transition-timing-function: var(--easing-${word}, ${easing})`
    },
  },
  {
    name: /delay-(\d+)/,
    body: ([, n]) => `transition-delay: ${n}ms`,
  },
  {
    name: /(-)?rotate-(\d+)/,
    body: ([, minus = "", n]) => `rotate: ${minus}${n}deg`,
  },
  {
    name: /(-)?scale(-[xy])?-(\d+)/,
    body: ([, minus = "", axis = "", n]) => {
      const value = `${minus}${n}%`
      const values = {
        "": `${value}`,
        "-x": `${value} 0`,
        "-y": `0 ${value}`,
      }[axis]
      return `scale: ${values}`
    },
  },
  {
    name: /(-)?translate(-[xy])?-(\d+)/,
    body: ([, minus = "", axis = "", n]) => {
      const value = `calc(var(--spacing) * ${minus}${n})`
      const values = {
        "": `${value}`,
        "-x": `${value} 0`,
        "-y": `0 ${value}`,
      }[axis]
      return `translate: ${values}`
    },
  },
  {
    name: /zoom-(?:(tiny|small|large|huge)|(\d+))/,
    body: ([, word, n]) => {
      if (n != null) return `zoom: ${n}%`
      const zoom = {
        tiny: 75,
        small: 85,
        large: 115,
        huge: 130,
      }[word]
      if (zoom == null) return `zoom: var(--zoom-${word})`
      return `zoom: var(--zoom-${word}, ${zoom}%)`
    },
  },
  {
    name: /accent-([\w-]+)?/,
    body: ([, word]) => `accent-color: ${getColor(word)}`,
  },
  {
    name: /appearance-(none|auto)/,
    body: ([, word]) => `appearance: ${word}`,
  },
  {
    name: /caret-([\w-]+)(?:\/([\w-]+))?/,
    body: ([, word, n]) => `caret-color: ${getColor(word, n)}`,
  },
  {
    name: /scheme-(light|dark|light-dark|only-(light|dark))/,
    body: ([, word]) => `color-scheme: ${word.replace(/-/g, " ")}`,
  },
  {
    name: /cursor-(auto|default|pointer|wait|text|move|help|not-allowed|none|context-menu|progress|cell|crosshair|vertical-text|alias|copy|no-drop|grab|grabbing|all-scroll|col-resize|row-resize|zoom-in|zoom-out)/,
    body: ([, word]) => `cursor: ${word}`,
  },
  {
    name: /field-sizing-(fixed|content)/,
    body: ([, word]) => `field-sizing: ${word}`,
  },
  {
    name: /pointer-events-(auto|none)/,
    body: ([, word]) => `pointer-events: ${word}`,
  },
  {
    name: /resize(?:-(none|[xy]))?/,
    body: ([, word = ""]) =>
      `resize: ${
        {
          "": "both",
          none: "none",
          x: "horizontal",
          y: "vertical",
        }[word]
      }`,
  },
  { name: "scroll-smooth", body: "scroll-behavior: smooth" },
  {
    name: /scrollbar-thumb-([\w-]+)(?:\/([\w-]+))?/,
    body: ([, word, n]) => `scrollbar-thumb-color: ${getColor(word, n)}`,
  },
  {
    name: /scrollbar-track-([\w-]+)(?:\/([\w-]+))?/,
    body: ([, word, n]) => `scrollbar-track-color: ${getColor(word, n)}`,
  },
  {
    name: /scrollbar-(auto|thin|none)/,
    body: ([, word]) => `scrollbar-width: ${word}`,
  },
  {
    name: /scrollbar-gutter-(auto|stable|both)?/,
    body: ([, word]) =>
      `scrollbar-gutter: ${
        {
          auto: "auto",
          stable: "stable",
          both: "stable both-edges",
        }[word]
      }`,
  },
  {
    name: /snap-(start|end|center|align-none)/,
    body: ([, word]) =>
      `scroll-snap-align: ${
        {
          start: "start",
          end: "end",
          center: "center",
          "align-none": "none",
        }[word]
      }`,
  },
  {
    name: /snap-(normal|always)/,
    body: ([, word]) => `scroll-snap-stop: ${word}`,
  },
  {
    name: /snap-(none|x|y|both)/,
    body: ([, word]) =>
      `scroll-snap-type: ${word} var(--snap-strictness, mandatory)`,
  },
  {
    name: /snap-(mandatory|proximity)/,
    body: ([, word]) => `--snap-strictness: ${word}`,
  },
  {
    name: /select-(none|text|all|auto)/,
    body: ([, word]) => `user-select: ${word}`,
  },
]

/**
 * Expands border axis shorthand.
 * @param {string} s
 */
const expandBorderAxis = (s) =>
  ({
    "": "",
    "-x": "-inline",
    "-y": "-block",
    "-s": "-inline-start",
    "-e": "-inline-end",
    "-bs": "-block-start",
    "-be": "-block-end",
    "-t": "-top",
    "-b": "-bottom",
    "-l": "-left",
    "-r": "-right",
  })[s]

/**
 * Get CSS for a common color or a reference to a custom color variable.
 * @param {string} name Color name
 * @param {string | undefined} [opacity] Opacity value
 */
function getColor(name, opacity) {
  let value =
    {
      inherit: "inherit",
      current: "currentColor",
      accent: "AccentColor",
      transparent: "transparent",
      black: "black",
      white: "white",
    }[name] ?? `var(--color-${name})`
  if (opacity) {
    const opacityValue = opacity.match(/^\d+$/)
      ? `${opacity}%`
      : `var(--opacity-${opacity})`
    value = `color-mix(in oklab, ${value} ${opacityValue}, transparent)`
  }
  return value
}
