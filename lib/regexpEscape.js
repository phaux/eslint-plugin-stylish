/**
 * Escapes special characters in a string for use in a regular expression.
 * @param {string} str The string to escape.
 * @returns {string} The escaped string.
 */
export const regexpEscape = (str) =>
  str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
