/**
 * Atomic class definition.
 */
export interface AtomDef {
  /**
   * The pattern to match the class name.
   */
  name: RegExp | string
  /**
   * The CSS to generate for the rule body.
   */
  body: string | ((match: RegExpMatchArray) => string)
  /**
   * The string to compare for ordering the rules.
   * By default the matched name is used.
   */
  order?: string | ((match: RegExpMatchArray) => string) | undefined
}

/**
 * Atomic class modifier definition.
 */
export interface ModifierDef {
  /**
   * The pattern to match the modifier prefix.
   */
  prefix: RegExp | string
  /**
   * The CSS to generate for the modifier selector.
   */
  selector: string | ((match: RegExpMatchArray) => string)
  /**
   * The string to compare for ordering the rules.
   * By default the matched prefix is used.
   */
  order?: string | ((match: RegExpMatchArray) => string) | undefined
}

/**
 * Represents a single occurence of a used atomic class.
 */
export interface AtomMatch {
  /** The class name. */
  className: string
  /** Array of string to use for sorting the rules. */
  order: string[]
  /** The CSS to generate for the class if missing. */
  ruleBody: string
}

/**
 * Represents a single occurence of a used atomic class.
 */
export interface UsedAtom extends AtomMatch {
  /** The path to the file in which the class is used. */
  filePath: string
}
