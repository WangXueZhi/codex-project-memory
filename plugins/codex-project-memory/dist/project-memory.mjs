var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/constants.js
var require_constants = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/constants.js"(exports, module) {
    "use strict";
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
    var DOT_LITERAL = "\\.";
    var PLUS_LITERAL = "\\+";
    var QMARK_LITERAL = "\\?";
    var SLASH_LITERAL = "\\/";
    var ONE_CHAR = "(?=.)";
    var QMARK = "[^/]";
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var SEP = "/";
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR,
      SEP
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
      SEP: "\\"
    };
    var POSIX_REGEX_SOURCE = {
      __proto__: null,
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    };
    module.exports = {
      DEFAULT_MAX_EXTGLOB_RECURSION,
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        __proto__: null,
        "***": "*",
        "**/**": "**",
        "**/**/**": "**"
      },
      // Digits
      CHAR_0: 48,
      /* 0 */
      CHAR_9: 57,
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 65,
      /* A */
      CHAR_LOWERCASE_A: 97,
      /* a */
      CHAR_UPPERCASE_Z: 90,
      /* Z */
      CHAR_LOWERCASE_Z: 122,
      /* z */
      CHAR_LEFT_PARENTHESES: 40,
      /* ( */
      CHAR_RIGHT_PARENTHESES: 41,
      /* ) */
      CHAR_ASTERISK: 42,
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38,
      /* & */
      CHAR_AT: 64,
      /* @ */
      CHAR_BACKWARD_SLASH: 92,
      /* \ */
      CHAR_CARRIAGE_RETURN: 13,
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94,
      /* ^ */
      CHAR_COLON: 58,
      /* : */
      CHAR_COMMA: 44,
      /* , */
      CHAR_DOT: 46,
      /* . */
      CHAR_DOUBLE_QUOTE: 34,
      /* " */
      CHAR_EQUAL: 61,
      /* = */
      CHAR_EXCLAMATION_MARK: 33,
      /* ! */
      CHAR_FORM_FEED: 12,
      /* \f */
      CHAR_FORWARD_SLASH: 47,
      /* / */
      CHAR_GRAVE_ACCENT: 96,
      /* ` */
      CHAR_HASH: 35,
      /* # */
      CHAR_HYPHEN_MINUS: 45,
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60,
      /* < */
      CHAR_LEFT_CURLY_BRACE: 123,
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91,
      /* [ */
      CHAR_LINE_FEED: 10,
      /* \n */
      CHAR_NO_BREAK_SPACE: 160,
      /* \u00A0 */
      CHAR_PERCENT: 37,
      /* % */
      CHAR_PLUS: 43,
      /* + */
      CHAR_QUESTION_MARK: 63,
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      /* > */
      CHAR_RIGHT_CURLY_BRACE: 125,
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      /* ] */
      CHAR_SEMICOLON: 59,
      /* ; */
      CHAR_SINGLE_QUOTE: 39,
      /* ' */
      CHAR_SPACE: 32,
      /*   */
      CHAR_TAB: 9,
      /* \t */
      CHAR_UNDERSCORE: 95,
      /* _ */
      CHAR_VERTICAL_LINE: 124,
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      /* \uFEFF */
      /**
       * Create EXTGLOB_CHARS
       */
      extglobChars(chars) {
        return {
          "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
          "?": { type: "qmark", open: "(?:", close: ")?" },
          "+": { type: "plus", open: "(?:", close: ")+" },
          "*": { type: "star", open: "(?:", close: ")*" },
          "@": { type: "at", open: "(?:", close: ")" }
        };
      },
      /**
       * Create GLOB_CHARS
       */
      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/utils.js
var require_utils = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/utils.js"(exports) {
    "use strict";
    var {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = require_constants();
    exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
    exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
    exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
    exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
    exports.isWindows = () => {
      if (typeof navigator !== "undefined" && navigator.platform) {
        const platform = navigator.platform.toLowerCase();
        return platform === "win32" || platform === "windows";
      }
      if (typeof process !== "undefined" && process.platform) {
        return process.platform === "win32";
      }
      return false;
    };
    exports.removeBackslashes = (str) => {
      return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
        return match === "\\" ? "" : match;
      });
    };
    exports.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1) return input;
      if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };
    exports.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith("./")) {
        output = output.slice(2);
        state.prefix = "./";
      }
      return output;
    };
    exports.wrapOutput = (input, state = {}, options = {}) => {
      const prepend = options.contains ? "" : "^";
      const append = options.contains ? "" : "$";
      let output = `${prepend}(?:${input})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
    exports.basename = (path7, { windows } = {}) => {
      const segs = path7.split(windows ? /[\\/]/ : "/");
      const last = segs[segs.length - 1];
      if (last === "") {
        return segs[segs.length - 2];
      }
      return last;
    };
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/scan.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var {
      CHAR_ASTERISK,
      /* * */
      CHAR_AT,
      /* @ */
      CHAR_BACKWARD_SLASH,
      /* \ */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_EXCLAMATION_MARK,
      /* ! */
      CHAR_FORWARD_SLASH,
      /* / */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_PLUS,
      /* + */
      CHAR_QUESTION_MARK,
      /* ? */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_RIGHT_SQUARE_BRACKET
      /* ] */
    } = require_constants();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan = (input, options) => {
      const opts = options || {};
      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];
      let str = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: "", depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: "", depth: 0, isGlob: false };
          if (finished === true) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES) {
                  isGlob = token.isGlob = true;
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_LEFT_PARENTHESES) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str;
      let prefix = "";
      let glob = "";
      if (start > 0) {
        prefix = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob = str.slice(lastIndex);
      } else if (isGlob === true) {
        base = "";
        glob = str;
      } else {
        base = str;
      }
      if (base && base !== "" && base !== "/" && base !== str) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob) glob = utils.removeBackslashes(glob);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix,
        input,
        start,
        base,
        glob,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n = prevIndex ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value = input.slice(n, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (idx !== 0 || value !== "") {
            parts.push(value);
          }
          prevIndex = i;
        }
        if (prevIndex && prevIndex + 1 < input.length) {
          const value = input.slice(prevIndex + 1);
          parts.push(value);
          if (opts.tokens) {
            tokens[tokens.length - 1].value = value;
            depth(tokens[tokens.length - 1]);
            state.maxDepth += tokens[tokens.length - 1].depth;
          }
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module.exports = scan;
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/parse.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    var utils = require_utils();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants;
    var expandRange = (args, options) => {
      if (typeof options.expandRange === "function") {
        return options.expandRange(...args, options);
      }
      args.sort();
      const value = `[${args.join("-")}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var splitTopLevel = (input) => {
      const parts = [];
      let bracket = 0;
      let paren = 0;
      let quote = 0;
      let value = "";
      let escaped = false;
      for (const ch of input) {
        if (escaped === true) {
          value += ch;
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          value += ch;
          escaped = true;
          continue;
        }
        if (ch === '"') {
          quote = quote === 1 ? 0 : 1;
          value += ch;
          continue;
        }
        if (quote === 0) {
          if (ch === "[") {
            bracket++;
          } else if (ch === "]" && bracket > 0) {
            bracket--;
          } else if (bracket === 0) {
            if (ch === "(") {
              paren++;
            } else if (ch === ")" && paren > 0) {
              paren--;
            } else if (ch === "|" && paren === 0) {
              parts.push(value);
              value = "";
              continue;
            }
          }
        }
        value += ch;
      }
      parts.push(value);
      return parts;
    };
    var isPlainBranch = (branch) => {
      let escaped = false;
      for (const ch of branch) {
        if (escaped === true) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (/[?*+@!()[\]{}]/.test(ch)) {
          return false;
        }
      }
      return true;
    };
    var normalizeSimpleBranch = (branch) => {
      let value = branch.trim();
      let changed = true;
      while (changed === true) {
        changed = false;
        if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
          value = value.slice(2, -1);
          changed = true;
        }
      }
      if (!isPlainBranch(value)) {
        return;
      }
      return value.replace(/\\(.)/g, "$1");
    };
    var hasRepeatedCharPrefixOverlap = (branches) => {
      const values = branches.map(normalizeSimpleBranch).filter(Boolean);
      for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
          const a = values[i];
          const b = values[j];
          const char = a[0];
          if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) {
            continue;
          }
          if (a === b || a.startsWith(b) || b.startsWith(a)) {
            return true;
          }
        }
      }
      return false;
    };
    var parseRepeatedExtglob = (pattern, requireEnd = true) => {
      if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") {
        return;
      }
      let bracket = 0;
      let paren = 0;
      let quote = 0;
      let escaped = false;
      for (let i = 1; i < pattern.length; i++) {
        const ch = pattern[i];
        if (escaped === true) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === '"') {
          quote = quote === 1 ? 0 : 1;
          continue;
        }
        if (quote === 1) {
          continue;
        }
        if (ch === "[") {
          bracket++;
          continue;
        }
        if (ch === "]" && bracket > 0) {
          bracket--;
          continue;
        }
        if (bracket > 0) {
          continue;
        }
        if (ch === "(") {
          paren++;
          continue;
        }
        if (ch === ")") {
          paren--;
          if (paren === 0) {
            if (requireEnd === true && i !== pattern.length - 1) {
              return;
            }
            return {
              type: pattern[0],
              body: pattern.slice(2, i),
              end: i
            };
          }
        }
      }
    };
    var buildCharClassStar = (chars) => {
      const source = chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`;
      return `${source}*`;
    };
    var getStarExtglobSequenceChars = (pattern) => {
      let index = 0;
      const chars = [];
      while (index < pattern.length) {
        const match = parseRepeatedExtglob(pattern.slice(index), false);
        if (!match || match.type !== "*") {
          return;
        }
        const branches = splitTopLevel(match.body).map((branch2) => branch2.trim());
        if (branches.length !== 1) {
          return;
        }
        const branch = normalizeSimpleBranch(branches[0]);
        if (!branch || branch.length !== 1) {
          return;
        }
        chars.push(branch);
        index += match.end + 1;
      }
      if (chars.length < 1) {
        return;
      }
      return chars;
    };
    var repeatedExtglobRecursion = (pattern) => {
      let depth = 0;
      let value = pattern.trim();
      let match = parseRepeatedExtglob(value);
      while (match) {
        depth++;
        value = match.body.trim();
        match = parseRepeatedExtglob(value);
      }
      return depth;
    };
    var analyzeRepeatedExtglob = (body, options) => {
      if (options.maxExtglobRecursion === false) {
        return { risky: false };
      }
      const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
      const branches = splitTopLevel(body).map((branch) => branch.trim());
      if (branches.length > 1) {
        if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) {
          return { risky: true };
        }
      }
      const safeChars = [];
      let sawStarSequence = false;
      let combinable = true;
      for (const branch of branches) {
        const chars = getStarExtglobSequenceChars(branch);
        if (chars) {
          sawStarSequence = true;
          safeChars.push(...chars);
          continue;
        }
        const literal = normalizeSimpleBranch(branch);
        if (literal && literal.length === 1) {
          safeChars.push(literal);
          continue;
        }
        combinable = false;
        if (repeatedExtglobRecursion(branch) > max) {
          return { risky: true };
        }
      }
      if (sawStarSequence) {
        return combinable ? { risky: true, safeOutput: buildCharClassStar([...new Set(safeChars)]) } : { risky: true };
      }
      return { risky: false };
    };
    var parse = (input, options) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      input = REPLACEMENTS[input] || input;
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: "bos", value: "", output: opts.prepend || "" };
      const tokens = [bos];
      const capture = opts.capture ? "" : "?:";
      const PLATFORM_CHARS = constants.globChars(opts.windows);
      const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? "" : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      if (typeof opts.noext === "boolean") {
        opts.noextglob = opts.noext;
      }
      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: "",
        output: "",
        prefix: "",
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens
      };
      input = utils.removePrefix(input, state);
      len = input.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;
      const eos = () => state.index === len - 1;
      const peek = state.peek = (n = 1) => input[state.index + n];
      const advance = state.advance = () => input[++state.index] || "";
      const remaining = () => input.slice(state.index + 1);
      const consume = (value2 = "", num = 0) => {
        state.consumed += value2;
        state.index += num;
      };
      const append = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count++;
        }
        if (count % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === "globstar") {
          const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
          const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
          if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "star";
            prev.value = "*";
            prev.output = star;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== "paren") {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === "text" && tok.type === "text") {
          prev.output = (prev.output || prev.value) + tok.value;
          prev.value += tok.value;
          return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value2) => {
        const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        token.startIndex = state.index;
        token.tokensIndex = tokens.length;
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        const literal = input.slice(token.startIndex, state.index + 1);
        const body = input.slice(token.startIndex + 2, state.index);
        const analysis = analyzeRepeatedExtglob(body, opts);
        if ((token.type === "plus" || token.type === "star") && analysis.risky) {
          const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
          const open = tokens[token.tokensIndex];
          open.type = "text";
          open.value = literal;
          open.output = safeOutput || utils.escapeRegex(literal);
          for (let i = token.tokensIndex + 1; i < tokens.length; i++) {
            tokens[i].value = "";
            tokens[i].output = "";
            delete tokens[i].suffix;
          }
          state.output = token.output + open.output;
          state.backtrack = true;
          push({ type: "paren", extglob: true, value, output: "" });
          decrement("parens");
          return;
        }
        let output = token.close + (opts.capture ? ")" : "");
        let rest;
        if (token.type === "negate") {
          let extglobStar = star;
          if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse(rest, { ...options, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === "bos") {
            state.negatedExtglob = true;
          }
        }
        push({ type: "paren", extglob: true, value, output });
        decrement("parens");
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === "\\") {
            backslashes = true;
            return m;
          }
          if (first === "?") {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : "");
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
            }
            return QMARK.repeat(chars.length);
          }
          if (first === ".") {
            return DOT_LITERAL.repeat(chars.length);
          }
          if (first === "*") {
            if (esc) {
              return esc + first + (rest ? star : "");
            }
            return star;
          }
          return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
            });
          }
        }
        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options);
        return state;
      }
      while (!eos()) {
        value = advance();
        if (value === "\0") {
          continue;
        }
        if (value === "\\") {
          const next = peek();
          if (next === "/" && opts.bash !== true) {
            continue;
          }
          if (next === "." || next === ";") {
            continue;
          }
          if (!next) {
            value += "\\";
            push({ type: "text", value });
            continue;
          }
          const match = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += "\\";
            }
          }
          if (opts.unescape === true) {
            value = advance();
          } else {
            value += advance();
          }
          if (state.brackets === 0) {
            push({ type: "text", value });
            continue;
          }
        }
        if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
          if (opts.posix !== false && value === ":") {
            const inner = prev.value.slice(1);
            if (inner.includes("[")) {
              prev.posix = true;
              if (inner.includes(":")) {
                const idx = prev.value.lastIndexOf("[");
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest2];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
            value = `\\${value}`;
          }
          if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
            value = `\\${value}`;
          }
          if (opts.posix === true && value === "!" && prev.value === "[") {
            value = "^";
          }
          prev.value += value;
          append({ value });
          continue;
        }
        if (state.quotes === 1 && value !== '"') {
          value = utils.escapeRegex(value);
          prev.value += value;
          append({ value });
          continue;
        }
        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: "text", value });
          }
          continue;
        }
        if (value === "(") {
          increment("parens");
          push({ type: "paren", value });
          continue;
        }
        if (value === ")") {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "("));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
          decrement("parens");
          continue;
        }
        if (value === "[") {
          if (opts.nobracket === true || !remaining().includes("]")) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("closing", "]"));
            }
            value = `\\${value}`;
          } else {
            increment("brackets");
          }
          push({ type: "bracket", value });
          continue;
        }
        if (value === "]") {
          if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "["));
            }
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          decrement("brackets");
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
            value = `/${value}`;
          }
          prev.value += value;
          append({ value });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value === "{" && opts.nobrace !== true) {
          increment("braces");
          const open = {
            type: "brace",
            value,
            output: "(",
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value === "}") {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: "text", value, output: value });
            continue;
          }
          let output = ")";
          if (brace.dots === true) {
            const arr = tokens.slice();
            const range = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === "brace") {
                break;
              }
              if (arr[i].type !== "dots") {
                range.unshift(arr[i].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value = output = "\\}";
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: "brace", value, output });
          decrement("braces");
          braces.pop();
          continue;
        }
        if (value === "|") {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === ",") {
          let output = value;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === "braces") {
            brace.comma = true;
            output = "|";
          }
          push({ type: "comma", value, output });
          continue;
        }
        if (value === "/") {
          if (prev.type === "dot" && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = "";
            state.output = "";
            tokens.pop();
            prev = bos;
            continue;
          }
          push({ type: "slash", value, output: SLASH_LITERAL });
          continue;
        }
        if (value === ".") {
          if (state.braces > 0 && prev.type === "dot") {
            if (prev.value === ".") prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = "dots";
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
            push({ type: "text", value, output: DOT_LITERAL });
            continue;
          }
          push({ type: "dot", value, output: DOT_LITERAL });
          continue;
        }
        if (value === "?") {
          const isGroup = prev && prev.value === "(";
          if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("qmark", value);
            continue;
          }
          if (prev && prev.type === "paren") {
            const next = peek();
            let output = value;
            if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
              output = `\\${value}`;
            }
            push({ type: "text", value, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
            push({ type: "qmark", value, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: "qmark", value, output: QMARK });
          continue;
        }
        if (value === "!") {
          if (opts.noextglob !== true && peek() === "(") {
            if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
              extglobOpen("negate", value);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value === "+") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("plus", value);
            continue;
          }
          if (prev && prev.value === "(" || opts.regex === false) {
            push({ type: "plus", value, output: PLUS_LITERAL });
            continue;
          }
          if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
            push({ type: "plus", value });
            continue;
          }
          push({ type: "plus", value: PLUS_LITERAL });
          continue;
        }
        if (value === "@") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            push({ type: "at", extglob: true, value, output: "" });
            continue;
          }
          push({ type: "text", value });
          continue;
        }
        if (value !== "*") {
          if (value === "$" || value === "^") {
            value = `\\${value}`;
          }
          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value += match[0];
            state.index += match[0].length;
          }
          push({ type: "text", value });
          continue;
        }
        if (prev && (prev.type === "globstar" || prev.star === true)) {
          prev.type = "star";
          prev.star = true;
          prev.value += value;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen("star", value);
          continue;
        }
        if (prev.type === "star") {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === "slash" || prior.type === "bos";
          const afterStar = before && (before.type === "star" || before.type === "globstar");
          if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
            push({ type: "star", value, output: "" });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
          const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
          if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
            push({ type: "star", value, output: "" });
            continue;
          }
          while (rest.slice(0, 3) === "/**") {
            const after = input[state.index + 4];
            if (after && after !== "/") {
              break;
            }
            rest = rest.slice(3);
            consume("/**", 3);
          }
          if (prior.type === "bos" && eos()) {
            prev.type = "globstar";
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
            const end = rest[1] !== void 0 ? "|$" : "";
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          if (prior.type === "bos" && rest[0] === "/") {
            prev.type = "globstar";
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "globstar";
          prev.output = globstar(opts);
          prev.value += value;
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        const token = { type: "star", value, output: star };
        if (opts.bash === true) {
          token.output = ".*?";
          if (prev.type === "bos" || prev.type === "slash") {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
          if (prev.type === "dot") {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== "*") {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
        state.output = utils.escapeLast(state.output, "[");
        decrement("brackets");
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
        state.output = utils.escapeLast(state.output, "(");
        decrement("parens");
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
        state.output = utils.escapeLast(state.output, "{");
        decrement("braces");
      }
      if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
        push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = "";
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse.fastpaths = (input, options) => {
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input = REPLACEMENTS[input] || input;
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants.globChars(opts.windows);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? "" : "?:";
      const state = { negated: false, prefix: "" };
      let star = opts.bash === true ? ".*?" : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create = (str) => {
        switch (str) {
          case "*":
            return `${nodot}${ONE_CHAR}${star}`;
          case ".*":
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*.*":
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*/*":
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
          case "**":
            return nodot + globstar(opts);
          case "**/*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
          case "**/*.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "**/.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str);
            if (!match) return;
            const source2 = create(match[1]);
            if (!source2) return;
            return source2 + DOT_LITERAL + match[2];
          }
        }
      };
      const output = utils.removePrefix(input, state);
      let source = create(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module.exports = parse;
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/picomatch.js"(exports, module) {
    "use strict";
    var scan = require_scan();
    var parse = require_parse();
    var utils = require_utils();
    var constants = require_constants();
    var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch2 = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input) => picomatch2(input, options, returnState));
        const arrayMatcher = (str) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str);
            if (state2) return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject(glob) && glob.tokens && glob.input;
      if (glob === "" || typeof glob !== "string" && !isState) {
        throw new TypeError("Expected pattern to be a non-empty string");
      }
      const opts = options || {};
      const posix = opts.windows;
      const regex = isState ? picomatch2.compileRe(glob, options) : picomatch2.makeRe(glob, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch2(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch2.test(input, regex, options, { glob, posix });
        const result = { glob, state, regex, posix, input, output, match, isMatch };
        if (typeof opts.onResult === "function") {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input)) {
          if (typeof opts.onIgnore === "function") {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === "function") {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch2.test = (input, regex, options, { glob, posix } = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options || {};
      const format = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input === glob;
      let output = match && format ? format(input) : input;
      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch2.matchBase(input, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch2.matchBase = (input, glob, options, posix = options && options.windows) => {
      const regex = glob instanceof RegExp ? glob : picomatch2.makeRe(glob, options);
      return regex.test(utils.basename(input, { windows: posix }));
    };
    picomatch2.isMatch = (str, patterns, options) => picomatch2(patterns, options)(str);
    picomatch2.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch2.parse(p, options));
      return parse(pattern, { ...options, fastpaths: false });
    };
    picomatch2.scan = (input, options) => scan(input, options);
    picomatch2.compileRe = (state, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options || {};
      const prepend = opts.contains ? "" : "^";
      const append = opts.contains ? "" : "$";
      let source = `${prepend}(?:${state.output})${append}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch2.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch2.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse(input, options);
      }
      return picomatch2.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch2.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch2.constants = constants;
    module.exports = picomatch2;
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/index.js"(exports, module) {
    "use strict";
    var pico = require_picomatch();
    var utils = require_utils();
    function picomatch2(glob, options, returnState = false) {
      if (options && (options.windows === null || options.windows === void 0)) {
        options = { ...options, windows: utils.isWindows() };
      }
      return pico(glob, options, returnState);
    }
    Object.assign(picomatch2, pico);
    module.exports = picomatch2;
  }
});

// ../../node_modules/.pnpm/ignore@7.0.5/node_modules/ignore/index.js
var require_ignore = __commonJS({
  "../../node_modules/.pnpm/ignore@7.0.5/node_modules/ignore/index.js"(exports, module) {
    "use strict";
    function makeArray(subject) {
      return Array.isArray(subject) ? subject : [subject];
    }
    var UNDEFINED = void 0;
    var EMPTY = "";
    var SPACE = " ";
    var ESCAPE = "\\";
    var REGEX_TEST_BLANK_LINE = /^\s+$/;
    var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
    var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
    var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
    var REGEX_SPLITALL_CRLF = /\r?\n/g;
    var REGEX_TEST_INVALID_PATH = /^\.{0,2}\/|^\.{1,2}$/;
    var REGEX_TEST_TRAILING_SLASH = /\/$/;
    var SLASH = "/";
    var TMP_KEY_IGNORE = "node-ignore";
    if (typeof Symbol !== "undefined") {
      TMP_KEY_IGNORE = /* @__PURE__ */ Symbol.for("node-ignore");
    }
    var KEY_IGNORE = TMP_KEY_IGNORE;
    var define = (object, key, value) => {
      Object.defineProperty(object, key, { value });
      return value;
    };
    var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
    var RETURN_FALSE = () => false;
    var sanitizeRange = (range) => range.replace(
      REGEX_REGEXP_RANGE,
      (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY
    );
    var cleanRangeBackSlash = (slashes) => {
      const { length } = slashes;
      return slashes.slice(0, length - length % 2);
    };
    var REPLACERS = [
      [
        // Remove BOM
        // TODO:
        // Other similar zero-width characters?
        /^\uFEFF/,
        () => EMPTY
      ],
      // > Trailing spaces are ignored unless they are quoted with backslash ("\")
      [
        // (a\ ) -> (a )
        // (a  ) -> (a)
        // (a ) -> (a)
        // (a \ ) -> (a  )
        /((?:\\\\)*?)(\\?\s+)$/,
        (_, m1, m2) => m1 + (m2.indexOf("\\") === 0 ? SPACE : EMPTY)
      ],
      // Replace (\ ) with ' '
      // (\ ) -> ' '
      // (\\ ) -> '\\ '
      // (\\\ ) -> '\\ '
      [
        /(\\+?)\s/g,
        (_, m1) => {
          const { length } = m1;
          return m1.slice(0, length - length % 2) + SPACE;
        }
      ],
      // Escape metacharacters
      // which is written down by users but means special for regular expressions.
      // > There are 12 characters with special meanings:
      // > - the backslash \,
      // > - the caret ^,
      // > - the dollar sign $,
      // > - the period or dot .,
      // > - the vertical bar or pipe symbol |,
      // > - the question mark ?,
      // > - the asterisk or star *,
      // > - the plus sign +,
      // > - the opening parenthesis (,
      // > - the closing parenthesis ),
      // > - and the opening square bracket [,
      // > - the opening curly brace {,
      // > These special characters are often called "metacharacters".
      [
        /[\\$.|*+(){^]/g,
        (match) => `\\${match}`
      ],
      [
        // > a question mark (?) matches a single character
        /(?!\\)\?/g,
        () => "[^/]"
      ],
      // leading slash
      [
        // > A leading slash matches the beginning of the pathname.
        // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
        // A leading slash matches the beginning of the pathname
        /^\//,
        () => "^"
      ],
      // replace special metacharacter slash after the leading slash
      [
        /\//g,
        () => "\\/"
      ],
      [
        // > A leading "**" followed by a slash means match in all directories.
        // > For example, "**/foo" matches file or directory "foo" anywhere,
        // > the same as pattern "foo".
        // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
        // >   under directory "foo".
        // Notice that the '*'s have been replaced as '\\*'
        /^\^*\\\*\\\*\\\//,
        // '**/foo' <-> 'foo'
        () => "^(?:.*\\/)?"
      ],
      // starting
      [
        // there will be no leading '/'
        //   (which has been replaced by section "leading slash")
        // If starts with '**', adding a '^' to the regular expression also works
        /^(?=[^^])/,
        function startingReplacer() {
          return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
        }
      ],
      // two globstars
      [
        // Use lookahead assertions so that we could match more than one `'/**'`
        /\\\/\\\*\\\*(?=\\\/|$)/g,
        // Zero, one or several directories
        // should not use '*', or it will be replaced by the next replacer
        // Check if it is not the last `'/**'`
        (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
      ],
      // normal intermediate wildcards
      [
        // Never replace escaped '*'
        // ignore rule '\*' will match the path '*'
        // 'abc.*/' -> go
        // 'abc.*'  -> skip this rule,
        //    coz trailing single wildcard will be handed by [trailing wildcard]
        /(^|[^\\]+)(\\\*)+(?=.+)/g,
        // '*.js' matches '.js'
        // '*.js' doesn't match 'abc'
        (_, p1, p2) => {
          const unescaped = p2.replace(/\\\*/g, "[^\\/]*");
          return p1 + unescaped;
        }
      ],
      [
        // unescape, revert step 3 except for back slash
        // For example, if a user escape a '\\*',
        // after step 3, the result will be '\\\\\\*'
        /\\\\\\(?=[$.|*+(){^])/g,
        () => ESCAPE
      ],
      [
        // '\\\\' -> '\\'
        /\\\\/g,
        () => ESCAPE
      ],
      [
        // > The range notation, e.g. [a-zA-Z],
        // > can be used to match one of the characters in a range.
        // `\` is escaped by step 3
        /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
        (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"
      ],
      // ending
      [
        // 'js' will not match 'js.'
        // 'ab' will not match 'abc'
        /(?:[^*])$/,
        // WTF!
        // https://git-scm.com/docs/gitignore
        // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
        // which re-fixes #24, #38
        // > If there is a separator at the end of the pattern then the pattern
        // > will only match directories, otherwise the pattern can match both
        // > files and directories.
        // 'js*' will not match 'a.js'
        // 'js/' will not match 'a.js'
        // 'js' will match 'a.js' and 'a.js/'
        (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
      ]
    ];
    var REGEX_REPLACE_TRAILING_WILDCARD = /(^|\\\/)?\\\*$/;
    var MODE_IGNORE = "regex";
    var MODE_CHECK_IGNORE = "checkRegex";
    var UNDERSCORE = "_";
    var TRAILING_WILD_CARD_REPLACERS = {
      [MODE_IGNORE](_, p1) {
        const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
        return `${prefix}(?=$|\\/$)`;
      },
      [MODE_CHECK_IGNORE](_, p1) {
        const prefix = p1 ? `${p1}[^/]*` : "[^/]*";
        return `${prefix}(?=$|\\/$)`;
      }
    };
    var makeRegexPrefix = (pattern) => REPLACERS.reduce(
      (prev, [matcher, replacer]) => prev.replace(matcher, replacer.bind(pattern)),
      pattern
    );
    var isString = (subject) => typeof subject === "string";
    var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
    var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF).filter(Boolean);
    var IgnoreRule = class {
      constructor(pattern, mark, body, ignoreCase, negative, prefix) {
        this.pattern = pattern;
        this.mark = mark;
        this.negative = negative;
        define(this, "body", body);
        define(this, "ignoreCase", ignoreCase);
        define(this, "regexPrefix", prefix);
      }
      get regex() {
        const key = UNDERSCORE + MODE_IGNORE;
        if (this[key]) {
          return this[key];
        }
        return this._make(MODE_IGNORE, key);
      }
      get checkRegex() {
        const key = UNDERSCORE + MODE_CHECK_IGNORE;
        if (this[key]) {
          return this[key];
        }
        return this._make(MODE_CHECK_IGNORE, key);
      }
      _make(mode, key) {
        const str = this.regexPrefix.replace(
          REGEX_REPLACE_TRAILING_WILDCARD,
          // It does not need to bind pattern
          TRAILING_WILD_CARD_REPLACERS[mode]
        );
        const regex = this.ignoreCase ? new RegExp(str, "i") : new RegExp(str);
        return define(this, key, regex);
      }
    };
    var createRule = ({
      pattern,
      mark
    }, ignoreCase) => {
      let negative = false;
      let body = pattern;
      if (body.indexOf("!") === 0) {
        negative = true;
        body = body.substr(1);
      }
      body = body.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
      const regexPrefix = makeRegexPrefix(body);
      return new IgnoreRule(
        pattern,
        mark,
        body,
        ignoreCase,
        negative,
        regexPrefix
      );
    };
    var RuleManager = class {
      constructor(ignoreCase) {
        this._ignoreCase = ignoreCase;
        this._rules = [];
      }
      _add(pattern) {
        if (pattern && pattern[KEY_IGNORE]) {
          this._rules = this._rules.concat(pattern._rules._rules);
          this._added = true;
          return;
        }
        if (isString(pattern)) {
          pattern = {
            pattern
          };
        }
        if (checkPattern(pattern.pattern)) {
          const rule = createRule(pattern, this._ignoreCase);
          this._added = true;
          this._rules.push(rule);
        }
      }
      // @param {Array<string> | string | Ignore} pattern
      add(pattern) {
        this._added = false;
        makeArray(
          isString(pattern) ? splitPattern(pattern) : pattern
        ).forEach(this._add, this);
        return this._added;
      }
      // Test one single path without recursively checking parent directories
      //
      // - checkUnignored `boolean` whether should check if the path is unignored,
      //   setting `checkUnignored` to `false` could reduce additional
      //   path matching.
      // - check `string` either `MODE_IGNORE` or `MODE_CHECK_IGNORE`
      // @returns {TestResult} true if a file is ignored
      test(path7, checkUnignored, mode) {
        let ignored = false;
        let unignored = false;
        let matchedRule;
        this._rules.forEach((rule) => {
          const { negative } = rule;
          if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
            return;
          }
          const matched = rule[mode].test(path7);
          if (!matched) {
            return;
          }
          ignored = !negative;
          unignored = negative;
          matchedRule = negative ? UNDEFINED : rule;
        });
        const ret = {
          ignored,
          unignored
        };
        if (matchedRule) {
          ret.rule = matchedRule;
        }
        return ret;
      }
    };
    var throwError = (message, Ctor) => {
      throw new Ctor(message);
    };
    var checkPath = (path7, originalPath, doThrow) => {
      if (!isString(path7)) {
        return doThrow(
          `path must be a string, but got \`${originalPath}\``,
          TypeError
        );
      }
      if (!path7) {
        return doThrow(`path must not be empty`, TypeError);
      }
      if (checkPath.isNotRelative(path7)) {
        const r = "`path.relative()`d";
        return doThrow(
          `path should be a ${r} string, but got "${originalPath}"`,
          RangeError
        );
      }
      return true;
    };
    var isNotRelative = (path7) => REGEX_TEST_INVALID_PATH.test(path7);
    checkPath.isNotRelative = isNotRelative;
    checkPath.convert = (p) => p;
    var Ignore = class {
      constructor({
        ignorecase = true,
        ignoreCase = ignorecase,
        allowRelativePaths = false
      } = {}) {
        define(this, KEY_IGNORE, true);
        this._rules = new RuleManager(ignoreCase);
        this._strictPathCheck = !allowRelativePaths;
        this._initCache();
      }
      _initCache() {
        this._ignoreCache = /* @__PURE__ */ Object.create(null);
        this._testCache = /* @__PURE__ */ Object.create(null);
      }
      add(pattern) {
        if (this._rules.add(pattern)) {
          this._initCache();
        }
        return this;
      }
      // legacy
      addPattern(pattern) {
        return this.add(pattern);
      }
      // @returns {TestResult}
      _test(originalPath, cache, checkUnignored, slices) {
        const path7 = originalPath && checkPath.convert(originalPath);
        checkPath(
          path7,
          originalPath,
          this._strictPathCheck ? throwError : RETURN_FALSE
        );
        return this._t(path7, cache, checkUnignored, slices);
      }
      checkIgnore(path7) {
        if (!REGEX_TEST_TRAILING_SLASH.test(path7)) {
          return this.test(path7);
        }
        const slices = path7.split(SLASH).filter(Boolean);
        slices.pop();
        if (slices.length) {
          const parent = this._t(
            slices.join(SLASH) + SLASH,
            this._testCache,
            true,
            slices
          );
          if (parent.ignored) {
            return parent;
          }
        }
        return this._rules.test(path7, false, MODE_CHECK_IGNORE);
      }
      _t(path7, cache, checkUnignored, slices) {
        if (path7 in cache) {
          return cache[path7];
        }
        if (!slices) {
          slices = path7.split(SLASH).filter(Boolean);
        }
        slices.pop();
        if (!slices.length) {
          return cache[path7] = this._rules.test(path7, checkUnignored, MODE_IGNORE);
        }
        const parent = this._t(
          slices.join(SLASH) + SLASH,
          cache,
          checkUnignored,
          slices
        );
        return cache[path7] = parent.ignored ? parent : this._rules.test(path7, checkUnignored, MODE_IGNORE);
      }
      ignores(path7) {
        return this._test(path7, this._ignoreCache, false).ignored;
      }
      createFilter() {
        return (path7) => !this.ignores(path7);
      }
      filter(paths) {
        return makeArray(paths).filter(this.createFilter());
      }
      // @returns {TestResult}
      test(path7) {
        return this._test(path7, this._testCache, true);
      }
    };
    var factory = (options) => new Ignore(options);
    var isPathValid = (path7) => checkPath(path7 && checkPath.convert(path7), path7, RETURN_FALSE);
    var setupWindows = () => {
      const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
      checkPath.convert = makePosix;
      const REGEX_TEST_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
      checkPath.isNotRelative = (path7) => REGEX_TEST_WINDOWS_PATH_ABSOLUTE.test(path7) || isNotRelative(path7);
    };
    if (
      // Detect `process` so that it can run in browsers.
      typeof process !== "undefined" && process.platform === "win32"
    ) {
      setupWindows();
    }
    module.exports = factory;
    factory.default = factory;
    module.exports.isPathValid = isPathValid;
    define(module.exports, /* @__PURE__ */ Symbol.for("setupWindows"), setupWindows);
  }
});

// src/cli.ts
import { spawnSync } from "child_process";
import { readFileSync as readFileSync5 } from "fs";
import { pathToFileURL as pathToFileURL2 } from "url";

// src/errors.ts
var ProjectMemoryError = class extends Error {
  code;
  details;
  constructor(code, message, details = {}) {
    super(message);
    this.name = "ProjectMemoryError";
    this.code = code;
    this.details = details;
  }
};
function normalizeError(error) {
  if (error instanceof ProjectMemoryError) {
    return { code: error.code, message: error.message, details: error.details };
  }
  return {
    code: "STORAGE_ERROR",
    message: error instanceof Error ? error.message : String(error),
    details: {}
  };
}

// src/paths.ts
var import_picomatch = __toESM(require_picomatch2(), 1);
import { existsSync, mkdirSync, readFileSync } from "fs";
import { homedir } from "os";
import path from "path";
function resolveDataDir() {
  const explicit = process.env.CODEX_PROJECT_MEMORY_HOME;
  if (explicit) {
    return path.resolve(explicit);
  }
  const codexHome = process.env.CODEX_HOME ? path.resolve(process.env.CODEX_HOME) : path.join(homedir(), ".codex");
  return path.join(codexHome, "project-memory", "v1");
}
function ensureDataDir(dataDir = resolveDataDir()) {
  mkdirSync(dataDir, { recursive: true, mode: 448 });
  return dataDir;
}
function loadLocalConfig(dataDir) {
  const configPath = path.join(dataDir, "config.json");
  if (!existsSync(configPath)) {
    return { denyPatterns: [] };
  }
  const raw = JSON.parse(readFileSync(configPath, "utf8"));
  return {
    denyPatterns: Array.isArray(raw.denyPatterns) ? raw.denyPatterns.filter((value) => typeof value === "string") : []
  };
}
function matchesCustomDeny(relativePath, patterns) {
  return patterns.some((pattern) => import_picomatch.default.isMatch(relativePath, pattern, { dot: true }));
}

// src/service.ts
import path5, { basename } from "path";
import { pathToFileURL } from "url";

// src/git.ts
import { execFileSync } from "child_process";
import { realpathSync, statSync } from "fs";
import path2 from "path";
function git(pathValue, args) {
  try {
    return execFileSync("git", ["-C", pathValue, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return null;
  }
}
function detectGitMetadata(inputPath) {
  const realInput = realpathSync(path2.resolve(inputPath));
  const directory = statSync(realInput).isDirectory() ? realInput : path2.dirname(realInput);
  const root = git(directory, ["rev-parse", "--show-toplevel"]);
  if (!root) {
    return {
      rootPath: directory,
      isGit: false,
      gitCommonDir: null,
      remoteUrl: null,
      headCommit: null
    };
  }
  const rootPath = realpathSync(root);
  const commonDirRaw = git(rootPath, ["rev-parse", "--git-common-dir"]);
  const gitCommonDir = commonDirRaw ? realpathSync(path2.resolve(rootPath, commonDirRaw)) : null;
  return {
    rootPath,
    isGit: true,
    gitCommonDir,
    remoteUrl: git(rootPath, ["remote", "get-url", "origin"]),
    headCommit: git(rootPath, ["rev-parse", "HEAD"])
  };
}
function listGitFiles(rootPath) {
  try {
    const output = execFileSync(
      "git",
      ["-C", rootPath, "ls-files", "-co", "--exclude-standard", "-z"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 20 * 1024 * 1024 }
    );
    return output.split("\0").filter(Boolean);
  } catch {
    return null;
  }
}

// src/guide.ts
import { createHash } from "crypto";
var CITATION_WEIGHTS = {
  evidence: 3,
  report: 2,
  workflow: 2,
  reference: 1
};
var RELATION_LABELS = {
  related_to: "\u76F8\u5173",
  depends_on: "\u4F9D\u8D56",
  supports: "\u652F\u6301",
  contradicts: "\u77DB\u76FE",
  supersedes: "\u66FF\u4EE3",
  derived_from: "\u6765\u6E90\u4E8E"
};
function pairKey(left, right) {
  return [left, right].sort().join("\0");
}
function stableId(prefix, values) {
  return `${prefix}_${createHash("sha256").update(values.join("\0")).digest("hex").slice(0, 16)}`;
}
function fileName(sourcePath) {
  return sourcePath.split("/").at(-1) ?? sourcePath;
}
function sortedMemories(memories) {
  return [...memories].sort((left, right) => left.id.localeCompare(right.id));
}
function relationDegrees(graph) {
  const degrees = new Map(graph.nodes.map((memory) => [memory.id, 0]));
  for (const relation of graph.relations) {
    degrees.set(relation.fromMemoryId, (degrees.get(relation.fromMemoryId) ?? 0) + 1);
    degrees.set(relation.toMemoryId, (degrees.get(relation.toMemoryId) ?? 0) + 1);
  }
  return degrees;
}
function connectedComponents(graph) {
  const adjacency = new Map(graph.nodes.map((memory) => [memory.id, /* @__PURE__ */ new Set()]));
  for (const relation of graph.relations) {
    adjacency.get(relation.fromMemoryId)?.add(relation.toMemoryId);
    adjacency.get(relation.toMemoryId)?.add(relation.fromMemoryId);
  }
  const visited = /* @__PURE__ */ new Set();
  const components = [];
  for (const memory of sortedMemories(graph.nodes)) {
    if (visited.has(memory.id)) continue;
    const component = [];
    const queue = [memory.id];
    visited.add(memory.id);
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      component.push(current);
      for (const neighbor of adjacency.get(current) ?? []) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
    components.push(component.sort());
  }
  return components.sort(
    (left, right) => right.length - left.length || (left[0] ?? "").localeCompare(right[0] ?? "")
  );
}
function buildHighlights(graph, degrees) {
  const memories = [...graph.nodes];
  const highlights = [];
  const select = (kind, candidates, reason, value) => {
    const memory = candidates[0];
    if (!memory) return;
    highlights.push({
      id: `highlight:${kind}:${memory.id}`,
      kind,
      memoryId: memory.id,
      title: memory.title,
      reason: reason(memory),
      value: value(memory)
    });
  };
  const byDegree = [...memories].sort(
    (left, right) => (degrees.get(right.id) ?? 0) - (degrees.get(left.id) ?? 0) || right.citations.length - left.citations.length || left.id.localeCompare(right.id)
  );
  if ((degrees.get(byDegree[0]?.id ?? "") ?? 0) > 0) {
    select(
      "connected",
      byDegree,
      (memory) => `\u8FDE\u63A5 ${degrees.get(memory.id) ?? 0} \u6761\u5DF2\u5BA1\u6838\u5173\u7CFB`,
      (memory) => degrees.get(memory.id) ?? 0
    );
  }
  select(
    "evidence",
    [...memories].sort(
      (left, right) => right.citations.length - left.citations.length || left.id.localeCompare(right.id)
    ),
    (memory) => `\u8BB0\u5F55 ${memory.citations.length} \u4E2A\u53EF\u8FFD\u6EAF\u6765\u6E90`,
    (memory) => memory.citations.length
  );
  select(
    "recent",
    [...memories].sort(
      (left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt) || left.id.localeCompare(right.id)
    ),
    (memory) => `\u6700\u8FD1\u66F4\u65B0\u4E8E ${memory.updatedAt}`,
    (memory) => memory.updatedAt
  );
  return highlights;
}
function buildRelationSuggestions(projectId, graph, limit) {
  const memories = sortedMemories(graph.nodes.filter((memory) => memory.projectId === projectId));
  if (memories.length < 2) return [];
  const existingPairs = new Set(
    graph.relations.map((relation) => pairKey(relation.fromMemoryId, relation.toMemoryId))
  );
  const signalsByPair = /* @__PURE__ */ new Map();
  const memoryById = new Map(memories.map((memory) => [memory.id, memory]));
  const addSignal = (leftId, rightId, signal) => {
    if (leftId === rightId || existingPairs.has(pairKey(leftId, rightId))) return;
    const key = pairKey(leftId, rightId);
    const signals = signalsByPair.get(key) ?? [];
    if (!signals.some((candidate) => candidate.key === signal.key)) signals.push(signal);
    signalsByPair.set(key, signals);
  };
  const citationIndex = /* @__PURE__ */ new Map();
  for (const memory of memories) {
    const seen = /* @__PURE__ */ new Set();
    for (const citation of memory.citations) {
      if (!citation.accessible) continue;
      const key = `${citation.sourceProjectId}\0${citation.sourcePath}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const indexed = citationIndex.get(key) ?? [];
      indexed.push({
        memoryId: memory.id,
        role: citation.role,
        sourceProjectId: citation.sourceProjectId,
        sourcePath: citation.sourcePath
      });
      citationIndex.set(key, indexed);
    }
  }
  for (const [key, references] of citationIndex) {
    if (references.length / memories.length > 0.6) continue;
    for (let leftIndex = 0; leftIndex < references.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < references.length; rightIndex += 1) {
        const left = references[leftIndex];
        const right = references[rightIndex];
        if (!left || !right) continue;
        const role = CITATION_WEIGHTS[left.role] >= CITATION_WEIGHTS[right.role] ? left.role : right.role;
        addSignal(left.memoryId, right.memoryId, {
          kind: "shared_citation",
          key: `citation:${key}`,
          label: `\u5171\u4EAB${role === "evidence" ? "\u8BC1\u636E" : role === "report" ? "\u62A5\u544A" : role === "workflow" ? "\u6D41\u7A0B" : "\u53C2\u8003"}\uFF1A${fileName(left.sourcePath)}`,
          weight: CITATION_WEIGHTS[role],
          role,
          sourceProjectId: left.sourceProjectId,
          sourcePath: left.sourcePath
        });
      }
    }
  }
  const topicIndex = /* @__PURE__ */ new Map();
  for (const memory of memories) {
    const topic = memory.topic?.trim();
    if (!topic) continue;
    topicIndex.set(topic, [...topicIndex.get(topic) ?? [], memory.id]);
  }
  for (const [topic, memoryIds] of topicIndex) {
    for (let leftIndex = 0; leftIndex < memoryIds.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < memoryIds.length; rightIndex += 1) {
        const leftId = memoryIds[leftIndex];
        const rightId = memoryIds[rightIndex];
        if (!leftId || !rightId) continue;
        addSignal(leftId, rightId, {
          kind: "same_topic",
          key: `topic:${topic}`,
          label: `\u540C\u5C5E\u4E3B\u9898\uFF1A${topic}`,
          weight: 2
        });
      }
    }
  }
  const tagFrequency = /* @__PURE__ */ new Map();
  for (const memory of memories) {
    for (const tag of new Set(memory.tags.map((value) => value.trim()).filter(Boolean))) {
      tagFrequency.set(tag, (tagFrequency.get(tag) ?? 0) + 1);
    }
  }
  for (let leftIndex = 0; leftIndex < memories.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < memories.length; rightIndex += 1) {
      const left = memories[leftIndex];
      const right = memories[rightIndex];
      if (!left || !right) continue;
      const rightTags = new Set(right.tags);
      const shared = [...new Set(left.tags)].filter(
        (tag) => rightTags.has(tag) && (tagFrequency.get(tag) ?? 0) / memories.length <= 0.5
      ).sort();
      if (shared.length < 2) continue;
      for (const tag of shared.slice(0, 2)) {
        addSignal(left.id, right.id, {
          kind: "shared_tag",
          key: `tag:${tag}`,
          label: `\u5171\u4EAB\u6807\u7B7E\uFF1A${tag}`,
          weight: 1
        });
      }
    }
  }
  const suggestions = [];
  for (const [key, rawSignals] of signalsByPair) {
    const [fromMemoryId, toMemoryId] = key.split("\0");
    if (!fromMemoryId || !toMemoryId || !memoryById.has(fromMemoryId) || !memoryById.has(toMemoryId))
      continue;
    const signals = [...rawSignals].sort(
      (left, right) => right.weight - left.weight || left.key.localeCompare(right.key)
    );
    const score = signals.reduce((total, signal) => total + signal.weight, 0);
    if (score < 2) continue;
    const signalKeys = signals.map((signal) => signal.key).sort();
    suggestions.push({
      id: stableId("hint", [projectId, fromMemoryId, toMemoryId, ...signalKeys]),
      projectId,
      fromMemoryId,
      toMemoryId,
      type: "related_to",
      rationale: signals.map((signal) => signal.label).join("\uFF1B"),
      score,
      signals
    });
  }
  return suggestions.sort(
    (left, right) => right.score - left.score || left.fromMemoryId.localeCompare(right.fromMemoryId) || left.toMemoryId.localeCompare(right.toMemoryId)
  ).slice(0, Math.max(1, Math.min(limit, 50)));
}
function buildGaps(graph, degrees) {
  const gaps = [];
  for (const memory of sortedMemories(graph.nodes)) {
    if ((degrees.get(memory.id) ?? 0) === 0) {
      gaps.push({
        id: `gap:isolated:${memory.id}`,
        kind: "isolated",
        memoryIds: [memory.id],
        message: `\u201C${memory.title}\u201D\u5C1A\u672A\u8FDE\u63A5\u4EFB\u4F55\u5DF2\u5BA1\u6838\u5173\u7CFB\u3002`
      });
    }
    if (memory.stale) {
      gaps.push({
        id: `gap:stale-memory:${memory.id}`,
        kind: "stale_memory",
        memoryIds: [memory.id],
        message: `\u201C${memory.title}\u201D\u5DF2\u8FC7\u671F\uFF1A${memory.staleReason ?? "\u6765\u6E90\u53D1\u751F\u53D8\u5316"}`
      });
    }
    const staleCitations = memory.citations.filter((citation) => citation.stale);
    if (staleCitations.length > 0) {
      gaps.push({
        id: `gap:stale-citation:${memory.id}`,
        kind: "stale_citation",
        memoryIds: [memory.id],
        message: `\u201C${memory.title}\u201D\u6709 ${staleCitations.length} \u4E2A\u6765\u6E90\u5DF2\u5931\u6548\u3002`
      });
    }
  }
  return gaps;
}
function buildSuggestedQuestions(graph, suggestions, degrees) {
  const memoryById = new Map(graph.nodes.map((memory) => [memory.id, memory]));
  const questions = [];
  for (const relation of graph.relations) {
    const from = memoryById.get(relation.fromMemoryId);
    const to = memoryById.get(relation.toMemoryId);
    if (!from || !to) continue;
    questions.push({
      id: `question:relation:${relation.id}`,
      question: `\u201C${from.title}\u201D\u5982\u4F55${RELATION_LABELS[relation.type]}\u201C${to.title}\u201D\uFF1F`,
      why: `\u5DF2\u6709\u4E00\u6761\u5DF2\u5BA1\u6838\u7684${RELATION_LABELS[relation.type]}\u5173\u7CFB\uFF0C\u53EF\u6CBF\u5173\u7CFB\u7406\u7531\u548C\u6765\u6E90\u7EE7\u7EED\u8FFD\u6EAF\u3002`,
      memoryIds: [from.id, to.id]
    });
  }
  for (const suggestion of suggestions) {
    const from = memoryById.get(suggestion.fromMemoryId);
    const to = memoryById.get(suggestion.toMemoryId);
    if (!from || !to) continue;
    questions.push({
      id: `question:suggestion:${suggestion.id}`,
      question: `\u201C${from.title}\u201D\u4E0E\u201C${to.title}\u201D\u4E4B\u95F4\u662F\u5426\u7F3A\u5C11\u4E00\u6761\u6B63\u5F0F\u5173\u7CFB\uFF1F`,
      why: suggestion.rationale,
      memoryIds: [from.id, to.id]
    });
  }
  for (const memory of sortedMemories(graph.nodes)) {
    if ((degrees.get(memory.id) ?? 0) !== 0) continue;
    questions.push({
      id: `question:isolated:${memory.id}`,
      question: `\u201C${memory.title}\u201D\u5E94\u4E0E\u54EA\u4E9B\u5DF2\u6709\u8BB0\u5FC6\u5EFA\u7ACB\u8054\u7CFB\uFF1F`,
      why: "\u8BE5\u8BB0\u5FC6\u5F53\u524D\u662F\u5B64\u7ACB\u8282\u70B9\uFF0C\u53EF\u80FD\u5B58\u5728\u5C1A\u672A\u5BA1\u6838\u7684\u77E5\u8BC6\u8054\u7CFB\u3002",
      memoryIds: [memory.id]
    });
  }
  return questions.slice(0, 5);
}
function analyzeKnowledgeGraph(projectId, projectName, graph, generatedAt = (/* @__PURE__ */ new Date()).toISOString(), relationSuggestionLimit = 12) {
  const degrees = relationDegrees(graph);
  const components = connectedComponents(graph);
  const relationSuggestions = buildRelationSuggestions(projectId, graph, relationSuggestionLimit);
  const topics = /* @__PURE__ */ new Map();
  for (const memory of graph.nodes) {
    const topic = memory.topic ?? "\u672A\u5206\u7EC4";
    topics.set(topic, [...topics.get(topic) ?? [], memory]);
  }
  return {
    projectId,
    projectName,
    generatedAt,
    summary: {
      memoryCount: graph.nodes.length,
      formalRelationCount: graph.relations.length,
      citationCount: graph.nodes.reduce((total, memory) => total + memory.citations.length, 0),
      staleMemoryCount: graph.nodes.filter((memory) => memory.stale).length,
      staleCitationCount: graph.nodes.reduce(
        (total, memory) => total + memory.citations.filter((citation) => citation.stale).length,
        0
      ),
      componentCount: components.length,
      isolatedCount: graph.nodes.filter((memory) => (degrees.get(memory.id) ?? 0) === 0).length
    },
    topics: [...topics].sort(([left], [right]) => left.localeCompare(right, "zh-CN")).map(([name, memories]) => ({
      name,
      memoryIds: sortedMemories(memories).map((memory) => memory.id),
      memoryCount: memories.length,
      staleCount: memories.filter((memory) => memory.stale).length
    })),
    highlights: buildHighlights(graph, degrees),
    gaps: buildGaps(graph, degrees),
    suggestedQuestions: buildSuggestedQuestions(graph, relationSuggestions, degrees),
    relationSuggestions
  };
}

// src/security.ts
var import_ignore = __toESM(require_ignore(), 1);
import { createHash as createHash2 } from "crypto";
import { existsSync as existsSync2, lstatSync, readdirSync, readFileSync as readFileSync2, realpathSync as realpathSync2, statSync as statSync2 } from "fs";
import path3 from "path";
var MAX_FILE_BYTES = 1024 * 1024;
var MAX_SEARCH_RESULTS = 50;
var MAX_SEARCH_FILES = 1e4;
var MAX_EXCERPT_CHARS = 400;
var DENIED_SEGMENTS = /* @__PURE__ */ new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "target",
  ".next",
  ".turbo",
  "coverage"
]);
var DENIED_BASENAMES = /* @__PURE__ */ new Set([
  "id_rsa",
  "id_ed25519",
  "credentials",
  "credentials.json",
  "service-account.json"
]);
var DENIED_EXTENSIONS = /* @__PURE__ */ new Set([".pem", ".key", ".p12", ".pfx", ".jks", ".keystore"]);
var SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/i,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /(?:password|passwd|secret|token|api[_-]?key)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{16,}/i
];
function normalizeRelative(relativePath) {
  if (!relativePath || path3.isAbsolute(relativePath)) {
    throw new ProjectMemoryError("PATH_DENIED", "Path must be relative to the project root.", {
      path: relativePath
    });
  }
  const normalized = relativePath.replaceAll("\\", "/");
  const parts = normalized.split("/").filter(Boolean);
  if (parts.includes("..")) {
    throw new ProjectMemoryError("PATH_DENIED", "Parent path traversal is not allowed.", {
      path: relativePath
    });
  }
  return parts.join("/");
}
function isDeniedPath(relativePath, customPatterns = []) {
  const normalized = relativePath.replaceAll("\\", "/");
  const parts = normalized.split("/").filter(Boolean);
  const basename2 = parts.at(-1)?.toLowerCase() ?? "";
  const extension = path3.extname(basename2);
  return parts.some((part) => DENIED_SEGMENTS.has(part)) || /^\.env(?:\.|$)/i.test(basename2) || DENIED_BASENAMES.has(basename2) || DENIED_EXTENSIONS.has(extension) || matchesCustomDeny(normalized, customPatterns);
}
function containsSecret(text) {
  return SECRET_PATTERNS.some((pattern) => pattern.test(text));
}
function assertNoSecret(text, field) {
  if (containsSecret(text)) {
    throw new ProjectMemoryError("SECRET_DETECTED", `Potential secret detected in ${field}.`, {
      field
    });
  }
}
function sha256(data) {
  return createHash2("sha256").update(data).digest("hex");
}
function ensureInsideRoot(rootPath, candidatePath) {
  const relative = path3.relative(rootPath, candidatePath);
  if (relative === "" || !relative.startsWith("..") && !path3.isAbsolute(relative)) {
    return;
  }
  throw new ProjectMemoryError("PATH_DENIED", "Resolved path escapes the project root.", {
    path: candidatePath
  });
}
function resolveReadableFile(rootPath, relativePath, customPatterns = []) {
  const normalized = normalizeRelative(relativePath);
  if (isDeniedPath(normalized, customPatterns)) {
    throw new ProjectMemoryError("PATH_DENIED", "Path is blocked by the project memory policy.", {
      path: normalized
    });
  }
  const realRoot = realpathSync2(rootPath);
  const candidate = path3.resolve(realRoot, normalized);
  if (!existsSync2(candidate)) {
    throw new ProjectMemoryError("FILE_NOT_FOUND", "File does not exist.", { path: normalized });
  }
  const realCandidate = realpathSync2(candidate);
  ensureInsideRoot(realRoot, realCandidate);
  if (!statSync2(realCandidate).isFile()) {
    throw new ProjectMemoryError("PATH_DENIED", "Path is not a regular file.", {
      path: normalized
    });
  }
  return { absolutePath: realCandidate, relativePath: normalized };
}
function isBinary(data) {
  const sample = data.subarray(0, Math.min(data.length, 8192));
  return sample.includes(0);
}
function readProjectFile(rootPath, relativePath, commit, customPatterns = []) {
  const resolved = resolveReadableFile(rootPath, relativePath, customPatterns);
  const size = statSync2(resolved.absolutePath).size;
  if (size > MAX_FILE_BYTES) {
    throw new ProjectMemoryError("FILE_TOO_LARGE", "File exceeds the 1 MiB read limit.", {
      path: resolved.relativePath,
      size,
      limit: MAX_FILE_BYTES
    });
  }
  const buffer = readFileSync2(resolved.absolutePath);
  if (isBinary(buffer)) {
    throw new ProjectMemoryError("BINARY_FILE", "Binary files cannot be read.", {
      path: resolved.relativePath
    });
  }
  return {
    path: resolved.relativePath,
    content: buffer.toString("utf8"),
    truncated: false,
    size,
    commit,
    fileHash: sha256(buffer)
  };
}
function walkNonGitFiles(rootPath) {
  const matcher = (0, import_ignore.default)();
  const gitignore = path3.join(rootPath, ".gitignore");
  if (existsSync2(gitignore)) {
    matcher.add(readFileSync2(gitignore, "utf8"));
  }
  const output = [];
  const queue = [""];
  while (queue.length > 0 && output.length < MAX_SEARCH_FILES) {
    const relativeDir = queue.shift() ?? "";
    const absoluteDir = path3.join(rootPath, relativeDir);
    for (const entry of readdirSync(absoluteDir, { withFileTypes: true })) {
      const relative = path3.posix.join(relativeDir.replaceAll("\\", "/"), entry.name);
      if (matcher.ignores(relative) || isDeniedPath(relative)) {
        continue;
      }
      if (entry.isSymbolicLink()) {
        continue;
      }
      if (entry.isDirectory()) {
        queue.push(relative);
      } else if (entry.isFile()) {
        output.push(relative);
      }
      if (output.length >= MAX_SEARCH_FILES) {
        break;
      }
    }
  }
  return output;
}
function listSearchableFiles(rootPath, customPatterns = []) {
  const gitFiles = listGitFiles(rootPath);
  const files = gitFiles ?? walkNonGitFiles(rootPath);
  return files.filter((relativePath) => !isDeniedPath(relativePath, customPatterns)).slice(0, MAX_SEARCH_FILES);
}
function excerpt(line, matchIndex, queryLength) {
  const half = Math.floor((MAX_EXCERPT_CHARS - queryLength) / 2);
  const start = Math.max(0, matchIndex - half);
  const end = Math.min(line.length, matchIndex + queryLength + half);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < line.length ? "..." : "";
  return `${prefix}${line.slice(start, end)}${suffix}`;
}
function searchProjectFiles(rootPath, query, commit, customPatterns = []) {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) {
    throw new ProjectMemoryError("INVALID_INPUT", "Search query cannot be empty.");
  }
  const results = [];
  for (const relativePath of listSearchableFiles(rootPath, customPatterns)) {
    if (results.length >= MAX_SEARCH_RESULTS) {
      break;
    }
    let resolved;
    try {
      resolved = resolveReadableFile(rootPath, relativePath, customPatterns);
    } catch {
      continue;
    }
    const stats = lstatSync(resolved.absolutePath);
    if (stats.size > MAX_FILE_BYTES) {
      continue;
    }
    const buffer = readFileSync2(resolved.absolutePath);
    if (isBinary(buffer)) {
      continue;
    }
    const text = buffer.toString("utf8");
    const lines = text.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] ?? "";
      const matchIndex = line.toLocaleLowerCase().indexOf(needle);
      if (matchIndex === -1) {
        continue;
      }
      results.push({
        path: resolved.relativePath,
        line: index + 1,
        excerpt: excerpt(line, matchIndex, needle.length),
        commit,
        fileHash: sha256(buffer)
      });
      if (results.length >= MAX_SEARCH_RESULTS) {
        break;
      }
    }
  }
  return results;
}

// src/types.ts
var MEMORY_KINDS = [
  "architecture",
  "decision",
  "workflow",
  "convention",
  "pitfall",
  "status"
];
var CITATION_ROLES = ["evidence", "report", "workflow", "reference"];
var RELATION_TYPES = [
  "related_to",
  "depends_on",
  "supports",
  "contradicts",
  "supersedes",
  "derived_from"
];

// src/view.ts
import { createHash as createHash3 } from "crypto";
import { existsSync as existsSync3, readFileSync as readFileSync3 } from "fs";
import path4 from "path";
import { fileURLToPath } from "url";
var RELATION_LABELS2 = {
  related_to: "\u76F8\u5173",
  depends_on: "\u4F9D\u8D56",
  supports: "\u652F\u6301",
  contradicts: "\u77DB\u76FE",
  supersedes: "\u66FF\u4EE3",
  derived_from: "\u6765\u6E90\u4E8E"
};
var CITATION_LABELS = {
  evidence: "\u8BC1\u636E",
  report: "\u62A5\u544A",
  workflow: "\u6D41\u7A0B",
  reference: "\u53C2\u8003"
};
function summaryFor(memory) {
  const value = memory.summary ?? memory.content.split(/[。！？.!?]\s*/u)[0] ?? memory.content;
  return value.trim().slice(0, 140);
}
function markdownText(value) {
  return value.replaceAll("\\", "\\\\").replaceAll("|", "\\|");
}
function renderGraphMarkdown(projectName, graph, generatedAt = (/* @__PURE__ */ new Date()).toISOString(), providedGuide) {
  const projectId = providedGuide?.projectId ?? graph.nodes[0]?.projectId ?? "unknown-project";
  const guide = providedGuide ?? analyzeKnowledgeGraph(projectId, projectName, graph, generatedAt, 12);
  const memoryById = new Map(graph.nodes.map((memory) => [memory.id, memory]));
  const lines = [
    `# ${projectName} \u8BB0\u5FC6\u77E5\u8BC6\u56FE\u8C31`,
    "",
    `> \u9759\u6001\u5FEB\u7167\uFF1A${generatedAt}`,
    "",
    "## \u77E5\u8BC6\u6982\u51B5",
    "",
    `- ${guide.summary.memoryCount} \u6761\u8BB0\u5FC6 \xB7 ${guide.summary.formalRelationCount} \u6761\u5DF2\u5BA1\u6838\u5173\u7CFB \xB7 ${guide.summary.citationCount} \u4E2A\u6765\u6E90`,
    `- ${guide.summary.componentCount} \u4E2A\u8FDE\u901A\u5206\u91CF \xB7 ${guide.summary.isolatedCount} \u4E2A\u5B64\u7ACB\u8282\u70B9`,
    `- ${guide.summary.staleMemoryCount} \u6761\u8FC7\u671F\u8BB0\u5FC6 \xB7 ${guide.summary.staleCitationCount} \u4E2A\u5931\u6548\u6765\u6E90`,
    "",
    "## \u63A8\u8350\u5148\u8BFB",
    ""
  ];
  if (guide.highlights.length === 0) {
    lines.push("- \u6682\u65E0\u8BB0\u5FC6");
  } else {
    for (const highlight of guide.highlights) {
      lines.push(`- **${markdownText(highlight.title)}**\uFF1A${markdownText(highlight.reason)}`);
    }
  }
  lines.push("", "## \u77E5\u8BC6\u7F3A\u53E3", "");
  if (guide.gaps.length === 0) {
    lines.push("- \u672A\u53D1\u73B0\u660E\u663E\u7F3A\u53E3");
  } else {
    for (const gap of guide.gaps) lines.push(`- ${markdownText(gap.message)}`);
  }
  lines.push("", "## \u5EFA\u8BAE\u63A2\u7D22", "");
  if (guide.suggestedQuestions.length === 0) {
    lines.push("- \u6682\u65E0\u5EFA\u8BAE\u95EE\u9898");
  } else {
    for (const question of guide.suggestedQuestions) {
      lines.push(`- **${markdownText(question.question)}** \xB7 ${markdownText(question.why)}`);
    }
  }
  lines.push("", "## \u5F85\u5BA1\u6838\u5173\u8054\u7EBF\u7D22", "");
  if (guide.relationSuggestions.length === 0) {
    lines.push("- \u6682\u65E0\u5173\u8054\u7EBF\u7D22");
  } else {
    for (const suggestion of guide.relationSuggestions) {
      const from = memoryById.get(suggestion.fromMemoryId);
      const to = memoryById.get(suggestion.toMemoryId);
      lines.push(
        `- \`${suggestion.id}\` \xB7 **${markdownText(from?.title ?? suggestion.fromMemoryId)}** \u2194 **${markdownText(to?.title ?? suggestion.toMemoryId)}** \xB7 \u5F3A\u5EA6 ${suggestion.score} \xB7 ${markdownText(suggestion.rationale)}`
      );
    }
  }
  lines.push("", "## \u4E3B\u9898\u6982\u89C8", "");
  for (const topic of guide.topics) {
    lines.push(
      "- **" + markdownText(topic.name) + "**\uFF1A" + topic.memoryCount + " \u6761\u8BB0\u5FC6\uFF0C" + topic.staleCount + " \u6761\u8FC7\u671F"
    );
  }
  lines.push("", "## \u8BB0\u5FC6\u8BE6\u60C5", "");
  for (const memory of graph.nodes) {
    lines.push(
      `### ${markdownText(memory.title)}${memory.stale ? " [\u5DF2\u8FC7\u671F]" : ""}`,
      "",
      `- \u4E3B\u9898\uFF1A${markdownText(memory.topic ?? "\u672A\u5206\u7EC4")}`,
      `- \u7C7B\u578B\uFF1A${memory.kind}`,
      `- \u6458\u8981\uFF1A${markdownText(summaryFor(memory))}`,
      `- \u7F6E\u4FE1\u5EA6\uFF1A${memory.confidence}`,
      `- \u66F4\u65B0\u65F6\u95F4\uFF1A${memory.updatedAt}`,
      "",
      memory.content,
      "",
      "**\u6765\u6E90**",
      ""
    );
    if (memory.citations.length === 0) {
      lines.push("- \u65E0\u5DF2\u8BB0\u5F55\u6765\u6E90");
    } else {
      for (const citation of memory.citations) {
        const locator = citation.locator ? ` \xB7 ${markdownText(citation.locator)}` : "";
        const stale = citation.stale ? ` \xB7 \u5DF2\u8FC7\u671F\uFF1A${citation.staleReason}` : "";
        lines.push(
          "- " + CITATION_LABELS[citation.role] + " \xB7 " + markdownText(`${citation.sourceProjectName}/${citation.sourcePath}`) + locator + stale + (citation.note ? ` \xB7 ${markdownText(citation.note)}` : "")
        );
      }
    }
    const connected = graph.relations.filter(
      (relation) => relation.fromMemoryId === memory.id || relation.toMemoryId === memory.id
    );
    lines.push("", "**\u5173\u7CFB**", "");
    if (connected.length === 0) {
      lines.push("- \u65E0\u5DF2\u8BB0\u5F55\u5173\u7CFB");
    } else {
      for (const relation of connected) {
        const outgoing = relation.fromMemoryId === memory.id;
        const otherId = outgoing ? relation.toMemoryId : relation.fromMemoryId;
        const other = graph.nodes.find((candidate) => candidate.id === otherId);
        lines.push(
          "- " + (outgoing ? "\u2192 " : "\u2190 ") + RELATION_LABELS2[relation.type] + " \xB7 " + markdownText(other?.title ?? otherId) + " \xB7 " + markdownText(relation.rationale) + " \xB7 " + relation.confidence
        );
      }
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}
`;
}
function buildViewData(projectName, graph, generatedAt, guide) {
  return {
    projectName,
    generatedAt,
    guide,
    memories: graph.nodes.map((memory) => ({
      id: memory.id,
      projectId: memory.projectId,
      projectName: memory.projectName,
      kind: memory.kind,
      title: memory.title,
      summary: memory.summary,
      topic: memory.topic,
      content: memory.content,
      tags: memory.tags,
      citations: memory.citations.map((citation) => ({
        sourceProjectId: citation.sourceProjectId,
        sourceProjectName: citation.sourceProjectName,
        sourcePath: citation.sourcePath,
        role: citation.role,
        locator: citation.locator,
        note: citation.note,
        sourceCommit: citation.sourceCommit,
        stale: citation.stale,
        staleReason: citation.staleReason,
        accessible: citation.accessible,
        fileUrl: citation.accessible ? citation.fileUrl : null
      })),
      confidence: memory.confidence,
      updatedAt: memory.updatedAt,
      stale: memory.stale,
      staleReason: memory.staleReason
    })),
    relations: graph.relations.map((relation) => ({
      id: relation.id,
      fromMemoryId: relation.fromMemoryId,
      toMemoryId: relation.toMemoryId,
      type: relation.type,
      rationale: relation.rationale,
      confidence: relation.confidence
    }))
  };
}
function htmlText(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function htmlAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function browserAsset(name) {
  const moduleDir = path4.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path4.join(moduleDir, "browser", name),
    path4.resolve(moduleDir, "..", "dist", "browser", name)
  ];
  const assetPath = candidates.find((candidate) => existsSync3(candidate));
  if (!assetPath) {
    throw new Error(`Browser asset ${name} is missing. Run pnpm build:browser first.`);
  }
  return readFileSync3(assetPath, "utf8");
}
function contentHash(value) {
  return createHash3("sha256").update(value).digest("base64");
}
function renderGraphHtml(projectName, graph, generatedAt = (/* @__PURE__ */ new Date()).toISOString(), providedGuide) {
  const projectId = providedGuide?.projectId ?? graph.nodes[0]?.projectId ?? "unknown-project";
  const guide = providedGuide ?? analyzeKnowledgeGraph(projectId, projectName, graph, generatedAt, 12);
  const data = buildViewData(projectName, graph, generatedAt, guide);
  const css = browserAsset("graph-app.css").replaceAll("</style", "<\\/style");
  const script = browserAsset("graph-app.js").replaceAll("</script", "<\\/script");
  const csp = [
    "default-src 'none'",
    `style-src 'sha256-${contentHash(css)}'`,
    `script-src 'sha256-${contentHash(script)}'`,
    "img-src data:",
    "font-src 'none'",
    "connect-src 'none'",
    "media-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-src 'none'",
    "worker-src 'none'"
  ].join("; ");
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${htmlAttribute(csp)}">
<title>${htmlText(projectName)} \xB7 \u8BB0\u5FC6\u77E5\u8BC6\u56FE\u8C31</title>
<style>${css}</style>
</head>
<body>
<div id="app"></div>
<template id="graph-data">${htmlText(JSON.stringify(data))}</template>
<script>${script}</script>
</body>
</html>
`;
}

// src/service.ts
var MAX_CANDIDATES = 20;
var MAX_UPDATE_CANDIDATES = 20;
var MAX_TITLE_LENGTH = 200;
var MAX_CONTENT_LENGTH = 5e3;
var MAX_SUMMARY_LENGTH = 300;
var MAX_TOPIC_LENGTH = 120;
var MAX_CITATIONS = 12;
var MAX_CITATION_LOCATOR_LENGTH = 240;
var MAX_CITATION_NOTE_LENGTH = 500;
var MAX_TAGS = 20;
var MAX_TAG_LENGTH = 50;
var MAX_RELATION_CANDIDATES = 40;
var MAX_RELATION_RATIONALE_LENGTH = 1e3;
var MAX_GRAPH_NODES = 100;
var MAX_GRAPH_DEPTH = 5;
var MAX_PATH_DEPTH = 8;
var SYMMETRIC_RELATION_TYPES = /* @__PURE__ */ new Set(["related_to", "contradicts"]);
var RELATION_LABELS3 = {
  related_to: "\u76F8\u5173",
  depends_on: "\u4F9D\u8D56",
  supports: "\u652F\u6301",
  contradicts: "\u77DB\u76FE",
  supersedes: "\u66FF\u4EE3",
  derived_from: "\u6765\u6E90\u4E8E"
};
var ProjectMemoryService = class {
  constructor(store, dataDir) {
    this.store = store;
    this.denyPatterns = loadLocalConfig(dataDir).denyPatterns;
  }
  store;
  denyPatterns;
  detectProject(inputPath) {
    let metadata;
    try {
      metadata = detectGitMetadata(inputPath);
    } catch (error) {
      throw new ProjectMemoryError("INVALID_INPUT", "Project path cannot be resolved.", {
        path: inputPath,
        cause: error instanceof Error ? error.message : String(error)
      });
    }
    const registeredProject = this.store.getProjectByPath(metadata.rootPath);
    const relocationCandidates = registeredProject ? [] : this.store.findRelocationCandidates(metadata.gitCommonDir, metadata.remoteUrl).filter((project) => project.primaryPath !== metadata.rootPath);
    return {
      requestedPath: inputPath,
      rootPath: metadata.rootPath,
      name: basename(metadata.rootPath),
      isGit: metadata.isGit,
      gitCommonDir: metadata.gitCommonDir,
      remoteUrl: metadata.remoteUrl,
      headCommit: metadata.headCommit,
      registeredProject: registeredProject ? this.store.getProject(registeredProject.id) : null,
      relocationCandidates
    };
  }
  registerProject(inputPath, name, relinkProjectId) {
    const detected = this.detectProject(inputPath);
    if (detected.registeredProject) {
      this.store.touchProject(
        detected.registeredProject.id,
        detected.rootPath,
        detected.headCommit
      );
      return this.store.getProject(detected.registeredProject.id);
    }
    if (detected.relocationCandidates.length > 0 && !relinkProjectId) {
      throw new ProjectMemoryError(
        "RELINK_CONFIRMATION_REQUIRED",
        "This path resembles an existing project. Confirm whether it should be relinked.",
        { candidates: detected.relocationCandidates }
      );
    }
    if (relinkProjectId && !detected.relocationCandidates.some((candidate) => candidate.id === relinkProjectId)) {
      throw new ProjectMemoryError("INVALID_INPUT", "Relink target is not a detected candidate.", {
        relinkProjectId
      });
    }
    const projectName = (name ?? detected.name).trim();
    if (!projectName || projectName.length > 120) {
      throw new ProjectMemoryError("INVALID_INPUT", "Project name must be 1-120 characters.");
    }
    return this.store.registerProject({
      name: projectName,
      primaryPath: detected.rootPath,
      isGit: detected.isGit,
      gitCommonDir: detected.gitCommonDir,
      remoteUrl: detected.remoteUrl,
      headCommit: detected.headCommit,
      ...relinkProjectId ? { relinkProjectId } : {}
    });
  }
  projectStatus(projectId) {
    const project = this.store.requireProject(projectId);
    const memories = this.getContext(projectId, 1e3);
    let current = null;
    try {
      current = this.detectProject(project.primaryPath);
    } catch {
      current = null;
    }
    return {
      project: this.store.getProject(projectId),
      links: this.store.listLinks(projectId),
      pathAvailable: current !== null,
      currentDetection: current,
      pendingProposals: this.store.countPendingProposals(projectId),
      memoryCount: memories.length,
      lastMemoryUpdatedAt: memories[0]?.updatedAt ?? null
    };
  }
  linkProjects(sourceProjectId, targetProjectId) {
    this.store.linkProjects(sourceProjectId, targetProjectId);
    return { sourceProjectId, targetProjectId, access: "read" };
  }
  unlinkProjects(sourceProjectId, targetProjectId) {
    this.store.unlinkProjects(sourceProjectId, targetProjectId);
    return { sourceProjectId, targetProjectId, removed: true };
  }
  requireReadAccess(sourceProjectId, targetProjectId) {
    this.store.requireProject(sourceProjectId);
    this.store.requireProject(targetProjectId);
    if (!this.store.hasReadAccess(sourceProjectId, targetProjectId)) {
      throw new ProjectMemoryError(
        "LINK_REQUIRED",
        "A read-only project link is required before cross-project access.",
        { sourceProjectId, targetProjectId }
      );
    }
  }
  enrichStaleness(memory) {
    const storedCitations = memory.citations.length > 0 ? memory.citations : this.legacyCitation(memory);
    if (storedCitations.length === 0) return memory;
    const citations = storedCitations.map(
      (citation) => this.enrichCitation(memory.projectId, citation)
    );
    const staleCitation = citations.find((citation) => citation.stale);
    return {
      ...memory,
      citations,
      stale: Boolean(staleCitation),
      staleReason: staleCitation?.staleReason ?? null
    };
  }
  legacyCitation(memory) {
    if (!memory.sourceProjectId || !memory.sourcePath || !memory.sourceFileHash) return [];
    return [
      {
        sourceProjectId: memory.sourceProjectId,
        sourceProjectName: "",
        sourcePath: memory.sourcePath,
        role: "reference",
        locator: null,
        note: "\u7531\u65E7\u7248 sourcePath \u517C\u5BB9\u751F\u6210",
        sourceCommit: memory.sourceCommit,
        sourceFileHash: memory.sourceFileHash,
        stale: false,
        staleReason: null,
        accessible: true,
        fileUrl: null
      }
    ];
  }
  enrichCitation(projectId, citation) {
    const sourceProject = this.store.getProject(citation.sourceProjectId);
    if (!sourceProject) {
      return {
        ...citation,
        sourceProjectName: "\u672A\u77E5\u9879\u76EE",
        stale: true,
        staleReason: "source_project_missing",
        accessible: false,
        fileUrl: null
      };
    }
    if (!this.store.hasReadAccess(projectId, citation.sourceProjectId)) {
      return {
        ...citation,
        sourceProjectName: sourceProject.name,
        stale: true,
        staleReason: "source_project_link_missing",
        accessible: false,
        fileUrl: null
      };
    }
    try {
      const metadata = detectGitMetadata(sourceProject.primaryPath);
      const current = readProjectFile(
        metadata.rootPath,
        citation.sourcePath,
        metadata.headCommit,
        this.denyPatterns
      );
      const stale = current.fileHash !== citation.sourceFileHash;
      return {
        ...citation,
        sourceProjectName: sourceProject.name,
        stale,
        staleReason: stale ? "source_file_changed" : null,
        accessible: true,
        fileUrl: pathToFileURL(path5.resolve(metadata.rootPath, current.path)).href
      };
    } catch {
      return {
        ...citation,
        sourceProjectName: sourceProject.name,
        stale: true,
        staleReason: "source_file_unavailable",
        accessible: true,
        fileUrl: null
      };
    }
  }
  getContext(projectId, limit = 30) {
    return this.store.getContext(projectId, limit).map((memory) => this.enrichStaleness(memory));
  }
  searchMemory(projectId, query, includeLinked = false, limit = 30) {
    this.store.requireProject(projectId);
    const projectIds = [projectId];
    if (includeLinked) {
      projectIds.push(...this.store.listLinks(projectId).map((project) => project.id));
    }
    return this.store.searchMemories(projectIds, query, limit).map((memory) => this.enrichStaleness(memory));
  }
  prepareCitations(projectId, citations) {
    if (citations.length > MAX_CITATIONS) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `A memory can contain at most ${MAX_CITATIONS} citations.`
      );
    }
    const prepared = citations.map((citation) => {
      if (!CITATION_ROLES.includes(citation.role)) {
        throw new ProjectMemoryError("INVALID_INPUT", "Unsupported citation role.", {
          role: citation.role
        });
      }
      const locator = citation.locator?.trim() || null;
      const note = citation.note?.trim() || null;
      if (locator && locator.length > MAX_CITATION_LOCATOR_LENGTH) {
        throw new ProjectMemoryError("INVALID_INPUT", "Citation locator is too long.");
      }
      if (note && note.length > MAX_CITATION_NOTE_LENGTH) {
        throw new ProjectMemoryError("INVALID_INPUT", "Citation note is too long.");
      }
      assertNoSecret(locator ?? "", "citation locator");
      assertNoSecret(note ?? "", "citation note");
      const sourceProjectId = citation.sourceProjectId ?? projectId;
      const sourceProject = this.store.requireProject(sourceProjectId);
      this.requireReadAccess(projectId, sourceProjectId);
      const metadata = detectGitMetadata(sourceProject.primaryPath);
      const source = readProjectFile(
        metadata.rootPath,
        citation.sourcePath,
        metadata.headCommit,
        this.denyPatterns
      );
      return {
        sourceProjectId,
        sourcePath: source.path,
        role: citation.role,
        locator,
        note,
        sourceCommit: source.commit,
        sourceFileHash: source.fileHash
      };
    });
    const keys = prepared.map(
      (citation) => `${citation.sourceProjectId}:${citation.sourcePath}:${citation.role}:${citation.locator ?? ""}`
    );
    if (new Set(keys).size !== keys.length) {
      throw new ProjectMemoryError("INVALID_INPUT", "Duplicate memory citation.");
    }
    return prepared;
  }
  prepareCandidate(projectId, candidate) {
    if (!MEMORY_KINDS.includes(candidate.kind)) {
      throw new ProjectMemoryError("INVALID_INPUT", "Unsupported memory kind.", {
        kind: candidate.kind
      });
    }
    const title = candidate.title.trim();
    const content = candidate.content.trim();
    const summary = candidate.summary?.trim() || null;
    const topic = candidate.topic?.trim() || null;
    const tags = [...new Set((candidate.tags ?? []).map((tag) => tag.trim()).filter(Boolean))];
    if (!title || title.length > MAX_TITLE_LENGTH) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Title must be 1-${MAX_TITLE_LENGTH} characters.`
      );
    }
    if (!content || content.length > MAX_CONTENT_LENGTH) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Content must be 1-${MAX_CONTENT_LENGTH} characters.`
      );
    }
    if (summary && summary.length > MAX_SUMMARY_LENGTH) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory summary is too long.");
    }
    if (topic && topic.length > MAX_TOPIC_LENGTH) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory topic is too long.");
    }
    if (tags.length > MAX_TAGS || tags.some((tag) => tag.length > MAX_TAG_LENGTH)) {
      throw new ProjectMemoryError("INVALID_INPUT", "Too many tags or tag is too long.");
    }
    assertNoSecret(title, "memory title");
    assertNoSecret(content, "memory content");
    assertNoSecret(summary ?? "", "memory summary");
    assertNoSecret(topic ?? "", "memory topic");
    assertNoSecret(tags.join(" "), "memory tags");
    const ref = candidate.ref?.trim();
    if (ref && !/^[A-Za-z0-9._:-]{1,80}$/.test(ref)) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "Memory candidate ref must use 1-80 letters, numbers, dots, underscores, colons, or hyphens."
      );
    }
    const sourceProjectId = candidate.sourceProjectId ?? projectId;
    const sourceProject = this.store.requireProject(sourceProjectId);
    this.requireReadAccess(projectId, sourceProjectId);
    let sourceCommit = sourceProject.headCommit;
    let sourceFileHash = null;
    let sourcePath = null;
    if (candidate.sourcePath) {
      const metadata = detectGitMetadata(sourceProject.primaryPath);
      const source = readProjectFile(
        metadata.rootPath,
        candidate.sourcePath,
        metadata.headCommit,
        this.denyPatterns
      );
      sourceCommit = source.commit;
      sourceFileHash = source.fileHash;
      sourcePath = source.path;
    }
    return {
      ...candidate,
      ...ref ? { ref } : {},
      title,
      summary,
      topic,
      content,
      tags,
      sourceProjectId,
      sourcePath,
      sourceCommit,
      sourceFileHash,
      citations: this.prepareCitations(projectId, candidate.citations ?? []),
      confidence: candidate.confidence ?? "observed"
    };
  }
  prepareUpdateCandidate(projectId, candidate) {
    const memory = this.store.getMemory(candidate.memoryId);
    if (!memory || memory.projectId !== projectId) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "Memory updates can target only an existing memory in the current project.",
        { memoryId: candidate.memoryId }
      );
    }
    if (candidate.summary === void 0 && candidate.topic === void 0 && candidate.citations === void 0) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory update has no enrichment fields.");
    }
    const summary = candidate.summary?.trim();
    const topic = candidate.topic?.trim();
    if (summary !== void 0 && (!summary || summary.length > MAX_SUMMARY_LENGTH)) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "Memory summary must be non-empty and concise."
      );
    }
    if (topic !== void 0 && (!topic || topic.length > MAX_TOPIC_LENGTH)) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory topic must be non-empty and concise.");
    }
    assertNoSecret(summary ?? "", "memory summary");
    assertNoSecret(topic ?? "", "memory topic");
    return {
      memoryId: memory.id,
      ...summary !== void 0 ? { summary } : {},
      ...topic !== void 0 ? { topic } : {},
      ...candidate.citations !== void 0 ? { citations: this.prepareCitations(projectId, candidate.citations) } : {}
    };
  }
  prepareRelationCandidate(projectId, candidateRefs, candidate) {
    if (!RELATION_TYPES.includes(candidate.type)) {
      throw new ProjectMemoryError("INVALID_INPUT", "Unsupported memory relation type.", {
        type: candidate.type
      });
    }
    const rationale = candidate.rationale.trim();
    if (!rationale || rationale.length > MAX_RELATION_RATIONALE_LENGTH) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Relation rationale must be 1-${MAX_RELATION_RATIONALE_LENGTH} characters.`
      );
    }
    assertNoSecret(rationale, "relation rationale");
    const endpointKey = (endpoint) => {
      const memoryId = "memoryId" in endpoint ? endpoint.memoryId : void 0;
      const candidateRef = "candidateRef" in endpoint ? endpoint.candidateRef : void 0;
      if (Boolean(memoryId) === Boolean(candidateRef)) {
        throw new ProjectMemoryError(
          "INVALID_INPUT",
          "Relation endpoint must contain exactly one of memoryId or candidateRef."
        );
      }
      if (memoryId) {
        const memory = this.store.getMemory(memoryId);
        if (!memory) {
          throw new ProjectMemoryError(
            "INVALID_INPUT",
            "Relation memory endpoint does not exist.",
            {
              memoryId
            }
          );
        }
        this.requireReadAccess(projectId, memory.projectId);
        return `memory:${memory.id}`;
      }
      if (!candidateRefs.has(candidateRef)) {
        throw new ProjectMemoryError(
          "INVALID_INPUT",
          "Relation candidateRef must match a unique memory candidate ref in the same proposal.",
          { candidateRef }
        );
      }
      return `candidate:${candidateRef}`;
    };
    const fromKey = endpointKey(candidate.from);
    const toKey = endpointKey(candidate.to);
    if (fromKey === toKey) {
      throw new ProjectMemoryError("INVALID_INPUT", "A memory cannot relate to itself.");
    }
    const endpointProjectId = (endpoint) => {
      if ("candidateRef" in endpoint && endpoint.candidateRef) return projectId;
      if (!("memoryId" in endpoint) || !endpoint.memoryId) {
        throw new ProjectMemoryError(
          "INVALID_INPUT",
          "Relation endpoint must contain memoryId or candidateRef."
        );
      }
      return this.store.getMemory(endpoint.memoryId).projectId;
    };
    const fromProjectId = endpointProjectId(candidate.from);
    const toProjectId = endpointProjectId(candidate.to);
    if (fromProjectId !== projectId && toProjectId !== projectId) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "At least one relation endpoint must belong to the current project."
      );
    }
    return {
      ...candidate,
      rationale,
      confidence: candidate.confidence ?? "inferred"
    };
  }
  proposeMemory(projectId, candidates, relations = [], updates = []) {
    this.store.requireProject(projectId);
    if (candidates.length + updates.length + relations.length === 0 || candidates.length > MAX_CANDIDATES || updates.length > MAX_UPDATE_CANDIDATES || relations.length > MAX_RELATION_CANDIDATES) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `A proposal must contain memory, update, or relation candidates, with at most ${MAX_CANDIDATES} memories, ${MAX_UPDATE_CANDIDATES} updates, and ${MAX_RELATION_CANDIDATES} relations.`
      );
    }
    const prepared = candidates.map((candidate) => this.prepareCandidate(projectId, candidate));
    const refs = prepared.map((candidate) => candidate.ref).filter((ref) => Boolean(ref));
    if (new Set(refs).size !== refs.length) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory candidate refs must be unique.");
    }
    const preparedRelations = relations.map(
      (candidate) => this.prepareRelationCandidate(projectId, new Set(refs), candidate)
    );
    const preparedUpdates = updates.map(
      (candidate) => this.prepareUpdateCandidate(projectId, candidate)
    );
    return this.store.createProposal(projectId, prepared, preparedUpdates, preparedRelations);
  }
  commitMemory(proposalId, acceptedItemIds, acceptedRelationIds = [], acceptedUpdateIds = []) {
    const result = this.store.commitProposal(
      proposalId,
      acceptedItemIds,
      acceptedUpdateIds,
      acceptedRelationIds
    );
    return {
      ...result,
      memories: result.memories.map((memory) => this.enrichStaleness(memory)),
      updatedMemories: result.updatedMemories.map((memory) => this.enrichStaleness(memory))
    };
  }
  rejectMemory(proposalId) {
    return this.store.rejectProposal(proposalId);
  }
  requireGraphMemoryAccess(projectId, memoryId, includeLinked) {
    const memory = this.store.getMemory(memoryId);
    if (!memory) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory does not exist.", { memoryId });
    }
    if (memory.projectId !== projectId) {
      if (!includeLinked) {
        throw new ProjectMemoryError(
          "LINK_REQUIRED",
          "Use --include-linked true to access a linked-project memory.",
          { memoryId, projectId: memory.projectId }
        );
      }
      this.requireReadAccess(projectId, memory.projectId);
    }
    return this.enrichStaleness(memory);
  }
  visibleRelations(projectId, includeLinked) {
    const ownerProjectIds = includeLinked ? [projectId, ...this.store.listLinks(projectId).map((project) => project.id)] : [projectId];
    return ownerProjectIds.flatMap((ownerProjectId) => this.store.getRelations(ownerProjectId)).filter((relation) => {
      const foreignProjectIds = new Set(
        [relation.fromProjectId, relation.toProjectId].filter((id) => id !== projectId)
      );
      if (foreignProjectIds.size === 0) return true;
      if (!includeLinked) return false;
      return [...foreignProjectIds].every((id) => this.store.hasReadAccess(projectId, id));
    });
  }
  relationView(relation) {
    const fromMemory = this.store.getMemory(relation.fromMemoryId);
    const toMemory = this.store.getMemory(relation.toMemoryId);
    if (!fromMemory || !toMemory) return null;
    const enrichedFrom = this.enrichStaleness(fromMemory);
    const enrichedTo = this.enrichStaleness(toMemory);
    return {
      ...relation,
      fromMemory: enrichedFrom,
      toMemory: enrichedTo,
      suspended: false,
      stale: enrichedFrom.stale || enrichedTo.stale
    };
  }
  listMemoryRelations(projectId, memoryId, direction = "both", types = [], includeLinked = false) {
    const memory = this.requireGraphMemoryAccess(projectId, memoryId, includeLinked);
    if (types.some((type) => !RELATION_TYPES.includes(type))) {
      throw new ProjectMemoryError("INVALID_INPUT", "Unsupported relation type filter.", { types });
    }
    const selectedTypes = new Set(types);
    const relations = this.visibleRelations(projectId, includeLinked).filter((relation) => selectedTypes.size === 0 || selectedTypes.has(relation.type)).filter((relation) => {
      if (SYMMETRIC_RELATION_TYPES.has(relation.type)) {
        return relation.fromMemoryId === memoryId || relation.toMemoryId === memoryId;
      }
      if (direction === "out") return relation.fromMemoryId === memoryId;
      if (direction === "in") return relation.toMemoryId === memoryId;
      return relation.fromMemoryId === memoryId || relation.toMemoryId === memoryId;
    }).map((relation) => this.relationView(relation)).filter((relation) => Boolean(relation));
    return { memory, direction, relations };
  }
  findRelationPath(projectId, fromMemoryId, toMemoryId, maxDepth = 4, includeLinked = false) {
    if (!Number.isInteger(maxDepth) || maxDepth < 1 || maxDepth > MAX_PATH_DEPTH) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Path max depth must be between 1 and ${MAX_PATH_DEPTH}.`
      );
    }
    const fromMemory = this.requireGraphMemoryAccess(projectId, fromMemoryId, includeLinked);
    const toMemory = this.requireGraphMemoryAccess(projectId, toMemoryId, includeLinked);
    const relations = this.visibleRelations(projectId, includeLinked);
    const adjacency = /* @__PURE__ */ new Map();
    const add = (from, nextId, relation) => {
      const entries = adjacency.get(from) ?? [];
      entries.push({ nextId, relation });
      adjacency.set(from, entries);
    };
    for (const relation of relations) {
      add(relation.fromMemoryId, relation.toMemoryId, relation);
      if (SYMMETRIC_RELATION_TYPES.has(relation.type)) {
        add(relation.toMemoryId, relation.fromMemoryId, relation);
      }
    }
    const queue = [
      { memoryId: fromMemoryId, depth: 0 }
    ];
    const visited = /* @__PURE__ */ new Set([fromMemoryId]);
    const previous = /* @__PURE__ */ new Map();
    while (queue.length > 0) {
      const current = queue.shift();
      if (current.memoryId === toMemoryId) break;
      if (current.depth >= maxDepth) continue;
      for (const edge of adjacency.get(current.memoryId) ?? []) {
        if (visited.has(edge.nextId)) continue;
        visited.add(edge.nextId);
        previous.set(edge.nextId, { memoryId: current.memoryId, relation: edge.relation });
        queue.push({ memoryId: edge.nextId, depth: current.depth + 1 });
      }
    }
    if (!visited.has(toMemoryId)) {
      return { found: false, fromMemory, toMemory, nodes: [], relations: [] };
    }
    const memoryIds = [toMemoryId];
    const pathRelations = [];
    let cursor = toMemoryId;
    while (cursor !== fromMemoryId) {
      const step = previous.get(cursor);
      if (!step) break;
      pathRelations.push(step.relation);
      cursor = step.memoryId;
      memoryIds.push(cursor);
    }
    memoryIds.reverse();
    pathRelations.reverse();
    return {
      found: true,
      fromMemory,
      toMemory,
      nodes: memoryIds.map((id) => this.store.getMemory(id)).filter((memory) => Boolean(memory)).map((memory) => this.enrichStaleness(memory)),
      relations: pathRelations
    };
  }
  buildGraph(projectId, memoryId, depth = 1, includeLinked = false) {
    if (!Number.isInteger(depth) || depth < 1 || depth > MAX_GRAPH_DEPTH) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        `Graph depth must be between 1 and ${MAX_GRAPH_DEPTH}.`
      );
    }
    this.store.requireProject(projectId);
    const visibleRelations = this.visibleRelations(projectId, includeLinked);
    const selectedMemoryIds = /* @__PURE__ */ new Set();
    const selectedRelationIds = /* @__PURE__ */ new Set();
    const queue = [];
    if (memoryId) {
      this.requireGraphMemoryAccess(projectId, memoryId, includeLinked);
      selectedMemoryIds.add(memoryId);
      queue.push({ memoryId, depth: 0 });
    } else {
      for (const memory of this.store.getContext(projectId, MAX_GRAPH_NODES)) {
        selectedMemoryIds.add(memory.id);
        queue.push({ memoryId: memory.id, depth: 0 });
      }
    }
    while (queue.length > 0 && selectedMemoryIds.size < MAX_GRAPH_NODES) {
      const current = queue.shift();
      if (current.depth >= depth) continue;
      for (const relation of visibleRelations) {
        let nextId = null;
        if (relation.fromMemoryId === current.memoryId) nextId = relation.toMemoryId;
        else if (relation.toMemoryId === current.memoryId) nextId = relation.fromMemoryId;
        if (!nextId) continue;
        selectedRelationIds.add(relation.id);
        if (!selectedMemoryIds.has(nextId) && selectedMemoryIds.size < MAX_GRAPH_NODES) {
          selectedMemoryIds.add(nextId);
          queue.push({ memoryId: nextId, depth: current.depth + 1 });
        }
      }
    }
    if (!memoryId) {
      for (const relation of visibleRelations) {
        if (selectedMemoryIds.has(relation.fromMemoryId) && selectedMemoryIds.has(relation.toMemoryId)) {
          selectedRelationIds.add(relation.id);
        }
      }
    }
    const nodes = [...selectedMemoryIds].map((id) => this.store.getMemory(id)).filter((memory) => Boolean(memory)).map((memory) => this.enrichStaleness(memory));
    const nodeIds = new Set(nodes.map((memory) => memory.id));
    const relations = visibleRelations.filter(
      (relation) => selectedRelationIds.has(relation.id) && nodeIds.has(relation.fromMemoryId) && nodeIds.has(relation.toMemoryId)
    );
    return { nodes, relations };
  }
  renderGraphMermaid(graph) {
    const nodeId = (id) => `m_${id.replaceAll("-", "_")}`;
    const escapeLabel = (value) => value.replaceAll("\\", "\\\\").replaceAll('"', "'").replaceAll(/\r?\n/g, " ");
    const lines = ["graph TD"];
    for (const memory of graph.nodes) {
      const stale = memory.stale ? " [\u5DF2\u8FC7\u671F]" : "";
      lines.push(
        `  ${nodeId(memory.id)}["${escapeLabel(`${memory.projectName}: ${memory.title}${stale}`)}"]`
      );
    }
    for (const relation of graph.relations) {
      const connector = SYMMETRIC_RELATION_TYPES.has(relation.type) ? "---" : "-->";
      lines.push(
        `  ${nodeId(relation.fromMemoryId)} ${connector}|${RELATION_LABELS3[relation.type]}| ${nodeId(relation.toMemoryId)}`
      );
    }
    return `${lines.join("\n")}
`;
  }
  renderGraphMarkdown(projectId, graph) {
    const project = this.store.requireProject(projectId);
    const generatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const guide = this.buildGraphGuide(projectId, graph, 12, generatedAt);
    return renderGraphMarkdown(project.name, graph, generatedAt, guide);
  }
  buildGraphGuide(projectId, graph, limit = 12, generatedAt = (/* @__PURE__ */ new Date()).toISOString()) {
    const project = this.store.requireProject(projectId);
    return analyzeKnowledgeGraph(projectId, project.name, graph, generatedAt, limit);
  }
  writeGraphHtml(projectId, graph, outputPath) {
    const project = this.store.requireProject(projectId);
    const generatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const guide = this.buildGraphGuide(projectId, graph, 12, generatedAt);
    const html = renderGraphHtml(project.name, graph, generatedAt, guide);
    const target = this.store.writeKnowledgeGraph(projectId, html, outputPath);
    return {
      format: "html",
      outputPath: target,
      generatedAt,
      nodeCount: graph.nodes.length,
      relationCount: graph.relations.length,
      relationSuggestionCount: guide.relationSuggestions.length
    };
  }
  searchFiles(sourceProjectId, targetProjectId, query) {
    this.requireReadAccess(sourceProjectId, targetProjectId);
    const target = this.store.requireProject(targetProjectId);
    const metadata = detectGitMetadata(target.primaryPath);
    return {
      targetProject: target,
      query,
      results: searchProjectFiles(metadata.rootPath, query, metadata.headCommit, this.denyPatterns)
    };
  }
  readFile(sourceProjectId, targetProjectId, relativePath) {
    this.requireReadAccess(sourceProjectId, targetProjectId);
    const target = this.store.requireProject(targetProjectId);
    const metadata = detectGitMetadata(target.primaryPath);
    return {
      targetProject: target,
      file: readProjectFile(
        metadata.rootPath,
        relativePath,
        metadata.headCommit,
        this.denyPatterns
      )
    };
  }
  bindingSnippet() {
    return {
      beginMarker: "<!-- codex-project-memory:start -->",
      endMarker: "<!-- codex-project-memory:end -->",
      markdown: `<!-- codex-project-memory:start -->
Use the installed $project-memory Skill before substantial work: run its bundled script to detect the current project and load saved context. Before finishing a tool-using task, resolve the memory proposal and include the required Project memory receipt. Use structured request_user_input choices when available. When request_user_input is unavailable, automatically commit all proposed memory and relation items and disclose the automatic fallback. Treat linked projects as read-only references.
<!-- codex-project-memory:end -->`
    };
  }
  exportProject(projectId) {
    const exported = this.store.exportProject(projectId);
    return { ...exported, memories: this.getContext(projectId, 1e3) };
  }
};

// src/store.ts
import { randomUUID } from "crypto";
import {
  appendFileSync,
  chmodSync,
  existsSync as existsSync4,
  mkdirSync as mkdirSync2,
  readdirSync as readdirSync2,
  readFileSync as readFileSync4,
  renameSync,
  rmSync,
  writeFileSync
} from "fs";
import path6 from "path";
var SCHEMA_VERSION = 1;
var MEMORY_SCHEMA_VERSION = 2;
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function ensurePrivateDirectory(directory) {
  mkdirSync2(directory, { recursive: true, mode: 448 });
  chmodSync(directory, 448);
}
function writePrivateFile(filePath, content, hardenDirectory = true) {
  if (hardenDirectory) {
    ensurePrivateDirectory(path6.dirname(filePath));
  } else {
    mkdirSync2(path6.dirname(filePath), { recursive: true, mode: 448 });
  }
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporaryPath, content, { encoding: "utf8", mode: 384 });
    chmodSync(temporaryPath, 384);
    renameSync(temporaryPath, filePath);
    chmodSync(filePath, 384);
  } finally {
    rmSync(temporaryPath, { force: true });
  }
}
function writeJson(filePath, value) {
  writePrivateFile(filePath, `${JSON.stringify(value, null, 2)}
`);
}
function readJson(filePath) {
  try {
    return JSON.parse(readFileSync4(filePath, "utf8"));
  } catch (error) {
    throw new ProjectMemoryError("STORAGE_ERROR", "Unable to read project memory state.", {
      path: filePath,
      cause: error instanceof Error ? error.message : String(error)
    });
  }
}
function headingTitle(title) {
  return title.replaceAll(/\s+/g, " ").trim();
}
function renderMemoryDocument(projectId, memories) {
  const metadata = {
    schemaVersion: MEMORY_SCHEMA_VERSION,
    projectId,
    memories: memories.map((memory) => ({
      id: memory.id,
      projectId: memory.projectId,
      kind: memory.kind,
      title: memory.title,
      summary: memory.summary,
      topic: memory.topic,
      tags: memory.tags,
      sourceProjectId: memory.sourceProjectId,
      sourcePath: memory.sourcePath,
      sourceCommit: memory.sourceCommit,
      sourceFileHash: memory.sourceFileHash,
      citations: memory.citations.map((citation) => ({
        sourceProjectId: citation.sourceProjectId,
        sourcePath: citation.sourcePath,
        role: citation.role,
        locator: citation.locator,
        note: citation.note,
        sourceCommit: citation.sourceCommit,
        sourceFileHash: citation.sourceFileHash
      })),
      confidence: memory.confidence,
      status: "active",
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt
    }))
  };
  const sections = memories.map(
    (memory) => `## [${memory.id}] ${headingTitle(memory.title)}

${memory.content.trim()}
`
  );
  return `---
${JSON.stringify(metadata, null, 2)}
---

# Project Memory

${sections.join("\n")}`;
}
function parseMemoryDocument(filePath, project) {
  if (!existsSync4(filePath)) {
    return [];
  }
  const text = readFileSync4(filePath, "utf8");
  const frontMatter = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontMatter) {
    throw new ProjectMemoryError("STORAGE_ERROR", "Project MEMORY.md has invalid front matter.", {
      path: filePath
    });
  }
  let metadata;
  try {
    metadata = JSON.parse(frontMatter[1] ?? "");
  } catch (error) {
    throw new ProjectMemoryError("STORAGE_ERROR", "Project MEMORY.md metadata is invalid.", {
      path: filePath,
      cause: error instanceof Error ? error.message : String(error)
    });
  }
  if (![1, MEMORY_SCHEMA_VERSION].includes(metadata.schemaVersion) || metadata.projectId !== project.id) {
    throw new ProjectMemoryError("STORAGE_ERROR", "Project MEMORY.md identity is invalid.", {
      path: filePath,
      projectId: project.id
    });
  }
  const bodyOffset = frontMatter[0].length;
  const body = text.slice(bodyOffset);
  const headings = /* @__PURE__ */ new Map();
  const memoryIds = new Set(metadata.memories.map((memory) => memory.id));
  const matches = [...body.matchAll(/^## \[([0-9a-f-]+)\](?: .*)?$/gim)].filter(
    (match) => memoryIds.has(match[1] ?? "")
  );
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const id = match?.[1];
    if (!match || !id || match.index === void 0) {
      continue;
    }
    const lineEnd = body.indexOf("\n", match.index);
    const contentStart = lineEnd === -1 ? body.length : lineEnd + 1;
    const sectionEnd = matches[index + 1]?.index ?? body.length;
    headings.set(id, { contentStart, sectionEnd });
  }
  return metadata.memories.map((memory) => {
    const section = headings.get(memory.id);
    if (!section) {
      throw new ProjectMemoryError(
        "STORAGE_ERROR",
        "Project MEMORY.md is missing a memory section.",
        {
          path: filePath,
          memoryId: memory.id
        }
      );
    }
    return {
      ...memory,
      summary: memory.summary ?? null,
      topic: memory.topic ?? null,
      projectName: project.name,
      content: body.slice(section.contentStart, section.sectionEnd).trim(),
      citations: (memory.citations ?? []).map((citation) => ({
        ...citation,
        sourceProjectName: "",
        stale: false,
        staleReason: null,
        accessible: true,
        fileUrl: null
      })),
      stale: false,
      staleReason: null
    };
  });
}
function scoreMemory(memory, tokens) {
  const title = memory.title.toLocaleLowerCase();
  const tags = memory.tags.join(" ").toLocaleLowerCase();
  const content = memory.content.toLocaleLowerCase();
  return tokens.reduce((score, token) => {
    if (title.includes(token)) return score + 5;
    if (tags.includes(token)) return score + 3;
    if (content.includes(token)) return score + 1;
    return score;
  }, 0);
}
var SYMMETRIC_RELATION_TYPES2 = /* @__PURE__ */ new Set(["related_to", "contradicts"]);
function relationKey(type, fromMemoryId, toMemoryId) {
  if (SYMMETRIC_RELATION_TYPES2.has(type)) {
    const [left, right] = [fromMemoryId, toMemoryId].sort();
    return `${type}:${left}:${right}`;
  }
  return `${type}:${fromMemoryId}:${toMemoryId}`;
}
function publicCitation(citation) {
  return {
    sourceProjectId: citation.sourceProjectId,
    sourcePath: citation.sourcePath,
    role: citation.role,
    ...citation.locator ? { locator: citation.locator } : {},
    ...citation.note ? { note: citation.note } : {}
  };
}
function publicUpdateCandidate(candidate) {
  return {
    memoryId: candidate.memoryId,
    ...candidate.summary !== void 0 ? { summary: candidate.summary } : {},
    ...candidate.topic !== void 0 ? { topic: candidate.topic } : {},
    ...candidate.citations !== void 0 ? { citations: candidate.citations.map(publicCitation) } : {}
  };
}
function publicProposal(proposal) {
  return {
    id: proposal.id,
    projectId: proposal.projectId,
    status: proposal.status,
    createdAt: proposal.createdAt,
    reviewedAt: proposal.reviewedAt,
    items: proposal.items.map((item) => ({
      id: item.id,
      proposalId: item.proposalId,
      status: item.status,
      candidate: {
        ...item.candidate.ref ? { ref: item.candidate.ref } : {},
        kind: item.candidate.kind,
        title: item.candidate.title,
        ...item.candidate.summary ? { summary: item.candidate.summary } : {},
        ...item.candidate.topic ? { topic: item.candidate.topic } : {},
        content: item.candidate.content,
        tags: item.candidate.tags,
        ...item.candidate.sourceProjectId ? { sourceProjectId: item.candidate.sourceProjectId } : {},
        ...item.candidate.sourcePath ? { sourcePath: item.candidate.sourcePath } : {},
        ...(item.candidate.citations ?? []).length > 0 ? { citations: (item.candidate.citations ?? []).map(publicCitation) } : {},
        confidence: item.candidate.confidence
      }
    })),
    updateItems: (proposal.updateItems ?? []).map((item) => ({
      id: item.id,
      proposalId: item.proposalId,
      status: item.status,
      rejectionReason: item.rejectionReason,
      candidate: publicUpdateCandidate(item.candidate)
    })),
    relationItems: (proposal.relationItems ?? []).map((item) => ({
      id: item.id,
      proposalId: item.proposalId,
      status: item.status,
      rejectionReason: item.rejectionReason,
      candidate: {
        from: item.candidate.from,
        to: item.candidate.to,
        type: item.candidate.type,
        rationale: item.candidate.rationale,
        confidence: item.candidate.confidence
      }
    }))
  };
}
var MemoryStore = class {
  storageRoot;
  registryPath;
  linksPath;
  projectsRoot;
  constructor(dataDir) {
    this.storageRoot = dataDir;
    this.registryPath = path6.join(dataDir, "registry.json");
    this.linksPath = path6.join(dataDir, "links.json");
    this.projectsRoot = path6.join(dataDir, "projects");
    ensurePrivateDirectory(this.projectsRoot);
    if (!existsSync4(this.registryPath)) {
      writeJson(this.registryPath, { schemaVersion: SCHEMA_VERSION, projects: [] });
    }
    if (!existsSync4(this.linksPath)) {
      writeJson(this.linksPath, { schemaVersion: SCHEMA_VERSION, links: [] });
    }
    this.readRegistry();
    this.readLinks();
  }
  close() {
  }
  projectDir(projectId) {
    return path6.join(this.projectsRoot, projectId);
  }
  projectPath(projectId) {
    return path6.join(this.projectDir(projectId), "project.json");
  }
  memoryPath(projectId) {
    return path6.join(this.projectDir(projectId), "MEMORY.md");
  }
  writeKnowledgeGraph(projectId, content, outputPath) {
    this.requireProject(projectId);
    const target = outputPath ? path6.resolve(outputPath) : path6.join(this.projectDir(projectId), "KNOWLEDGE_GRAPH.html");
    writePrivateFile(target, content, outputPath === void 0);
    return target;
  }
  relationsPath(projectId) {
    return path6.join(this.projectDir(projectId), "RELATIONS.json");
  }
  proposalsDir(projectId) {
    return path6.join(this.projectDir(projectId), "proposals");
  }
  proposalPath(projectId, proposalId) {
    return path6.join(this.proposalsDir(projectId), `${proposalId}.json`);
  }
  auditPath(projectId) {
    return path6.join(this.projectDir(projectId), "audit.jsonl");
  }
  readRelationsDocument(projectId) {
    this.requireProject(projectId);
    const relationsPath = this.relationsPath(projectId);
    if (!existsSync4(relationsPath)) {
      return { schemaVersion: SCHEMA_VERSION, projectId, relations: [] };
    }
    const document = readJson(relationsPath);
    if (document.schemaVersion !== SCHEMA_VERSION || document.projectId !== projectId || !Array.isArray(document.relations)) {
      throw new ProjectMemoryError("STORAGE_ERROR", "Project relations schema is invalid.", {
        path: relationsPath,
        projectId
      });
    }
    return document;
  }
  writeRelationsDocument(document) {
    writeJson(this.relationsPath(document.projectId), document);
  }
  getRelations(projectId) {
    return this.readRelationsDocument(projectId).relations;
  }
  getAllRelations() {
    return this.readRegistry().projects.flatMap((entry) => this.getRelations(entry.id));
  }
  readRegistry() {
    const registry = readJson(this.registryPath);
    if (registry.schemaVersion !== SCHEMA_VERSION || !Array.isArray(registry.projects)) {
      throw new ProjectMemoryError("STORAGE_ERROR", "Project registry schema is invalid.", {
        path: this.registryPath
      });
    }
    return registry;
  }
  writeRegistry(registry) {
    writeJson(this.registryPath, registry);
  }
  readLinks() {
    const links = readJson(this.linksPath);
    if (links.schemaVersion !== SCHEMA_VERSION || !Array.isArray(links.links)) {
      throw new ProjectMemoryError("STORAGE_ERROR", "Project links schema is invalid.", {
        path: this.linksPath
      });
    }
    return links;
  }
  writeLinks(links) {
    writeJson(this.linksPath, links);
  }
  audit(eventType, projectId, subjectId, details) {
    if (!projectId) {
      return;
    }
    const event = { eventType, projectId, subjectId, details, createdAt: now() };
    const auditPath = this.auditPath(projectId);
    ensurePrivateDirectory(path6.dirname(auditPath));
    appendFileSync(auditPath, `${JSON.stringify(event)}
`, { encoding: "utf8", mode: 384 });
    chmodSync(auditPath, 384);
  }
  getProject(projectId) {
    const projectPath = this.projectPath(projectId);
    return existsSync4(projectPath) ? readJson(projectPath) : null;
  }
  getProjectByPath(canonicalPath) {
    const entry = this.readRegistry().projects.find(
      (project) => project.locations.some((location) => location.canonicalPath === canonicalPath)
    );
    return entry ? this.getProject(entry.id) : null;
  }
  findRelocationCandidates(gitCommonDir, remoteUrl) {
    if (!gitCommonDir && !remoteUrl) {
      return [];
    }
    return this.readRegistry().projects.map((entry) => this.getProject(entry.id)).filter((project) => Boolean(project)).filter(
      (project) => gitCommonDir !== null && project.gitCommonDir === gitCommonDir || remoteUrl !== null && project.remoteUrl === remoteUrl
    ).sort((left, right) => right.lastSeenAt.localeCompare(left.lastSeenAt));
  }
  registerProject(input) {
    const existing = this.getProjectByPath(input.primaryPath);
    if (existing) {
      throw new ProjectMemoryError(
        "PROJECT_ALREADY_REGISTERED",
        "Project path is already registered.",
        { projectId: existing.id }
      );
    }
    const registry = this.readRegistry();
    const timestamp = now();
    if (input.relinkProjectId) {
      const project2 = this.getProject(input.relinkProjectId);
      const entry = registry.projects.find((candidate) => candidate.id === input.relinkProjectId);
      if (!project2 || !entry) {
        throw new ProjectMemoryError("PROJECT_NOT_REGISTERED", "Relink target does not exist.", {
          projectId: input.relinkProjectId
        });
      }
      const updated = {
        ...project2,
        name: input.name,
        primaryPath: input.primaryPath,
        isGit: input.isGit,
        gitCommonDir: input.gitCommonDir,
        remoteUrl: input.remoteUrl,
        headCommit: input.headCommit,
        updatedAt: timestamp,
        lastSeenAt: timestamp
      };
      entry.locations.push({
        canonicalPath: input.primaryPath,
        firstSeenAt: timestamp,
        lastSeenAt: timestamp
      });
      writeJson(this.projectPath(project2.id), updated);
      this.writeRegistry(registry);
      this.audit("project_relinked", project2.id, project2.id, { path: input.primaryPath });
      return updated;
    }
    const id = randomUUID();
    const project = {
      id,
      name: input.name,
      primaryPath: input.primaryPath,
      isGit: input.isGit,
      gitCommonDir: input.gitCommonDir,
      remoteUrl: input.remoteUrl,
      headCommit: input.headCommit,
      createdAt: timestamp,
      updatedAt: timestamp,
      lastSeenAt: timestamp
    };
    ensurePrivateDirectory(this.proposalsDir(id));
    writeJson(this.projectPath(id), project);
    writePrivateFile(this.memoryPath(id), renderMemoryDocument(id, []));
    this.writeRelationsDocument({ schemaVersion: SCHEMA_VERSION, projectId: id, relations: [] });
    registry.projects.push({
      id,
      locations: [
        { canonicalPath: input.primaryPath, firstSeenAt: timestamp, lastSeenAt: timestamp }
      ]
    });
    this.writeRegistry(registry);
    this.audit("project_registered", id, id, { path: input.primaryPath });
    return project;
  }
  touchProject(projectId, pathValue, headCommit) {
    const project = this.requireProject(projectId);
    const registry = this.readRegistry();
    const entry = registry.projects.find((candidate) => candidate.id === projectId);
    if (!entry) {
      throw new ProjectMemoryError("STORAGE_ERROR", "Project is missing from the registry.", {
        projectId
      });
    }
    const timestamp = now();
    const location = entry.locations.find((candidate) => candidate.canonicalPath === pathValue);
    if (location) {
      location.lastSeenAt = timestamp;
    } else {
      entry.locations.push({
        canonicalPath: pathValue,
        firstSeenAt: timestamp,
        lastSeenAt: timestamp
      });
    }
    writeJson(this.projectPath(projectId), {
      ...project,
      primaryPath: pathValue,
      headCommit,
      updatedAt: timestamp,
      lastSeenAt: timestamp
    });
    this.writeRegistry(registry);
  }
  linkProjects(sourceProjectId, targetProjectId) {
    if (sourceProjectId === targetProjectId) {
      throw new ProjectMemoryError("INVALID_INPUT", "A project cannot link to itself.");
    }
    this.requireProject(sourceProjectId);
    this.requireProject(targetProjectId);
    const links = this.readLinks();
    if (!links.links.some(
      (link) => link.sourceProjectId === sourceProjectId && link.targetProjectId === targetProjectId
    )) {
      links.links.push({ sourceProjectId, targetProjectId, access: "read", createdAt: now() });
      this.writeLinks(links);
    }
    this.audit("project_linked", sourceProjectId, targetProjectId, { access: "read" });
  }
  unlinkProjects(sourceProjectId, targetProjectId) {
    const links = this.readLinks();
    links.links = links.links.filter(
      (link) => !(link.sourceProjectId === sourceProjectId && link.targetProjectId === targetProjectId)
    );
    this.writeLinks(links);
    this.audit("project_unlinked", sourceProjectId, targetProjectId, {});
  }
  listLinks(sourceProjectId) {
    this.requireProject(sourceProjectId);
    return this.readLinks().links.filter((link) => link.sourceProjectId === sourceProjectId).map((link) => this.getProject(link.targetProjectId)).filter((project) => Boolean(project)).sort((left, right) => left.name.localeCompare(right.name));
  }
  hasReadAccess(sourceProjectId, targetProjectId) {
    if (sourceProjectId === targetProjectId) {
      return true;
    }
    return this.readLinks().links.some(
      (link) => link.sourceProjectId === sourceProjectId && link.targetProjectId === targetProjectId
    );
  }
  createProposal(projectId, candidates, updates = [], relations = []) {
    this.requireProject(projectId);
    const proposalId = randomUUID();
    const proposal = {
      id: proposalId,
      projectId,
      status: "pending",
      createdAt: now(),
      reviewedAt: null,
      items: candidates.map((candidate) => ({
        id: randomUUID(),
        proposalId,
        candidate,
        status: "pending"
      })),
      updateItems: updates.map((candidate) => ({
        id: randomUUID(),
        proposalId,
        candidate,
        status: "pending",
        rejectionReason: null
      })),
      relationItems: relations.map((candidate) => ({
        id: randomUUID(),
        proposalId,
        candidate,
        status: "pending",
        rejectionReason: null
      }))
    };
    writeJson(this.proposalPath(projectId, proposalId), proposal);
    this.audit("memory_proposed", projectId, proposalId, {
      itemCount: candidates.length,
      updateItemCount: updates.length,
      relationItemCount: relations.length
    });
    return publicProposal(proposal);
  }
  findProposalPath(proposalId) {
    for (const entry of this.readRegistry().projects) {
      const proposalPath = this.proposalPath(entry.id, proposalId);
      if (existsSync4(proposalPath)) {
        return proposalPath;
      }
    }
    return null;
  }
  getProposal(proposalId, expectedItemIds) {
    const proposalPath = this.findProposalPath(proposalId);
    if (!proposalPath) {
      return null;
    }
    const proposal = readJson(proposalPath);
    if (expectedItemIds && proposal.items.some((item) => !expectedItemIds.includes(item.id))) {
      throw new ProjectMemoryError("STORAGE_ERROR", "Proposal items changed unexpectedly.");
    }
    return publicProposal(proposal);
  }
  commitProposal(proposalId, acceptedItemIds, acceptedUpdateIds = [], acceptedRelationIds = []) {
    const proposalPath = this.findProposalPath(proposalId);
    const proposal = proposalPath ? readJson(proposalPath) : null;
    if (proposal?.status !== "pending" || !proposalPath) {
      throw new ProjectMemoryError("PROPOSAL_NOT_PENDING", "Proposal is not pending.", {
        proposalId
      });
    }
    const accepted = new Set(acceptedItemIds);
    const acceptedUpdates = new Set(acceptedUpdateIds);
    const acceptedRelations = new Set(acceptedRelationIds);
    const validIds = new Set(proposal.items.map((item) => item.id));
    const updateItems = proposal.updateItems ?? [];
    const validUpdateIds = new Set(updateItems.map((item) => item.id));
    const relationItems = proposal.relationItems ?? [];
    const validRelationIds = new Set(relationItems.map((item) => item.id));
    if (accepted.size + acceptedUpdates.size + acceptedRelations.size === 0 || [...accepted].some((id) => !validIds.has(id)) || [...acceptedUpdates].some((id) => !validUpdateIds.has(id)) || [...acceptedRelations].some((id) => !validRelationIds.has(id))) {
      throw new ProjectMemoryError(
        "INVALID_INPUT",
        "Accepted memory, update, and relation item IDs must belong to the proposal.",
        { proposalId }
      );
    }
    const project = this.requireProject(proposal.projectId);
    const memories = this.getContext(project.id, 1e3);
    const reviewedAt = now();
    const created = [];
    const createdByRef = /* @__PURE__ */ new Map();
    for (const item of proposal.items) {
      if (!accepted.has(item.id)) {
        item.status = "rejected";
        continue;
      }
      const candidate = item.candidate;
      const memory = {
        id: randomUUID(),
        projectId: project.id,
        projectName: project.name,
        kind: candidate.kind,
        title: candidate.title,
        summary: candidate.summary ?? null,
        topic: candidate.topic ?? null,
        content: candidate.content,
        tags: candidate.tags,
        sourceProjectId: candidate.sourceProjectId,
        sourcePath: candidate.sourcePath,
        sourceCommit: candidate.sourceCommit,
        sourceFileHash: candidate.sourceFileHash,
        citations: (candidate.citations ?? []).map((citation) => ({
          ...citation,
          sourceProjectName: "",
          stale: false,
          staleReason: null,
          accessible: true,
          fileUrl: null
        })),
        confidence: candidate.confidence,
        status: "active",
        createdAt: reviewedAt,
        updatedAt: reviewedAt,
        stale: false,
        staleReason: null
      };
      memories.push(memory);
      created.push(memory);
      if (candidate.ref) createdByRef.set(candidate.ref, memory);
      item.status = "accepted";
    }
    const updatedMemories = [];
    const rejectedUpdateItems = [];
    for (const item of updateItems) {
      if (!acceptedUpdates.has(item.id)) {
        item.status = "rejected";
        item.rejectionReason = "not_accepted";
        continue;
      }
      const memory = memories.find((candidate) => candidate.id === item.candidate.memoryId);
      if (!memory || memory.projectId !== project.id) {
        item.status = "rejected";
        item.rejectionReason = "memory_unavailable";
        rejectedUpdateItems.push({
          id: item.id,
          proposalId: item.proposalId,
          candidate: publicUpdateCandidate(item.candidate),
          status: "rejected",
          rejectionReason: item.rejectionReason
        });
        continue;
      }
      if (item.candidate.summary !== void 0) memory.summary = item.candidate.summary;
      if (item.candidate.topic !== void 0) memory.topic = item.candidate.topic;
      if (item.candidate.citations !== void 0) {
        memory.citations = item.candidate.citations.map((citation) => ({
          ...citation,
          sourceProjectName: "",
          stale: false,
          staleReason: null,
          accessible: true,
          fileUrl: null
        }));
      }
      memory.updatedAt = reviewedAt;
      updatedMemories.push(memory);
      item.status = "accepted";
      item.rejectionReason = null;
    }
    const relationDocument = this.readRelationsDocument(project.id);
    const relationKeys = new Set(
      relationDocument.relations.map(
        (relation) => relationKey(relation.type, relation.fromMemoryId, relation.toMemoryId)
      )
    );
    const createdRelations = [];
    const rejectedRelationItems = [];
    const resolveEndpoint = (endpoint) => {
      if (endpoint.memoryId) return this.getMemory(endpoint.memoryId);
      if (!("candidateRef" in endpoint) || !endpoint.candidateRef) return null;
      return createdByRef.get(endpoint.candidateRef) ?? null;
    };
    for (const item of relationItems) {
      if (!acceptedRelations.has(item.id)) {
        item.status = "rejected";
        item.rejectionReason = "not_accepted";
        continue;
      }
      const fromMemory = resolveEndpoint(item.candidate.from);
      const toMemory = resolveEndpoint(item.candidate.to);
      let rejectionReason = null;
      if (!fromMemory || !toMemory) {
        rejectionReason = "endpoint_unavailable";
      } else if (fromMemory.id === toMemory.id) {
        rejectionReason = "self_relation";
      } else if (fromMemory.projectId !== project.id && toMemory.projectId !== project.id) {
        rejectionReason = "current_project_endpoint_required";
      } else {
        const foreignProjectIds = new Set(
          [fromMemory.projectId, toMemory.projectId].filter((id) => id !== project.id)
        );
        if ([...foreignProjectIds].some((id) => !this.hasReadAccess(project.id, id))) {
          rejectionReason = "project_link_required";
        }
      }
      const key = fromMemory && toMemory ? relationKey(item.candidate.type, fromMemory.id, toMemory.id) : null;
      if (!rejectionReason && key && relationKeys.has(key)) {
        rejectionReason = "duplicate_relation";
      }
      if (rejectionReason || !fromMemory || !toMemory || !key) {
        item.status = "rejected";
        item.rejectionReason = rejectionReason ?? "invalid_relation";
        rejectedRelationItems.push({
          id: item.id,
          proposalId: item.proposalId,
          candidate: item.candidate,
          status: item.status,
          rejectionReason: item.rejectionReason
        });
        continue;
      }
      const relation = {
        id: randomUUID(),
        ownerProjectId: project.id,
        fromMemoryId: fromMemory.id,
        fromProjectId: fromMemory.projectId,
        toMemoryId: toMemory.id,
        toProjectId: toMemory.projectId,
        type: item.candidate.type,
        rationale: item.candidate.rationale,
        confidence: item.candidate.confidence,
        sourceProposalId: proposalId,
        status: "active",
        createdAt: reviewedAt,
        updatedAt: reviewedAt
      };
      relationDocument.relations.push(relation);
      relationKeys.add(key);
      createdRelations.push(relation);
      item.status = "accepted";
      item.rejectionReason = null;
    }
    proposal.status = "accepted";
    proposal.reviewedAt = reviewedAt;
    writePrivateFile(this.memoryPath(project.id), renderMemoryDocument(project.id, memories));
    this.writeRelationsDocument(relationDocument);
    writeJson(proposalPath, proposal);
    this.audit("memory_committed", project.id, proposalId, {
      acceptedItemIds: [...accepted],
      memoryIds: created.map((memory) => memory.id),
      acceptedUpdateIds: [...acceptedUpdates],
      updatedMemoryIds: updatedMemories.map((memory) => memory.id),
      rejectedUpdateItemIds: rejectedUpdateItems.map((item) => item.id),
      acceptedRelationIds: [...acceptedRelations],
      relationIds: createdRelations.map((relation) => relation.id),
      rejectedRelationItemIds: rejectedRelationItems.map((item) => item.id)
    });
    return {
      memories: created,
      updatedMemories,
      relations: createdRelations,
      rejectedUpdateItems,
      rejectedRelationItems
    };
  }
  rejectProposal(proposalId) {
    const proposalPath = this.findProposalPath(proposalId);
    const proposal = proposalPath ? readJson(proposalPath) : null;
    if (proposal?.status !== "pending" || !proposalPath) {
      throw new ProjectMemoryError("PROPOSAL_NOT_PENDING", "Proposal is not pending.", {
        proposalId
      });
    }
    proposal.status = "rejected";
    proposal.reviewedAt = now();
    for (const item of proposal.items) {
      item.status = "rejected";
    }
    for (const item of proposal.updateItems ?? []) {
      item.status = "rejected";
      item.rejectionReason = "proposal_rejected";
    }
    for (const item of proposal.relationItems ?? []) {
      item.status = "rejected";
      item.rejectionReason = "proposal_rejected";
    }
    writeJson(proposalPath, proposal);
    this.audit("memory_rejected", proposal.projectId, proposalId, {});
    return publicProposal(proposal);
  }
  getMemory(memoryId) {
    for (const entry of this.readRegistry().projects) {
      const memory = this.getContext(entry.id, 1e3).find((candidate) => candidate.id === memoryId);
      if (memory) {
        return memory;
      }
    }
    return null;
  }
  getContext(projectId, limit = 30) {
    const project = this.requireProject(projectId);
    return parseMemoryDocument(this.memoryPath(projectId), project).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, Math.min(Math.max(limit, 1), 1e3));
  }
  searchMemories(projectIds, query, limit = 30) {
    if (projectIds.length === 0) {
      return [];
    }
    const tokens = (query.match(/[\p{L}\p{N}_-]+/gu) ?? []).map(
      (token) => token.toLocaleLowerCase()
    );
    if (tokens.length === 0) {
      throw new ProjectMemoryError("INVALID_INPUT", "Memory search query cannot be empty.");
    }
    return projectIds.flatMap((projectId) => this.getContext(projectId, 1e3)).map((memory) => ({ memory, score: scoreMemory(memory, tokens) })).filter(({ memory }) => {
      const haystack = `${memory.title}
${memory.tags.join(" ")}
${memory.content}`.toLocaleLowerCase();
      return tokens.every((token) => haystack.includes(token));
    }).sort(
      (left, right) => right.score - left.score || right.memory.updatedAt.localeCompare(left.memory.updatedAt)
    ).slice(0, Math.min(Math.max(limit, 1), 100)).map(({ memory }) => memory);
  }
  forgetMemories(projectId, memoryIds) {
    this.requireProject(projectId);
    const forgotten = new Set(memoryIds);
    const memories = this.getContext(projectId, 1e3);
    const retained = memories.filter((memory) => !forgotten.has(memory.id));
    const removed = memories.filter((memory) => forgotten.has(memory.id)).map((memory) => memory.id);
    writePrivateFile(this.memoryPath(projectId), renderMemoryDocument(projectId, retained));
    const removedSet = new Set(removed);
    for (const entry of this.readRegistry().projects) {
      const document = this.readRelationsDocument(entry.id);
      const removedRelations = document.relations.filter(
        (relation) => removedSet.has(relation.fromMemoryId) || removedSet.has(relation.toMemoryId)
      );
      if (removedRelations.length === 0) continue;
      document.relations = document.relations.filter(
        (relation) => !removedSet.has(relation.fromMemoryId) && !removedSet.has(relation.toMemoryId)
      );
      this.writeRelationsDocument(document);
      this.audit("relations_forgotten", entry.id, null, {
        relationIds: removedRelations.map((relation) => relation.id),
        causedByMemoryIds: removed
      });
    }
    this.audit("memory_forgotten", projectId, null, { memoryIds: removed });
    return removed;
  }
  forgetRelations(projectId, relationIds) {
    const document = this.readRelationsDocument(projectId);
    const requested = new Set(relationIds);
    const removed = document.relations.filter((relation) => requested.has(relation.id)).map((relation) => relation.id);
    document.relations = document.relations.filter((relation) => !requested.has(relation.id));
    this.writeRelationsDocument(document);
    this.audit("relations_forgotten", projectId, null, { relationIds: removed });
    return removed;
  }
  exportProject(projectId) {
    const project = this.requireProject(projectId);
    return {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: now(),
      project,
      links: this.listLinks(projectId),
      memories: this.getContext(projectId, 1e3),
      relations: this.getRelations(projectId)
    };
  }
  countPendingProposals(projectId) {
    this.requireProject(projectId);
    const directory = this.proposalsDir(projectId);
    if (!existsSync4(directory)) {
      return 0;
    }
    return readdirSync2(directory).filter((file) => file.endsWith(".json")).map((file) => readJson(path6.join(directory, file))).filter((proposal) => proposal.status === "pending").length;
  }
  doctor() {
    const errors = [];
    const warnings = [];
    let memories = 0;
    let relations = 0;
    let suspendedRelations = 0;
    let pendingProposals = 0;
    const registry = this.readRegistry();
    for (const entry of registry.projects) {
      try {
        this.requireProject(entry.id);
        memories += this.getContext(entry.id, 1e3).length;
        const projectRelations = this.getRelations(entry.id);
        relations += projectRelations.length;
        const keys = /* @__PURE__ */ new Set();
        for (const relation of projectRelations) {
          if (relation.ownerProjectId !== entry.id) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Relation ${relation.id} has an invalid owner project.`
            });
          }
          if (!RELATION_TYPES.includes(relation.type)) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Relation ${relation.id} has an invalid type.`
            });
            continue;
          }
          const key = relationKey(relation.type, relation.fromMemoryId, relation.toMemoryId);
          if (keys.has(key)) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Duplicate relation ${relation.id}.`
            });
          }
          keys.add(key);
          if (relation.fromMemoryId === relation.toMemoryId) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Self relation ${relation.id}.`
            });
          }
          const fromMemory = this.getMemory(relation.fromMemoryId);
          const toMemory = this.getMemory(relation.toMemoryId);
          if (!fromMemory || !toMemory) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Relation ${relation.id} has a missing endpoint.`
            });
          } else if (fromMemory.projectId !== relation.fromProjectId || toMemory.projectId !== relation.toProjectId) {
            errors.push({
              path: this.relationsPath(entry.id),
              message: `Relation ${relation.id} endpoint project metadata is inconsistent.`
            });
          }
          const foreignProjectIds = new Set(
            [relation.fromProjectId, relation.toProjectId].filter((id) => id !== entry.id)
          );
          if ([...foreignProjectIds].some((id) => !this.hasReadAccess(entry.id, id))) {
            suspendedRelations += 1;
            warnings.push({
              path: this.relationsPath(entry.id),
              message: `Relation ${relation.id} is suspended because a project link is missing.`
            });
          }
        }
        pendingProposals += this.countPendingProposals(entry.id);
      } catch (error) {
        errors.push({
          path: this.projectDir(entry.id),
          message: error instanceof Error ? error.message : String(error)
        });
      }
    }
    this.readLinks();
    return {
      ok: errors.length === 0,
      integrity: errors.length === 0 ? ["ok"] : errors,
      warnings,
      storageRoot: this.storageRoot,
      storageFormat: "markdown-json",
      schemaVersion: SCHEMA_VERSION,
      memorySchemaVersion: MEMORY_SCHEMA_VERSION,
      nodeVersion: process.version,
      counts: {
        projects: registry.projects.length,
        memories,
        relations,
        suspendedRelations,
        pendingProposals
      }
    };
  }
  requireProject(projectId) {
    const project = this.getProject(projectId);
    if (!project) {
      throw new ProjectMemoryError("PROJECT_NOT_REGISTERED", "Project is not registered.", {
        projectId
      });
    }
    return project;
  }
};

// src/cli.ts
function parseArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = /* @__PURE__ */ new Map();
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token?.startsWith("--")) {
      throw new ProjectMemoryError("INVALID_INPUT", `Unexpected argument: ${token ?? ""}`);
    }
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) {
      options.set(token.slice(2), "true");
      continue;
    }
    options.set(token.slice(2), value);
    index += 1;
  }
  return { command, options };
}
function option(args, name, fallback) {
  const value = args.options.get(name) ?? fallback;
  if (value === void 0) {
    throw new ProjectMemoryError("INVALID_INPUT", `Missing required option --${name}.`);
  }
  return value;
}
function integerOption(args, name, fallback) {
  const value = Number(args.options.get(name) ?? fallback);
  if (!Number.isInteger(value) || value < 1) {
    throw new ProjectMemoryError("INVALID_INPUT", `--${name} must be a positive integer.`);
  }
  return value;
}
function listOption(args, name) {
  return (args.options.get(name) ?? "").split(",").map((value) => value.trim()).filter(Boolean);
}
function jsonInput(args) {
  const inline = args.options.get("json");
  const filePath = args.options.get("json-file");
  const raw = inline ?? (filePath ? readFileSync5(filePath, "utf8") : readFileSync5(0, "utf8"));
  if (!raw.trim()) {
    throw new ProjectMemoryError(
      "INVALID_INPUT",
      "Provide JSON with --json, --json-file, or stdin."
    );
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new ProjectMemoryError("INVALID_INPUT", "Input JSON is invalid.", {
      cause: error instanceof Error ? error.message : String(error)
    });
  }
}
function createService() {
  const dataDir = ensureDataDir(resolveDataDir());
  return new ProjectMemoryService(new MemoryStore(dataDir), dataDir);
}
function openLocalFile(filePath) {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const commandArgs = process.platform === "win32" ? ["/c", "start", "", filePath] : [filePath];
  const result = spawnSync(command, commandArgs, { stdio: "ignore" });
  if (result.status !== 0) {
    throw new ProjectMemoryError("STORAGE_ERROR", "Unable to open generated graph view.", {
      path: filePath
    });
  }
}
function registeredProjectId(service, pathValue) {
  const detected = service.detectProject(pathValue);
  if (!detected.registeredProject) {
    throw new ProjectMemoryError("PROJECT_NOT_REGISTERED", "Project is not registered.", {
      rootPath: detected.rootPath,
      relocationCandidates: detected.relocationCandidates
    });
  }
  return detected.registeredProject.id;
}
function help() {
  return {
    usage: "project-memory <command> [options]",
    graphView: "HTML opens with a knowledge guide; use graph and reading modes for relationship exploration.",
    commands: {
      detect: "detect [--path PATH]",
      register: "register [--path PATH] [--name NAME] [--relink-project-id ID]",
      status: "status [--path PATH]",
      load: "load [--path PATH] [--limit N]",
      search: "search --query TEXT [--path PATH] [--include-linked true] [--limit N]",
      propose: "propose [--path PATH] [--json JSON|--json-file FILE|stdin]",
      commit: "commit --proposal-id ID [--accepted-item-ids ID,ID] [--accepted-update-ids ID,ID] [--accepted-relation-ids ID,ID]",
      reject: "reject --proposal-id ID",
      link: "link --source-project-id ID --target-project-id ID",
      unlink: "unlink --source-project-id ID --target-project-id ID",
      links: "links [--path PATH]",
      "search-files": "search-files --target-project-id ID --query TEXT [--path PATH]",
      "read-file": "read-file --target-project-id ID --relative-path PATH [--path PATH]",
      relations: "relations --memory-id ID [--direction in|out|both] [--types CSV] [--include-linked true]",
      path: "path --from-memory-id ID --to-memory-id ID [--max-depth N] [--include-linked true]",
      graph: "graph [--memory-id ID] [--depth N] [--include-linked true] [--format json|mermaid|markdown|html] [--output PATH] [--open true]",
      guide: "guide [--path PATH] [--include-linked true] [--limit N]",
      export: "export [--path PATH]",
      forget: "forget --memory-ids ID,ID [--path PATH]",
      "forget-relations": "forget-relations --relation-ids ID,ID [--path PATH]",
      doctor: "doctor",
      binding: "binding"
    }
  };
}
function runCommand(argv) {
  const args = parseArgs(argv);
  if (args.command === "help" || args.options.has("help")) {
    return help();
  }
  const service = createService();
  try {
    const pathValue = args.options.get("path") ?? process.cwd();
    switch (args.command) {
      case "detect":
        return service.detectProject(pathValue);
      case "register":
        return service.registerProject(
          pathValue,
          args.options.get("name"),
          args.options.get("relink-project-id")
        );
      case "status": {
        const detected = service.detectProject(pathValue);
        return detected.registeredProject ? service.projectStatus(detected.registeredProject.id) : { registered: false, detection: detected };
      }
      case "load":
        return {
          memories: service.getContext(
            registeredProjectId(service, pathValue),
            integerOption(args, "limit", 30)
          )
        };
      case "search":
        return {
          memories: service.searchMemory(
            registeredProjectId(service, pathValue),
            option(args, "query"),
            args.options.get("include-linked") === "true",
            integerOption(args, "limit", 30)
          )
        };
      case "propose": {
        const input = jsonInput(args);
        const candidates = Array.isArray(input) ? input : input.candidates;
        const updates = Array.isArray(input) ? [] : input.updates;
        const relations = Array.isArray(input) ? [] : input.relations;
        if (candidates !== void 0 && !Array.isArray(candidates)) {
          throw new ProjectMemoryError("INVALID_INPUT", "Proposal candidates must be an array.");
        }
        if (relations !== void 0 && !Array.isArray(relations)) {
          throw new ProjectMemoryError("INVALID_INPUT", "Proposal relations must be an array.");
        }
        if (updates !== void 0 && !Array.isArray(updates)) {
          throw new ProjectMemoryError("INVALID_INPUT", "Proposal updates must be an array.");
        }
        return service.proposeMemory(
          registeredProjectId(service, pathValue),
          candidates ?? [],
          relations ?? [],
          updates ?? []
        );
      }
      case "commit":
        return service.commitMemory(
          option(args, "proposal-id"),
          listOption(args, "accepted-item-ids"),
          listOption(args, "accepted-relation-ids"),
          listOption(args, "accepted-update-ids")
        );
      case "reject":
        return service.rejectMemory(option(args, "proposal-id"));
      case "link":
        return service.linkProjects(
          option(args, "source-project-id"),
          option(args, "target-project-id")
        );
      case "unlink":
        return service.unlinkProjects(
          option(args, "source-project-id"),
          option(args, "target-project-id")
        );
      case "links":
        return {
          links: service.store.listLinks(registeredProjectId(service, pathValue))
        };
      case "search-files": {
        const sourceProjectId = registeredProjectId(service, pathValue);
        return service.searchFiles(
          sourceProjectId,
          option(args, "target-project-id"),
          option(args, "query")
        );
      }
      case "read-file": {
        const sourceProjectId = registeredProjectId(service, pathValue);
        return service.readFile(
          sourceProjectId,
          option(args, "target-project-id"),
          option(args, "relative-path")
        );
      }
      case "relations": {
        const direction = option(args, "direction", "both");
        if (!["in", "out", "both"].includes(direction)) {
          throw new ProjectMemoryError("INVALID_INPUT", "Direction must be in, out, or both.");
        }
        return service.listMemoryRelations(
          registeredProjectId(service, pathValue),
          option(args, "memory-id"),
          direction,
          listOption(args, "types"),
          args.options.get("include-linked") === "true"
        );
      }
      case "path":
        return service.findRelationPath(
          registeredProjectId(service, pathValue),
          option(args, "from-memory-id"),
          option(args, "to-memory-id"),
          integerOption(args, "max-depth", 4),
          args.options.get("include-linked") === "true"
        );
      case "guide": {
        const projectId = registeredProjectId(service, pathValue);
        const graph = service.buildGraph(
          projectId,
          null,
          1,
          args.options.get("include-linked") === "true"
        );
        return service.buildGraphGuide(projectId, graph, integerOption(args, "limit", 12));
      }
      case "graph": {
        const projectId = registeredProjectId(service, pathValue);
        const graph = service.buildGraph(
          projectId,
          args.options.get("memory-id") ?? null,
          integerOption(args, "depth", 1),
          args.options.get("include-linked") === "true"
        );
        const format = option(args, "format", "json");
        if (format === "json") return graph;
        if (format === "mermaid") return service.renderGraphMermaid(graph);
        if (format === "markdown") return service.renderGraphMarkdown(projectId, graph);
        if (format === "html") {
          const result = service.writeGraphHtml(projectId, graph, args.options.get("output"));
          if (args.options.get("open") === "true") {
            openLocalFile(result.outputPath);
          }
          return result;
        }
        throw new ProjectMemoryError(
          "INVALID_INPUT",
          "Graph format must be json, mermaid, markdown, or html."
        );
      }
      case "export":
        return service.exportProject(registeredProjectId(service, pathValue));
      case "forget":
        return {
          forgottenMemoryIds: service.store.forgetMemories(
            registeredProjectId(service, pathValue),
            option(args, "memory-ids").split(",").map((value) => value.trim()).filter(Boolean)
          )
        };
      case "forget-relations":
        return {
          forgottenRelationIds: service.store.forgetRelations(
            registeredProjectId(service, pathValue),
            listOption(args, "relation-ids")
          )
        };
      case "doctor":
        return service.store.doctor();
      case "binding":
        return service.bindingSnippet();
      default:
        throw new ProjectMemoryError("INVALID_INPUT", `Unknown command: ${args.command}`);
    }
  } finally {
    service.store.close();
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL2(process.argv[1]).href) {
  try {
    const result = runCommand(process.argv.slice(2));
    process.stdout.write(
      typeof result === "string" ? result : `${JSON.stringify(result, null, 2)}
`
    );
  } catch (error) {
    process.stderr.write(`${JSON.stringify(normalizeError(error), null, 2)}
`);
    process.exitCode = 1;
  }
}
export {
  runCommand
};
