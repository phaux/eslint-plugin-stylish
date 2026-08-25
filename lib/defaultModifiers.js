import { breakpoints } from "./breakpoints.js"

/**
 * Default atom modifier definitions
 * @type {import("./types.js").ModifierDef[]}
 */
export const defaultModifiers = [
  {
    prefix: /hover|focus(?:-within|-visible)?|active|visited|target/,
    selector: ([state]) => `&:${state}`,
  },
  {
    prefix: "**",
    selector: "*",
  },
  {
    prefix: "*",
    selector: "> *",
  },
  {
    prefix: /has-([\w-]+)/,
    selector: ([, state]) => `&:has(:${state})`,
  },
  {
    prefix: /group-([\w-]+)/,
    selector: ([, state]) => `&:is(:where(.group):${state} *)`,
  },
  {
    prefix: /group-([\w-]+)\/([\w-]+)/,
    selector: ([, state, name]) => `&:is(:where(.group\\/${name}):${state} *)`,
  },
  {
    prefix: /peer-([\w-]+)/,
    selector: ([, state]) => `&:is(:where(.peer):${state} ~ *)`,
  },
  {
    prefix: /peer-([\w-]+)\/([\w-]+)/,
    selector: ([, state, name]) => `&:is(:where(.peer\\/${name}):${state} ~ *)`,
  },
  {
    prefix: /in-([\w-]+)/,
    selector: ([, state]) => `:where(:${state}) &`,
  },
  {
    prefix: /not-([\w-]+)/,
    selector: ([, state]) => `&:not(:${state})`,
  },
  { prefix: "inert", selector: "&:is([inert], [inert] *)" },
  { prefix: /first|last|only/, selector: ([s]) => `&:${s}-child` },
  { prefix: /odd|even/, selector: ([s]) => `&:nth-child(${s})` },
  { prefix: /(first|last|only)-of-type/, selector: ([s]) => `&:${s}` },
  {
    prefix:
      /empty|disabled|enabled|checked|indeterminate|default|optional|required|valid|invalid|user-valid|user-invalid|in-range|out-of-range|placeholder-shown|autofill|read-only/,
    selector: ([s]) => `&:${s}`,
  },
  {
    prefix:
      /before|after|first-letter|first-line|details-content|selection|backdrop|placeholder/,
    selector: ([s]) => `&::${s}`,
  },
  { prefix: "file", selector: "&::file-selector-button" },
  { prefix: "marker", selector: "&::marker, & *::marker" },
  {
    prefix: /\d?xs|sm|md|lg|\d?xl/,
    selector: ([name]) => `@media (width >= ${breakpoints[name] ?? 0}rem)`,
    order: ([name]) => `media-width-${breakpoints[name] ?? name}`,
  },
  {
    prefix: /max-(\d?xs|sm|md|lg|\d?xl)/,
    selector: ([, name]) => `@media (width < ${breakpoints[name] ?? 0}rem)`,
    order: ([, name]) => `media-width-${breakpoints[name] ?? name}-max`,
  },
  {
    prefix: /@(\d?xs|sm|md|lg|\d?xl)/,
    selector: ([, name]) =>
      `@container (width >= ${breakpoints[name] ?? 0}rem)`,
    order: ([, name]) => `container-width-${breakpoints[name] ?? name}`,
  },
  {
    prefix: /@max-(\d?xs|sm|md|lg|\d?xl)/,
    selector: ([, name]) => `@container (width < ${breakpoints[name] ?? 0}rem)`,
    order: ([, name]) => `container-width-${breakpoints[name] ?? name}-max`,
  },
  { prefix: "dark", selector: "@media (prefers-color-scheme: dark)" },
  { prefix: "light", selector: "@media (prefers-color-scheme: light)" },
  {
    prefix: "motion-safe",
    selector: "@media (prefers-reduced-motion: no-preference)",
  },
  {
    prefix: "motion-reduce",
    selector: "@media (prefers-reduced-motion: reduce)",
  },
  { prefix: "portrait", selector: "@media (orientation: portrait)" },
  { prefix: "landscape", selector: "@media (orientation: landscape)" },
  {
    prefix: /aria-(\w+)/,
    selector: ([, name]) => `&[aria-${name}="true"]`,
  },
  {
    prefix: "aria-current",
    selector: '&[aria-current]:where(:not([aria-current="false"]))',
  },
  {
    prefix: /data-([\w-]+)/,
    selector: ([, name]) => `&[data-${name}]`,
  },
  {
    prefix: "open",
    selector: "&[open], &:popover-open, &:open",
  },
  {
    prefix: /rtl|ltr/,
    selector: ([dir]) => `&:dir(${dir}), &[dir="${dir}"], &[dir="${dir}"] *`,
  },
  {
    prefix: "starting",
    selector: "@starting-style",
  },
]
