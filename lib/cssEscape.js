/**
 * Escapes a CSS selector.
 * @param {string} selector
 */
export const cssEscape = (selector) => selector.replace(/[^\w-]/g, "\\$&")

/**
 * Unescapes a CSS selector.
 * @param {string} selector
 */
export const cssUnescape = (selector) => selector.replace(/\\(.)/g, "$1")
