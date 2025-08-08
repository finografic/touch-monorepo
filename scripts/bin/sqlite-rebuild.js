#!/usr/bin/env node
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import process2 from 'node:process';
import os from 'node:os';
import tty from 'node:tty';

// ../node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
[...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process2.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = process2;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process2.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => key in env)) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
  stderr: createSupportsColor({ isTTY: tty.isatty(2) })
};
var supports_color_default = supportsColor;

// ../node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// ../node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// src/sqlite-rebuild/sqlite-rebuild.ts
var SqliteRebuilder = class {
  workspaceRoot;
  options;
  packages = [];
  constructor(options = {}) {
    this.options = {
      force: false,
      verbose: false,
      targetVersion: "11.9.0",
      cleanOnly: false,
      includeMigration: false,
      ...options
    };
    this.workspaceRoot = this.findWorkspaceRoot();
  }
  findWorkspaceRoot() {
    let currentDir = process.cwd();
    while (currentDir !== path.dirname(currentDir)) {
      if (fs.existsSync(path.join(currentDir, "pnpm-workspace.yaml"))) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    throw new Error("Could not find workspace root (pnpm-workspace.yaml)");
  }
  log(message, type = "info") {
    const colors = {
      info: source_default.blue,
      success: source_default.green,
      error: source_default.red,
      warning: source_default.yellow
    };
    console.log(colors[type](`[SQLite Rebuilder] ${message}`));
  }
  logVerbose(message) {
    if (this.options.verbose) {
      console.log(source_default.gray(`[DEBUG] ${message}`));
    }
  }
  async runCommand(command, cwd) {
    this.logVerbose(`Running: ${command}${cwd ? ` in ${cwd}` : ""}`);
    try {
      const result = execSync(command, {
        cwd: cwd || this.workspaceRoot,
        encoding: "utf8",
        stdio: this.options.verbose ? "inherit" : "pipe"
      });
      return result;
    } catch (error) {
      if (this.options.verbose) {
        throw error;
      }
      throw new Error(`Command failed: ${command}
${error.message}`);
    }
  }
  async scanPackages() {
    this.log("Scanning packages for better-sqlite3 dependencies...");
    const packageDirs = [
      this.workspaceRoot,
      path.join(this.workspaceRoot, "apps", "client"),
      path.join(this.workspaceRoot, "apps", "server"),
      path.join(this.workspaceRoot, "packages", "core"),
      path.join(this.workspaceRoot, "packages", "globals"),
      path.join(this.workspaceRoot, "packages", "i18n"),
      path.join(this.workspaceRoot, "packages", "types")
    ];
    for (const packageDir of packageDirs) {
      if (!fs.existsSync(packageDir)) continue;
      const packageJsonPath = path.join(packageDir, "package.json");
      if (!fs.existsSync(packageJsonPath)) continue;
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        const betterSqlite3Version = packageJson.dependencies?.["better-sqlite3"] || packageJson.devDependencies?.["better-sqlite3"];
        this.packages.push({
          name: packageJson.name || path.basename(packageDir),
          version: packageJson.version || "unknown",
          path: packageDir,
          hasBetterSqlite3: !!betterSqlite3Version,
          betterSqlite3Version
        });
      } catch (error) {
        this.log(`Failed to parse package.json in ${packageDir}`, "warning");
      }
    }
    this.log(`Found ${this.packages.length} packages`);
    this.packages.forEach((pkg) => {
      if (pkg.hasBetterSqlite3) {
        this.log(`  ${pkg.name}: better-sqlite3@${pkg.betterSqlite3Version}`, "info");
      }
    });
  }
  async checkVersionConsistency() {
    this.log("Checking version consistency...");
    const versions = this.packages.filter((pkg) => pkg.hasBetterSqlite3).map((pkg) => pkg.betterSqlite3Version);
    const uniqueVersions = [...new Set(versions)];
    if (uniqueVersions.length === 0) {
      this.log("No better-sqlite3 dependencies found", "warning");
      return true;
    }
    if (uniqueVersions.length === 1) {
      this.log(`\u2705 All packages use the same version: ${uniqueVersions[0]}`, "success");
      return true;
    }
    this.log(`\u274C Version mismatch detected:`, "error");
    uniqueVersions.forEach((version) => {
      const packages = this.packages.filter((pkg) => pkg.betterSqlite3Version === version);
      this.log(`  ${version}: ${packages.map((pkg) => pkg.name).join(", ")}`, "error");
    });
    return false;
  }
  async updateVersions() {
    this.log(`Updating all packages to use better-sqlite3@${this.options.targetVersion}...`);
    for (const pkg of this.packages) {
      if (!pkg.hasBetterSqlite3) continue;
      if (pkg.betterSqlite3Version === this.options.targetVersion) {
        this.log(`  ${pkg.name}: Already using target version`, "info");
        continue;
      }
      try {
        const packageJsonPath = path.join(pkg.path, "package.json");
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        if (packageJson.dependencies?.["better-sqlite3"]) {
          packageJson.dependencies["better-sqlite3"] = this.options.targetVersion;
        }
        if (packageJson.devDependencies?.["better-sqlite3"]) {
          packageJson.devDependencies["better-sqlite3"] = this.options.targetVersion;
        }
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
        this.log(`  \u2705 Updated ${pkg.name} to ${this.options.targetVersion}`, "success");
      } catch (error) {
        this.log(`  \u274C Failed to update ${pkg.name}: ${error}`, "error");
      }
    }
  }
  async cleanNodeModules() {
    this.log("Cleaning node_modules directories...");
    const nodeModulesDirs = [
      path.join(this.workspaceRoot, "node_modules"),
      path.join(this.workspaceRoot, "apps", "client", "node_modules"),
      path.join(this.workspaceRoot, "apps", "server", "node_modules"),
      path.join(this.workspaceRoot, "packages", "core", "node_modules"),
      path.join(this.workspaceRoot, "packages", "globals", "node_modules"),
      path.join(this.workspaceRoot, "packages", "i18n", "node_modules"),
      path.join(this.workspaceRoot, "packages", "types", "node_modules")
    ];
    for (const dir of nodeModulesDirs) {
      if (fs.existsSync(dir)) {
        try {
          fs.rmSync(dir, { recursive: true, force: true });
          this.log(`  \u2705 Cleaned ${path.relative(this.workspaceRoot, dir)}`, "success");
        } catch (error) {
          this.log(`  \u274C Failed to clean ${dir}: ${error}`, "error");
        }
      }
    }
  }
  async rebuildBetterSqlite3() {
    this.log("Rebuilding better-sqlite3 native bindings...");
    try {
      await this.runCommand("pnpm rebuild better-sqlite3");
      this.log("\u2705 Rebuild completed successfully", "success");
    } catch (error) {
      this.log("\u274C Rebuild failed, trying alternative approach...", "warning");
      try {
        const betterSqlite3Path = path.join(
          this.workspaceRoot,
          "node_modules",
          ".pnpm",
          `better-sqlite3@${this.options.targetVersion}`,
          "node_modules",
          "better-sqlite3"
        );
        if (fs.existsSync(betterSqlite3Path)) {
          this.log("Attempting manual rebuild...", "info");
          await this.runCommand("npm run build-release", betterSqlite3Path);
          this.log("\u2705 Manual rebuild completed", "success");
        } else {
          throw new Error("Could not find better-sqlite3 package directory");
        }
      } catch (manualError) {
        this.log("\u274C Manual rebuild also failed", "error");
        throw manualError;
      }
    }
  }
  async testBetterSqlite3() {
    this.log("Testing better-sqlite3 functionality...");
    try {
      const testScript = `
        const Database = require('better-sqlite3');
        const db = new Database(':memory:');
        console.log('\u2705 better-sqlite3 is working!');
        db.close();
      `;
      await this.runCommand(`node -e "${testScript}"`);
      this.log("\u2705 better-sqlite3 test passed", "success");
      return true;
    } catch (error) {
      this.log("\u274C better-sqlite3 test failed", "error");
      return false;
    }
  }
  async runDatabaseMigration() {
    if (!this.options.includeMigration) {
      this.log("Skipping database migration test as --include-migration is not set.", "info");
      return true;
    }
    this.log("Testing database migration...");
    try {
      const serverPath = path.join(this.workspaceRoot, "apps", "server");
      if (!fs.existsSync(serverPath)) {
        this.log("Server directory not found, skipping migration test", "warning");
        return true;
      }
      const migrationScript = path.join(serverPath, "src", "db", "utils", "migrate.ts");
      if (!fs.existsSync(migrationScript)) {
        this.log("Migration script not found, skipping migration test", "warning");
        return true;
      }
      await this.runCommand("pnpm db.migrations.run", serverPath);
      this.log("\u2705 Database migration test passed", "success");
      return true;
    } catch (error) {
      this.log("\u274C Database migration test failed", "error");
      this.log("This is often due to missing environment variables or database configuration", "warning");
      this.log("The basic better-sqlite3 functionality should still work", "info");
      return false;
    }
  }
  async rebuild() {
    this.log("\u{1F680} Starting better-sqlite3 rebuild process...", "info");
    try {
      await this.scanPackages();
      const isConsistent = await this.checkVersionConsistency();
      if (!isConsistent && !this.options.force) {
        this.log("Version inconsistency detected. Use --force to proceed anyway.", "warning");
        return;
      }
      if (!isConsistent) {
        await this.updateVersions();
      }
      await this.cleanNodeModules();
      if (this.options.cleanOnly) {
        this.log("Clean-only mode: skipping rebuild", "info");
        return;
      }
      this.log("Reinstalling dependencies...");
      await this.runCommand("pnpm install");
      await this.rebuildBetterSqlite3();
      const testPassed = await this.testBetterSqlite3();
      if (!testPassed) {
        throw new Error("better-sqlite3 test failed after rebuild");
      }
      const migrationPassed = await this.runDatabaseMigration();
      if (!migrationPassed) {
        this.log("Database migration test failed, but basic functionality works", "warning");
      }
      this.log("\u{1F389} better-sqlite3 rebuild completed successfully!", "success");
    } catch (error) {
      this.log(`\u274C Rebuild failed: ${error}`, "error");
      throw error;
    }
  }
};
async function main() {
  const args = process.argv.slice(2);
  const options = {
    force: args.includes("--force") || args.includes("-f"),
    verbose: args.includes("--verbose") || args.includes("-v"),
    cleanOnly: args.includes("--clean-only") || args.includes("-c"),
    includeMigration: args.includes("--include-migration") || args.includes("-m")
  };
  const versionIndex = args.indexOf("--version");
  if (versionIndex !== -1 && args[versionIndex + 1]) {
    options.targetVersion = args[versionIndex + 1];
  }
  const rebuilder = new SqliteRebuilder(options);
  try {
    await rebuilder.rebuild();
  } catch (error) {
    console.error(source_default.red(`
\u274C Rebuild failed: ${error}`));
    process.exit(1);
  }
}
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SqliteRebuilder };
