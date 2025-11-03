// Comprehensive key constants for keyboard handling
// Organized by category for easy maintenance and discovery

export const KEY_PRESS = {
  // Punctuation and Symbols
  QUESTION_MARK: '?',
  EXCLAMATION_MARK: '!',
  AT_SYMBOL: '@',
  HASH: '#',
  DOLLAR: '$',
  PERCENT: '%',
  CARET: '^',
  AMPERSAND: '&',
  ASTERISK: '*',
  LEFT_PARENTHESIS: '(',
  RIGHT_PARENTHESIS: ')',
  UNDERSCORE: '_',
  PLUS: '+',
  MINUS: '-',
  EQUALS: '=',
  LEFT_BRACKET: '[',
  RIGHT_BRACKET: ']',
  LEFT_BRACE: '{',
  RIGHT_BRACE: '}',
  BACKSLASH: '\\',
  PIPE: '|',
  COLON: ':',
  SEMICOLON: ';',
  QUOTE: "'",
  DOUBLE_QUOTE: '"',
  COMMA: ',',
  PERIOD: '.',
  SLASH: '/',
  BACKTICK: '`',
  TILDE: '~',
  LESS_THAN: '<',
  GREATER_THAN: '>',

  // Navigation Keys
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',

  // Function Keys
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',

  // Control Keys
  ESCAPE: 'Escape',
  TAB: 'Tab',
  CAPS_LOCK: 'CapsLock',
  SHIFT: 'Shift',
  CONTROL: 'Control',
  ALT: 'Alt',
  META: 'Meta',
  SPACE: ' ',
  ENTER: 'Enter',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  INSERT: 'Insert',

  // Number Keys (top row)
  DIGIT_0: '0',
  DIGIT_1: '1',
  DIGIT_2: '2',
  DIGIT_3: '3',
  DIGIT_4: '4',
  DIGIT_5: '5',
  DIGIT_6: '6',
  DIGIT_7: '7',
  DIGIT_8: '8',
  DIGIT_9: '9',

  // Letter Keys
  KEY_A: 'a',
  KEY_B: 'b',
  KEY_C: 'c',
  KEY_D: 'd',
  KEY_E: 'e',
  KEY_F: 'f',
  KEY_G: 'g',
  KEY_H: 'h',
  KEY_I: 'i',
  KEY_J: 'j',
  KEY_K: 'k',
  KEY_L: 'l',
  KEY_M: 'm',
  KEY_N: 'n',
  KEY_O: 'o',
  KEY_P: 'p',
  KEY_Q: 'q',
  KEY_R: 'r',
  KEY_S: 's',
  KEY_T: 't',
  KEY_U: 'u',
  KEY_V: 'v',
  KEY_W: 'w',
  KEY_X: 'x',
  KEY_Y: 'y',
  KEY_Z: 'z',

  // Media Keys (if supported)
  MEDIA_PLAY: 'MediaPlay',
  MEDIA_PAUSE: 'MediaPause',
  MEDIA_STOP: 'MediaStop',
  MEDIA_NEXT: 'MediaNext',
  MEDIA_PREVIOUS: 'MediaPrevious',
  VOLUME_UP: 'AudioVolumeUp',
  VOLUME_DOWN: 'AudioVolumeDown',
  VOLUME_MUTE: 'AudioVolumeMute',

  // Special Keys
  PRINT_SCREEN: 'PrintScreen',
  SCROLL_LOCK: 'ScrollLock',
  PAUSE: 'Pause',
  BREAK: 'Break',
  NUM_LOCK: 'NumLock',

  // Numpad Keys
  NUMPAD_0: 'Numpad0',
  NUMPAD_1: 'Numpad1',
  NUMPAD_2: 'Numpad2',
  NUMPAD_3: 'Numpad3',
  NUMPAD_4: 'Numpad4',
  NUMPAD_5: 'Numpad5',
  NUMPAD_6: 'Numpad6',
  NUMPAD_7: 'Numpad7',
  NUMPAD_8: 'Numpad8',
  NUMPAD_9: 'Numpad9',
  NUMPAD_ADD: 'NumpadAdd',
  NUMPAD_SUBTRACT: 'NumpadSubtract',
  NUMPAD_MULTIPLY: 'NumpadMultiply',
  NUMPAD_DIVIDE: 'NumpadDivide',
  NUMPAD_DECIMAL: 'NumpadDecimal',
  NUMPAD_ENTER: 'NumpadEnter',

  // Browser Keys
  BROWSER_BACK: 'BrowserBack',
  BROWSER_FORWARD: 'BrowserForward',
  BROWSER_REFRESH: 'BrowserRefresh',
  BROWSER_STOP: 'BrowserStop',
  BROWSER_SEARCH: 'BrowserSearch',
  BROWSER_FAVORITES: 'BrowserFavorites',
  BROWSER_HOME: 'BrowserHome',

  // Context Menu
  CONTEXT_MENU: 'ContextMenu',

  // IME Keys
  CONVERT: 'Convert',
  NON_CONVERT: 'NonConvert',
  KANA_MODE: 'KanaMode',
  HANGUL_MODE: 'HangulMode',
  JUNJA_MODE: 'JunjaMode',
  FINAL_MODE: 'FinalMode',
  HANJA_MODE: 'HanjaMode',
  KANJI_MODE: 'KanjiMode',

  // Japanese IME
  EISU: 'Eisu',
  HIRAGANA: 'Hiragana',
  KATAKANA: 'Katakana',
  HIRAGANA_KATAKANA: 'HiraganaKatakana',

  // Korean IME
  HANGUL: 'Hangul',
  HANJA: 'Hanja',

  // Chinese IME
  ZH_CN: 'ZhCn',
  ZH_TW: 'ZhTw',
  ZH_HK: 'ZhHk',

  // Dead Keys
  DEAD_GRAVE: 'DeadGrave',
  DEAD_ACUTE: 'DeadAcute',
  DEAD_CIRCUMFLEX: 'DeadCircumflex',
  DEAD_TILDE: 'DeadTilde',
  DEAD_MACRON: 'DeadMacron',
  DEAD_BREVE: 'DeadBreve',
  DEAD_ABOVEDOT: 'DeadAbovedot',
  DEAD_DIAERESIS: 'DeadDiaeresis',
  DEAD_ABOVERING: 'DeadAbovering',
  DEAD_DOUBLEACUTE: 'DeadDoubleacute',
  DEAD_CARON: 'DeadCaron',
  DEAD_CEDILLA: 'DeadCedilla',
  DEAD_OGONEK: 'DeadOgonek',
  DEAD_IOTA: 'DeadIota',
  DEAD_VOICED_SOUND: 'DeadVoicedSound',
  DEAD_SEMIVOICED_SOUND: 'DeadSemivoicedSound',
  DEAD_BELOWDOT: 'DeadBelowdot',
  DEAD_HOOK: 'DeadHook',
  DEAD_HORN: 'DeadHorn',

  // Special Characters
  SECTION: '§',
  DEGREE: '°',
  COPYRIGHT: '©',
  REGISTERED: '®',
  TRADEMARK: '™',
  EURO: '€',
  POUND: '£',
  YEN: '¥',
  CENT: '¢',
  MICRO: 'µ',
  INFINITY: '∞',
  SQUARE_ROOT: '√',
  INTEGRAL: '∫',
  PI: 'π',
  THETA: 'θ',
  ALPHA: 'α',
  BETA: 'β',
  GAMMA: 'γ',
  DELTA: 'δ',
  EPSILON: 'ε',
  ZETA: 'ζ',
  ETA: 'η',
  IOTA: 'ι',
  KAPPA: 'κ',
  LAMBDA: 'λ',
  MU: 'μ',
  NU: 'ν',
  XI: 'ξ',
  OMICRON: 'ο',
  RHO: 'ρ',
  SIGMA: 'σ',
  TAU: 'τ',
  UPSILON: 'υ',
  PHI: 'φ',
  CHI: 'χ',
  PSI: 'ψ',
  OMEGA: 'ω',
} as const;

// Type for all available keys
export type KeyPress = (typeof KEY_PRESS)[keyof typeof KEY_PRESS];

// Convenience types for specific categories
export type PunctuationKey =
  | typeof KEY_PRESS.QUESTION_MARK
  | typeof KEY_PRESS.EXCLAMATION_MARK
  | typeof KEY_PRESS.AT_SYMBOL
  | typeof KEY_PRESS.HASH
  | typeof KEY_PRESS.DOLLAR
  | typeof KEY_PRESS.PERCENT
  | typeof KEY_PRESS.CARET
  | typeof KEY_PRESS.AMPERSAND
  | typeof KEY_PRESS.ASTERISK
  | typeof KEY_PRESS.LEFT_PARENTHESIS
  | typeof KEY_PRESS.RIGHT_PARENTHESIS
  | typeof KEY_PRESS.UNDERSCORE
  | typeof KEY_PRESS.PLUS
  | typeof KEY_PRESS.MINUS
  | typeof KEY_PRESS.EQUALS
  | typeof KEY_PRESS.LEFT_BRACKET
  | typeof KEY_PRESS.RIGHT_BRACKET
  | typeof KEY_PRESS.LEFT_BRACE
  | typeof KEY_PRESS.RIGHT_BRACE
  | typeof KEY_PRESS.BACKSLASH
  | typeof KEY_PRESS.PIPE
  | typeof KEY_PRESS.COLON
  | typeof KEY_PRESS.SEMICOLON
  | typeof KEY_PRESS.QUOTE
  | typeof KEY_PRESS.DOUBLE_QUOTE
  | typeof KEY_PRESS.COMMA
  | typeof KEY_PRESS.PERIOD
  | typeof KEY_PRESS.SLASH
  | typeof KEY_PRESS.BACKTICK
  | typeof KEY_PRESS.TILDE
  | typeof KEY_PRESS.LESS_THAN
  | typeof KEY_PRESS.GREATER_THAN;

export type NavigationKey =
  | typeof KEY_PRESS.ARROW_UP
  | typeof KEY_PRESS.ARROW_DOWN
  | typeof KEY_PRESS.ARROW_LEFT
  | typeof KEY_PRESS.ARROW_RIGHT
  | typeof KEY_PRESS.HOME
  | typeof KEY_PRESS.END
  | typeof KEY_PRESS.PAGE_UP
  | typeof KEY_PRESS.PAGE_DOWN;

export type FunctionKey =
  | typeof KEY_PRESS.F1
  | typeof KEY_PRESS.F2
  | typeof KEY_PRESS.F3
  | typeof KEY_PRESS.F4
  | typeof KEY_PRESS.F5
  | typeof KEY_PRESS.F6
  | typeof KEY_PRESS.F7
  | typeof KEY_PRESS.F8
  | typeof KEY_PRESS.F9
  | typeof KEY_PRESS.F10
  | typeof KEY_PRESS.F11
  | typeof KEY_PRESS.F12;

export type ControlKey =
  | typeof KEY_PRESS.ESCAPE
  | typeof KEY_PRESS.TAB
  | typeof KEY_PRESS.CAPS_LOCK
  | typeof KEY_PRESS.SHIFT
  | typeof KEY_PRESS.CONTROL
  | typeof KEY_PRESS.ALT
  | typeof KEY_PRESS.META
  | typeof KEY_PRESS.SPACE
  | typeof KEY_PRESS.ENTER
  | typeof KEY_PRESS.BACKSPACE
  | typeof KEY_PRESS.DELETE
  | typeof KEY_PRESS.INSERT;

export type LetterKey =
  | typeof KEY_PRESS.KEY_A
  | typeof KEY_PRESS.KEY_B
  | typeof KEY_PRESS.KEY_C
  | typeof KEY_PRESS.KEY_D
  | typeof KEY_PRESS.KEY_E
  | typeof KEY_PRESS.KEY_F
  | typeof KEY_PRESS.KEY_G
  | typeof KEY_PRESS.KEY_H
  | typeof KEY_PRESS.KEY_I
  | typeof KEY_PRESS.KEY_J
  | typeof KEY_PRESS.KEY_K
  | typeof KEY_PRESS.KEY_L
  | typeof KEY_PRESS.KEY_M
  | typeof KEY_PRESS.KEY_N
  | typeof KEY_PRESS.KEY_O
  | typeof KEY_PRESS.KEY_P
  | typeof KEY_PRESS.KEY_Q
  | typeof KEY_PRESS.KEY_R
  | typeof KEY_PRESS.KEY_S
  | typeof KEY_PRESS.KEY_T
  | typeof KEY_PRESS.KEY_U
  | typeof KEY_PRESS.KEY_V
  | typeof KEY_PRESS.KEY_W
  | typeof KEY_PRESS.KEY_X
  | typeof KEY_PRESS.KEY_Y
  | typeof KEY_PRESS.KEY_Z;
