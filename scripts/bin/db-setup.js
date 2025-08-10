#!/usr/bin/env node
import fs2 from 'node:fs';
import path4 from 'node:path';
import { pathToFileURL } from 'node:url';
import { checkbox } from '@inquirer/prompts';
import process2 from 'node:process';
import os from 'node:os';
import tty from 'node:tty';
import { execSync } from 'node:child_process';
import path6, { dirname } from 'path';
import { fileURLToPath } from 'url';

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b2) => (typeof require !== "undefined" ? require : a)[b2]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except2, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except2)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  __defProp(target, "default", { value: mod, enumerable: true }) ,
  mod
));

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/package.json
var require_package = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/package.json"(exports, module) {
    module.exports = {
      version: "1.39.0",
      name: "@dotenvx/dotenvx",
      description: "a better dotenv\u2013from the creator of `dotenv`",
      author: "@motdotla",
      keywords: [
        "dotenv",
        "env"
      ],
      homepage: "https://github.com/dotenvx/dotenvx",
      repository: {
        type: "git",
        url: "git+https://github.com/dotenvx/dotenvx.git"
      },
      license: "BSD-3-Clause",
      files: [
        "src/**/*",
        "CHANGELOG.md"
      ],
      main: "src/lib/main.js",
      types: "src/lib/main.d.ts",
      exports: {
        ".": {
          types: "./src/lib/main.d.ts",
          require: "./src/lib/main.js",
          default: "./src/lib/main.js"
        },
        "./config": "./src/lib/config.js",
        "./config.js": "./src/lib/config.js",
        "./package.json": "./package.json"
      },
      bin: {
        dotenvx: "./src/cli/dotenvx.js",
        "git-dotenvx": "./src/cli/dotenvx.js"
      },
      scripts: {
        standard: "standard",
        "standard:fix": "standard --fix",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test-coverage": "tap run --show-full-coverage --timeout=60000",
        testshell: "bash shellspec",
        prerelease: "npm test && npm run testshell",
        release: "standard-version"
      },
      funding: "https://dotenvx.com",
      dependencies: {
        commander: "^11.1.0",
        dotenv: "^16.4.5",
        eciesjs: "^0.4.10",
        execa: "^5.1.1",
        fdir: "^6.2.0",
        ignore: "^5.3.0",
        "object-treeify": "1.1.33",
        picomatch: "^4.0.2",
        which: "^4.0.0"
      },
      devDependencies: {
        "@yao-pkg/pkg": "^5.14.2",
        "capture-console": "^1.0.2",
        esbuild: "^0.24.0",
        proxyquire: "^2.1.3",
        sinon: "^14.0.1",
        standard: "^17.1.0",
        "standard-version": "^9.5.0",
        tap: "^21.0.1"
      },
      publishConfig: {
        access: "public",
        provenance: true
      }
    };
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/packageJson.js
var require_packageJson = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/packageJson.js"(exports, module) {
    var { name, version: version2, description } = require_package();
    module.exports = { name, version: version2, description };
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/colorDepth.js
var require_colorDepth = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/colorDepth.js"(exports, module) {
    var { WriteStream } = __require("tty");
    var getColorDepth = () => {
      try {
        return WriteStream.prototype.getColorDepth();
      } catch (error) {
        const term = process.env.TERM;
        if (term && (term.includes("256color") || term.includes("xterm"))) {
          return 8;
        }
        return 4;
      }
    };
    module.exports = { getColorDepth };
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/shared/colors.js
var require_colors = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/shared/colors.js"(exports, module) {
    var depth = require_colorDepth();
    var colors16 = /* @__PURE__ */ new Map([
      ["blue", 34],
      ["gray", 37],
      ["green", 32],
      ["olive", 33],
      ["orangered", 31],
      // mapped to red
      ["plum", 35],
      // mapped to magenta
      ["red", 31],
      ["electricblue", 36],
      ["dodgerblue", 36]
    ]);
    var colors256 = /* @__PURE__ */ new Map([
      ["blue", 21],
      ["gray", 244],
      ["green", 34],
      ["olive", 142],
      ["orangered", 202],
      ["plum", 182],
      ["red", 196],
      ["electricblue", 45],
      ["dodgerblue", 33]
    ]);
    function getColor(color) {
      const colorDepth = depth.getColorDepth();
      if (!colors256.has(color)) {
        throw new Error(`Invalid color ${color}`);
      }
      if (colorDepth >= 8) {
        const code = colors256.get(color);
        return (message) => `\x1B[38;5;${code}m${message}\x1B[39m`;
      }
      if (colorDepth >= 4) {
        const code = colors16.get(color);
        return (message) => `\x1B[${code}m${message}\x1B[39m`;
      }
      return (message) => message;
    }
    function bold(message) {
      if (depth.getColorDepth() >= 4) {
        return `\x1B[1m${message}\x1B[22m`;
      }
      return message;
    }
    module.exports = {
      getColor,
      bold
    };
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/shared/logger.js
var require_logger = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/shared/logger.js"(exports, module) {
    var packageJson = require_packageJson();
    var { getColor, bold } = require_colors();
    var levels = {
      error: 0,
      errorv: 0,
      errornocolor: 0,
      warn: 1,
      success: 2,
      successv: 2,
      info: 2,
      help: 2,
      blank: 2,
      verbose: 4,
      debug: 5,
      silly: 6
    };
    var error = (m2) => bold(getColor("red")(m2));
    var warn = getColor("orangered");
    var success = getColor("green");
    var successv = getColor("olive");
    var help = getColor("dodgerblue");
    var verbose = getColor("plum");
    var debug2 = getColor("plum");
    var currentLevel = levels.info;
    function log(level, message) {
      if (levels[level] === void 0) {
        throw new Error(`MISSING_LOG_LEVEL: '${level}'. implement in logger.`);
      }
      if (levels[level] <= currentLevel) {
        const formattedMessage = formatMessage(level, message);
        console.log(formattedMessage);
      }
    }
    function formatMessage(level, message) {
      const formattedMessage = typeof message === "object" ? JSON.stringify(message) : message;
      switch (level.toLowerCase()) {
        // errors
        case "error":
          return error(formattedMessage);
        case "errorv":
          return error(`[dotenvx@${packageJson.version}] ${formattedMessage}`);
        case "errornocolor":
          return formattedMessage;
        // warns
        case "warn":
          return warn(formattedMessage);
        // successes
        case "success":
          return success(formattedMessage);
        case "successv":
          return successv(`[dotenvx@${packageJson.version}] ${formattedMessage}`);
        // info
        case "info":
          return formattedMessage;
        // help
        case "help":
          return help(formattedMessage);
        // verbose
        case "verbose":
          return verbose(formattedMessage);
        // debug
        case "debug":
          return debug2(formattedMessage);
        // blank
        case "blank":
          return formattedMessage;
      }
    }
    var logger = {
      // track level
      level: "info",
      // errors
      error: (msg) => log("error", msg),
      errorv: (msg) => log("errorv", msg),
      errornocolor: (msg) => log("errornocolor", msg),
      // warns
      warn: (msg) => log("warn", msg),
      // success
      success: (msg) => log("success", msg),
      successv: (msg) => log("successv", msg),
      // info
      info: (msg) => log("info", msg),
      // help
      help: (msg) => log("help", msg),
      // verbose
      verbose: (msg) => log("verbose", msg),
      // debug
      debug: (msg) => log("debug", msg),
      // blank
      blank: (msg) => log("blank", msg),
      setLevel: (level) => {
        if (levels[level] !== void 0) {
          currentLevel = levels[level];
          logger.level = level;
        }
      }
    };
    function setLogLevel(options) {
      const logLevel = options.debug ? "debug" : options.verbose ? "verbose" : options.quiet ? "error" : options.logLevel;
      if (!logLevel) return;
      logger.setLevel(logLevel);
      if (!options.quiet || options.quiet && logLevel !== "error") {
        logger.debug(`Setting log level to ${logLevel}`);
      }
    }
    module.exports = {
      logger,
      getColor,
      setLogLevel,
      levels
    };
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/utils.js
var require_utils = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/utils.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalizePath = exports.isRootDirectory = exports.convertSlashes = exports.cleanPath = void 0;
    var path_1 = __require("path");
    function cleanPath(path8) {
      let normalized = (0, path_1.normalize)(path8);
      if (normalized.length > 1 && normalized[normalized.length - 1] === path_1.sep)
        normalized = normalized.substring(0, normalized.length - 1);
      return normalized;
    }
    exports.cleanPath = cleanPath;
    var SLASHES_REGEX = /[\\/]/g;
    function convertSlashes(path8, separator) {
      return path8.replace(SLASHES_REGEX, separator);
    }
    exports.convertSlashes = convertSlashes;
    var WINDOWS_ROOT_DIR_REGEX = /^[a-z]:[\\/]$/i;
    function isRootDirectory(path8) {
      return path8 === "/" || WINDOWS_ROOT_DIR_REGEX.test(path8);
    }
    exports.isRootDirectory = isRootDirectory;
    function normalizePath(path8, options) {
      const { resolvePaths, normalizePath: normalizePath2, pathSeparator } = options;
      const pathNeedsCleaning = process.platform === "win32" && path8.includes("/") || path8.startsWith(".");
      if (resolvePaths)
        path8 = (0, path_1.resolve)(path8);
      if (normalizePath2 || pathNeedsCleaning)
        path8 = cleanPath(path8);
      if (path8 === ".")
        return "";
      const needsSeperator = path8[path8.length - 1] !== pathSeparator;
      return convertSlashes(needsSeperator ? path8 + pathSeparator : path8, pathSeparator);
    }
    exports.normalizePath = normalizePath;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/join-path.js
var require_join_path = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/join-path.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.build = exports.joinDirectoryPath = exports.joinPathWithBasePath = void 0;
    var path_1 = __require("path");
    var utils_1 = require_utils();
    function joinPathWithBasePath(filename, directoryPath) {
      return directoryPath + filename;
    }
    exports.joinPathWithBasePath = joinPathWithBasePath;
    function joinPathWithRelativePath(root, options) {
      return function(filename, directoryPath) {
        const sameRoot = directoryPath.startsWith(root);
        if (sameRoot)
          return directoryPath.replace(root, "") + filename;
        else
          return (0, utils_1.convertSlashes)((0, path_1.relative)(root, directoryPath), options.pathSeparator) + options.pathSeparator + filename;
      };
    }
    function joinPath(filename) {
      return filename;
    }
    function joinDirectoryPath(filename, directoryPath, separator) {
      return directoryPath + filename + separator;
    }
    exports.joinDirectoryPath = joinDirectoryPath;
    function build(root, options) {
      const { relativePaths, includeBasePath } = options;
      return relativePaths && root ? joinPathWithRelativePath(root, options) : includeBasePath ? joinPathWithBasePath : joinPath;
    }
    exports.build = build;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/push-directory.js
var require_push_directory = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/push-directory.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.build = void 0;
    function pushDirectoryWithRelativePath(root) {
      return function(directoryPath, paths2) {
        paths2.push(directoryPath.substring(root.length) || ".");
      };
    }
    function pushDirectoryFilterWithRelativePath(root) {
      return function(directoryPath, paths2, filters) {
        const relativePath = directoryPath.substring(root.length) || ".";
        if (filters.every((filter) => filter(relativePath, true))) {
          paths2.push(relativePath);
        }
      };
    }
    var pushDirectory = (directoryPath, paths2) => {
      paths2.push(directoryPath || ".");
    };
    var pushDirectoryFilter = (directoryPath, paths2, filters) => {
      const path8 = directoryPath || ".";
      if (filters.every((filter) => filter(path8, true))) {
        paths2.push(path8);
      }
    };
    var empty = () => {
    };
    function build(root, options) {
      const { includeDirs, filters, relativePaths } = options;
      if (!includeDirs)
        return empty;
      if (relativePaths)
        return filters && filters.length ? pushDirectoryFilterWithRelativePath(root) : pushDirectoryWithRelativePath(root);
      return filters && filters.length ? pushDirectoryFilter : pushDirectory;
    }
    exports.build = build;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/push-file.js
var require_push_file = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/push-file.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.build = void 0;
    var pushFileFilterAndCount = (filename, _paths, counts, filters) => {
      if (filters.every((filter) => filter(filename, false)))
        counts.files++;
    };
    var pushFileFilter = (filename, paths2, _counts, filters) => {
      if (filters.every((filter) => filter(filename, false)))
        paths2.push(filename);
    };
    var pushFileCount = (_filename, _paths, counts, _filters) => {
      counts.files++;
    };
    var pushFile = (filename, paths2) => {
      paths2.push(filename);
    };
    var empty = () => {
    };
    function build(options) {
      const { excludeFiles, filters, onlyCounts } = options;
      if (excludeFiles)
        return empty;
      if (filters && filters.length) {
        return onlyCounts ? pushFileFilterAndCount : pushFileFilter;
      } else if (onlyCounts) {
        return pushFileCount;
      } else {
        return pushFile;
      }
    }
    exports.build = build;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/get-array.js
var require_get_array = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/get-array.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.build = void 0;
    var getArray = (paths2) => {
      return paths2;
    };
    var getArrayGroup = () => {
      return [""].slice(0, 0);
    };
    function build(options) {
      return options.group ? getArrayGroup : getArray;
    }
    exports.build = build;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/group-files.js
var require_group_files = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/group-files.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.build = void 0;
    var groupFiles = (groups, directory, files) => {
      groups.push({ directory, files, dir: directory });
    };
    var empty = () => {
    };
    function build(options) {
      return options.group ? groupFiles : empty;
    }
    exports.build = build;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/resolve-symlink.js
var require_resolve_symlink = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/resolve-symlink.js"(exports) {
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.build = void 0;
    var fs_1 = __importDefault(__require("fs"));
    var path_1 = __require("path");
    var resolveSymlinksAsync = function(path8, state, callback) {
      const { queue, options: { suppressErrors } } = state;
      queue.enqueue();
      fs_1.default.realpath(path8, (error, resolvedPath) => {
        if (error)
          return queue.dequeue(suppressErrors ? null : error, state);
        fs_1.default.stat(resolvedPath, (error2, stat) => {
          if (error2)
            return queue.dequeue(suppressErrors ? null : error2, state);
          if (stat.isDirectory() && isRecursive(path8, resolvedPath, state))
            return queue.dequeue(null, state);
          callback(stat, resolvedPath);
          queue.dequeue(null, state);
        });
      });
    };
    var resolveSymlinks = function(path8, state, callback) {
      const { queue, options: { suppressErrors } } = state;
      queue.enqueue();
      try {
        const resolvedPath = fs_1.default.realpathSync(path8);
        const stat = fs_1.default.statSync(resolvedPath);
        if (stat.isDirectory() && isRecursive(path8, resolvedPath, state))
          return;
        callback(stat, resolvedPath);
      } catch (e) {
        if (!suppressErrors)
          throw e;
      }
    };
    function build(options, isSynchronous) {
      if (!options.resolveSymlinks || options.excludeSymlinks)
        return null;
      return isSynchronous ? resolveSymlinks : resolveSymlinksAsync;
    }
    exports.build = build;
    function isRecursive(path8, resolved, state) {
      if (state.options.useRealPaths)
        return isRecursiveUsingRealPaths(resolved, state);
      let parent = (0, path_1.dirname)(path8);
      let depth = 1;
      while (parent !== state.root && depth < 2) {
        const resolvedPath = state.symlinks.get(parent);
        const isSameRoot = !!resolvedPath && (resolvedPath === resolved || resolvedPath.startsWith(resolved) || resolved.startsWith(resolvedPath));
        if (isSameRoot)
          depth++;
        else
          parent = (0, path_1.dirname)(parent);
      }
      state.symlinks.set(path8, resolved);
      return depth > 1;
    }
    function isRecursiveUsingRealPaths(resolved, state) {
      return state.visited.includes(resolved + state.options.pathSeparator);
    }
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/invoke-callback.js
var require_invoke_callback = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/invoke-callback.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.build = void 0;
    var onlyCountsSync = (state) => {
      return state.counts;
    };
    var groupsSync = (state) => {
      return state.groups;
    };
    var defaultSync = (state) => {
      return state.paths;
    };
    var limitFilesSync = (state) => {
      return state.paths.slice(0, state.options.maxFiles);
    };
    var onlyCountsAsync = (state, error, callback) => {
      report(error, callback, state.counts, state.options.suppressErrors);
      return null;
    };
    var defaultAsync = (state, error, callback) => {
      report(error, callback, state.paths, state.options.suppressErrors);
      return null;
    };
    var limitFilesAsync = (state, error, callback) => {
      report(error, callback, state.paths.slice(0, state.options.maxFiles), state.options.suppressErrors);
      return null;
    };
    var groupsAsync = (state, error, callback) => {
      report(error, callback, state.groups, state.options.suppressErrors);
      return null;
    };
    function report(error, callback, output, suppressErrors) {
      if (error && !suppressErrors)
        callback(error, output);
      else
        callback(null, output);
    }
    function build(options, isSynchronous) {
      const { onlyCounts, group, maxFiles } = options;
      if (onlyCounts)
        return isSynchronous ? onlyCountsSync : onlyCountsAsync;
      else if (group)
        return isSynchronous ? groupsSync : groupsAsync;
      else if (maxFiles)
        return isSynchronous ? limitFilesSync : limitFilesAsync;
      else
        return isSynchronous ? defaultSync : defaultAsync;
    }
    exports.build = build;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/walk-directory.js
var require_walk_directory = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/functions/walk-directory.js"(exports) {
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.build = void 0;
    var fs_1 = __importDefault(__require("fs"));
    var readdirOpts = { withFileTypes: true };
    var walkAsync = (state, crawlPath, directoryPath, currentDepth, callback) => {
      state.queue.enqueue();
      if (currentDepth < 0)
        return state.queue.dequeue(null, state);
      state.visited.push(crawlPath);
      state.counts.directories++;
      fs_1.default.readdir(crawlPath || ".", readdirOpts, (error, entries = []) => {
        callback(entries, directoryPath, currentDepth);
        state.queue.dequeue(state.options.suppressErrors ? null : error, state);
      });
    };
    var walkSync = (state, crawlPath, directoryPath, currentDepth, callback) => {
      if (currentDepth < 0)
        return;
      state.visited.push(crawlPath);
      state.counts.directories++;
      let entries = [];
      try {
        entries = fs_1.default.readdirSync(crawlPath || ".", readdirOpts);
      } catch (e) {
        if (!state.options.suppressErrors)
          throw e;
      }
      callback(entries, directoryPath, currentDepth);
    };
    function build(isSynchronous) {
      return isSynchronous ? walkSync : walkAsync;
    }
    exports.build = build;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/queue.js
var require_queue = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/queue.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Queue = void 0;
    var Queue = class {
      onQueueEmpty;
      count = 0;
      constructor(onQueueEmpty) {
        this.onQueueEmpty = onQueueEmpty;
      }
      enqueue() {
        this.count++;
        return this.count;
      }
      dequeue(error, output) {
        if (this.onQueueEmpty && (--this.count <= 0 || error)) {
          this.onQueueEmpty(error, output);
          if (error) {
            output.controller.abort();
            this.onQueueEmpty = void 0;
          }
        }
      }
    };
    exports.Queue = Queue;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/counter.js
var require_counter = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/counter.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Counter = void 0;
    var Counter = class {
      _files = 0;
      _directories = 0;
      set files(num) {
        this._files = num;
      }
      get files() {
        return this._files;
      }
      set directories(num) {
        this._directories = num;
      }
      get directories() {
        return this._directories;
      }
      /**
       * @deprecated use `directories` instead
       */
      /* c8 ignore next 3 */
      get dirs() {
        return this._directories;
      }
    };
    exports.Counter = Counter;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/walker.js
var require_walker = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/walker.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc2 = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc2 || ("get" in desc2 ? !m2.__esModule : desc2.writable || desc2.configurable)) {
        desc2 = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc2);
    } : function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Walker = void 0;
    var path_1 = __require("path");
    var utils_1 = require_utils();
    var joinPath = __importStar(require_join_path());
    var pushDirectory = __importStar(require_push_directory());
    var pushFile = __importStar(require_push_file());
    var getArray = __importStar(require_get_array());
    var groupFiles = __importStar(require_group_files());
    var resolveSymlink = __importStar(require_resolve_symlink());
    var invokeCallback = __importStar(require_invoke_callback());
    var walkDirectory = __importStar(require_walk_directory());
    var queue_1 = require_queue();
    var counter_1 = require_counter();
    var Walker = class {
      root;
      isSynchronous;
      state;
      joinPath;
      pushDirectory;
      pushFile;
      getArray;
      groupFiles;
      resolveSymlink;
      walkDirectory;
      callbackInvoker;
      constructor(root, options, callback) {
        this.isSynchronous = !callback;
        this.callbackInvoker = invokeCallback.build(options, this.isSynchronous);
        this.root = (0, utils_1.normalizePath)(root, options);
        this.state = {
          root: (0, utils_1.isRootDirectory)(this.root) ? this.root : this.root.slice(0, -1),
          // Perf: we explicitly tell the compiler to optimize for String arrays
          paths: [""].slice(0, 0),
          groups: [],
          counts: new counter_1.Counter(),
          options,
          queue: new queue_1.Queue((error, state) => this.callbackInvoker(state, error, callback)),
          symlinks: /* @__PURE__ */ new Map(),
          visited: [""].slice(0, 0),
          controller: new AbortController()
        };
        this.joinPath = joinPath.build(this.root, options);
        this.pushDirectory = pushDirectory.build(this.root, options);
        this.pushFile = pushFile.build(options);
        this.getArray = getArray.build(options);
        this.groupFiles = groupFiles.build(options);
        this.resolveSymlink = resolveSymlink.build(options, this.isSynchronous);
        this.walkDirectory = walkDirectory.build(this.isSynchronous);
      }
      start() {
        this.pushDirectory(this.root, this.state.paths, this.state.options.filters);
        this.walkDirectory(this.state, this.root, this.root, this.state.options.maxDepth, this.walk);
        return this.isSynchronous ? this.callbackInvoker(this.state, null) : null;
      }
      walk = (entries, directoryPath, depth) => {
        const { paths: paths2, options: { filters, resolveSymlinks, excludeSymlinks, exclude, maxFiles, signal, useRealPaths, pathSeparator }, controller } = this.state;
        if (controller.signal.aborted || signal && signal.aborted || maxFiles && paths2.length > maxFiles)
          return;
        const files = this.getArray(this.state.paths);
        for (let i = 0; i < entries.length; ++i) {
          const entry = entries[i];
          if (entry.isFile() || entry.isSymbolicLink() && !resolveSymlinks && !excludeSymlinks) {
            const filename = this.joinPath(entry.name, directoryPath);
            this.pushFile(filename, files, this.state.counts, filters);
          } else if (entry.isDirectory()) {
            let path8 = joinPath.joinDirectoryPath(entry.name, directoryPath, this.state.options.pathSeparator);
            if (exclude && exclude(entry.name, path8))
              continue;
            this.pushDirectory(path8, paths2, filters);
            this.walkDirectory(this.state, path8, path8, depth - 1, this.walk);
          } else if (this.resolveSymlink && entry.isSymbolicLink()) {
            let path8 = joinPath.joinPathWithBasePath(entry.name, directoryPath);
            this.resolveSymlink(path8, this.state, (stat, resolvedPath) => {
              if (stat.isDirectory()) {
                resolvedPath = (0, utils_1.normalizePath)(resolvedPath, this.state.options);
                if (exclude && exclude(entry.name, useRealPaths ? resolvedPath : path8 + pathSeparator))
                  return;
                this.walkDirectory(this.state, resolvedPath, useRealPaths ? resolvedPath : path8 + pathSeparator, depth - 1, this.walk);
              } else {
                resolvedPath = useRealPaths ? resolvedPath : path8;
                const filename = (0, path_1.basename)(resolvedPath);
                const directoryPath2 = (0, utils_1.normalizePath)((0, path_1.dirname)(resolvedPath), this.state.options);
                resolvedPath = this.joinPath(filename, directoryPath2);
                this.pushFile(resolvedPath, files, this.state.counts, filters);
              }
            });
          }
        }
        this.groupFiles(this.state.groups, directoryPath, files);
      };
    };
    exports.Walker = Walker;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/async.js
var require_async = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/async.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callback = exports.promise = void 0;
    var walker_1 = require_walker();
    function promise(root, options) {
      return new Promise((resolve, reject) => {
        callback(root, options, (err, output) => {
          if (err)
            return reject(err);
          resolve(output);
        });
      });
    }
    exports.promise = promise;
    function callback(root, options, callback2) {
      let walker = new walker_1.Walker(root, options, callback2);
      walker.start();
    }
    exports.callback = callback;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/sync.js
var require_sync = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/api/sync.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sync = void 0;
    var walker_1 = require_walker();
    function sync(root, options) {
      const walker = new walker_1.Walker(root, options);
      return walker.start();
    }
    exports.sync = sync;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/builder/api-builder.js
var require_api_builder = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/builder/api-builder.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.APIBuilder = void 0;
    var async_1 = require_async();
    var sync_1 = require_sync();
    var APIBuilder = class {
      root;
      options;
      constructor(root, options) {
        this.root = root;
        this.options = options;
      }
      withPromise() {
        return (0, async_1.promise)(this.root, this.options);
      }
      withCallback(cb) {
        (0, async_1.callback)(this.root, this.options, cb);
      }
      sync() {
        return (0, sync_1.sync)(this.root, this.options);
      }
    };
    exports.APIBuilder = APIBuilder;
  }
});

// ../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/constants.js
var require_constants = __commonJS({
  "../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/constants.js"(exports, module) {
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
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

// ../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/utils.js
var require_utils2 = __commonJS({
  "../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/utils.js"(exports) {
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
    exports.basename = (path8, { windows } = {}) => {
      const segs = path8.split(windows ? /[\\/]/ : "/");
      const last = segs[segs.length - 1];
      if (last === "") {
        return segs[segs.length - 2];
      }
      return last;
    };
  }
});

// ../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/scan.js"(exports, module) {
    var utils = require_utils2();
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

// ../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/parse.js
var require_parse = __commonJS({
  "../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/parse.js"(exports, module) {
    var constants = require_constants();
    var utils = require_utils2();
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
    var parse2 = (input, options) => {
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
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
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
            const expression = parse2(rest, { ...options, fastpaths: false }).output;
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
        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m2, esc, chars, first, rest, index) => {
          if (first === "\\") {
            backslashes = true;
            return m2;
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
          return esc ? m2 : `\\${m2}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m2) => {
              return m2.length % 2 === 0 ? "\\\\" : m2 ? "\\" : "";
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
    parse2.fastpaths = (input, options) => {
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
    module.exports = parse2;
  }
});

// ../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/picomatch.js"(exports, module) {
    var scan = require_scan();
    var parse2 = require_parse();
    var utils = require_utils2();
    var constants = require_constants();
    var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input) => picomatch(input, options, returnState));
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
      const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
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
    picomatch.test = (input, regex, options, { glob, posix } = {}) => {
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
          match = picomatch.matchBase(input, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch.matchBase = (input, glob, options) => {
      const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
      return regex.test(utils.basename(input));
    };
    picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    picomatch.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p2) => picomatch.parse(p2, options));
      return parse2(pattern, { ...options, fastpaths: false });
    };
    picomatch.scan = (input, options) => scan(input, options);
    picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
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
      const regex = picomatch.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse2.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse2(input, options);
      }
      return picomatch.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch.constants = constants;
    module.exports = picomatch;
  }
});

// ../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/index.js"(exports, module) {
    var pico = require_picomatch();
    var utils = require_utils2();
    function picomatch(glob, options, returnState = false) {
      if (options && (options.windows === null || options.windows === void 0)) {
        options = { ...options, windows: utils.isWindows() };
      }
      return pico(glob, options, returnState);
    }
    Object.assign(picomatch, pico);
    module.exports = picomatch;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/builder/index.js
var require_builder = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/builder/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Builder = void 0;
    var path_1 = __require("path");
    var api_builder_1 = require_api_builder();
    var pm = null;
    try {
      __require.resolve("picomatch");
      pm = require_picomatch2();
    } catch (_e) {
    }
    var Builder = class {
      globCache = {};
      options = {
        maxDepth: Infinity,
        suppressErrors: true,
        pathSeparator: path_1.sep,
        filters: []
      };
      globFunction;
      constructor(options) {
        this.options = { ...this.options, ...options };
        this.globFunction = this.options.globFunction;
      }
      group() {
        this.options.group = true;
        return this;
      }
      withPathSeparator(separator) {
        this.options.pathSeparator = separator;
        return this;
      }
      withBasePath() {
        this.options.includeBasePath = true;
        return this;
      }
      withRelativePaths() {
        this.options.relativePaths = true;
        return this;
      }
      withDirs() {
        this.options.includeDirs = true;
        return this;
      }
      withMaxDepth(depth) {
        this.options.maxDepth = depth;
        return this;
      }
      withMaxFiles(limit) {
        this.options.maxFiles = limit;
        return this;
      }
      withFullPaths() {
        this.options.resolvePaths = true;
        this.options.includeBasePath = true;
        return this;
      }
      withErrors() {
        this.options.suppressErrors = false;
        return this;
      }
      withSymlinks({ resolvePaths = true } = {}) {
        this.options.resolveSymlinks = true;
        this.options.useRealPaths = resolvePaths;
        return this.withFullPaths();
      }
      withAbortSignal(signal) {
        this.options.signal = signal;
        return this;
      }
      normalize() {
        this.options.normalizePath = true;
        return this;
      }
      filter(predicate) {
        this.options.filters.push(predicate);
        return this;
      }
      onlyDirs() {
        this.options.excludeFiles = true;
        this.options.includeDirs = true;
        return this;
      }
      exclude(predicate) {
        this.options.exclude = predicate;
        return this;
      }
      onlyCounts() {
        this.options.onlyCounts = true;
        return this;
      }
      crawl(root) {
        return new api_builder_1.APIBuilder(root || ".", this.options);
      }
      withGlobFunction(fn) {
        this.globFunction = fn;
        return this;
      }
      /**
       * @deprecated Pass options using the constructor instead:
       * ```ts
       * new fdir(options).crawl("/path/to/root");
       * ```
       * This method will be removed in v7.0
       */
      /* c8 ignore next 4 */
      crawlWithOptions(root, options) {
        this.options = { ...this.options, ...options };
        return new api_builder_1.APIBuilder(root || ".", this.options);
      }
      glob(...patterns) {
        if (this.globFunction) {
          return this.globWithOptions(patterns);
        }
        return this.globWithOptions(patterns, ...[{ dot: true }]);
      }
      globWithOptions(patterns, ...options) {
        const globFn = this.globFunction || pm;
        if (!globFn) {
          throw new Error("Please specify a glob function to use glob matching.");
        }
        var isMatch = this.globCache[patterns.join("\0")];
        if (!isMatch) {
          isMatch = globFn(patterns, ...options);
          this.globCache[patterns.join("\0")] = isMatch;
        }
        this.options.filters.push((path8) => isMatch(path8));
        return this;
      }
    };
    exports.Builder = Builder;
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/types.js
var require_types = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/types.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/index.js
var require_dist = __commonJS({
  "../node_modules/.pnpm/fdir@6.4.6_picomatch@4.0.3/node_modules/fdir/dist/index.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc2 = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc2 || ("get" in desc2 ? !m2.__esModule : desc2.writable || desc2.configurable)) {
        desc2 = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc2);
    } : function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m2, exports2) {
      for (var p2 in m2) if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2)) __createBinding(exports2, m2, p2);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fdir = void 0;
    var builder_1 = require_builder();
    Object.defineProperty(exports, "fdir", { enumerable: true, get: function() {
      return builder_1.Builder;
    } });
    __exportStar(require_types(), exports);
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/ls.js
var require_ls = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/ls.js"(exports, module) {
    var { fdir: Fdir } = require_dist();
    var path8 = __require("path");
    var picomatch = require_picomatch2();
    var Ls = class {
      constructor(directory = "./", envFile = [".env*"], excludeEnvFile = []) {
        this.ignore = ["node_modules/**", ".git/**"];
        this.cwd = path8.resolve(directory);
        this.envFile = envFile;
        this.excludeEnvFile = excludeEnvFile;
      }
      run() {
        return this._filepaths();
      }
      _filepaths() {
        const exclude = picomatch(this._exclude());
        const include = picomatch(this._patterns(), {
          ignore: this._exclude()
        });
        return new Fdir().withRelativePaths().exclude((dir, path9) => exclude(path9)).filter((path9) => include(path9)).crawl(this.cwd).sync();
      }
      _patterns() {
        if (!Array.isArray(this.envFile)) {
          return [`**/${this.envFile}`];
        }
        return this.envFile.map((part) => `**/${part}`);
      }
      _excludePatterns() {
        if (!Array.isArray(this.excludeEnvFile)) {
          return [`**/${this.excludeEnvFile}`];
        }
        return this.excludeEnvFile.map((part) => `**/${part}`);
      }
      _exclude() {
        if (this._excludePatterns().length > 0) {
          return this.ignore.concat(this._excludePatterns());
        } else {
          return this.ignore;
        }
      }
    };
    module.exports = Ls;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/fsx.js
var require_fsx = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/fsx.js"(exports, module) {
    var fs6 = __require("fs");
    var ENCODING = "utf8";
    function readFileX(filepath, encoding = null) {
      if (!encoding) {
        encoding = ENCODING;
      }
      return fs6.readFileSync(filepath, encoding);
    }
    function writeFileX(filepath, str) {
      return fs6.writeFileSync(filepath, str, ENCODING);
    }
    var fsx = {
      chmodSync: fs6.chmodSync,
      existsSync: fs6.existsSync,
      readdirSync: fs6.readdirSync,
      readFileSync: fs6.readFileSync,
      writeFileSync: fs6.writeFileSync,
      appendFileSync: fs6.appendFileSync,
      // fsx special commands
      readFileX,
      writeFileX
    };
    module.exports = fsx;
  }
});

// ../node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/package.json
var require_package2 = __commonJS({
  "../node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "16.6.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// ../node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "../node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/main.js"(exports, module) {
    var fs6 = __require("fs");
    var path8 = __require("path");
    var os2 = __require("os");
    var crypto2 = __require("crypto");
    var packageJson = require_package2();
    var version2 = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse2(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.log(`[dotenv@${version2}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version2}][DEBUG] ${message}`);
    }
    function _log(message) {
      console.log(`[dotenv@${version2}] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs6.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path8.resolve(process.cwd(), ".env.vault");
      }
      if (fs6.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath2) {
      return envPath2[0] === "~" ? path8.join(os2.homedir(), envPath2.slice(1)) : envPath2;
    }
    function _configVault(options) {
      const debug2 = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (debug2 || !quiet) {
        _log("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path8.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug2 = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug2) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path9 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs6.readFileSync(path9, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug2) {
            _debug(`Failed to load ${path9} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (debug2 || !quiet) {
        const keysCount = Object.keys(parsedAll).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path8.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug2) {
              _debug(`Failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config3(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto2.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug2 = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug2) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config3,
      decrypt,
      parse: parse2,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/parseEncryptionKeyFromDotenvKey.js
var require_parseEncryptionKeyFromDotenvKey = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/parseEncryptionKeyFromDotenvKey.js"(exports, module) {
    function parseEncryptionKeyFromDotenvKey(dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (e) {
        throw new Error("INVALID_DOTENV_KEY: Incomplete format. It should be a dotenv uri. (dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development)");
      }
      const key = uri.password;
      if (!key) {
        throw new Error("INVALID_DOTENV_KEY: Missing key part");
      }
      return Buffer.from(key.slice(-64), "hex");
    }
    module.exports = parseEncryptionKeyFromDotenvKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/decrypt.js
var require_decrypt = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/decrypt.js"(exports, module) {
    var dotenv = require_main();
    var parseEncryptionKeyFromDotenvKey = require_parseEncryptionKeyFromDotenvKey();
    function decrypt(ciphertext, dotenvKey) {
      const key = parseEncryptionKeyFromDotenvKey(dotenvKey);
      try {
        return dotenv.decrypt(ciphertext, key);
      } catch (e) {
        if (e.code === "DECRYPTION_FAILED") {
          const error = new Error("[DECRYPTION_FAILED] Unable to decrypt .env.vault with DOTENV_KEY.");
          error.code = "DECRYPTION_FAILED";
          error.help = "[DECRYPTION_FAILED] Run with debug flag [dotenvx run --debug -- yourcommand] or manually run [echo $DOTENV_KEY] to compare it to the one in .env.keys.";
          error.debug = `[DECRYPTION_FAILED] DOTENV_KEY is ${dotenvKey}`;
          throw error;
        }
        if (e.code === "ERR_CRYPTO_INVALID_AUTH_TAG") {
          const error = new Error("[INVALID_CIPHERTEXT] Unable to decrypt what appears to be invalid ciphertext.");
          error.code = "INVALID_CIPHERTEXT";
          error.help = "[INVALID_CIPHERTEXT] Run with debug flag [dotenvx run --debug -- yourcommand] or manually check .env.vault.";
          error.debug = `[INVALID_CIPHERTEXT] ciphertext is '${ciphertext}'`;
          throw error;
        }
        throw e;
      }
    }
    module.exports = decrypt;
  }
});

// ../node_modules/.pnpm/@noble+ciphers@1.3.0/node_modules/@noble/ciphers/utils.js
var require_utils3 = __commonJS({
  "../node_modules/.pnpm/@noble+ciphers@1.3.0/node_modules/@noble/ciphers/utils.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapCipher = exports.Hash = exports.nextTick = exports.isLE = void 0;
    exports.isBytes = isBytes;
    exports.abool = abool;
    exports.anumber = anumber;
    exports.abytes = abytes;
    exports.ahash = ahash;
    exports.aexists = aexists;
    exports.aoutput = aoutput;
    exports.u8 = u8;
    exports.u32 = u32;
    exports.clean = clean;
    exports.createView = createView;
    exports.bytesToHex = bytesToHex;
    exports.hexToBytes = hexToBytes;
    exports.hexToNumber = hexToNumber;
    exports.bytesToNumberBE = bytesToNumberBE;
    exports.numberToBytesBE = numberToBytesBE;
    exports.utf8ToBytes = utf8ToBytes;
    exports.bytesToUtf8 = bytesToUtf8;
    exports.toBytes = toBytes;
    exports.overlapBytes = overlapBytes;
    exports.complexOverlapBytes = complexOverlapBytes;
    exports.concatBytes = concatBytes;
    exports.checkOpts = checkOpts;
    exports.equalBytes = equalBytes;
    exports.getOutput = getOutput;
    exports.setBigUint64 = setBigUint64;
    exports.u64Lengths = u64Lengths;
    exports.isAligned32 = isAligned32;
    exports.copyBytes = copyBytes;
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function abool(b2) {
      if (typeof b2 !== "boolean")
        throw new Error(`boolean expected, not ${b2}`);
    }
    function anumber(n) {
      if (!Number.isSafeInteger(n) || n < 0)
        throw new Error("positive integer expected, got " + n);
    }
    function abytes(b2, ...lengths) {
      if (!isBytes(b2))
        throw new Error("Uint8Array expected");
      if (lengths.length > 0 && !lengths.includes(b2.length))
        throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b2.length);
    }
    function ahash(h) {
      if (typeof h !== "function" || typeof h.create !== "function")
        throw new Error("Hash should be wrapped by utils.createHasher");
      anumber(h.outputLen);
      anumber(h.blockLen);
    }
    function aexists(instance, checkFinished = true) {
      if (instance.destroyed)
        throw new Error("Hash instance has been destroyed");
      if (checkFinished && instance.finished)
        throw new Error("Hash#digest() has already been called");
    }
    function aoutput(out, instance) {
      abytes(out);
      const min = instance.outputLen;
      if (out.length < min) {
        throw new Error("digestInto() expects output buffer of length at least " + min);
      }
    }
    function u8(arr) {
      return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function u32(arr) {
      return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    }
    function clean(...arrays) {
      for (let i = 0; i < arrays.length; i++) {
        arrays[i].fill(0);
      }
    }
    function createView(arr) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    var hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      abytes(bytes);
      if (hasHexBuiltin)
        return bytes.toHex();
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      if (hasHexBuiltin)
        return Uint8Array.fromHex(hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    function hexToNumber(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      return BigInt(hex === "" ? "0" : "0x" + hex);
    }
    function bytesToNumberBE(bytes) {
      return hexToNumber(bytesToHex(bytes));
    }
    function numberToBytesBE(n, len) {
      return hexToBytes(n.toString(16).padStart(len * 2, "0"));
    }
    var nextTick = async () => {
    };
    exports.nextTick = nextTick;
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function bytesToUtf8(bytes) {
      return new TextDecoder().decode(bytes);
    }
    function toBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      else if (isBytes(data))
        data = copyBytes(data);
      else
        throw new Error("Uint8Array expected, got " + typeof data);
      return data;
    }
    function overlapBytes(a, b2) {
      return a.buffer === b2.buffer && // best we can do, may fail with an obscure Proxy
      a.byteOffset < b2.byteOffset + b2.byteLength && // a starts before b end
      b2.byteOffset < a.byteOffset + a.byteLength;
    }
    function complexOverlapBytes(input, output) {
      if (overlapBytes(input, output) && input.byteOffset < output.byteOffset)
        throw new Error("complex overlap of input and output is not supported");
    }
    function concatBytes(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    function checkOpts(defaults, opts) {
      if (opts == null || typeof opts !== "object")
        throw new Error("options must be defined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    function equalBytes(a, b2) {
      if (a.length !== b2.length)
        return false;
      let diff = 0;
      for (let i = 0; i < a.length; i++)
        diff |= a[i] ^ b2[i];
      return diff === 0;
    }
    var Hash = class {
    };
    exports.Hash = Hash;
    var wrapCipher = /* @__NO_SIDE_EFFECTS__ */ (params, constructor) => {
      function wrappedCipher(key, ...args) {
        abytes(key);
        if (!exports.isLE)
          throw new Error("Non little-endian hardware is not yet supported");
        if (params.nonceLength !== void 0) {
          const nonce = args[0];
          if (!nonce)
            throw new Error("nonce / iv required");
          if (params.varSizeNonce)
            abytes(nonce);
          else
            abytes(nonce, params.nonceLength);
        }
        const tagl = params.tagLength;
        if (tagl && args[1] !== void 0) {
          abytes(args[1]);
        }
        const cipher = constructor(key, ...args);
        const checkOutput = (fnLength, output) => {
          if (output !== void 0) {
            if (fnLength !== 2)
              throw new Error("cipher output not supported");
            abytes(output);
          }
        };
        let called = false;
        const wrCipher = {
          encrypt(data, output) {
            if (called)
              throw new Error("cannot encrypt() twice with same key + nonce");
            called = true;
            abytes(data);
            checkOutput(cipher.encrypt.length, output);
            return cipher.encrypt(data, output);
          },
          decrypt(data, output) {
            abytes(data);
            if (tagl && data.length < tagl)
              throw new Error("invalid ciphertext length: smaller than tagLength=" + tagl);
            checkOutput(cipher.decrypt.length, output);
            return cipher.decrypt(data, output);
          }
        };
        return wrCipher;
      }
      Object.assign(wrappedCipher, params);
      return wrappedCipher;
    };
    exports.wrapCipher = wrapCipher;
    function getOutput(expectedLength, out, onlyAligned = true) {
      if (out === void 0)
        return new Uint8Array(expectedLength);
      if (out.length !== expectedLength)
        throw new Error("invalid output length, expected " + expectedLength + ", got: " + out.length);
      if (onlyAligned && !isAligned32(out))
        throw new Error("invalid output, must be aligned");
      return out;
    }
    function setBigUint64(view, byteOffset, value, isLE) {
      if (typeof view.setBigUint64 === "function")
        return view.setBigUint64(byteOffset, value, isLE);
      const _32n = BigInt(32);
      const _u32_max = BigInt(4294967295);
      const wh = Number(value >> _32n & _u32_max);
      const wl = Number(value & _u32_max);
      const h = isLE ? 4 : 0;
      const l = isLE ? 0 : 4;
      view.setUint32(byteOffset + h, wh, isLE);
      view.setUint32(byteOffset + l, wl, isLE);
    }
    function u64Lengths(dataLength, aadLength, isLE) {
      abool(isLE);
      const num = new Uint8Array(16);
      const view = createView(num);
      setBigUint64(view, 0, BigInt(aadLength), isLE);
      setBigUint64(view, 8, BigInt(dataLength), isLE);
      return num;
    }
    function isAligned32(bytes) {
      return bytes.byteOffset % 4 === 0;
    }
    function copyBytes(bytes) {
      return Uint8Array.from(bytes);
    }
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/consts.js
var require_consts = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/consts.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AEAD_TAG_LENGTH = exports.XCHACHA20_NONCE_LENGTH = exports.CURVE25519_PUBLIC_KEY_SIZE = exports.ETH_PUBLIC_KEY_SIZE = exports.UNCOMPRESSED_PUBLIC_KEY_SIZE = exports.COMPRESSED_PUBLIC_KEY_SIZE = exports.SECRET_KEY_LENGTH = void 0;
    exports.SECRET_KEY_LENGTH = 32;
    exports.COMPRESSED_PUBLIC_KEY_SIZE = 33;
    exports.UNCOMPRESSED_PUBLIC_KEY_SIZE = 65;
    exports.ETH_PUBLIC_KEY_SIZE = 64;
    exports.CURVE25519_PUBLIC_KEY_SIZE = 32;
    exports.XCHACHA20_NONCE_LENGTH = 24;
    exports.AEAD_TAG_LENGTH = 16;
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/config.js
var require_config = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/config.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ephemeralKeySize = exports.symmetricNonceLength = exports.symmetricAlgorithm = exports.isHkdfKeyCompressed = exports.isEphemeralKeyCompressed = exports.ellipticCurve = exports.ECIES_CONFIG = void 0;
    var consts_1 = require_consts();
    var Config = (
      /** @class */
      /* @__PURE__ */ function() {
        function Config2() {
          this.ellipticCurve = "secp256k1";
          this.isEphemeralKeyCompressed = false;
          this.isHkdfKeyCompressed = false;
          this.symmetricAlgorithm = "aes-256-gcm";
          this.symmetricNonceLength = 16;
        }
        return Config2;
      }()
    );
    exports.ECIES_CONFIG = new Config();
    var ellipticCurve = function() {
      return exports.ECIES_CONFIG.ellipticCurve;
    };
    exports.ellipticCurve = ellipticCurve;
    var isEphemeralKeyCompressed = function() {
      return exports.ECIES_CONFIG.isEphemeralKeyCompressed;
    };
    exports.isEphemeralKeyCompressed = isEphemeralKeyCompressed;
    var isHkdfKeyCompressed = function() {
      return exports.ECIES_CONFIG.isHkdfKeyCompressed;
    };
    exports.isHkdfKeyCompressed = isHkdfKeyCompressed;
    var symmetricAlgorithm = function() {
      return exports.ECIES_CONFIG.symmetricAlgorithm;
    };
    exports.symmetricAlgorithm = symmetricAlgorithm;
    var symmetricNonceLength = function() {
      return exports.ECIES_CONFIG.symmetricNonceLength;
    };
    exports.symmetricNonceLength = symmetricNonceLength;
    var ephemeralKeySize = function() {
      var mapping = {
        secp256k1: exports.ECIES_CONFIG.isEphemeralKeyCompressed ? consts_1.COMPRESSED_PUBLIC_KEY_SIZE : consts_1.UNCOMPRESSED_PUBLIC_KEY_SIZE,
        x25519: consts_1.CURVE25519_PUBLIC_KEY_SIZE,
        ed25519: consts_1.CURVE25519_PUBLIC_KEY_SIZE
      };
      if (exports.ECIES_CONFIG.ellipticCurve in mapping) {
        return mapping[exports.ECIES_CONFIG.ellipticCurve];
      } else {
        throw new Error("Not implemented");
      }
    };
    exports.ephemeralKeySize = ephemeralKeySize;
  }
});

// ../node_modules/.pnpm/@noble+ciphers@1.3.0/node_modules/@noble/ciphers/cryptoNode.js
var require_cryptoNode = __commonJS({
  "../node_modules/.pnpm/@noble+ciphers@1.3.0/node_modules/@noble/ciphers/cryptoNode.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crypto = void 0;
    var nc = __require("node:crypto");
    exports.crypto = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : nc && typeof nc === "object" && "randomBytes" in nc ? nc : void 0;
  }
});

// ../node_modules/.pnpm/@noble+ciphers@1.3.0/node_modules/@noble/ciphers/webcrypto.js
var require_webcrypto = __commonJS({
  "../node_modules/.pnpm/@noble+ciphers@1.3.0/node_modules/@noble/ciphers/webcrypto.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gcm = exports.ctr = exports.cbc = exports.utils = void 0;
    exports.randomBytes = randomBytes;
    exports.getWebcryptoSubtle = getWebcryptoSubtle;
    exports.managedNonce = managedNonce;
    var crypto_1 = require_cryptoNode();
    var utils_ts_1 = require_utils3();
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
    function getWebcryptoSubtle() {
      if (crypto_1.crypto && typeof crypto_1.crypto.subtle === "object" && crypto_1.crypto.subtle != null)
        return crypto_1.crypto.subtle;
      throw new Error("crypto.subtle must be defined");
    }
    function managedNonce(fn) {
      const { nonceLength } = fn;
      (0, utils_ts_1.anumber)(nonceLength);
      return (key, ...args) => ({
        encrypt(plaintext, ...argsEnc) {
          const nonce = randomBytes(nonceLength);
          const ciphertext = fn(key, nonce, ...args).encrypt(plaintext, ...argsEnc);
          const out = (0, utils_ts_1.concatBytes)(nonce, ciphertext);
          ciphertext.fill(0);
          return out;
        },
        decrypt(ciphertext, ...argsDec) {
          const nonce = ciphertext.subarray(0, nonceLength);
          const data = ciphertext.subarray(nonceLength);
          return fn(key, nonce, ...args).decrypt(data, ...argsDec);
        }
      });
    }
    exports.utils = {
      async encrypt(key, keyParams, cryptParams, plaintext) {
        const cr = getWebcryptoSubtle();
        const iKey = await cr.importKey("raw", key, keyParams, true, ["encrypt"]);
        const ciphertext = await cr.encrypt(cryptParams, iKey, plaintext);
        return new Uint8Array(ciphertext);
      },
      async decrypt(key, keyParams, cryptParams, ciphertext) {
        const cr = getWebcryptoSubtle();
        const iKey = await cr.importKey("raw", key, keyParams, true, ["decrypt"]);
        const plaintext = await cr.decrypt(cryptParams, iKey, ciphertext);
        return new Uint8Array(plaintext);
      }
    };
    var mode = {
      CBC: "AES-CBC",
      CTR: "AES-CTR",
      GCM: "AES-GCM"
    };
    function getCryptParams(algo, nonce, AAD) {
      if (algo === mode.CBC)
        return { name: mode.CBC, iv: nonce };
      if (algo === mode.CTR)
        return { name: mode.CTR, counter: nonce, length: 64 };
      if (algo === mode.GCM) {
        if (AAD)
          return { name: mode.GCM, iv: nonce, additionalData: AAD };
        else
          return { name: mode.GCM, iv: nonce };
      }
      throw new Error("unknown aes block mode");
    }
    function generate(algo) {
      return (key, nonce, AAD) => {
        (0, utils_ts_1.abytes)(key);
        (0, utils_ts_1.abytes)(nonce);
        const keyParams = { name: algo, length: key.length * 8 };
        const cryptParams = getCryptParams(algo, nonce, AAD);
        let consumed = false;
        return {
          // keyLength,
          encrypt(plaintext) {
            (0, utils_ts_1.abytes)(plaintext);
            if (consumed)
              throw new Error("Cannot encrypt() twice with same key / nonce");
            consumed = true;
            return exports.utils.encrypt(key, keyParams, cryptParams, plaintext);
          },
          decrypt(ciphertext) {
            (0, utils_ts_1.abytes)(ciphertext);
            return exports.utils.decrypt(key, keyParams, cryptParams, ciphertext);
          }
        };
      };
    }
    exports.cbc = (() => generate(mode.CBC))();
    exports.ctr = (() => generate(mode.CTR))();
    exports.gcm = /* @__PURE__ */ (() => generate(mode.GCM))();
  }
});

// ../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/cryptoNode.js
var require_cryptoNode2 = __commonJS({
  "../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/cryptoNode.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.crypto = void 0;
    var nc = __require("node:crypto");
    exports.crypto = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : nc && typeof nc === "object" && "randomBytes" in nc ? nc : void 0;
  }
});

// ../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/utils.js
var require_utils4 = __commonJS({
  "../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/utils.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.Hash = exports.nextTick = exports.swap32IfBE = exports.byteSwapIfBE = exports.swap8IfBE = exports.isLE = void 0;
    exports.isBytes = isBytes;
    exports.anumber = anumber;
    exports.abytes = abytes;
    exports.ahash = ahash;
    exports.aexists = aexists;
    exports.aoutput = aoutput;
    exports.u8 = u8;
    exports.u32 = u32;
    exports.clean = clean;
    exports.createView = createView;
    exports.rotr = rotr;
    exports.rotl = rotl;
    exports.byteSwap = byteSwap;
    exports.byteSwap32 = byteSwap32;
    exports.bytesToHex = bytesToHex;
    exports.hexToBytes = hexToBytes;
    exports.asyncLoop = asyncLoop;
    exports.utf8ToBytes = utf8ToBytes;
    exports.bytesToUtf8 = bytesToUtf8;
    exports.toBytes = toBytes;
    exports.kdfInputToBytes = kdfInputToBytes;
    exports.concatBytes = concatBytes;
    exports.checkOpts = checkOpts;
    exports.createHasher = createHasher;
    exports.createOptHasher = createOptHasher;
    exports.createXOFer = createXOFer;
    exports.randomBytes = randomBytes;
    var crypto_1 = require_cryptoNode2();
    function isBytes(a) {
      return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
    }
    function anumber(n) {
      if (!Number.isSafeInteger(n) || n < 0)
        throw new Error("positive integer expected, got " + n);
    }
    function abytes(b2, ...lengths) {
      if (!isBytes(b2))
        throw new Error("Uint8Array expected");
      if (lengths.length > 0 && !lengths.includes(b2.length))
        throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b2.length);
    }
    function ahash(h) {
      if (typeof h !== "function" || typeof h.create !== "function")
        throw new Error("Hash should be wrapped by utils.createHasher");
      anumber(h.outputLen);
      anumber(h.blockLen);
    }
    function aexists(instance, checkFinished = true) {
      if (instance.destroyed)
        throw new Error("Hash instance has been destroyed");
      if (checkFinished && instance.finished)
        throw new Error("Hash#digest() has already been called");
    }
    function aoutput(out, instance) {
      abytes(out);
      const min = instance.outputLen;
      if (out.length < min) {
        throw new Error("digestInto() expects output buffer of length at least " + min);
      }
    }
    function u8(arr) {
      return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function u32(arr) {
      return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    }
    function clean(...arrays) {
      for (let i = 0; i < arrays.length; i++) {
        arrays[i].fill(0);
      }
    }
    function createView(arr) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    function rotr(word, shift) {
      return word << 32 - shift | word >>> shift;
    }
    function rotl(word, shift) {
      return word << shift | word >>> 32 - shift >>> 0;
    }
    exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    function byteSwap(word) {
      return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
    }
    exports.swap8IfBE = exports.isLE ? (n) => n : (n) => byteSwap(n);
    exports.byteSwapIfBE = exports.swap8IfBE;
    function byteSwap32(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
      }
      return arr;
    }
    exports.swap32IfBE = exports.isLE ? (u) => u : byteSwap32;
    var hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex(bytes) {
      abytes(bytes);
      if (hasHexBuiltin)
        return bytes.toHex();
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
      }
      return hex;
    }
    var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    function asciiToBase16(ch) {
      if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0;
      if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10);
      if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10);
      return;
    }
    function hexToBytes(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      if (hasHexBuiltin)
        return Uint8Array.fromHex(hex);
      const hl = hex.length;
      const al = hl / 2;
      if (hl % 2)
        throw new Error("hex string expected, got unpadded hex of length " + hl);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    var nextTick = async () => {
    };
    exports.nextTick = nextTick;
    async function asyncLoop(iters, tick, cb) {
      let ts = Date.now();
      for (let i = 0; i < iters; i++) {
        cb(i);
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
          continue;
        await (0, exports.nextTick)();
        ts += diff;
      }
    }
    function utf8ToBytes(str) {
      if (typeof str !== "string")
        throw new Error("string expected");
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function bytesToUtf8(bytes) {
      return new TextDecoder().decode(bytes);
    }
    function toBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      abytes(data);
      return data;
    }
    function kdfInputToBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes(data);
      abytes(data);
      return data;
    }
    function concatBytes(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    function checkOpts(defaults, opts) {
      if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
        throw new Error("options should be object or undefined");
      const merged = Object.assign(defaults, opts);
      return merged;
    }
    var Hash = class {
    };
    exports.Hash = Hash;
    function createHasher(hashCons) {
      const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    function createOptHasher(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function createXOFer(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    exports.wrapConstructor = createHasher;
    exports.wrapConstructorWithOpts = createOptHasher;
    exports.wrapXOFConstructorWithOpts = createXOFer;
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
  }
});

// ../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/_md.js
var require_md = __commonJS({
  "../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/_md.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SHA512_IV = exports.SHA384_IV = exports.SHA224_IV = exports.SHA256_IV = exports.HashMD = void 0;
    exports.setBigUint64 = setBigUint64;
    exports.Chi = Chi;
    exports.Maj = Maj;
    var utils_ts_1 = require_utils4();
    function setBigUint64(view, byteOffset, value, isLE) {
      if (typeof view.setBigUint64 === "function")
        return view.setBigUint64(byteOffset, value, isLE);
      const _32n = BigInt(32);
      const _u32_max = BigInt(4294967295);
      const wh = Number(value >> _32n & _u32_max);
      const wl = Number(value & _u32_max);
      const h = isLE ? 4 : 0;
      const l = isLE ? 0 : 4;
      view.setUint32(byteOffset + h, wh, isLE);
      view.setUint32(byteOffset + l, wl, isLE);
    }
    function Chi(a, b2, c2) {
      return a & b2 ^ ~a & c2;
    }
    function Maj(a, b2, c2) {
      return a & b2 ^ a & c2 ^ b2 & c2;
    }
    var HashMD = class extends utils_ts_1.Hash {
      constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0, utils_ts_1.createView)(this.buffer);
      }
      update(data) {
        (0, utils_ts_1.aexists)(this);
        data = (0, utils_ts_1.toBytes)(data);
        (0, utils_ts_1.abytes)(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = (0, utils_ts_1.createView)(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        (0, utils_ts_1.aexists)(this);
        (0, utils_ts_1.aoutput)(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        (0, utils_ts_1.clean)(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = (0, utils_ts_1.createView)(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    exports.HashMD = HashMD;
    exports.SHA256_IV = Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    exports.SHA224_IV = Uint32Array.from([
      3238371032,
      914150663,
      812702999,
      4144912697,
      4290775857,
      1750603025,
      1694076839,
      3204075428
    ]);
    exports.SHA384_IV = Uint32Array.from([
      3418070365,
      3238371032,
      1654270250,
      914150663,
      2438529370,
      812702999,
      355462360,
      4144912697,
      1731405415,
      4290775857,
      2394180231,
      1750603025,
      3675008525,
      1694076839,
      1203062813,
      3204075428
    ]);
    exports.SHA512_IV = Uint32Array.from([
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ]);
  }
});

// ../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/_u64.js
var require_u64 = __commonJS({
  "../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/_u64.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toBig = exports.shrSL = exports.shrSH = exports.rotrSL = exports.rotrSH = exports.rotrBL = exports.rotrBH = exports.rotr32L = exports.rotr32H = exports.rotlSL = exports.rotlSH = exports.rotlBL = exports.rotlBH = exports.add5L = exports.add5H = exports.add4L = exports.add4H = exports.add3L = exports.add3H = void 0;
    exports.add = add;
    exports.fromBig = fromBig;
    exports.split = split;
    var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    var _32n = /* @__PURE__ */ BigInt(32);
    function fromBig(n, le = false) {
      if (le)
        return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
      return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
    }
    function split(lst, le = false) {
      const len = lst.length;
      let Ah = new Uint32Array(len);
      let Al = new Uint32Array(len);
      for (let i = 0; i < len; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
      }
      return [Ah, Al];
    }
    var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
    exports.toBig = toBig;
    var shrSH = (h, _l, s) => h >>> s;
    exports.shrSH = shrSH;
    var shrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports.shrSL = shrSL;
    var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    exports.rotrSH = rotrSH;
    var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    exports.rotrSL = rotrSL;
    var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    exports.rotrBH = rotrBH;
    var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    exports.rotrBL = rotrBL;
    var rotr32H = (_h, l) => l;
    exports.rotr32H = rotr32H;
    var rotr32L = (h, _l) => h;
    exports.rotr32L = rotr32L;
    var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
    exports.rotlSH = rotlSH;
    var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
    exports.rotlSL = rotlSL;
    var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
    exports.rotlBH = rotlBH;
    var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
    exports.rotlBL = rotlBL;
    function add(Ah, Al, Bh, Bl) {
      const l = (Al >>> 0) + (Bl >>> 0);
      return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
    }
    var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    exports.add3L = add3L;
    var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    exports.add3H = add3H;
    var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    exports.add4L = add4L;
    var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    exports.add4H = add4H;
    var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    exports.add5L = add5L;
    var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    exports.add5H = add5H;
    var u64 = {
      fromBig,
      split,
      toBig,
      shrSH,
      shrSL,
      rotrSH,
      rotrSL,
      rotrBH,
      rotrBL,
      rotr32H,
      rotr32L,
      rotlSH,
      rotlSL,
      rotlBH,
      rotlBL,
      add,
      add3L,
      add3H,
      add4L,
      add4H,
      add5H,
      add5L
    };
    exports.default = u64;
  }
});

// ../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/sha2.js
var require_sha2 = __commonJS({
  "../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/sha2.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha512_224 = exports.sha512_256 = exports.sha384 = exports.sha512 = exports.sha224 = exports.sha256 = exports.SHA512_256 = exports.SHA512_224 = exports.SHA384 = exports.SHA512 = exports.SHA224 = exports.SHA256 = void 0;
    var _md_ts_1 = require_md();
    var u64 = require_u64();
    var utils_ts_1 = require_utils4();
    var SHA256_K = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
    var SHA256 = class extends _md_ts_1.HashMD {
      constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        this.A = _md_ts_1.SHA256_IV[0] | 0;
        this.B = _md_ts_1.SHA256_IV[1] | 0;
        this.C = _md_ts_1.SHA256_IV[2] | 0;
        this.D = _md_ts_1.SHA256_IV[3] | 0;
        this.E = _md_ts_1.SHA256_IV[4] | 0;
        this.F = _md_ts_1.SHA256_IV[5] | 0;
        this.G = _md_ts_1.SHA256_IV[6] | 0;
        this.H = _md_ts_1.SHA256_IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = (0, utils_ts_1.rotr)(W15, 7) ^ (0, utils_ts_1.rotr)(W15, 18) ^ W15 >>> 3;
          const s1 = (0, utils_ts_1.rotr)(W2, 17) ^ (0, utils_ts_1.rotr)(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = (0, utils_ts_1.rotr)(E, 6) ^ (0, utils_ts_1.rotr)(E, 11) ^ (0, utils_ts_1.rotr)(E, 25);
          const T1 = H + sigma1 + (0, _md_ts_1.Chi)(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = (0, utils_ts_1.rotr)(A, 2) ^ (0, utils_ts_1.rotr)(A, 13) ^ (0, utils_ts_1.rotr)(A, 22);
          const T2 = sigma0 + (0, _md_ts_1.Maj)(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        (0, utils_ts_1.clean)(SHA256_W);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        (0, utils_ts_1.clean)(this.buffer);
      }
    };
    exports.SHA256 = SHA256;
    var SHA224 = class extends SHA256 {
      constructor() {
        super(28);
        this.A = _md_ts_1.SHA224_IV[0] | 0;
        this.B = _md_ts_1.SHA224_IV[1] | 0;
        this.C = _md_ts_1.SHA224_IV[2] | 0;
        this.D = _md_ts_1.SHA224_IV[3] | 0;
        this.E = _md_ts_1.SHA224_IV[4] | 0;
        this.F = _md_ts_1.SHA224_IV[5] | 0;
        this.G = _md_ts_1.SHA224_IV[6] | 0;
        this.H = _md_ts_1.SHA224_IV[7] | 0;
      }
    };
    exports.SHA224 = SHA224;
    var K512 = /* @__PURE__ */ (() => u64.split([
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817"
    ].map((n) => BigInt(n))))();
    var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
    var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
    var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
    var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
    var SHA512 = class extends _md_ts_1.HashMD {
      constructor(outputLen = 64) {
        super(128, outputLen, 16, false);
        this.Ah = _md_ts_1.SHA512_IV[0] | 0;
        this.Al = _md_ts_1.SHA512_IV[1] | 0;
        this.Bh = _md_ts_1.SHA512_IV[2] | 0;
        this.Bl = _md_ts_1.SHA512_IV[3] | 0;
        this.Ch = _md_ts_1.SHA512_IV[4] | 0;
        this.Cl = _md_ts_1.SHA512_IV[5] | 0;
        this.Dh = _md_ts_1.SHA512_IV[6] | 0;
        this.Dl = _md_ts_1.SHA512_IV[7] | 0;
        this.Eh = _md_ts_1.SHA512_IV[8] | 0;
        this.El = _md_ts_1.SHA512_IV[9] | 0;
        this.Fh = _md_ts_1.SHA512_IV[10] | 0;
        this.Fl = _md_ts_1.SHA512_IV[11] | 0;
        this.Gh = _md_ts_1.SHA512_IV[12] | 0;
        this.Gl = _md_ts_1.SHA512_IV[13] | 0;
        this.Hh = _md_ts_1.SHA512_IV[14] | 0;
        this.Hl = _md_ts_1.SHA512_IV[15] | 0;
      }
      // prettier-ignore
      get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
      }
      // prettier-ignore
      set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H[i] = view.getUint32(offset);
          SHA512_W_L[i] = view.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H[i - 15] | 0;
          const W15l = SHA512_W_L[i - 15] | 0;
          const s0h = u64.rotrSH(W15h, W15l, 1) ^ u64.rotrSH(W15h, W15l, 8) ^ u64.shrSH(W15h, W15l, 7);
          const s0l = u64.rotrSL(W15h, W15l, 1) ^ u64.rotrSL(W15h, W15l, 8) ^ u64.shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H[i - 2] | 0;
          const W2l = SHA512_W_L[i - 2] | 0;
          const s1h = u64.rotrSH(W2h, W2l, 19) ^ u64.rotrBH(W2h, W2l, 61) ^ u64.shrSH(W2h, W2l, 6);
          const s1l = u64.rotrSL(W2h, W2l, 19) ^ u64.rotrBL(W2h, W2l, 61) ^ u64.shrSL(W2h, W2l, 6);
          const SUMl = u64.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
          const SUMh = u64.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
          SHA512_W_H[i] = SUMh | 0;
          SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = u64.rotrSH(Eh, El, 14) ^ u64.rotrSH(Eh, El, 18) ^ u64.rotrBH(Eh, El, 41);
          const sigma1l = u64.rotrSL(Eh, El, 14) ^ u64.rotrSL(Eh, El, 18) ^ u64.rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = u64.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
          const T1h = u64.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
          const T1l = T1ll | 0;
          const sigma0h = u64.rotrSH(Ah, Al, 28) ^ u64.rotrBH(Ah, Al, 34) ^ u64.rotrBH(Ah, Al, 39);
          const sigma0l = u64.rotrSL(Ah, Al, 28) ^ u64.rotrBL(Ah, Al, 34) ^ u64.rotrBL(Ah, Al, 39);
          const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
          const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
          Hh = Gh | 0;
          Hl = Gl | 0;
          Gh = Fh | 0;
          Gl = Fl | 0;
          Fh = Eh | 0;
          Fl = El | 0;
          ({ h: Eh, l: El } = u64.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
          Dh = Ch | 0;
          Dl = Cl | 0;
          Ch = Bh | 0;
          Cl = Bl | 0;
          Bh = Ah | 0;
          Bl = Al | 0;
          const All = u64.add3L(T1l, sigma0l, MAJl);
          Ah = u64.add3H(All, T1h, sigma0h, MAJh);
          Al = All | 0;
        }
        ({ h: Ah, l: Al } = u64.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = u64.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = u64.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = u64.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = u64.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = u64.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = u64.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = u64.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
      }
      roundClean() {
        (0, utils_ts_1.clean)(SHA512_W_H, SHA512_W_L);
      }
      destroy() {
        (0, utils_ts_1.clean)(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    exports.SHA512 = SHA512;
    var SHA384 = class extends SHA512 {
      constructor() {
        super(48);
        this.Ah = _md_ts_1.SHA384_IV[0] | 0;
        this.Al = _md_ts_1.SHA384_IV[1] | 0;
        this.Bh = _md_ts_1.SHA384_IV[2] | 0;
        this.Bl = _md_ts_1.SHA384_IV[3] | 0;
        this.Ch = _md_ts_1.SHA384_IV[4] | 0;
        this.Cl = _md_ts_1.SHA384_IV[5] | 0;
        this.Dh = _md_ts_1.SHA384_IV[6] | 0;
        this.Dl = _md_ts_1.SHA384_IV[7] | 0;
        this.Eh = _md_ts_1.SHA384_IV[8] | 0;
        this.El = _md_ts_1.SHA384_IV[9] | 0;
        this.Fh = _md_ts_1.SHA384_IV[10] | 0;
        this.Fl = _md_ts_1.SHA384_IV[11] | 0;
        this.Gh = _md_ts_1.SHA384_IV[12] | 0;
        this.Gl = _md_ts_1.SHA384_IV[13] | 0;
        this.Hh = _md_ts_1.SHA384_IV[14] | 0;
        this.Hl = _md_ts_1.SHA384_IV[15] | 0;
      }
    };
    exports.SHA384 = SHA384;
    var T224_IV = /* @__PURE__ */ Uint32Array.from([
      2352822216,
      424955298,
      1944164710,
      2312950998,
      502970286,
      855612546,
      1738396948,
      1479516111,
      258812777,
      2077511080,
      2011393907,
      79989058,
      1067287976,
      1780299464,
      286451373,
      2446758561
    ]);
    var T256_IV = /* @__PURE__ */ Uint32Array.from([
      573645204,
      4230739756,
      2673172387,
      3360449730,
      596883563,
      1867755857,
      2520282905,
      1497426621,
      2519219938,
      2827943907,
      3193839141,
      1401305490,
      721525244,
      746961066,
      246885852,
      2177182882
    ]);
    var SHA512_224 = class extends SHA512 {
      constructor() {
        super(28);
        this.Ah = T224_IV[0] | 0;
        this.Al = T224_IV[1] | 0;
        this.Bh = T224_IV[2] | 0;
        this.Bl = T224_IV[3] | 0;
        this.Ch = T224_IV[4] | 0;
        this.Cl = T224_IV[5] | 0;
        this.Dh = T224_IV[6] | 0;
        this.Dl = T224_IV[7] | 0;
        this.Eh = T224_IV[8] | 0;
        this.El = T224_IV[9] | 0;
        this.Fh = T224_IV[10] | 0;
        this.Fl = T224_IV[11] | 0;
        this.Gh = T224_IV[12] | 0;
        this.Gl = T224_IV[13] | 0;
        this.Hh = T224_IV[14] | 0;
        this.Hl = T224_IV[15] | 0;
      }
    };
    exports.SHA512_224 = SHA512_224;
    var SHA512_256 = class extends SHA512 {
      constructor() {
        super(32);
        this.Ah = T256_IV[0] | 0;
        this.Al = T256_IV[1] | 0;
        this.Bh = T256_IV[2] | 0;
        this.Bl = T256_IV[3] | 0;
        this.Ch = T256_IV[4] | 0;
        this.Cl = T256_IV[5] | 0;
        this.Dh = T256_IV[6] | 0;
        this.Dl = T256_IV[7] | 0;
        this.Eh = T256_IV[8] | 0;
        this.El = T256_IV[9] | 0;
        this.Fh = T256_IV[10] | 0;
        this.Fl = T256_IV[11] | 0;
        this.Gh = T256_IV[12] | 0;
        this.Gl = T256_IV[13] | 0;
        this.Hh = T256_IV[14] | 0;
        this.Hl = T256_IV[15] | 0;
      }
    };
    exports.SHA512_256 = SHA512_256;
    exports.sha256 = (0, utils_ts_1.createHasher)(() => new SHA256());
    exports.sha224 = (0, utils_ts_1.createHasher)(() => new SHA224());
    exports.sha512 = (0, utils_ts_1.createHasher)(() => new SHA512());
    exports.sha384 = (0, utils_ts_1.createHasher)(() => new SHA384());
    exports.sha512_256 = (0, utils_ts_1.createHasher)(() => new SHA512_256());
    exports.sha512_224 = (0, utils_ts_1.createHasher)(() => new SHA512_224());
  }
});

// ../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/utils.js
var require_utils5 = __commonJS({
  "../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/utils.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.notImplemented = exports.bitMask = exports.utf8ToBytes = exports.randomBytes = exports.isBytes = exports.hexToBytes = exports.concatBytes = exports.bytesToUtf8 = exports.bytesToHex = exports.anumber = exports.abytes = void 0;
    exports.abool = abool;
    exports._abool2 = _abool2;
    exports._abytes2 = _abytes2;
    exports.numberToHexUnpadded = numberToHexUnpadded;
    exports.hexToNumber = hexToNumber;
    exports.bytesToNumberBE = bytesToNumberBE;
    exports.bytesToNumberLE = bytesToNumberLE;
    exports.numberToBytesBE = numberToBytesBE;
    exports.numberToBytesLE = numberToBytesLE;
    exports.numberToVarBytesBE = numberToVarBytesBE;
    exports.ensureBytes = ensureBytes;
    exports.equalBytes = equalBytes;
    exports.copyBytes = copyBytes;
    exports.asciiToBytes = asciiToBytes;
    exports.inRange = inRange;
    exports.aInRange = aInRange;
    exports.bitLen = bitLen;
    exports.bitGet = bitGet;
    exports.bitSet = bitSet;
    exports.createHmacDrbg = createHmacDrbg;
    exports.validateObject = validateObject;
    exports.isHash = isHash;
    exports._validateObject = _validateObject;
    exports.memoized = memoized;
    var utils_js_1 = require_utils4();
    var utils_js_2 = require_utils4();
    Object.defineProperty(exports, "abytes", { enumerable: true, get: function() {
      return utils_js_2.abytes;
    } });
    Object.defineProperty(exports, "anumber", { enumerable: true, get: function() {
      return utils_js_2.anumber;
    } });
    Object.defineProperty(exports, "bytesToHex", { enumerable: true, get: function() {
      return utils_js_2.bytesToHex;
    } });
    Object.defineProperty(exports, "bytesToUtf8", { enumerable: true, get: function() {
      return utils_js_2.bytesToUtf8;
    } });
    Object.defineProperty(exports, "concatBytes", { enumerable: true, get: function() {
      return utils_js_2.concatBytes;
    } });
    Object.defineProperty(exports, "hexToBytes", { enumerable: true, get: function() {
      return utils_js_2.hexToBytes;
    } });
    Object.defineProperty(exports, "isBytes", { enumerable: true, get: function() {
      return utils_js_2.isBytes;
    } });
    Object.defineProperty(exports, "randomBytes", { enumerable: true, get: function() {
      return utils_js_2.randomBytes;
    } });
    Object.defineProperty(exports, "utf8ToBytes", { enumerable: true, get: function() {
      return utils_js_2.utf8ToBytes;
    } });
    var _0n = /* @__PURE__ */ BigInt(0);
    var _1n = /* @__PURE__ */ BigInt(1);
    function abool(title, value) {
      if (typeof value !== "boolean")
        throw new Error(title + " boolean expected, got " + value);
    }
    function _abool2(value, title = "") {
      if (typeof value !== "boolean") {
        const prefix = title && `"${title}"`;
        throw new Error(prefix + "expected boolean, got type=" + typeof value);
      }
      return value;
    }
    function _abytes2(value, length, title = "") {
      const bytes = (0, utils_js_1.isBytes)(value);
      const len = value?.length;
      const needsLen = length !== void 0;
      if (!bytes || needsLen && len !== length) {
        const prefix = title && `"${title}" `;
        const ofLen = needsLen ? ` of length ${length}` : "";
        const got = bytes ? `length=${len}` : `type=${typeof value}`;
        throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
      }
      return value;
    }
    function numberToHexUnpadded(num) {
      const hex = num.toString(16);
      return hex.length & 1 ? "0" + hex : hex;
    }
    function hexToNumber(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      return hex === "" ? _0n : BigInt("0x" + hex);
    }
    function bytesToNumberBE(bytes) {
      return hexToNumber((0, utils_js_1.bytesToHex)(bytes));
    }
    function bytesToNumberLE(bytes) {
      (0, utils_js_1.abytes)(bytes);
      return hexToNumber((0, utils_js_1.bytesToHex)(Uint8Array.from(bytes).reverse()));
    }
    function numberToBytesBE(n, len) {
      return (0, utils_js_1.hexToBytes)(n.toString(16).padStart(len * 2, "0"));
    }
    function numberToBytesLE(n, len) {
      return numberToBytesBE(n, len).reverse();
    }
    function numberToVarBytesBE(n) {
      return (0, utils_js_1.hexToBytes)(numberToHexUnpadded(n));
    }
    function ensureBytes(title, hex, expectedLength) {
      let res;
      if (typeof hex === "string") {
        try {
          res = (0, utils_js_1.hexToBytes)(hex);
        } catch (e) {
          throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
        }
      } else if ((0, utils_js_1.isBytes)(hex)) {
        res = Uint8Array.from(hex);
      } else {
        throw new Error(title + " must be hex string or Uint8Array");
      }
      const len = res.length;
      if (typeof expectedLength === "number" && len !== expectedLength)
        throw new Error(title + " of length " + expectedLength + " expected, got " + len);
      return res;
    }
    function equalBytes(a, b2) {
      if (a.length !== b2.length)
        return false;
      let diff = 0;
      for (let i = 0; i < a.length; i++)
        diff |= a[i] ^ b2[i];
      return diff === 0;
    }
    function copyBytes(bytes) {
      return Uint8Array.from(bytes);
    }
    function asciiToBytes(ascii) {
      return Uint8Array.from(ascii, (c2, i) => {
        const charCode = c2.charCodeAt(0);
        if (c2.length !== 1 || charCode > 127) {
          throw new Error(`string contains non-ASCII character "${ascii[i]}" with code ${charCode} at position ${i}`);
        }
        return charCode;
      });
    }
    var isPosBig = (n) => typeof n === "bigint" && _0n <= n;
    function inRange(n, min, max) {
      return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
    }
    function aInRange(title, n, min, max) {
      if (!inRange(n, min, max))
        throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
    }
    function bitLen(n) {
      let len;
      for (len = 0; n > _0n; n >>= _1n, len += 1)
        ;
      return len;
    }
    function bitGet(n, pos) {
      return n >> BigInt(pos) & _1n;
    }
    function bitSet(n, pos, value) {
      return n | (value ? _1n : _0n) << BigInt(pos);
    }
    var bitMask = (n) => (_1n << BigInt(n)) - _1n;
    exports.bitMask = bitMask;
    function createHmacDrbg(hashLen, qByteLen, hmacFn) {
      if (typeof hashLen !== "number" || hashLen < 2)
        throw new Error("hashLen must be a number");
      if (typeof qByteLen !== "number" || qByteLen < 2)
        throw new Error("qByteLen must be a number");
      if (typeof hmacFn !== "function")
        throw new Error("hmacFn must be a function");
      const u8n = (len) => new Uint8Array(len);
      const u8of = (byte) => Uint8Array.of(byte);
      let v = u8n(hashLen);
      let k = u8n(hashLen);
      let i = 0;
      const reset = () => {
        v.fill(1);
        k.fill(0);
        i = 0;
      };
      const h = (...b2) => hmacFn(k, v, ...b2);
      const reseed = (seed = u8n(0)) => {
        k = h(u8of(0), seed);
        v = h();
        if (seed.length === 0)
          return;
        k = h(u8of(1), seed);
        v = h();
      };
      const gen = () => {
        if (i++ >= 1e3)
          throw new Error("drbg: tried 1000 values");
        let len = 0;
        const out = [];
        while (len < qByteLen) {
          v = h();
          const sl = v.slice();
          out.push(sl);
          len += v.length;
        }
        return (0, utils_js_1.concatBytes)(...out);
      };
      const genUntil = (seed, pred) => {
        reset();
        reseed(seed);
        let res = void 0;
        while (!(res = pred(gen())))
          reseed();
        reset();
        return res;
      };
      return genUntil;
    }
    var validatorFns = {
      bigint: (val) => typeof val === "bigint",
      function: (val) => typeof val === "function",
      boolean: (val) => typeof val === "boolean",
      string: (val) => typeof val === "string",
      stringOrUint8Array: (val) => typeof val === "string" || (0, utils_js_1.isBytes)(val),
      isSafeInteger: (val) => Number.isSafeInteger(val),
      array: (val) => Array.isArray(val),
      field: (val, object) => object.Fp.isValid(val),
      hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
    };
    function validateObject(object, validators, optValidators = {}) {
      const checkField = (fieldName, type, isOptional) => {
        const checkVal = validatorFns[type];
        if (typeof checkVal !== "function")
          throw new Error("invalid validator function");
        const val = object[fieldName];
        if (isOptional && val === void 0)
          return;
        if (!checkVal(val, object)) {
          throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
        }
      };
      for (const [fieldName, type] of Object.entries(validators))
        checkField(fieldName, type, false);
      for (const [fieldName, type] of Object.entries(optValidators))
        checkField(fieldName, type, true);
      return object;
    }
    function isHash(val) {
      return typeof val === "function" && Number.isSafeInteger(val.outputLen);
    }
    function _validateObject(object, fields, optFields = {}) {
      if (!object || typeof object !== "object")
        throw new Error("expected valid options object");
      function checkField(fieldName, expectedType, isOpt) {
        const val = object[fieldName];
        if (isOpt && val === void 0)
          return;
        const current = typeof val;
        if (current !== expectedType || val === null)
          throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
      }
      Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
      Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
    }
    var notImplemented = () => {
      throw new Error("not implemented");
    };
    exports.notImplemented = notImplemented;
    function memoized(fn) {
      const map = /* @__PURE__ */ new WeakMap();
      return (arg, ...args) => {
        const val = map.get(arg);
        if (val !== void 0)
          return val;
        const computed = fn(arg, ...args);
        map.set(arg, computed);
        return computed;
      };
    }
  }
});

// ../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/modular.js
var require_modular = __commonJS({
  "../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/modular.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isNegativeLE = void 0;
    exports.mod = mod;
    exports.pow = pow;
    exports.pow2 = pow2;
    exports.invert = invert;
    exports.tonelliShanks = tonelliShanks;
    exports.FpSqrt = FpSqrt;
    exports.validateField = validateField;
    exports.FpPow = FpPow;
    exports.FpInvertBatch = FpInvertBatch;
    exports.FpDiv = FpDiv;
    exports.FpLegendre = FpLegendre;
    exports.FpIsSquare = FpIsSquare;
    exports.nLength = nLength;
    exports.Field = Field;
    exports.FpSqrtOdd = FpSqrtOdd;
    exports.FpSqrtEven = FpSqrtEven;
    exports.hashToPrivateScalar = hashToPrivateScalar;
    exports.getFieldBytesLength = getFieldBytesLength;
    exports.getMinHashLength = getMinHashLength;
    exports.mapHashToField = mapHashToField;
    var utils_ts_1 = require_utils5();
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = /* @__PURE__ */ BigInt(2);
    var _3n = /* @__PURE__ */ BigInt(3);
    var _4n = /* @__PURE__ */ BigInt(4);
    var _5n = /* @__PURE__ */ BigInt(5);
    var _7n = /* @__PURE__ */ BigInt(7);
    var _8n = /* @__PURE__ */ BigInt(8);
    var _9n = /* @__PURE__ */ BigInt(9);
    var _16n = /* @__PURE__ */ BigInt(16);
    function mod(a, b2) {
      const result = a % b2;
      return result >= _0n ? result : b2 + result;
    }
    function pow(num, power, modulo) {
      return FpPow(Field(modulo), num, power);
    }
    function pow2(x, power, modulo) {
      let res = x;
      while (power-- > _0n) {
        res *= res;
        res %= modulo;
      }
      return res;
    }
    function invert(number, modulo) {
      if (number === _0n)
        throw new Error("invert: expected non-zero number");
      if (modulo <= _0n)
        throw new Error("invert: expected positive modulus, got " + modulo);
      let a = mod(number, modulo);
      let b2 = modulo;
      let x = _0n, u = _1n;
      while (a !== _0n) {
        const q = b2 / a;
        const r = b2 % a;
        const m2 = x - u * q;
        b2 = a, a = r, x = u, u = m2;
      }
      const gcd = b2;
      if (gcd !== _1n)
        throw new Error("invert: does not exist");
      return mod(x, modulo);
    }
    function assertIsSquare(Fp, root, n) {
      if (!Fp.eql(Fp.sqr(root), n))
        throw new Error("Cannot find square root");
    }
    function sqrt3mod4(Fp, n) {
      const p1div4 = (Fp.ORDER + _1n) / _4n;
      const root = Fp.pow(n, p1div4);
      assertIsSquare(Fp, root, n);
      return root;
    }
    function sqrt5mod8(Fp, n) {
      const p5div8 = (Fp.ORDER - _5n) / _8n;
      const n2 = Fp.mul(n, _2n);
      const v = Fp.pow(n2, p5div8);
      const nv = Fp.mul(n, v);
      const i = Fp.mul(Fp.mul(nv, _2n), v);
      const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
      assertIsSquare(Fp, root, n);
      return root;
    }
    function sqrt9mod16(P) {
      const Fp_ = Field(P);
      const tn = tonelliShanks(P);
      const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
      const c2 = tn(Fp_, c1);
      const c3 = tn(Fp_, Fp_.neg(c1));
      const c4 = (P + _7n) / _16n;
      return (Fp, n) => {
        let tv1 = Fp.pow(n, c4);
        let tv2 = Fp.mul(tv1, c1);
        const tv3 = Fp.mul(tv1, c2);
        const tv4 = Fp.mul(tv1, c3);
        const e1 = Fp.eql(Fp.sqr(tv2), n);
        const e2 = Fp.eql(Fp.sqr(tv3), n);
        tv1 = Fp.cmov(tv1, tv2, e1);
        tv2 = Fp.cmov(tv4, tv3, e2);
        const e3 = Fp.eql(Fp.sqr(tv2), n);
        const root = Fp.cmov(tv1, tv2, e3);
        assertIsSquare(Fp, root, n);
        return root;
      };
    }
    function tonelliShanks(P) {
      if (P < _3n)
        throw new Error("sqrt is not defined for small field");
      let Q = P - _1n;
      let S = 0;
      while (Q % _2n === _0n) {
        Q /= _2n;
        S++;
      }
      let Z = _2n;
      const _Fp = Field(P);
      while (FpLegendre(_Fp, Z) === 1) {
        if (Z++ > 1e3)
          throw new Error("Cannot find square root: probably non-prime P");
      }
      if (S === 1)
        return sqrt3mod4;
      let cc = _Fp.pow(Z, Q);
      const Q1div2 = (Q + _1n) / _2n;
      return function tonelliSlow(Fp, n) {
        if (Fp.is0(n))
          return n;
        if (FpLegendre(Fp, n) !== 1)
          throw new Error("Cannot find square root");
        let M = S;
        let c2 = Fp.mul(Fp.ONE, cc);
        let t = Fp.pow(n, Q);
        let R = Fp.pow(n, Q1div2);
        while (!Fp.eql(t, Fp.ONE)) {
          if (Fp.is0(t))
            return Fp.ZERO;
          let i = 1;
          let t_tmp = Fp.sqr(t);
          while (!Fp.eql(t_tmp, Fp.ONE)) {
            i++;
            t_tmp = Fp.sqr(t_tmp);
            if (i === M)
              throw new Error("Cannot find square root");
          }
          const exponent = _1n << BigInt(M - i - 1);
          const b2 = Fp.pow(c2, exponent);
          M = i;
          c2 = Fp.sqr(b2);
          t = Fp.mul(t, c2);
          R = Fp.mul(R, b2);
        }
        return R;
      };
    }
    function FpSqrt(P) {
      if (P % _4n === _3n)
        return sqrt3mod4;
      if (P % _8n === _5n)
        return sqrt5mod8;
      if (P % _16n === _9n)
        return sqrt9mod16(P);
      return tonelliShanks(P);
    }
    var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n) === _1n;
    exports.isNegativeLE = isNegativeLE;
    var FIELD_FIELDS = [
      "create",
      "isValid",
      "is0",
      "neg",
      "inv",
      "sqrt",
      "sqr",
      "eql",
      "add",
      "sub",
      "mul",
      "pow",
      "div",
      "addN",
      "subN",
      "mulN",
      "sqrN"
    ];
    function validateField(field) {
      const initial = {
        ORDER: "bigint",
        MASK: "bigint",
        BYTES: "number",
        BITS: "number"
      };
      const opts = FIELD_FIELDS.reduce((map, val) => {
        map[val] = "function";
        return map;
      }, initial);
      (0, utils_ts_1._validateObject)(field, opts);
      return field;
    }
    function FpPow(Fp, num, power) {
      if (power < _0n)
        throw new Error("invalid exponent, negatives unsupported");
      if (power === _0n)
        return Fp.ONE;
      if (power === _1n)
        return num;
      let p2 = Fp.ONE;
      let d = num;
      while (power > _0n) {
        if (power & _1n)
          p2 = Fp.mul(p2, d);
        d = Fp.sqr(d);
        power >>= _1n;
      }
      return p2;
    }
    function FpInvertBatch(Fp, nums, passZero = false) {
      const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
      const multipliedAcc = nums.reduce((acc, num, i) => {
        if (Fp.is0(num))
          return acc;
        inverted[i] = acc;
        return Fp.mul(acc, num);
      }, Fp.ONE);
      const invertedAcc = Fp.inv(multipliedAcc);
      nums.reduceRight((acc, num, i) => {
        if (Fp.is0(num))
          return acc;
        inverted[i] = Fp.mul(acc, inverted[i]);
        return Fp.mul(acc, num);
      }, invertedAcc);
      return inverted;
    }
    function FpDiv(Fp, lhs, rhs) {
      return Fp.mul(lhs, typeof rhs === "bigint" ? invert(rhs, Fp.ORDER) : Fp.inv(rhs));
    }
    function FpLegendre(Fp, n) {
      const p1mod2 = (Fp.ORDER - _1n) / _2n;
      const powered = Fp.pow(n, p1mod2);
      const yes = Fp.eql(powered, Fp.ONE);
      const zero = Fp.eql(powered, Fp.ZERO);
      const no = Fp.eql(powered, Fp.neg(Fp.ONE));
      if (!yes && !zero && !no)
        throw new Error("invalid Legendre symbol result");
      return yes ? 1 : zero ? 0 : -1;
    }
    function FpIsSquare(Fp, n) {
      const l = FpLegendre(Fp, n);
      return l === 1;
    }
    function nLength(n, nBitLength) {
      if (nBitLength !== void 0)
        (0, utils_ts_1.anumber)(nBitLength);
      const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
      const nByteLength = Math.ceil(_nBitLength / 8);
      return { nBitLength: _nBitLength, nByteLength };
    }
    function Field(ORDER, bitLenOrOpts, isLE = false, opts = {}) {
      if (ORDER <= _0n)
        throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
      let _nbitLength = void 0;
      let _sqrt = void 0;
      let modFromBytes = false;
      let allowedLengths = void 0;
      if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
        if (opts.sqrt || isLE)
          throw new Error("cannot specify opts in two arguments");
        const _opts = bitLenOrOpts;
        if (_opts.BITS)
          _nbitLength = _opts.BITS;
        if (_opts.sqrt)
          _sqrt = _opts.sqrt;
        if (typeof _opts.isLE === "boolean")
          isLE = _opts.isLE;
        if (typeof _opts.modFromBytes === "boolean")
          modFromBytes = _opts.modFromBytes;
        allowedLengths = _opts.allowedLengths;
      } else {
        if (typeof bitLenOrOpts === "number")
          _nbitLength = bitLenOrOpts;
        if (opts.sqrt)
          _sqrt = opts.sqrt;
      }
      const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
      if (BYTES > 2048)
        throw new Error("invalid field: expected ORDER of <= 2048 bytes");
      let sqrtP;
      const f2 = Object.freeze({
        ORDER,
        isLE,
        BITS,
        BYTES,
        MASK: (0, utils_ts_1.bitMask)(BITS),
        ZERO: _0n,
        ONE: _1n,
        allowedLengths,
        create: (num) => mod(num, ORDER),
        isValid: (num) => {
          if (typeof num !== "bigint")
            throw new Error("invalid field element: expected bigint, got " + typeof num);
          return _0n <= num && num < ORDER;
        },
        is0: (num) => num === _0n,
        // is valid and invertible
        isValidNot0: (num) => !f2.is0(num) && f2.isValid(num),
        isOdd: (num) => (num & _1n) === _1n,
        neg: (num) => mod(-num, ORDER),
        eql: (lhs, rhs) => lhs === rhs,
        sqr: (num) => mod(num * num, ORDER),
        add: (lhs, rhs) => mod(lhs + rhs, ORDER),
        sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
        mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
        pow: (num, power) => FpPow(f2, num, power),
        div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
        // Same as above, but doesn't normalize
        sqrN: (num) => num * num,
        addN: (lhs, rhs) => lhs + rhs,
        subN: (lhs, rhs) => lhs - rhs,
        mulN: (lhs, rhs) => lhs * rhs,
        inv: (num) => invert(num, ORDER),
        sqrt: _sqrt || ((n) => {
          if (!sqrtP)
            sqrtP = FpSqrt(ORDER);
          return sqrtP(f2, n);
        }),
        toBytes: (num) => isLE ? (0, utils_ts_1.numberToBytesLE)(num, BYTES) : (0, utils_ts_1.numberToBytesBE)(num, BYTES),
        fromBytes: (bytes, skipValidation = true) => {
          if (allowedLengths) {
            if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
              throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
            }
            const padded = new Uint8Array(BYTES);
            padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
            bytes = padded;
          }
          if (bytes.length !== BYTES)
            throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
          let scalar = isLE ? (0, utils_ts_1.bytesToNumberLE)(bytes) : (0, utils_ts_1.bytesToNumberBE)(bytes);
          if (modFromBytes)
            scalar = mod(scalar, ORDER);
          if (!skipValidation) {
            if (!f2.isValid(scalar))
              throw new Error("invalid field element: outside of range 0..ORDER");
          }
          return scalar;
        },
        // TODO: we don't need it here, move out to separate fn
        invertBatch: (lst) => FpInvertBatch(f2, lst),
        // We can't move this out because Fp6, Fp12 implement it
        // and it's unclear what to return in there.
        cmov: (a, b2, c2) => c2 ? b2 : a
      });
      return Object.freeze(f2);
    }
    function FpSqrtOdd(Fp, elm) {
      if (!Fp.isOdd)
        throw new Error("Field doesn't have isOdd");
      const root = Fp.sqrt(elm);
      return Fp.isOdd(root) ? root : Fp.neg(root);
    }
    function FpSqrtEven(Fp, elm) {
      if (!Fp.isOdd)
        throw new Error("Field doesn't have isOdd");
      const root = Fp.sqrt(elm);
      return Fp.isOdd(root) ? Fp.neg(root) : root;
    }
    function hashToPrivateScalar(hash, groupOrder, isLE = false) {
      hash = (0, utils_ts_1.ensureBytes)("privateHash", hash);
      const hashLen = hash.length;
      const minLen = nLength(groupOrder).nByteLength + 8;
      if (minLen < 24 || hashLen < minLen || hashLen > 1024)
        throw new Error("hashToPrivateScalar: expected " + minLen + "-1024 bytes of input, got " + hashLen);
      const num = isLE ? (0, utils_ts_1.bytesToNumberLE)(hash) : (0, utils_ts_1.bytesToNumberBE)(hash);
      return mod(num, groupOrder - _1n) + _1n;
    }
    function getFieldBytesLength(fieldOrder) {
      if (typeof fieldOrder !== "bigint")
        throw new Error("field order must be bigint");
      const bitLength = fieldOrder.toString(2).length;
      return Math.ceil(bitLength / 8);
    }
    function getMinHashLength(fieldOrder) {
      const length = getFieldBytesLength(fieldOrder);
      return length + Math.ceil(length / 2);
    }
    function mapHashToField(key, fieldOrder, isLE = false) {
      const len = key.length;
      const fieldLen = getFieldBytesLength(fieldOrder);
      const minLen = getMinHashLength(fieldOrder);
      if (len < 16 || len < minLen || len > 1024)
        throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
      const num = isLE ? (0, utils_ts_1.bytesToNumberLE)(key) : (0, utils_ts_1.bytesToNumberBE)(key);
      const reduced = mod(num, fieldOrder - _1n) + _1n;
      return isLE ? (0, utils_ts_1.numberToBytesLE)(reduced, fieldLen) : (0, utils_ts_1.numberToBytesBE)(reduced, fieldLen);
    }
  }
});

// ../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/curve.js
var require_curve = __commonJS({
  "../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/curve.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wNAF = void 0;
    exports.negateCt = negateCt;
    exports.normalizeZ = normalizeZ;
    exports.mulEndoUnsafe = mulEndoUnsafe;
    exports.pippenger = pippenger;
    exports.precomputeMSMUnsafe = precomputeMSMUnsafe;
    exports.validateBasic = validateBasic;
    exports._createCurveFields = _createCurveFields;
    var utils_ts_1 = require_utils5();
    var modular_ts_1 = require_modular();
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    function negateCt(condition, item) {
      const neg = item.negate();
      return condition ? neg : item;
    }
    function normalizeZ(c2, points) {
      const invertedZs = (0, modular_ts_1.FpInvertBatch)(c2.Fp, points.map((p2) => p2.Z));
      return points.map((p2, i) => c2.fromAffine(p2.toAffine(invertedZs[i])));
    }
    function validateW(W, bits) {
      if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
        throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
    }
    function calcWOpts(W, scalarBits) {
      validateW(W, scalarBits);
      const windows = Math.ceil(scalarBits / W) + 1;
      const windowSize = 2 ** (W - 1);
      const maxNumber = 2 ** W;
      const mask = (0, utils_ts_1.bitMask)(W);
      const shiftBy = BigInt(W);
      return { windows, windowSize, mask, maxNumber, shiftBy };
    }
    function calcOffsets(n, window, wOpts) {
      const { windowSize, mask, maxNumber, shiftBy } = wOpts;
      let wbits = Number(n & mask);
      let nextN = n >> shiftBy;
      if (wbits > windowSize) {
        wbits -= maxNumber;
        nextN += _1n;
      }
      const offsetStart = window * windowSize;
      const offset = offsetStart + Math.abs(wbits) - 1;
      const isZero = wbits === 0;
      const isNeg = wbits < 0;
      const isNegF = window % 2 !== 0;
      const offsetF = offsetStart;
      return { nextN, offset, isZero, isNeg, isNegF, offsetF };
    }
    function validateMSMPoints(points, c2) {
      if (!Array.isArray(points))
        throw new Error("array expected");
      points.forEach((p2, i) => {
        if (!(p2 instanceof c2))
          throw new Error("invalid point at index " + i);
      });
    }
    function validateMSMScalars(scalars, field) {
      if (!Array.isArray(scalars))
        throw new Error("array of scalars expected");
      scalars.forEach((s, i) => {
        if (!field.isValid(s))
          throw new Error("invalid scalar at index " + i);
      });
    }
    var pointPrecomputes = /* @__PURE__ */ new WeakMap();
    var pointWindowSizes = /* @__PURE__ */ new WeakMap();
    function getW(P) {
      return pointWindowSizes.get(P) || 1;
    }
    function assert0(n) {
      if (n !== _0n)
        throw new Error("invalid wNAF");
    }
    var wNAF = class {
      // Parametrized with a given Point class (not individual point)
      constructor(Point, bits) {
        this.BASE = Point.BASE;
        this.ZERO = Point.ZERO;
        this.Fn = Point.Fn;
        this.bits = bits;
      }
      // non-const time multiplication ladder
      _unsafeLadder(elm, n, p2 = this.ZERO) {
        let d = elm;
        while (n > _0n) {
          if (n & _1n)
            p2 = p2.add(d);
          d = d.double();
          n >>= _1n;
        }
        return p2;
      }
      /**
       * Creates a wNAF precomputation window. Used for caching.
       * Default window size is set by `utils.precompute()` and is equal to 8.
       * Number of precomputed points depends on the curve size:
       * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
       * - 𝑊 is the window size
       * - 𝑛 is the bitlength of the curve order.
       * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
       * @param point Point instance
       * @param W window size
       * @returns precomputed point tables flattened to a single array
       */
      precomputeWindow(point, W) {
        const { windows, windowSize } = calcWOpts(W, this.bits);
        const points = [];
        let p2 = point;
        let base = p2;
        for (let window = 0; window < windows; window++) {
          base = p2;
          points.push(base);
          for (let i = 1; i < windowSize; i++) {
            base = base.add(p2);
            points.push(base);
          }
          p2 = base.double();
        }
        return points;
      }
      /**
       * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
       * More compact implementation:
       * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
       * @returns real and fake (for const-time) points
       */
      wNAF(W, precomputes, n) {
        if (!this.Fn.isValid(n))
          throw new Error("invalid scalar");
        let p2 = this.ZERO;
        let f2 = this.BASE;
        const wo = calcWOpts(W, this.bits);
        for (let window = 0; window < wo.windows; window++) {
          const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
          n = nextN;
          if (isZero) {
            f2 = f2.add(negateCt(isNegF, precomputes[offsetF]));
          } else {
            p2 = p2.add(negateCt(isNeg, precomputes[offset]));
          }
        }
        assert0(n);
        return { p: p2, f: f2 };
      }
      /**
       * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
       * @param acc accumulator point to add result of multiplication
       * @returns point
       */
      wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
        const wo = calcWOpts(W, this.bits);
        for (let window = 0; window < wo.windows; window++) {
          if (n === _0n)
            break;
          const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
          n = nextN;
          if (isZero) {
            continue;
          } else {
            const item = precomputes[offset];
            acc = acc.add(isNeg ? item.negate() : item);
          }
        }
        assert0(n);
        return acc;
      }
      getPrecomputes(W, point, transform) {
        let comp = pointPrecomputes.get(point);
        if (!comp) {
          comp = this.precomputeWindow(point, W);
          if (W !== 1) {
            if (typeof transform === "function")
              comp = transform(comp);
            pointPrecomputes.set(point, comp);
          }
        }
        return comp;
      }
      cached(point, scalar, transform) {
        const W = getW(point);
        return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
      }
      unsafe(point, scalar, transform, prev) {
        const W = getW(point);
        if (W === 1)
          return this._unsafeLadder(point, scalar, prev);
        return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
      }
      // We calculate precomputes for elliptic curve point multiplication
      // using windowed method. This specifies window size and
      // stores precomputed values. Usually only base point would be precomputed.
      createCache(P, W) {
        validateW(W, this.bits);
        pointWindowSizes.set(P, W);
        pointPrecomputes.delete(P);
      }
      hasCache(elm) {
        return getW(elm) !== 1;
      }
    };
    exports.wNAF = wNAF;
    function mulEndoUnsafe(Point, point, k1, k2) {
      let acc = point;
      let p1 = Point.ZERO;
      let p2 = Point.ZERO;
      while (k1 > _0n || k2 > _0n) {
        if (k1 & _1n)
          p1 = p1.add(acc);
        if (k2 & _1n)
          p2 = p2.add(acc);
        acc = acc.double();
        k1 >>= _1n;
        k2 >>= _1n;
      }
      return { p1, p2 };
    }
    function pippenger(c2, fieldN, points, scalars) {
      validateMSMPoints(points, c2);
      validateMSMScalars(scalars, fieldN);
      const plength = points.length;
      const slength = scalars.length;
      if (plength !== slength)
        throw new Error("arrays of points and scalars must have equal length");
      const zero = c2.ZERO;
      const wbits = (0, utils_ts_1.bitLen)(BigInt(plength));
      let windowSize = 1;
      if (wbits > 12)
        windowSize = wbits - 3;
      else if (wbits > 4)
        windowSize = wbits - 2;
      else if (wbits > 0)
        windowSize = 2;
      const MASK = (0, utils_ts_1.bitMask)(windowSize);
      const buckets = new Array(Number(MASK) + 1).fill(zero);
      const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
      let sum = zero;
      for (let i = lastBits; i >= 0; i -= windowSize) {
        buckets.fill(zero);
        for (let j = 0; j < slength; j++) {
          const scalar = scalars[j];
          const wbits2 = Number(scalar >> BigInt(i) & MASK);
          buckets[wbits2] = buckets[wbits2].add(points[j]);
        }
        let resI = zero;
        for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
          sumI = sumI.add(buckets[j]);
          resI = resI.add(sumI);
        }
        sum = sum.add(resI);
        if (i !== 0)
          for (let j = 0; j < windowSize; j++)
            sum = sum.double();
      }
      return sum;
    }
    function precomputeMSMUnsafe(c2, fieldN, points, windowSize) {
      validateW(windowSize, fieldN.BITS);
      validateMSMPoints(points, c2);
      const zero = c2.ZERO;
      const tableSize = 2 ** windowSize - 1;
      const chunks = Math.ceil(fieldN.BITS / windowSize);
      const MASK = (0, utils_ts_1.bitMask)(windowSize);
      const tables = points.map((p2) => {
        const res = [];
        for (let i = 0, acc = p2; i < tableSize; i++) {
          res.push(acc);
          acc = acc.add(p2);
        }
        return res;
      });
      return (scalars) => {
        validateMSMScalars(scalars, fieldN);
        if (scalars.length > points.length)
          throw new Error("array of scalars must be smaller than array of points");
        let res = zero;
        for (let i = 0; i < chunks; i++) {
          if (res !== zero)
            for (let j = 0; j < windowSize; j++)
              res = res.double();
          const shiftBy = BigInt(chunks * windowSize - (i + 1) * windowSize);
          for (let j = 0; j < scalars.length; j++) {
            const n = scalars[j];
            const curr = Number(n >> shiftBy & MASK);
            if (!curr)
              continue;
            res = res.add(tables[j][curr - 1]);
          }
        }
        return res;
      };
    }
    function validateBasic(curve) {
      (0, modular_ts_1.validateField)(curve.Fp);
      (0, utils_ts_1.validateObject)(curve, {
        n: "bigint",
        h: "bigint",
        Gx: "field",
        Gy: "field"
      }, {
        nBitLength: "isSafeInteger",
        nByteLength: "isSafeInteger"
      });
      return Object.freeze({
        ...(0, modular_ts_1.nLength)(curve.n, curve.nBitLength),
        ...curve,
        ...{ p: curve.Fp.ORDER }
      });
    }
    function createField(order, field, isLE) {
      if (field) {
        if (field.ORDER !== order)
          throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
        (0, modular_ts_1.validateField)(field);
        return field;
      } else {
        return (0, modular_ts_1.Field)(order, { isLE });
      }
    }
    function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
      if (FpFnLE === void 0)
        FpFnLE = type === "edwards";
      if (!CURVE || typeof CURVE !== "object")
        throw new Error(`expected valid ${type} CURVE object`);
      for (const p2 of ["p", "n", "h"]) {
        const val = CURVE[p2];
        if (!(typeof val === "bigint" && val > _0n))
          throw new Error(`CURVE.${p2} must be positive bigint`);
      }
      const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
      const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
      const _b = type === "weierstrass" ? "b" : "d";
      const params = ["Gx", "Gy", "a", _b];
      for (const p2 of params) {
        if (!Fp.isValid(CURVE[p2]))
          throw new Error(`CURVE.${p2} must be valid field element of CURVE.Fp`);
      }
      CURVE = Object.freeze(Object.assign({}, CURVE));
      return { CURVE, Fp, Fn };
    }
  }
});

// ../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/edwards.js
var require_edwards = __commonJS({
  "../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/edwards.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PrimeEdwardsPoint = void 0;
    exports.edwards = edwards;
    exports.eddsa = eddsa;
    exports.twistedEdwards = twistedEdwards;
    var utils_ts_1 = require_utils5();
    var curve_ts_1 = require_curve();
    var modular_ts_1 = require_modular();
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var _8n = BigInt(8);
    function isEdValidXY(Fp, CURVE, x, y) {
      const x2 = Fp.sqr(x);
      const y2 = Fp.sqr(y);
      const left = Fp.add(Fp.mul(CURVE.a, x2), y2);
      const right = Fp.add(Fp.ONE, Fp.mul(CURVE.d, Fp.mul(x2, y2)));
      return Fp.eql(left, right);
    }
    function edwards(params, extraOpts = {}) {
      const validated = (0, curve_ts_1._createCurveFields)("edwards", params, extraOpts, extraOpts.FpFnLE);
      const { Fp, Fn } = validated;
      let CURVE = validated.CURVE;
      const { h: cofactor } = CURVE;
      (0, utils_ts_1._validateObject)(extraOpts, {}, { uvRatio: "function" });
      const MASK = _2n << BigInt(Fn.BYTES * 8) - _1n;
      const modP = (n) => Fp.create(n);
      const uvRatio = extraOpts.uvRatio || ((u, v) => {
        try {
          return { isValid: true, value: Fp.sqrt(Fp.div(u, v)) };
        } catch (e) {
          return { isValid: false, value: _0n };
        }
      });
      if (!isEdValidXY(Fp, CURVE, CURVE.Gx, CURVE.Gy))
        throw new Error("bad curve params: generator point");
      function acoord(title, n, banZero = false) {
        const min = banZero ? _1n : _0n;
        (0, utils_ts_1.aInRange)("coordinate " + title, n, min, MASK);
        return n;
      }
      function aextpoint(other) {
        if (!(other instanceof Point))
          throw new Error("ExtendedPoint expected");
      }
      const toAffineMemo = (0, utils_ts_1.memoized)((p2, iz) => {
        const { X, Y, Z } = p2;
        const is0 = p2.is0();
        if (iz == null)
          iz = is0 ? _8n : Fp.inv(Z);
        const x = modP(X * iz);
        const y = modP(Y * iz);
        const zz = Fp.mul(Z, iz);
        if (is0)
          return { x: _0n, y: _1n };
        if (zz !== _1n)
          throw new Error("invZ was invalid");
        return { x, y };
      });
      const assertValidMemo = (0, utils_ts_1.memoized)((p2) => {
        const { a, d } = CURVE;
        if (p2.is0())
          throw new Error("bad point: ZERO");
        const { X, Y, Z, T } = p2;
        const X2 = modP(X * X);
        const Y2 = modP(Y * Y);
        const Z2 = modP(Z * Z);
        const Z4 = modP(Z2 * Z2);
        const aX2 = modP(X2 * a);
        const left = modP(Z2 * modP(aX2 + Y2));
        const right = modP(Z4 + modP(d * modP(X2 * Y2)));
        if (left !== right)
          throw new Error("bad point: equation left != right (1)");
        const XY = modP(X * Y);
        const ZT = modP(Z * T);
        if (XY !== ZT)
          throw new Error("bad point: equation left != right (2)");
        return true;
      });
      class Point {
        constructor(X, Y, Z, T) {
          this.X = acoord("x", X);
          this.Y = acoord("y", Y);
          this.Z = acoord("z", Z, true);
          this.T = acoord("t", T);
          Object.freeze(this);
        }
        static CURVE() {
          return CURVE;
        }
        static fromAffine(p2) {
          if (p2 instanceof Point)
            throw new Error("extended point not allowed");
          const { x, y } = p2 || {};
          acoord("x", x);
          acoord("y", y);
          return new Point(x, y, _1n, modP(x * y));
        }
        // Uses algo from RFC8032 5.1.3.
        static fromBytes(bytes, zip215 = false) {
          const len = Fp.BYTES;
          const { a, d } = CURVE;
          bytes = (0, utils_ts_1.copyBytes)((0, utils_ts_1._abytes2)(bytes, len, "point"));
          (0, utils_ts_1._abool2)(zip215, "zip215");
          const normed = (0, utils_ts_1.copyBytes)(bytes);
          const lastByte = bytes[len - 1];
          normed[len - 1] = lastByte & -129;
          const y = (0, utils_ts_1.bytesToNumberLE)(normed);
          const max = zip215 ? MASK : Fp.ORDER;
          (0, utils_ts_1.aInRange)("point.y", y, _0n, max);
          const y2 = modP(y * y);
          const u = modP(y2 - _1n);
          const v = modP(d * y2 - a);
          let { isValid: isValid2, value: x } = uvRatio(u, v);
          if (!isValid2)
            throw new Error("bad point: invalid y coordinate");
          const isXOdd = (x & _1n) === _1n;
          const isLastByteOdd = (lastByte & 128) !== 0;
          if (!zip215 && x === _0n && isLastByteOdd)
            throw new Error("bad point: x=0 and x_0=1");
          if (isLastByteOdd !== isXOdd)
            x = modP(-x);
          return Point.fromAffine({ x, y });
        }
        static fromHex(bytes, zip215 = false) {
          return Point.fromBytes((0, utils_ts_1.ensureBytes)("point", bytes), zip215);
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        precompute(windowSize = 8, isLazy = true) {
          wnaf.createCache(this, windowSize);
          if (!isLazy)
            this.multiply(_2n);
          return this;
        }
        // Useful in fromAffine() - not for fromBytes(), which always created valid points.
        assertValidity() {
          assertValidMemo(this);
        }
        // Compare one point to another.
        equals(other) {
          aextpoint(other);
          const { X: X1, Y: Y1, Z: Z1 } = this;
          const { X: X2, Y: Y2, Z: Z2 } = other;
          const X1Z2 = modP(X1 * Z2);
          const X2Z1 = modP(X2 * Z1);
          const Y1Z2 = modP(Y1 * Z2);
          const Y2Z1 = modP(Y2 * Z1);
          return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
        }
        is0() {
          return this.equals(Point.ZERO);
        }
        negate() {
          return new Point(modP(-this.X), this.Y, this.Z, modP(-this.T));
        }
        // Fast algo for doubling Extended Point.
        // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
        // Cost: 4M + 4S + 1*a + 6add + 1*2.
        double() {
          const { a } = CURVE;
          const { X: X1, Y: Y1, Z: Z1 } = this;
          const A = modP(X1 * X1);
          const B = modP(Y1 * Y1);
          const C = modP(_2n * modP(Z1 * Z1));
          const D = modP(a * A);
          const x1y1 = X1 + Y1;
          const E = modP(modP(x1y1 * x1y1) - A - B);
          const G = D + B;
          const F = G - C;
          const H = D - B;
          const X3 = modP(E * F);
          const Y3 = modP(G * H);
          const T3 = modP(E * H);
          const Z3 = modP(F * G);
          return new Point(X3, Y3, Z3, T3);
        }
        // Fast algo for adding 2 Extended Points.
        // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
        // Cost: 9M + 1*a + 1*d + 7add.
        add(other) {
          aextpoint(other);
          const { a, d } = CURVE;
          const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
          const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
          const A = modP(X1 * X2);
          const B = modP(Y1 * Y2);
          const C = modP(T1 * d * T2);
          const D = modP(Z1 * Z2);
          const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
          const F = D - C;
          const G = D + C;
          const H = modP(B - a * A);
          const X3 = modP(E * F);
          const Y3 = modP(G * H);
          const T3 = modP(E * H);
          const Z3 = modP(F * G);
          return new Point(X3, Y3, Z3, T3);
        }
        subtract(other) {
          return this.add(other.negate());
        }
        // Constant-time multiplication.
        multiply(scalar) {
          if (!Fn.isValidNot0(scalar))
            throw new Error("invalid scalar: expected 1 <= sc < curve.n");
          const { p: p2, f: f2 } = wnaf.cached(this, scalar, (p3) => (0, curve_ts_1.normalizeZ)(Point, p3));
          return (0, curve_ts_1.normalizeZ)(Point, [p2, f2])[0];
        }
        // Non-constant-time multiplication. Uses double-and-add algorithm.
        // It's faster, but should only be used when you don't care about
        // an exposed private key e.g. sig verification.
        // Does NOT allow scalars higher than CURVE.n.
        // Accepts optional accumulator to merge with multiply (important for sparse scalars)
        multiplyUnsafe(scalar, acc = Point.ZERO) {
          if (!Fn.isValid(scalar))
            throw new Error("invalid scalar: expected 0 <= sc < curve.n");
          if (scalar === _0n)
            return Point.ZERO;
          if (this.is0() || scalar === _1n)
            return this;
          return wnaf.unsafe(this, scalar, (p2) => (0, curve_ts_1.normalizeZ)(Point, p2), acc);
        }
        // Checks if point is of small order.
        // If you add something to small order point, you will have "dirty"
        // point with torsion component.
        // Multiplies point by cofactor and checks if the result is 0.
        isSmallOrder() {
          return this.multiplyUnsafe(cofactor).is0();
        }
        // Multiplies point by curve order and checks if the result is 0.
        // Returns `false` is the point is dirty.
        isTorsionFree() {
          return wnaf.unsafe(this, CURVE.n).is0();
        }
        // Converts Extended point to default (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        toAffine(invertedZ) {
          return toAffineMemo(this, invertedZ);
        }
        clearCofactor() {
          if (cofactor === _1n)
            return this;
          return this.multiplyUnsafe(cofactor);
        }
        toBytes() {
          const { x, y } = this.toAffine();
          const bytes = Fp.toBytes(y);
          bytes[bytes.length - 1] |= x & _1n ? 128 : 0;
          return bytes;
        }
        toHex() {
          return (0, utils_ts_1.bytesToHex)(this.toBytes());
        }
        toString() {
          return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
        }
        // TODO: remove
        get ex() {
          return this.X;
        }
        get ey() {
          return this.Y;
        }
        get ez() {
          return this.Z;
        }
        get et() {
          return this.T;
        }
        static normalizeZ(points) {
          return (0, curve_ts_1.normalizeZ)(Point, points);
        }
        static msm(points, scalars) {
          return (0, curve_ts_1.pippenger)(Point, Fn, points, scalars);
        }
        _setWindowSize(windowSize) {
          this.precompute(windowSize);
        }
        toRawBytes() {
          return this.toBytes();
        }
      }
      Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n, modP(CURVE.Gx * CURVE.Gy));
      Point.ZERO = new Point(_0n, _1n, _1n, _0n);
      Point.Fp = Fp;
      Point.Fn = Fn;
      const wnaf = new curve_ts_1.wNAF(Point, Fn.BITS);
      Point.BASE.precompute(8);
      return Point;
    }
    var PrimeEdwardsPoint = class {
      constructor(ep) {
        this.ep = ep;
      }
      // Static methods that must be implemented by subclasses
      static fromBytes(_bytes) {
        (0, utils_ts_1.notImplemented)();
      }
      static fromHex(_hex) {
        (0, utils_ts_1.notImplemented)();
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      // Common implementations
      clearCofactor() {
        return this;
      }
      assertValidity() {
        this.ep.assertValidity();
      }
      toAffine(invertedZ) {
        return this.ep.toAffine(invertedZ);
      }
      toHex() {
        return (0, utils_ts_1.bytesToHex)(this.toBytes());
      }
      toString() {
        return this.toHex();
      }
      isTorsionFree() {
        return true;
      }
      isSmallOrder() {
        return false;
      }
      add(other) {
        this.assertSame(other);
        return this.init(this.ep.add(other.ep));
      }
      subtract(other) {
        this.assertSame(other);
        return this.init(this.ep.subtract(other.ep));
      }
      multiply(scalar) {
        return this.init(this.ep.multiply(scalar));
      }
      multiplyUnsafe(scalar) {
        return this.init(this.ep.multiplyUnsafe(scalar));
      }
      double() {
        return this.init(this.ep.double());
      }
      negate() {
        return this.init(this.ep.negate());
      }
      precompute(windowSize, isLazy) {
        return this.init(this.ep.precompute(windowSize, isLazy));
      }
      /** @deprecated use `toBytes` */
      toRawBytes() {
        return this.toBytes();
      }
    };
    exports.PrimeEdwardsPoint = PrimeEdwardsPoint;
    function eddsa(Point, cHash, eddsaOpts = {}) {
      if (typeof cHash !== "function")
        throw new Error('"hash" function param is required');
      (0, utils_ts_1._validateObject)(eddsaOpts, {}, {
        adjustScalarBytes: "function",
        randomBytes: "function",
        domain: "function",
        prehash: "function",
        mapToCurve: "function"
      });
      const { prehash } = eddsaOpts;
      const { BASE, Fp, Fn } = Point;
      const randomBytes = eddsaOpts.randomBytes || utils_ts_1.randomBytes;
      const adjustScalarBytes = eddsaOpts.adjustScalarBytes || ((bytes) => bytes);
      const domain = eddsaOpts.domain || ((data, ctx, phflag) => {
        (0, utils_ts_1._abool2)(phflag, "phflag");
        if (ctx.length || phflag)
          throw new Error("Contexts/pre-hash are not supported");
        return data;
      });
      function modN_LE(hash) {
        return Fn.create((0, utils_ts_1.bytesToNumberLE)(hash));
      }
      function getPrivateScalar(key) {
        const len = lengths.secretKey;
        key = (0, utils_ts_1.ensureBytes)("private key", key, len);
        const hashed = (0, utils_ts_1.ensureBytes)("hashed private key", cHash(key), 2 * len);
        const head = adjustScalarBytes(hashed.slice(0, len));
        const prefix = hashed.slice(len, 2 * len);
        const scalar = modN_LE(head);
        return { head, prefix, scalar };
      }
      function getExtendedPublicKey(secretKey) {
        const { head, prefix, scalar } = getPrivateScalar(secretKey);
        const point = BASE.multiply(scalar);
        const pointBytes = point.toBytes();
        return { head, prefix, scalar, point, pointBytes };
      }
      function getPublicKey(secretKey) {
        return getExtendedPublicKey(secretKey).pointBytes;
      }
      function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
        const msg = (0, utils_ts_1.concatBytes)(...msgs);
        return modN_LE(cHash(domain(msg, (0, utils_ts_1.ensureBytes)("context", context), !!prehash)));
      }
      function sign(msg, secretKey, options = {}) {
        msg = (0, utils_ts_1.ensureBytes)("message", msg);
        if (prehash)
          msg = prehash(msg);
        const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
        const r = hashDomainToScalar(options.context, prefix, msg);
        const R = BASE.multiply(r).toBytes();
        const k = hashDomainToScalar(options.context, R, pointBytes, msg);
        const s = Fn.create(r + k * scalar);
        if (!Fn.isValid(s))
          throw new Error("sign failed: invalid s");
        const rs = (0, utils_ts_1.concatBytes)(R, Fn.toBytes(s));
        return (0, utils_ts_1._abytes2)(rs, lengths.signature, "result");
      }
      const verifyOpts = { zip215: true };
      function verify(sig, msg, publicKey, options = verifyOpts) {
        const { context, zip215 } = options;
        const len = lengths.signature;
        sig = (0, utils_ts_1.ensureBytes)("signature", sig, len);
        msg = (0, utils_ts_1.ensureBytes)("message", msg);
        publicKey = (0, utils_ts_1.ensureBytes)("publicKey", publicKey, lengths.publicKey);
        if (zip215 !== void 0)
          (0, utils_ts_1._abool2)(zip215, "zip215");
        if (prehash)
          msg = prehash(msg);
        const mid = len / 2;
        const r = sig.subarray(0, mid);
        const s = (0, utils_ts_1.bytesToNumberLE)(sig.subarray(mid, len));
        let A, R, SB;
        try {
          A = Point.fromBytes(publicKey, zip215);
          R = Point.fromBytes(r, zip215);
          SB = BASE.multiplyUnsafe(s);
        } catch (error) {
          return false;
        }
        if (!zip215 && A.isSmallOrder())
          return false;
        const k = hashDomainToScalar(context, R.toBytes(), A.toBytes(), msg);
        const RkA = R.add(A.multiplyUnsafe(k));
        return RkA.subtract(SB).clearCofactor().is0();
      }
      const _size = Fp.BYTES;
      const lengths = {
        secretKey: _size,
        publicKey: _size,
        signature: 2 * _size,
        seed: _size
      };
      function randomSecretKey(seed = randomBytes(lengths.seed)) {
        return (0, utils_ts_1._abytes2)(seed, lengths.seed, "seed");
      }
      function keygen(seed) {
        const secretKey = utils.randomSecretKey(seed);
        return { secretKey, publicKey: getPublicKey(secretKey) };
      }
      function isValidSecretKey(key) {
        return (0, utils_ts_1.isBytes)(key) && key.length === Fn.BYTES;
      }
      function isValidPublicKey(key, zip215) {
        try {
          return !!Point.fromBytes(key, zip215);
        } catch (error) {
          return false;
        }
      }
      const utils = {
        getExtendedPublicKey,
        randomSecretKey,
        isValidSecretKey,
        isValidPublicKey,
        /**
         * Converts ed public key to x public key. Uses formula:
         * - ed25519:
         *   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
         *   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
         * - ed448:
         *   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
         *   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
         */
        toMontgomery(publicKey) {
          const { y } = Point.fromBytes(publicKey);
          const size = lengths.publicKey;
          const is25519 = size === 32;
          if (!is25519 && size !== 57)
            throw new Error("only defined for 25519 and 448");
          const u = is25519 ? Fp.div(_1n + y, _1n - y) : Fp.div(y - _1n, y + _1n);
          return Fp.toBytes(u);
        },
        toMontgomeryPriv(secretKey) {
          const size = lengths.secretKey;
          (0, utils_ts_1._abytes2)(secretKey, size);
          const hashed = cHash(secretKey.subarray(0, size));
          return adjustScalarBytes(hashed).subarray(0, size);
        },
        /** @deprecated */
        randomPrivateKey: randomSecretKey,
        /** @deprecated */
        precompute(windowSize = 8, point = Point.BASE) {
          return point.precompute(windowSize, false);
        }
      };
      return Object.freeze({
        keygen,
        getPublicKey,
        sign,
        verify,
        utils,
        Point,
        lengths
      });
    }
    function _eddsa_legacy_opts_to_new(c2) {
      const CURVE = {
        a: c2.a,
        d: c2.d,
        p: c2.Fp.ORDER,
        n: c2.n,
        h: c2.h,
        Gx: c2.Gx,
        Gy: c2.Gy
      };
      const Fp = c2.Fp;
      const Fn = (0, modular_ts_1.Field)(CURVE.n, c2.nBitLength, true);
      const curveOpts = { Fp, Fn, uvRatio: c2.uvRatio };
      const eddsaOpts = {
        randomBytes: c2.randomBytes,
        adjustScalarBytes: c2.adjustScalarBytes,
        domain: c2.domain,
        prehash: c2.prehash,
        mapToCurve: c2.mapToCurve
      };
      return { CURVE, curveOpts, hash: c2.hash, eddsaOpts };
    }
    function _eddsa_new_output_to_legacy(c2, eddsa2) {
      const Point = eddsa2.Point;
      const legacy = Object.assign({}, eddsa2, {
        ExtendedPoint: Point,
        CURVE: c2,
        nBitLength: Point.Fn.BITS,
        nByteLength: Point.Fn.BYTES
      });
      return legacy;
    }
    function twistedEdwards(c2) {
      const { CURVE, curveOpts, hash, eddsaOpts } = _eddsa_legacy_opts_to_new(c2);
      const Point = edwards(CURVE, curveOpts);
      const EDDSA = eddsa(Point, hash, eddsaOpts);
      return _eddsa_new_output_to_legacy(c2, EDDSA);
    }
  }
});

// ../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/hash-to-curve.js
var require_hash_to_curve = __commonJS({
  "../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/hash-to-curve.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._DST_scalar = void 0;
    exports.expand_message_xmd = expand_message_xmd;
    exports.expand_message_xof = expand_message_xof;
    exports.hash_to_field = hash_to_field;
    exports.isogenyMap = isogenyMap;
    exports.createHasher = createHasher;
    var utils_ts_1 = require_utils5();
    var modular_ts_1 = require_modular();
    var os2ip = utils_ts_1.bytesToNumberBE;
    function i2osp(value, length) {
      anum(value);
      anum(length);
      if (value < 0 || value >= 1 << 8 * length)
        throw new Error("invalid I2OSP input: " + value);
      const res = Array.from({ length }).fill(0);
      for (let i = length - 1; i >= 0; i--) {
        res[i] = value & 255;
        value >>>= 8;
      }
      return new Uint8Array(res);
    }
    function strxor(a, b2) {
      const arr = new Uint8Array(a.length);
      for (let i = 0; i < a.length; i++) {
        arr[i] = a[i] ^ b2[i];
      }
      return arr;
    }
    function anum(item) {
      if (!Number.isSafeInteger(item))
        throw new Error("number expected");
    }
    function normDST(DST) {
      if (!(0, utils_ts_1.isBytes)(DST) && typeof DST !== "string")
        throw new Error("DST must be Uint8Array or string");
      return typeof DST === "string" ? (0, utils_ts_1.utf8ToBytes)(DST) : DST;
    }
    function expand_message_xmd(msg, DST, lenInBytes, H) {
      (0, utils_ts_1.abytes)(msg);
      anum(lenInBytes);
      DST = normDST(DST);
      if (DST.length > 255)
        DST = H((0, utils_ts_1.concatBytes)((0, utils_ts_1.utf8ToBytes)("H2C-OVERSIZE-DST-"), DST));
      const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
      const ell = Math.ceil(lenInBytes / b_in_bytes);
      if (lenInBytes > 65535 || ell > 255)
        throw new Error("expand_message_xmd: invalid lenInBytes");
      const DST_prime = (0, utils_ts_1.concatBytes)(DST, i2osp(DST.length, 1));
      const Z_pad = i2osp(0, r_in_bytes);
      const l_i_b_str = i2osp(lenInBytes, 2);
      const b2 = new Array(ell);
      const b_0 = H((0, utils_ts_1.concatBytes)(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
      b2[0] = H((0, utils_ts_1.concatBytes)(b_0, i2osp(1, 1), DST_prime));
      for (let i = 1; i <= ell; i++) {
        const args = [strxor(b_0, b2[i - 1]), i2osp(i + 1, 1), DST_prime];
        b2[i] = H((0, utils_ts_1.concatBytes)(...args));
      }
      const pseudo_random_bytes = (0, utils_ts_1.concatBytes)(...b2);
      return pseudo_random_bytes.slice(0, lenInBytes);
    }
    function expand_message_xof(msg, DST, lenInBytes, k, H) {
      (0, utils_ts_1.abytes)(msg);
      anum(lenInBytes);
      DST = normDST(DST);
      if (DST.length > 255) {
        const dkLen = Math.ceil(2 * k / 8);
        DST = H.create({ dkLen }).update((0, utils_ts_1.utf8ToBytes)("H2C-OVERSIZE-DST-")).update(DST).digest();
      }
      if (lenInBytes > 65535 || DST.length > 255)
        throw new Error("expand_message_xof: invalid lenInBytes");
      return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
    }
    function hash_to_field(msg, count, options) {
      (0, utils_ts_1._validateObject)(options, {
        p: "bigint",
        m: "number",
        k: "number",
        hash: "function"
      });
      const { p: p2, k, m: m2, hash, expand, DST } = options;
      if (!(0, utils_ts_1.isHash)(options.hash))
        throw new Error("expected valid hash");
      (0, utils_ts_1.abytes)(msg);
      anum(count);
      const log2p = p2.toString(2).length;
      const L = Math.ceil((log2p + k) / 8);
      const len_in_bytes = count * m2 * L;
      let prb;
      if (expand === "xmd") {
        prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
      } else if (expand === "xof") {
        prb = expand_message_xof(msg, DST, len_in_bytes, k, hash);
      } else if (expand === "_internal_pass") {
        prb = msg;
      } else {
        throw new Error('expand must be "xmd" or "xof"');
      }
      const u = new Array(count);
      for (let i = 0; i < count; i++) {
        const e = new Array(m2);
        for (let j = 0; j < m2; j++) {
          const elm_offset = L * (j + i * m2);
          const tv = prb.subarray(elm_offset, elm_offset + L);
          e[j] = (0, modular_ts_1.mod)(os2ip(tv), p2);
        }
        u[i] = e;
      }
      return u;
    }
    function isogenyMap(field, map) {
      const coeff = map.map((i) => Array.from(i).reverse());
      return (x, y) => {
        const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
        const [xd_inv, yd_inv] = (0, modular_ts_1.FpInvertBatch)(field, [xd, yd], true);
        x = field.mul(xn, xd_inv);
        y = field.mul(y, field.mul(yn, yd_inv));
        return { x, y };
      };
    }
    exports._DST_scalar = (0, utils_ts_1.utf8ToBytes)("HashToScalar-");
    function createHasher(Point, mapToCurve, defaults) {
      if (typeof mapToCurve !== "function")
        throw new Error("mapToCurve() must be defined");
      function map(num) {
        return Point.fromAffine(mapToCurve(num));
      }
      function clear(initial) {
        const P = initial.clearCofactor();
        if (P.equals(Point.ZERO))
          return Point.ZERO;
        P.assertValidity();
        return P;
      }
      return {
        defaults,
        hashToCurve(msg, options) {
          const opts = Object.assign({}, defaults, options);
          const u = hash_to_field(msg, 2, opts);
          const u0 = map(u[0]);
          const u1 = map(u[1]);
          return clear(u0.add(u1));
        },
        encodeToCurve(msg, options) {
          const optsDst = defaults.encodeDST ? { DST: defaults.encodeDST } : {};
          const opts = Object.assign({}, defaults, optsDst, options);
          const u = hash_to_field(msg, 1, opts);
          const u0 = map(u[0]);
          return clear(u0);
        },
        /** See {@link H2CHasher} */
        mapToCurve(scalars) {
          if (!Array.isArray(scalars))
            throw new Error("expected array of bigints");
          for (const i of scalars)
            if (typeof i !== "bigint")
              throw new Error("expected array of bigints");
          return clear(map(scalars));
        },
        // hash_to_scalar can produce 0: https://www.rfc-editor.org/errata/eid8393
        // RFC 9380, draft-irtf-cfrg-bbs-signatures-08
        hashToScalar(msg, options) {
          const N = Point.Fn.ORDER;
          const opts = Object.assign({}, defaults, { p: N, m: 1, DST: exports._DST_scalar }, options);
          return hash_to_field(msg, 1, opts)[0][0];
        }
      };
    }
  }
});

// ../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/montgomery.js
var require_montgomery = __commonJS({
  "../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/montgomery.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.montgomery = montgomery;
    var utils_ts_1 = require_utils5();
    var modular_ts_1 = require_modular();
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    function validateOpts(curve) {
      (0, utils_ts_1._validateObject)(curve, {
        adjustScalarBytes: "function",
        powPminus2: "function"
      });
      return Object.freeze({ ...curve });
    }
    function montgomery(curveDef) {
      const CURVE = validateOpts(curveDef);
      const { P, type, adjustScalarBytes, powPminus2, randomBytes: rand } = CURVE;
      const is25519 = type === "x25519";
      if (!is25519 && type !== "x448")
        throw new Error("invalid type");
      const randomBytes_ = rand || utils_ts_1.randomBytes;
      const montgomeryBits = is25519 ? 255 : 448;
      const fieldLen = is25519 ? 32 : 56;
      const Gu = is25519 ? BigInt(9) : BigInt(5);
      const a24 = is25519 ? BigInt(121665) : BigInt(39081);
      const minScalar = is25519 ? _2n ** BigInt(254) : _2n ** BigInt(447);
      const maxAdded = is25519 ? BigInt(8) * _2n ** BigInt(251) - _1n : BigInt(4) * _2n ** BigInt(445) - _1n;
      const maxScalar = minScalar + maxAdded + _1n;
      const modP = (n) => (0, modular_ts_1.mod)(n, P);
      const GuBytes = encodeU(Gu);
      function encodeU(u) {
        return (0, utils_ts_1.numberToBytesLE)(modP(u), fieldLen);
      }
      function decodeU(u) {
        const _u = (0, utils_ts_1.ensureBytes)("u coordinate", u, fieldLen);
        if (is25519)
          _u[31] &= 127;
        return modP((0, utils_ts_1.bytesToNumberLE)(_u));
      }
      function decodeScalar(scalar) {
        return (0, utils_ts_1.bytesToNumberLE)(adjustScalarBytes((0, utils_ts_1.ensureBytes)("scalar", scalar, fieldLen)));
      }
      function scalarMult(scalar, u) {
        const pu = montgomeryLadder(decodeU(u), decodeScalar(scalar));
        if (pu === _0n)
          throw new Error("invalid private or public key received");
        return encodeU(pu);
      }
      function scalarMultBase(scalar) {
        return scalarMult(scalar, GuBytes);
      }
      function cswap(swap, x_2, x_3) {
        const dummy = modP(swap * (x_2 - x_3));
        x_2 = modP(x_2 - dummy);
        x_3 = modP(x_3 + dummy);
        return { x_2, x_3 };
      }
      function montgomeryLadder(u, scalar) {
        (0, utils_ts_1.aInRange)("u", u, _0n, P);
        (0, utils_ts_1.aInRange)("scalar", scalar, minScalar, maxScalar);
        const k = scalar;
        const x_1 = u;
        let x_2 = _1n;
        let z_2 = _0n;
        let x_3 = u;
        let z_3 = _1n;
        let swap = _0n;
        for (let t = BigInt(montgomeryBits - 1); t >= _0n; t--) {
          const k_t = k >> t & _1n;
          swap ^= k_t;
          ({ x_2, x_3 } = cswap(swap, x_2, x_3));
          ({ x_2: z_2, x_3: z_3 } = cswap(swap, z_2, z_3));
          swap = k_t;
          const A = x_2 + z_2;
          const AA = modP(A * A);
          const B = x_2 - z_2;
          const BB = modP(B * B);
          const E = AA - BB;
          const C = x_3 + z_3;
          const D = x_3 - z_3;
          const DA = modP(D * A);
          const CB = modP(C * B);
          const dacb = DA + CB;
          const da_cb = DA - CB;
          x_3 = modP(dacb * dacb);
          z_3 = modP(x_1 * modP(da_cb * da_cb));
          x_2 = modP(AA * BB);
          z_2 = modP(E * (AA + modP(a24 * E)));
        }
        ({ x_2, x_3 } = cswap(swap, x_2, x_3));
        ({ x_2: z_2, x_3: z_3 } = cswap(swap, z_2, z_3));
        const z2 = powPminus2(z_2);
        return modP(x_2 * z2);
      }
      const lengths = {
        secretKey: fieldLen,
        publicKey: fieldLen,
        seed: fieldLen
      };
      const randomSecretKey = (seed = randomBytes_(fieldLen)) => {
        (0, utils_ts_1.abytes)(seed, lengths.seed);
        return seed;
      };
      function keygen(seed) {
        const secretKey = randomSecretKey(seed);
        return { secretKey, publicKey: scalarMultBase(secretKey) };
      }
      const utils = {
        randomSecretKey,
        randomPrivateKey: randomSecretKey
      };
      return {
        keygen,
        getSharedSecret: (secretKey, publicKey) => scalarMult(secretKey, publicKey),
        getPublicKey: (secretKey) => scalarMultBase(secretKey),
        scalarMult,
        scalarMultBase,
        utils,
        GuBytes: GuBytes.slice(),
        lengths
      };
    }
  }
});

// ../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/ed25519.js
var require_ed25519 = __commonJS({
  "../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/ed25519.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hash_to_ristretto255 = exports.hashToRistretto255 = exports.encodeToCurve = exports.hashToCurve = exports.RistrettoPoint = exports.edwardsToMontgomery = exports.ED25519_TORSION_SUBGROUP = exports.ristretto255_hasher = exports.ristretto255 = exports.ed25519_hasher = exports.x25519 = exports.ed25519ph = exports.ed25519ctx = exports.ed25519 = void 0;
    exports.edwardsToMontgomeryPub = edwardsToMontgomeryPub;
    exports.edwardsToMontgomeryPriv = edwardsToMontgomeryPriv;
    var sha2_js_1 = require_sha2();
    var utils_js_1 = require_utils4();
    var curve_ts_1 = require_curve();
    var edwards_ts_1 = require_edwards();
    var hash_to_curve_ts_1 = require_hash_to_curve();
    var modular_ts_1 = require_modular();
    var montgomery_ts_1 = require_montgomery();
    var utils_ts_1 = require_utils5();
    var _0n = /* @__PURE__ */ BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var _3n = BigInt(3);
    var _5n = BigInt(5);
    var _8n = BigInt(8);
    var ed25519_CURVE_p = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
    var ed25519_CURVE = /* @__PURE__ */ (() => ({
      p: ed25519_CURVE_p,
      n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
      h: _8n,
      a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
      d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
      Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
      Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
    }))();
    function ed25519_pow_2_252_3(x) {
      const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
      const P = ed25519_CURVE_p;
      const x2 = x * x % P;
      const b2 = x2 * x % P;
      const b4 = (0, modular_ts_1.pow2)(b2, _2n, P) * b2 % P;
      const b5 = (0, modular_ts_1.pow2)(b4, _1n, P) * x % P;
      const b10 = (0, modular_ts_1.pow2)(b5, _5n, P) * b5 % P;
      const b20 = (0, modular_ts_1.pow2)(b10, _10n, P) * b10 % P;
      const b40 = (0, modular_ts_1.pow2)(b20, _20n, P) * b20 % P;
      const b80 = (0, modular_ts_1.pow2)(b40, _40n, P) * b40 % P;
      const b160 = (0, modular_ts_1.pow2)(b80, _80n, P) * b80 % P;
      const b240 = (0, modular_ts_1.pow2)(b160, _80n, P) * b80 % P;
      const b250 = (0, modular_ts_1.pow2)(b240, _10n, P) * b10 % P;
      const pow_p_5_8 = (0, modular_ts_1.pow2)(b250, _2n, P) * x % P;
      return { pow_p_5_8, b2 };
    }
    function adjustScalarBytes(bytes) {
      bytes[0] &= 248;
      bytes[31] &= 127;
      bytes[31] |= 64;
      return bytes;
    }
    var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
    function uvRatio(u, v) {
      const P = ed25519_CURVE_p;
      const v3 = (0, modular_ts_1.mod)(v * v * v, P);
      const v7 = (0, modular_ts_1.mod)(v3 * v3 * v, P);
      const pow = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
      let x = (0, modular_ts_1.mod)(u * v3 * pow, P);
      const vx2 = (0, modular_ts_1.mod)(v * x * x, P);
      const root1 = x;
      const root2 = (0, modular_ts_1.mod)(x * ED25519_SQRT_M1, P);
      const useRoot1 = vx2 === u;
      const useRoot2 = vx2 === (0, modular_ts_1.mod)(-u, P);
      const noRoot = vx2 === (0, modular_ts_1.mod)(-u * ED25519_SQRT_M1, P);
      if (useRoot1)
        x = root1;
      if (useRoot2 || noRoot)
        x = root2;
      if ((0, modular_ts_1.isNegativeLE)(x, P))
        x = (0, modular_ts_1.mod)(-x, P);
      return { isValid: useRoot1 || useRoot2, value: x };
    }
    var Fp = /* @__PURE__ */ (() => (0, modular_ts_1.Field)(ed25519_CURVE.p, { isLE: true }))();
    var Fn = /* @__PURE__ */ (() => (0, modular_ts_1.Field)(ed25519_CURVE.n, { isLE: true }))();
    var ed25519Defaults = /* @__PURE__ */ (() => ({
      ...ed25519_CURVE,
      Fp,
      hash: sha2_js_1.sha512,
      adjustScalarBytes,
      // dom2
      // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
      // Constant-time, u/√v
      uvRatio
    }))();
    exports.ed25519 = (() => (0, edwards_ts_1.twistedEdwards)(ed25519Defaults))();
    function ed25519_domain(data, ctx, phflag) {
      if (ctx.length > 255)
        throw new Error("Context is too big");
      return (0, utils_js_1.concatBytes)((0, utils_js_1.utf8ToBytes)("SigEd25519 no Ed25519 collisions"), new Uint8Array([phflag ? 1 : 0, ctx.length]), ctx, data);
    }
    exports.ed25519ctx = (() => (0, edwards_ts_1.twistedEdwards)({
      ...ed25519Defaults,
      domain: ed25519_domain
    }))();
    exports.ed25519ph = (() => (0, edwards_ts_1.twistedEdwards)(Object.assign({}, ed25519Defaults, {
      domain: ed25519_domain,
      prehash: sha2_js_1.sha512
    })))();
    exports.x25519 = (() => {
      const P = Fp.ORDER;
      return (0, montgomery_ts_1.montgomery)({
        P,
        type: "x25519",
        powPminus2: (x) => {
          const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
          return (0, modular_ts_1.mod)((0, modular_ts_1.pow2)(pow_p_5_8, _3n, P) * b2, P);
        },
        adjustScalarBytes
      });
    })();
    var ELL2_C1 = /* @__PURE__ */ (() => (ed25519_CURVE_p + _3n) / _8n)();
    var ELL2_C2 = /* @__PURE__ */ (() => Fp.pow(_2n, ELL2_C1))();
    var ELL2_C3 = /* @__PURE__ */ (() => Fp.sqrt(Fp.neg(Fp.ONE)))();
    function map_to_curve_elligator2_curve25519(u) {
      const ELL2_C4 = (ed25519_CURVE_p - _5n) / _8n;
      const ELL2_J = BigInt(486662);
      let tv1 = Fp.sqr(u);
      tv1 = Fp.mul(tv1, _2n);
      let xd = Fp.add(tv1, Fp.ONE);
      let x1n = Fp.neg(ELL2_J);
      let tv2 = Fp.sqr(xd);
      let gxd = Fp.mul(tv2, xd);
      let gx1 = Fp.mul(tv1, ELL2_J);
      gx1 = Fp.mul(gx1, x1n);
      gx1 = Fp.add(gx1, tv2);
      gx1 = Fp.mul(gx1, x1n);
      let tv3 = Fp.sqr(gxd);
      tv2 = Fp.sqr(tv3);
      tv3 = Fp.mul(tv3, gxd);
      tv3 = Fp.mul(tv3, gx1);
      tv2 = Fp.mul(tv2, tv3);
      let y11 = Fp.pow(tv2, ELL2_C4);
      y11 = Fp.mul(y11, tv3);
      let y12 = Fp.mul(y11, ELL2_C3);
      tv2 = Fp.sqr(y11);
      tv2 = Fp.mul(tv2, gxd);
      let e1 = Fp.eql(tv2, gx1);
      let y1 = Fp.cmov(y12, y11, e1);
      let x2n = Fp.mul(x1n, tv1);
      let y21 = Fp.mul(y11, u);
      y21 = Fp.mul(y21, ELL2_C2);
      let y22 = Fp.mul(y21, ELL2_C3);
      let gx2 = Fp.mul(gx1, tv1);
      tv2 = Fp.sqr(y21);
      tv2 = Fp.mul(tv2, gxd);
      let e2 = Fp.eql(tv2, gx2);
      let y2 = Fp.cmov(y22, y21, e2);
      tv2 = Fp.sqr(y1);
      tv2 = Fp.mul(tv2, gxd);
      let e3 = Fp.eql(tv2, gx1);
      let xn = Fp.cmov(x2n, x1n, e3);
      let y = Fp.cmov(y2, y1, e3);
      let e4 = Fp.isOdd(y);
      y = Fp.cmov(y, Fp.neg(y), e3 !== e4);
      return { xMn: xn, xMd: xd, yMn: y, yMd: _1n };
    }
    var ELL2_C1_EDWARDS = /* @__PURE__ */ (() => (0, modular_ts_1.FpSqrtEven)(Fp, Fp.neg(BigInt(486664))))();
    function map_to_curve_elligator2_edwards25519(u) {
      const { xMn, xMd, yMn, yMd } = map_to_curve_elligator2_curve25519(u);
      let xn = Fp.mul(xMn, yMd);
      xn = Fp.mul(xn, ELL2_C1_EDWARDS);
      let xd = Fp.mul(xMd, yMn);
      let yn = Fp.sub(xMn, xMd);
      let yd = Fp.add(xMn, xMd);
      let tv1 = Fp.mul(xd, yd);
      let e = Fp.eql(tv1, Fp.ZERO);
      xn = Fp.cmov(xn, Fp.ZERO, e);
      xd = Fp.cmov(xd, Fp.ONE, e);
      yn = Fp.cmov(yn, Fp.ONE, e);
      yd = Fp.cmov(yd, Fp.ONE, e);
      const [xd_inv, yd_inv] = (0, modular_ts_1.FpInvertBatch)(Fp, [xd, yd], true);
      return { x: Fp.mul(xn, xd_inv), y: Fp.mul(yn, yd_inv) };
    }
    exports.ed25519_hasher = (() => (0, hash_to_curve_ts_1.createHasher)(exports.ed25519.Point, (scalars) => map_to_curve_elligator2_edwards25519(scalars[0]), {
      DST: "edwards25519_XMD:SHA-512_ELL2_RO_",
      encodeDST: "edwards25519_XMD:SHA-512_ELL2_NU_",
      p: ed25519_CURVE_p,
      m: 1,
      k: 128,
      expand: "xmd",
      hash: sha2_js_1.sha512
    }))();
    var SQRT_M1 = ED25519_SQRT_M1;
    var SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
    var INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
    var ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
    var D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
    var invertSqrt = (number) => uvRatio(_1n, number);
    var MAX_255B = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    var bytes255ToNumberLE = (bytes) => exports.ed25519.Point.Fp.create((0, utils_ts_1.bytesToNumberLE)(bytes) & MAX_255B);
    function calcElligatorRistrettoMap(r0) {
      const { d } = ed25519_CURVE;
      const P = ed25519_CURVE_p;
      const mod = (n) => Fp.create(n);
      const r = mod(SQRT_M1 * r0 * r0);
      const Ns = mod((r + _1n) * ONE_MINUS_D_SQ);
      let c2 = BigInt(-1);
      const D = mod((c2 - d * r) * mod(r + d));
      let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
      let s_ = mod(s * r0);
      if (!(0, modular_ts_1.isNegativeLE)(s_, P))
        s_ = mod(-s_);
      if (!Ns_D_is_sq)
        s = s_;
      if (!Ns_D_is_sq)
        c2 = r;
      const Nt = mod(c2 * (r - _1n) * D_MINUS_ONE_SQ - D);
      const s2 = s * s;
      const W0 = mod((s + s) * D);
      const W1 = mod(Nt * SQRT_AD_MINUS_ONE);
      const W2 = mod(_1n - s2);
      const W3 = mod(_1n + s2);
      return new exports.ed25519.Point(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
    }
    function ristretto255_map(bytes) {
      (0, utils_js_1.abytes)(bytes, 64);
      const r1 = bytes255ToNumberLE(bytes.subarray(0, 32));
      const R1 = calcElligatorRistrettoMap(r1);
      const r2 = bytes255ToNumberLE(bytes.subarray(32, 64));
      const R2 = calcElligatorRistrettoMap(r2);
      return new _RistrettoPoint(R1.add(R2));
    }
    var _RistrettoPoint = class __RistrettoPoint extends edwards_ts_1.PrimeEdwardsPoint {
      constructor(ep) {
        super(ep);
      }
      static fromAffine(ap) {
        return new __RistrettoPoint(exports.ed25519.Point.fromAffine(ap));
      }
      assertSame(other) {
        if (!(other instanceof __RistrettoPoint))
          throw new Error("RistrettoPoint expected");
      }
      init(ep) {
        return new __RistrettoPoint(ep);
      }
      /** @deprecated use `import { ristretto255_hasher } from '@noble/curves/ed25519.js';` */
      static hashToCurve(hex) {
        return ristretto255_map((0, utils_ts_1.ensureBytes)("ristrettoHash", hex, 64));
      }
      static fromBytes(bytes) {
        (0, utils_js_1.abytes)(bytes, 32);
        const { a, d } = ed25519_CURVE;
        const P = ed25519_CURVE_p;
        const mod = (n) => Fp.create(n);
        const s = bytes255ToNumberLE(bytes);
        if (!(0, utils_ts_1.equalBytes)(Fp.toBytes(s), bytes) || (0, modular_ts_1.isNegativeLE)(s, P))
          throw new Error("invalid ristretto255 encoding 1");
        const s2 = mod(s * s);
        const u1 = mod(_1n + a * s2);
        const u2 = mod(_1n - a * s2);
        const u1_2 = mod(u1 * u1);
        const u2_2 = mod(u2 * u2);
        const v = mod(a * d * u1_2 - u2_2);
        const { isValid: isValid2, value: I } = invertSqrt(mod(v * u2_2));
        const Dx = mod(I * u2);
        const Dy = mod(I * Dx * v);
        let x = mod((s + s) * Dx);
        if ((0, modular_ts_1.isNegativeLE)(x, P))
          x = mod(-x);
        const y = mod(u1 * Dy);
        const t = mod(x * y);
        if (!isValid2 || (0, modular_ts_1.isNegativeLE)(t, P) || y === _0n)
          throw new Error("invalid ristretto255 encoding 2");
        return new __RistrettoPoint(new exports.ed25519.Point(x, y, _1n, t));
      }
      /**
       * Converts ristretto-encoded string to ristretto point.
       * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
       * @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
       */
      static fromHex(hex) {
        return __RistrettoPoint.fromBytes((0, utils_ts_1.ensureBytes)("ristrettoHex", hex, 32));
      }
      static msm(points, scalars) {
        return (0, curve_ts_1.pippenger)(__RistrettoPoint, exports.ed25519.Point.Fn, points, scalars);
      }
      /**
       * Encodes ristretto point to Uint8Array.
       * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
       */
      toBytes() {
        let { X, Y, Z, T } = this.ep;
        const P = ed25519_CURVE_p;
        const mod = (n) => Fp.create(n);
        const u1 = mod(mod(Z + Y) * mod(Z - Y));
        const u2 = mod(X * Y);
        const u2sq = mod(u2 * u2);
        const { value: invsqrt } = invertSqrt(mod(u1 * u2sq));
        const D1 = mod(invsqrt * u1);
        const D2 = mod(invsqrt * u2);
        const zInv = mod(D1 * D2 * T);
        let D;
        if ((0, modular_ts_1.isNegativeLE)(T * zInv, P)) {
          let _x = mod(Y * SQRT_M1);
          let _y = mod(X * SQRT_M1);
          X = _x;
          Y = _y;
          D = mod(D1 * INVSQRT_A_MINUS_D);
        } else {
          D = D2;
        }
        if ((0, modular_ts_1.isNegativeLE)(X * zInv, P))
          Y = mod(-Y);
        let s = mod((Z - Y) * D);
        if ((0, modular_ts_1.isNegativeLE)(s, P))
          s = mod(-s);
        return Fp.toBytes(s);
      }
      /**
       * Compares two Ristretto points.
       * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
       */
      equals(other) {
        this.assertSame(other);
        const { X: X1, Y: Y1 } = this.ep;
        const { X: X2, Y: Y2 } = other.ep;
        const mod = (n) => Fp.create(n);
        const one = mod(X1 * Y2) === mod(Y1 * X2);
        const two = mod(Y1 * Y2) === mod(X1 * X2);
        return one || two;
      }
      is0() {
        return this.equals(__RistrettoPoint.ZERO);
      }
    };
    _RistrettoPoint.BASE = /* @__PURE__ */ (() => new _RistrettoPoint(exports.ed25519.Point.BASE))();
    _RistrettoPoint.ZERO = /* @__PURE__ */ (() => new _RistrettoPoint(exports.ed25519.Point.ZERO))();
    _RistrettoPoint.Fp = /* @__PURE__ */ (() => Fp)();
    _RistrettoPoint.Fn = /* @__PURE__ */ (() => Fn)();
    exports.ristretto255 = { Point: _RistrettoPoint };
    exports.ristretto255_hasher = {
      hashToCurve(msg, options) {
        const DST = options?.DST || "ristretto255_XMD:SHA-512_R255MAP_RO_";
        const xmd = (0, hash_to_curve_ts_1.expand_message_xmd)(msg, DST, 64, sha2_js_1.sha512);
        return ristretto255_map(xmd);
      },
      hashToScalar(msg, options = { DST: hash_to_curve_ts_1._DST_scalar }) {
        const xmd = (0, hash_to_curve_ts_1.expand_message_xmd)(msg, options.DST, 64, sha2_js_1.sha512);
        return Fn.create((0, utils_ts_1.bytesToNumberLE)(xmd));
      }
    };
    exports.ED25519_TORSION_SUBGROUP = [
      "0100000000000000000000000000000000000000000000000000000000000000",
      "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
      "0000000000000000000000000000000000000000000000000000000000000080",
      "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
      "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
      "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
      "0000000000000000000000000000000000000000000000000000000000000000",
      "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
    ];
    function edwardsToMontgomeryPub(edwardsPub) {
      return exports.ed25519.utils.toMontgomery((0, utils_ts_1.ensureBytes)("pub", edwardsPub));
    }
    exports.edwardsToMontgomery = edwardsToMontgomeryPub;
    function edwardsToMontgomeryPriv(edwardsPriv) {
      return exports.ed25519.utils.toMontgomeryPriv((0, utils_ts_1.ensureBytes)("pub", edwardsPriv));
    }
    exports.RistrettoPoint = _RistrettoPoint;
    exports.hashToCurve = (() => exports.ed25519_hasher.hashToCurve)();
    exports.encodeToCurve = (() => exports.ed25519_hasher.encodeToCurve)();
    exports.hashToRistretto255 = (() => exports.ristretto255_hasher.hashToCurve)();
    exports.hash_to_ristretto255 = (() => exports.ristretto255_hasher.hashToCurve)();
  }
});

// ../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/hmac.js
var require_hmac = __commonJS({
  "../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/hmac.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hmac = exports.HMAC = void 0;
    var utils_ts_1 = require_utils4();
    var HMAC = class extends utils_ts_1.Hash {
      constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        (0, utils_ts_1.ahash)(hash);
        const key = (0, utils_ts_1.toBytes)(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54;
        this.iHash.update(pad);
        this.oHash = hash.create();
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54 ^ 92;
        this.oHash.update(pad);
        (0, utils_ts_1.clean)(pad);
      }
      update(buf) {
        (0, utils_ts_1.aexists)(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        (0, utils_ts_1.aexists)(this);
        (0, utils_ts_1.abytes)(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    exports.HMAC = HMAC;
    var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
    exports.hmac = hmac;
    exports.hmac.create = (hash, key) => new HMAC(hash, key);
  }
});

// ../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/weierstrass.js
var require_weierstrass = __commonJS({
  "../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/abstract/weierstrass.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DER = exports.DERErr = void 0;
    exports._splitEndoScalar = _splitEndoScalar;
    exports._normFnElement = _normFnElement;
    exports.weierstrassN = weierstrassN;
    exports.SWUFpSqrtRatio = SWUFpSqrtRatio;
    exports.mapToCurveSimpleSWU = mapToCurveSimpleSWU;
    exports.ecdh = ecdh;
    exports.ecdsa = ecdsa;
    exports.weierstrassPoints = weierstrassPoints;
    exports._legacyHelperEquat = _legacyHelperEquat;
    exports.weierstrass = weierstrass;
    var hmac_js_1 = require_hmac();
    var utils_1 = require_utils4();
    var utils_ts_1 = require_utils5();
    var curve_ts_1 = require_curve();
    var modular_ts_1 = require_modular();
    var divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n) / den;
    function _splitEndoScalar(k, basis, n) {
      const [[a1, b1], [a2, b2]] = basis;
      const c1 = divNearest(b2 * k, n);
      const c2 = divNearest(-b1 * k, n);
      let k1 = k - c1 * a1 - c2 * a2;
      let k2 = -c1 * b1 - c2 * b2;
      const k1neg = k1 < _0n;
      const k2neg = k2 < _0n;
      if (k1neg)
        k1 = -k1;
      if (k2neg)
        k2 = -k2;
      const MAX_NUM = (0, utils_ts_1.bitMask)(Math.ceil((0, utils_ts_1.bitLen)(n) / 2)) + _1n;
      if (k1 < _0n || k1 >= MAX_NUM || k2 < _0n || k2 >= MAX_NUM) {
        throw new Error("splitScalar (endomorphism): failed, k=" + k);
      }
      return { k1neg, k1, k2neg, k2 };
    }
    function validateSigFormat(format) {
      if (!["compact", "recovered", "der"].includes(format))
        throw new Error('Signature format must be "compact", "recovered", or "der"');
      return format;
    }
    function validateSigOpts(opts, def) {
      const optsn = {};
      for (let optName of Object.keys(def)) {
        optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
      }
      (0, utils_ts_1._abool2)(optsn.lowS, "lowS");
      (0, utils_ts_1._abool2)(optsn.prehash, "prehash");
      if (optsn.format !== void 0)
        validateSigFormat(optsn.format);
      return optsn;
    }
    var DERErr = class extends Error {
      constructor(m2 = "") {
        super(m2);
      }
    };
    exports.DERErr = DERErr;
    exports.DER = {
      // asn.1 DER encoding utils
      Err: DERErr,
      // Basic building block is TLV (Tag-Length-Value)
      _tlv: {
        encode: (tag, data) => {
          const { Err: E } = exports.DER;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length & 1)
            throw new E("tlv.encode: unpadded data");
          const dataLen = data.length / 2;
          const len = (0, utils_ts_1.numberToHexUnpadded)(dataLen);
          if (len.length / 2 & 128)
            throw new E("tlv.encode: long form length too big");
          const lenLen = dataLen > 127 ? (0, utils_ts_1.numberToHexUnpadded)(len.length / 2 | 128) : "";
          const t = (0, utils_ts_1.numberToHexUnpadded)(tag);
          return t + lenLen + len + data;
        },
        // v - value, l - left bytes (unparsed)
        decode(tag, data) {
          const { Err: E } = exports.DER;
          let pos = 0;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length < 2 || data[pos++] !== tag)
            throw new E("tlv.decode: wrong tlv");
          const first = data[pos++];
          const isLong = !!(first & 128);
          let length = 0;
          if (!isLong)
            length = first;
          else {
            const lenLen = first & 127;
            if (!lenLen)
              throw new E("tlv.decode(long): indefinite length not supported");
            if (lenLen > 4)
              throw new E("tlv.decode(long): byte length is too big");
            const lengthBytes = data.subarray(pos, pos + lenLen);
            if (lengthBytes.length !== lenLen)
              throw new E("tlv.decode: length bytes not complete");
            if (lengthBytes[0] === 0)
              throw new E("tlv.decode(long): zero leftmost byte");
            for (const b2 of lengthBytes)
              length = length << 8 | b2;
            pos += lenLen;
            if (length < 128)
              throw new E("tlv.decode(long): not minimal encoding");
          }
          const v = data.subarray(pos, pos + length);
          if (v.length !== length)
            throw new E("tlv.decode: wrong value length");
          return { v, l: data.subarray(pos + length) };
        }
      },
      // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
      // since we always use positive integers here. It must always be empty:
      // - add zero byte if exists
      // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
      _int: {
        encode(num) {
          const { Err: E } = exports.DER;
          if (num < _0n)
            throw new E("integer: negative integers are not allowed");
          let hex = (0, utils_ts_1.numberToHexUnpadded)(num);
          if (Number.parseInt(hex[0], 16) & 8)
            hex = "00" + hex;
          if (hex.length & 1)
            throw new E("unexpected DER parsing assertion: unpadded hex");
          return hex;
        },
        decode(data) {
          const { Err: E } = exports.DER;
          if (data[0] & 128)
            throw new E("invalid signature integer: negative");
          if (data[0] === 0 && !(data[1] & 128))
            throw new E("invalid signature integer: unnecessary leading zero");
          return (0, utils_ts_1.bytesToNumberBE)(data);
        }
      },
      toSig(hex) {
        const { Err: E, _int: int, _tlv: tlv } = exports.DER;
        const data = (0, utils_ts_1.ensureBytes)("signature", hex);
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
        if (seqLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
        if (sLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        return { r: int.decode(rBytes), s: int.decode(sBytes) };
      },
      hexFromSig(sig) {
        const { _tlv: tlv, _int: int } = exports.DER;
        const rs = tlv.encode(2, int.encode(sig.r));
        const ss = tlv.encode(2, int.encode(sig.s));
        const seq = rs + ss;
        return tlv.encode(48, seq);
      }
    };
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var _3n = BigInt(3);
    var _4n = BigInt(4);
    function _normFnElement(Fn, key) {
      const { BYTES: expected } = Fn;
      let num;
      if (typeof key === "bigint") {
        num = key;
      } else {
        let bytes = (0, utils_ts_1.ensureBytes)("private key", key);
        try {
          num = Fn.fromBytes(bytes);
        } catch (error) {
          throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
        }
      }
      if (!Fn.isValidNot0(num))
        throw new Error("invalid private key: out of range [1..N-1]");
      return num;
    }
    function weierstrassN(params, extraOpts = {}) {
      const validated = (0, curve_ts_1._createCurveFields)("weierstrass", params, extraOpts);
      const { Fp, Fn } = validated;
      let CURVE = validated.CURVE;
      const { h: cofactor, n: CURVE_ORDER } = CURVE;
      (0, utils_ts_1._validateObject)(extraOpts, {}, {
        allowInfinityPoint: "boolean",
        clearCofactor: "function",
        isTorsionFree: "function",
        fromBytes: "function",
        toBytes: "function",
        endo: "object",
        wrapPrivateKey: "boolean"
      });
      const { endo } = extraOpts;
      if (endo) {
        if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
          throw new Error('invalid endo: expected "beta": bigint and "basises": array');
        }
      }
      const lengths = getWLengths(Fp, Fn);
      function assertCompressionIsSupported() {
        if (!Fp.isOdd)
          throw new Error("compression is not supported: Field does not have .isOdd()");
      }
      function pointToBytes(_c, point, isCompressed) {
        const { x, y } = point.toAffine();
        const bx = Fp.toBytes(x);
        (0, utils_ts_1._abool2)(isCompressed, "isCompressed");
        if (isCompressed) {
          assertCompressionIsSupported();
          const hasEvenY = !Fp.isOdd(y);
          return (0, utils_ts_1.concatBytes)(pprefix(hasEvenY), bx);
        } else {
          return (0, utils_ts_1.concatBytes)(Uint8Array.of(4), bx, Fp.toBytes(y));
        }
      }
      function pointFromBytes(bytes) {
        (0, utils_ts_1._abytes2)(bytes, void 0, "Point");
        const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
        const length = bytes.length;
        const head = bytes[0];
        const tail = bytes.subarray(1);
        if (length === comp && (head === 2 || head === 3)) {
          const x = Fp.fromBytes(tail);
          if (!Fp.isValid(x))
            throw new Error("bad point: is not on curve, wrong x");
          const y2 = weierstrassEquation(x);
          let y;
          try {
            y = Fp.sqrt(y2);
          } catch (sqrtError) {
            const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
            throw new Error("bad point: is not on curve, sqrt error" + err);
          }
          assertCompressionIsSupported();
          const isYOdd = Fp.isOdd(y);
          const isHeadOdd = (head & 1) === 1;
          if (isHeadOdd !== isYOdd)
            y = Fp.neg(y);
          return { x, y };
        } else if (length === uncomp && head === 4) {
          const L = Fp.BYTES;
          const x = Fp.fromBytes(tail.subarray(0, L));
          const y = Fp.fromBytes(tail.subarray(L, L * 2));
          if (!isValidXY(x, y))
            throw new Error("bad point: is not on curve");
          return { x, y };
        } else {
          throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
        }
      }
      const encodePoint = extraOpts.toBytes || pointToBytes;
      const decodePoint = extraOpts.fromBytes || pointFromBytes;
      function weierstrassEquation(x) {
        const x2 = Fp.sqr(x);
        const x3 = Fp.mul(x2, x);
        return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
      }
      function isValidXY(x, y) {
        const left = Fp.sqr(y);
        const right = weierstrassEquation(x);
        return Fp.eql(left, right);
      }
      if (!isValidXY(CURVE.Gx, CURVE.Gy))
        throw new Error("bad curve params: generator point");
      const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n), _4n);
      const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
      if (Fp.is0(Fp.add(_4a3, _27b2)))
        throw new Error("bad curve params: a or b");
      function acoord(title, n, banZero = false) {
        if (!Fp.isValid(n) || banZero && Fp.is0(n))
          throw new Error(`bad point coordinate ${title}`);
        return n;
      }
      function aprjpoint(other) {
        if (!(other instanceof Point))
          throw new Error("ProjectivePoint expected");
      }
      function splitEndoScalarN(k) {
        if (!endo || !endo.basises)
          throw new Error("no endo");
        return _splitEndoScalar(k, endo.basises, Fn.ORDER);
      }
      const toAffineMemo = (0, utils_ts_1.memoized)((p2, iz) => {
        const { X, Y, Z } = p2;
        if (Fp.eql(Z, Fp.ONE))
          return { x: X, y: Y };
        const is0 = p2.is0();
        if (iz == null)
          iz = is0 ? Fp.ONE : Fp.inv(Z);
        const x = Fp.mul(X, iz);
        const y = Fp.mul(Y, iz);
        const zz = Fp.mul(Z, iz);
        if (is0)
          return { x: Fp.ZERO, y: Fp.ZERO };
        if (!Fp.eql(zz, Fp.ONE))
          throw new Error("invZ was invalid");
        return { x, y };
      });
      const assertValidMemo = (0, utils_ts_1.memoized)((p2) => {
        if (p2.is0()) {
          if (extraOpts.allowInfinityPoint && !Fp.is0(p2.Y))
            return;
          throw new Error("bad point: ZERO");
        }
        const { x, y } = p2.toAffine();
        if (!Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("bad point: x or y not field elements");
        if (!isValidXY(x, y))
          throw new Error("bad point: equation left != right");
        if (!p2.isTorsionFree())
          throw new Error("bad point: not in prime-order subgroup");
        return true;
      });
      function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
        k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
        k1p = (0, curve_ts_1.negateCt)(k1neg, k1p);
        k2p = (0, curve_ts_1.negateCt)(k2neg, k2p);
        return k1p.add(k2p);
      }
      class Point {
        /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
        constructor(X, Y, Z) {
          this.X = acoord("x", X);
          this.Y = acoord("y", Y, true);
          this.Z = acoord("z", Z);
          Object.freeze(this);
        }
        static CURVE() {
          return CURVE;
        }
        /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
        static fromAffine(p2) {
          const { x, y } = p2 || {};
          if (!p2 || !Fp.isValid(x) || !Fp.isValid(y))
            throw new Error("invalid affine point");
          if (p2 instanceof Point)
            throw new Error("projective point not allowed");
          if (Fp.is0(x) && Fp.is0(y))
            return Point.ZERO;
          return new Point(x, y, Fp.ONE);
        }
        static fromBytes(bytes) {
          const P = Point.fromAffine(decodePoint((0, utils_ts_1._abytes2)(bytes, void 0, "point")));
          P.assertValidity();
          return P;
        }
        static fromHex(hex) {
          return Point.fromBytes((0, utils_ts_1.ensureBytes)("pointHex", hex));
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        /**
         *
         * @param windowSize
         * @param isLazy true will defer table computation until the first multiplication
         * @returns
         */
        precompute(windowSize = 8, isLazy = true) {
          wnaf.createCache(this, windowSize);
          if (!isLazy)
            this.multiply(_3n);
          return this;
        }
        // TODO: return `this`
        /** A point on curve is valid if it conforms to equation. */
        assertValidity() {
          assertValidMemo(this);
        }
        hasEvenY() {
          const { y } = this.toAffine();
          if (!Fp.isOdd)
            throw new Error("Field doesn't support isOdd");
          return !Fp.isOdd(y);
        }
        /** Compare one point to another. */
        equals(other) {
          aprjpoint(other);
          const { X: X1, Y: Y1, Z: Z1 } = this;
          const { X: X2, Y: Y2, Z: Z2 } = other;
          const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
          const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
          return U1 && U2;
        }
        /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
        negate() {
          return new Point(this.X, Fp.neg(this.Y), this.Z);
        }
        // Renes-Costello-Batina exception-free doubling formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 3
        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
        double() {
          const { a, b: b2 } = CURVE;
          const b3 = Fp.mul(b2, _3n);
          const { X: X1, Y: Y1, Z: Z1 } = this;
          let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
          let t0 = Fp.mul(X1, X1);
          let t1 = Fp.mul(Y1, Y1);
          let t2 = Fp.mul(Z1, Z1);
          let t3 = Fp.mul(X1, Y1);
          t3 = Fp.add(t3, t3);
          Z3 = Fp.mul(X1, Z1);
          Z3 = Fp.add(Z3, Z3);
          X3 = Fp.mul(a, Z3);
          Y3 = Fp.mul(b3, t2);
          Y3 = Fp.add(X3, Y3);
          X3 = Fp.sub(t1, Y3);
          Y3 = Fp.add(t1, Y3);
          Y3 = Fp.mul(X3, Y3);
          X3 = Fp.mul(t3, X3);
          Z3 = Fp.mul(b3, Z3);
          t2 = Fp.mul(a, t2);
          t3 = Fp.sub(t0, t2);
          t3 = Fp.mul(a, t3);
          t3 = Fp.add(t3, Z3);
          Z3 = Fp.add(t0, t0);
          t0 = Fp.add(Z3, t0);
          t0 = Fp.add(t0, t2);
          t0 = Fp.mul(t0, t3);
          Y3 = Fp.add(Y3, t0);
          t2 = Fp.mul(Y1, Z1);
          t2 = Fp.add(t2, t2);
          t0 = Fp.mul(t2, t3);
          X3 = Fp.sub(X3, t0);
          Z3 = Fp.mul(t2, t1);
          Z3 = Fp.add(Z3, Z3);
          Z3 = Fp.add(Z3, Z3);
          return new Point(X3, Y3, Z3);
        }
        // Renes-Costello-Batina exception-free addition formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 1
        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
        add(other) {
          aprjpoint(other);
          const { X: X1, Y: Y1, Z: Z1 } = this;
          const { X: X2, Y: Y2, Z: Z2 } = other;
          let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
          const a = CURVE.a;
          const b3 = Fp.mul(CURVE.b, _3n);
          let t0 = Fp.mul(X1, X2);
          let t1 = Fp.mul(Y1, Y2);
          let t2 = Fp.mul(Z1, Z2);
          let t3 = Fp.add(X1, Y1);
          let t4 = Fp.add(X2, Y2);
          t3 = Fp.mul(t3, t4);
          t4 = Fp.add(t0, t1);
          t3 = Fp.sub(t3, t4);
          t4 = Fp.add(X1, Z1);
          let t5 = Fp.add(X2, Z2);
          t4 = Fp.mul(t4, t5);
          t5 = Fp.add(t0, t2);
          t4 = Fp.sub(t4, t5);
          t5 = Fp.add(Y1, Z1);
          X3 = Fp.add(Y2, Z2);
          t5 = Fp.mul(t5, X3);
          X3 = Fp.add(t1, t2);
          t5 = Fp.sub(t5, X3);
          Z3 = Fp.mul(a, t4);
          X3 = Fp.mul(b3, t2);
          Z3 = Fp.add(X3, Z3);
          X3 = Fp.sub(t1, Z3);
          Z3 = Fp.add(t1, Z3);
          Y3 = Fp.mul(X3, Z3);
          t1 = Fp.add(t0, t0);
          t1 = Fp.add(t1, t0);
          t2 = Fp.mul(a, t2);
          t4 = Fp.mul(b3, t4);
          t1 = Fp.add(t1, t2);
          t2 = Fp.sub(t0, t2);
          t2 = Fp.mul(a, t2);
          t4 = Fp.add(t4, t2);
          t0 = Fp.mul(t1, t4);
          Y3 = Fp.add(Y3, t0);
          t0 = Fp.mul(t5, t4);
          X3 = Fp.mul(t3, X3);
          X3 = Fp.sub(X3, t0);
          t0 = Fp.mul(t3, t1);
          Z3 = Fp.mul(t5, Z3);
          Z3 = Fp.add(Z3, t0);
          return new Point(X3, Y3, Z3);
        }
        subtract(other) {
          return this.add(other.negate());
        }
        is0() {
          return this.equals(Point.ZERO);
        }
        /**
         * Constant time multiplication.
         * Uses wNAF method. Windowed method may be 10% faster,
         * but takes 2x longer to generate and consumes 2x memory.
         * Uses precomputes when available.
         * Uses endomorphism for Koblitz curves.
         * @param scalar by which the point would be multiplied
         * @returns New point
         */
        multiply(scalar) {
          const { endo: endo2 } = extraOpts;
          if (!Fn.isValidNot0(scalar))
            throw new Error("invalid scalar: out of range");
          let point, fake;
          const mul = (n) => wnaf.cached(this, n, (p2) => (0, curve_ts_1.normalizeZ)(Point, p2));
          if (endo2) {
            const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
            const { p: k1p, f: k1f } = mul(k1);
            const { p: k2p, f: k2f } = mul(k2);
            fake = k1f.add(k2f);
            point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
          } else {
            const { p: p2, f: f2 } = mul(scalar);
            point = p2;
            fake = f2;
          }
          return (0, curve_ts_1.normalizeZ)(Point, [point, fake])[0];
        }
        /**
         * Non-constant-time multiplication. Uses double-and-add algorithm.
         * It's faster, but should only be used when you don't care about
         * an exposed secret key e.g. sig verification, which works over *public* keys.
         */
        multiplyUnsafe(sc) {
          const { endo: endo2 } = extraOpts;
          const p2 = this;
          if (!Fn.isValid(sc))
            throw new Error("invalid scalar: out of range");
          if (sc === _0n || p2.is0())
            return Point.ZERO;
          if (sc === _1n)
            return p2;
          if (wnaf.hasCache(this))
            return this.multiply(sc);
          if (endo2) {
            const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
            const { p1, p2: p22 } = (0, curve_ts_1.mulEndoUnsafe)(Point, p2, k1, k2);
            return finishEndo(endo2.beta, p1, p22, k1neg, k2neg);
          } else {
            return wnaf.unsafe(p2, sc);
          }
        }
        multiplyAndAddUnsafe(Q, a, b2) {
          const sum = this.multiplyUnsafe(a).add(Q.multiplyUnsafe(b2));
          return sum.is0() ? void 0 : sum;
        }
        /**
         * Converts Projective point to affine (x, y) coordinates.
         * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
         */
        toAffine(invertedZ) {
          return toAffineMemo(this, invertedZ);
        }
        /**
         * Checks whether Point is free of torsion elements (is in prime subgroup).
         * Always torsion-free for cofactor=1 curves.
         */
        isTorsionFree() {
          const { isTorsionFree } = extraOpts;
          if (cofactor === _1n)
            return true;
          if (isTorsionFree)
            return isTorsionFree(Point, this);
          return wnaf.unsafe(this, CURVE_ORDER).is0();
        }
        clearCofactor() {
          const { clearCofactor } = extraOpts;
          if (cofactor === _1n)
            return this;
          if (clearCofactor)
            return clearCofactor(Point, this);
          return this.multiplyUnsafe(cofactor);
        }
        isSmallOrder() {
          return this.multiplyUnsafe(cofactor).is0();
        }
        toBytes(isCompressed = true) {
          (0, utils_ts_1._abool2)(isCompressed, "isCompressed");
          this.assertValidity();
          return encodePoint(Point, this, isCompressed);
        }
        toHex(isCompressed = true) {
          return (0, utils_ts_1.bytesToHex)(this.toBytes(isCompressed));
        }
        toString() {
          return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
        }
        // TODO: remove
        get px() {
          return this.X;
        }
        get py() {
          return this.X;
        }
        get pz() {
          return this.Z;
        }
        toRawBytes(isCompressed = true) {
          return this.toBytes(isCompressed);
        }
        _setWindowSize(windowSize) {
          this.precompute(windowSize);
        }
        static normalizeZ(points) {
          return (0, curve_ts_1.normalizeZ)(Point, points);
        }
        static msm(points, scalars) {
          return (0, curve_ts_1.pippenger)(Point, Fn, points, scalars);
        }
        static fromPrivateKey(privateKey) {
          return Point.BASE.multiply(_normFnElement(Fn, privateKey));
        }
      }
      Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
      Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
      Point.Fp = Fp;
      Point.Fn = Fn;
      const bits = Fn.BITS;
      const wnaf = new curve_ts_1.wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
      Point.BASE.precompute(8);
      return Point;
    }
    function pprefix(hasEvenY) {
      return Uint8Array.of(hasEvenY ? 2 : 3);
    }
    function SWUFpSqrtRatio(Fp, Z) {
      const q = Fp.ORDER;
      let l = _0n;
      for (let o = q - _1n; o % _2n === _0n; o /= _2n)
        l += _1n;
      const c1 = l;
      const _2n_pow_c1_1 = _2n << c1 - _1n - _1n;
      const _2n_pow_c1 = _2n_pow_c1_1 * _2n;
      const c2 = (q - _1n) / _2n_pow_c1;
      const c3 = (c2 - _1n) / _2n;
      const c4 = _2n_pow_c1 - _1n;
      const c5 = _2n_pow_c1_1;
      const c6 = Fp.pow(Z, c2);
      const c7 = Fp.pow(Z, (c2 + _1n) / _2n);
      let sqrtRatio = (u, v) => {
        let tv1 = c6;
        let tv2 = Fp.pow(v, c4);
        let tv3 = Fp.sqr(tv2);
        tv3 = Fp.mul(tv3, v);
        let tv5 = Fp.mul(u, tv3);
        tv5 = Fp.pow(tv5, c3);
        tv5 = Fp.mul(tv5, tv2);
        tv2 = Fp.mul(tv5, v);
        tv3 = Fp.mul(tv5, u);
        let tv4 = Fp.mul(tv3, tv2);
        tv5 = Fp.pow(tv4, c5);
        let isQR = Fp.eql(tv5, Fp.ONE);
        tv2 = Fp.mul(tv3, c7);
        tv5 = Fp.mul(tv4, tv1);
        tv3 = Fp.cmov(tv2, tv3, isQR);
        tv4 = Fp.cmov(tv5, tv4, isQR);
        for (let i = c1; i > _1n; i--) {
          let tv52 = i - _2n;
          tv52 = _2n << tv52 - _1n;
          let tvv5 = Fp.pow(tv4, tv52);
          const e1 = Fp.eql(tvv5, Fp.ONE);
          tv2 = Fp.mul(tv3, tv1);
          tv1 = Fp.mul(tv1, tv1);
          tvv5 = Fp.mul(tv4, tv1);
          tv3 = Fp.cmov(tv2, tv3, e1);
          tv4 = Fp.cmov(tvv5, tv4, e1);
        }
        return { isValid: isQR, value: tv3 };
      };
      if (Fp.ORDER % _4n === _3n) {
        const c12 = (Fp.ORDER - _3n) / _4n;
        const c22 = Fp.sqrt(Fp.neg(Z));
        sqrtRatio = (u, v) => {
          let tv1 = Fp.sqr(v);
          const tv2 = Fp.mul(u, v);
          tv1 = Fp.mul(tv1, tv2);
          let y1 = Fp.pow(tv1, c12);
          y1 = Fp.mul(y1, tv2);
          const y2 = Fp.mul(y1, c22);
          const tv3 = Fp.mul(Fp.sqr(y1), v);
          const isQR = Fp.eql(tv3, u);
          let y = Fp.cmov(y2, y1, isQR);
          return { isValid: isQR, value: y };
        };
      }
      return sqrtRatio;
    }
    function mapToCurveSimpleSWU(Fp, opts) {
      (0, modular_ts_1.validateField)(Fp);
      const { A, B, Z } = opts;
      if (!Fp.isValid(A) || !Fp.isValid(B) || !Fp.isValid(Z))
        throw new Error("mapToCurveSimpleSWU: invalid opts");
      const sqrtRatio = SWUFpSqrtRatio(Fp, Z);
      if (!Fp.isOdd)
        throw new Error("Field does not have .isOdd()");
      return (u) => {
        let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
        tv1 = Fp.sqr(u);
        tv1 = Fp.mul(tv1, Z);
        tv2 = Fp.sqr(tv1);
        tv2 = Fp.add(tv2, tv1);
        tv3 = Fp.add(tv2, Fp.ONE);
        tv3 = Fp.mul(tv3, B);
        tv4 = Fp.cmov(Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
        tv4 = Fp.mul(tv4, A);
        tv2 = Fp.sqr(tv3);
        tv6 = Fp.sqr(tv4);
        tv5 = Fp.mul(tv6, A);
        tv2 = Fp.add(tv2, tv5);
        tv2 = Fp.mul(tv2, tv3);
        tv6 = Fp.mul(tv6, tv4);
        tv5 = Fp.mul(tv6, B);
        tv2 = Fp.add(tv2, tv5);
        x = Fp.mul(tv1, tv3);
        const { isValid: isValid2, value } = sqrtRatio(tv2, tv6);
        y = Fp.mul(tv1, u);
        y = Fp.mul(y, value);
        x = Fp.cmov(x, tv3, isValid2);
        y = Fp.cmov(y, value, isValid2);
        const e1 = Fp.isOdd(u) === Fp.isOdd(y);
        y = Fp.cmov(Fp.neg(y), y, e1);
        const tv4_inv = (0, modular_ts_1.FpInvertBatch)(Fp, [tv4], true)[0];
        x = Fp.mul(x, tv4_inv);
        return { x, y };
      };
    }
    function getWLengths(Fp, Fn) {
      return {
        secretKey: Fn.BYTES,
        publicKey: 1 + Fp.BYTES,
        publicKeyUncompressed: 1 + 2 * Fp.BYTES,
        publicKeyHasPrefix: true,
        signature: 2 * Fn.BYTES
      };
    }
    function ecdh(Point, ecdhOpts = {}) {
      const { Fn } = Point;
      const randomBytes_ = ecdhOpts.randomBytes || utils_ts_1.randomBytes;
      const lengths = Object.assign(getWLengths(Point.Fp, Fn), { seed: (0, modular_ts_1.getMinHashLength)(Fn.ORDER) });
      function isValidSecretKey(secretKey) {
        try {
          return !!_normFnElement(Fn, secretKey);
        } catch (error) {
          return false;
        }
      }
      function isValidPublicKey(publicKey, isCompressed) {
        const { publicKey: comp, publicKeyUncompressed } = lengths;
        try {
          const l = publicKey.length;
          if (isCompressed === true && l !== comp)
            return false;
          if (isCompressed === false && l !== publicKeyUncompressed)
            return false;
          return !!Point.fromBytes(publicKey);
        } catch (error) {
          return false;
        }
      }
      function randomSecretKey(seed = randomBytes_(lengths.seed)) {
        return (0, modular_ts_1.mapHashToField)((0, utils_ts_1._abytes2)(seed, lengths.seed, "seed"), Fn.ORDER);
      }
      function getPublicKey(secretKey, isCompressed = true) {
        return Point.BASE.multiply(_normFnElement(Fn, secretKey)).toBytes(isCompressed);
      }
      function keygen(seed) {
        const secretKey = randomSecretKey(seed);
        return { secretKey, publicKey: getPublicKey(secretKey) };
      }
      function isProbPub(item) {
        if (typeof item === "bigint")
          return false;
        if (item instanceof Point)
          return true;
        const { secretKey, publicKey, publicKeyUncompressed } = lengths;
        if (Fn.allowedLengths || secretKey === publicKey)
          return void 0;
        const l = (0, utils_ts_1.ensureBytes)("key", item).length;
        return l === publicKey || l === publicKeyUncompressed;
      }
      function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
        if (isProbPub(secretKeyA) === true)
          throw new Error("first arg must be private key");
        if (isProbPub(publicKeyB) === false)
          throw new Error("second arg must be public key");
        const s = _normFnElement(Fn, secretKeyA);
        const b2 = Point.fromHex(publicKeyB);
        return b2.multiply(s).toBytes(isCompressed);
      }
      const utils = {
        isValidSecretKey,
        isValidPublicKey,
        randomSecretKey,
        // TODO: remove
        isValidPrivateKey: isValidSecretKey,
        randomPrivateKey: randomSecretKey,
        normPrivateKeyToScalar: (key) => _normFnElement(Fn, key),
        precompute(windowSize = 8, point = Point.BASE) {
          return point.precompute(windowSize, false);
        }
      };
      return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point, utils, lengths });
    }
    function ecdsa(Point, hash, ecdsaOpts = {}) {
      (0, utils_1.ahash)(hash);
      (0, utils_ts_1._validateObject)(ecdsaOpts, {}, {
        hmac: "function",
        lowS: "boolean",
        randomBytes: "function",
        bits2int: "function",
        bits2int_modN: "function"
      });
      const randomBytes = ecdsaOpts.randomBytes || utils_ts_1.randomBytes;
      const hmac = ecdsaOpts.hmac || ((key, ...msgs) => (0, hmac_js_1.hmac)(hash, key, (0, utils_ts_1.concatBytes)(...msgs)));
      const { Fp, Fn } = Point;
      const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
      const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point, ecdsaOpts);
      const defaultSigOpts = {
        prehash: false,
        lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : false,
        format: void 0,
        //'compact' as ECDSASigFormat,
        extraEntropy: false
      };
      const defaultSigOpts_format = "compact";
      function isBiggerThanHalfOrder(number) {
        const HALF = CURVE_ORDER >> _1n;
        return number > HALF;
      }
      function validateRS(title, num) {
        if (!Fn.isValidNot0(num))
          throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
        return num;
      }
      function validateSigLength(bytes, format) {
        validateSigFormat(format);
        const size = lengths.signature;
        const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
        return (0, utils_ts_1._abytes2)(bytes, sizer, `${format} signature`);
      }
      class Signature {
        constructor(r, s, recovery) {
          this.r = validateRS("r", r);
          this.s = validateRS("s", s);
          if (recovery != null)
            this.recovery = recovery;
          Object.freeze(this);
        }
        static fromBytes(bytes, format = defaultSigOpts_format) {
          validateSigLength(bytes, format);
          let recid;
          if (format === "der") {
            const { r: r2, s: s2 } = exports.DER.toSig((0, utils_ts_1._abytes2)(bytes));
            return new Signature(r2, s2);
          }
          if (format === "recovered") {
            recid = bytes[0];
            format = "compact";
            bytes = bytes.subarray(1);
          }
          const L = Fn.BYTES;
          const r = bytes.subarray(0, L);
          const s = bytes.subarray(L, L * 2);
          return new Signature(Fn.fromBytes(r), Fn.fromBytes(s), recid);
        }
        static fromHex(hex, format) {
          return this.fromBytes((0, utils_ts_1.hexToBytes)(hex), format);
        }
        addRecoveryBit(recovery) {
          return new Signature(this.r, this.s, recovery);
        }
        recoverPublicKey(messageHash) {
          const FIELD_ORDER = Fp.ORDER;
          const { r, s, recovery: rec } = this;
          if (rec == null || ![0, 1, 2, 3].includes(rec))
            throw new Error("recovery id invalid");
          const hasCofactor = CURVE_ORDER * _2n < FIELD_ORDER;
          if (hasCofactor && rec > 1)
            throw new Error("recovery id is ambiguous for h>1 curve");
          const radj = rec === 2 || rec === 3 ? r + CURVE_ORDER : r;
          if (!Fp.isValid(radj))
            throw new Error("recovery id 2 or 3 invalid");
          const x = Fp.toBytes(radj);
          const R = Point.fromBytes((0, utils_ts_1.concatBytes)(pprefix((rec & 1) === 0), x));
          const ir = Fn.inv(radj);
          const h = bits2int_modN((0, utils_ts_1.ensureBytes)("msgHash", messageHash));
          const u1 = Fn.create(-h * ir);
          const u2 = Fn.create(s * ir);
          const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
          if (Q.is0())
            throw new Error("point at infinify");
          Q.assertValidity();
          return Q;
        }
        // Signatures should be low-s, to prevent malleability.
        hasHighS() {
          return isBiggerThanHalfOrder(this.s);
        }
        toBytes(format = defaultSigOpts_format) {
          validateSigFormat(format);
          if (format === "der")
            return (0, utils_ts_1.hexToBytes)(exports.DER.hexFromSig(this));
          const r = Fn.toBytes(this.r);
          const s = Fn.toBytes(this.s);
          if (format === "recovered") {
            if (this.recovery == null)
              throw new Error("recovery bit must be present");
            return (0, utils_ts_1.concatBytes)(Uint8Array.of(this.recovery), r, s);
          }
          return (0, utils_ts_1.concatBytes)(r, s);
        }
        toHex(format) {
          return (0, utils_ts_1.bytesToHex)(this.toBytes(format));
        }
        // TODO: remove
        assertValidity() {
        }
        static fromCompact(hex) {
          return Signature.fromBytes((0, utils_ts_1.ensureBytes)("sig", hex), "compact");
        }
        static fromDER(hex) {
          return Signature.fromBytes((0, utils_ts_1.ensureBytes)("sig", hex), "der");
        }
        normalizeS() {
          return this.hasHighS() ? new Signature(this.r, Fn.neg(this.s), this.recovery) : this;
        }
        toDERRawBytes() {
          return this.toBytes("der");
        }
        toDERHex() {
          return (0, utils_ts_1.bytesToHex)(this.toBytes("der"));
        }
        toCompactRawBytes() {
          return this.toBytes("compact");
        }
        toCompactHex() {
          return (0, utils_ts_1.bytesToHex)(this.toBytes("compact"));
        }
      }
      const bits2int = ecdsaOpts.bits2int || function bits2int_def(bytes) {
        if (bytes.length > 8192)
          throw new Error("input is too large");
        const num = (0, utils_ts_1.bytesToNumberBE)(bytes);
        const delta = bytes.length * 8 - fnBits;
        return delta > 0 ? num >> BigInt(delta) : num;
      };
      const bits2int_modN = ecdsaOpts.bits2int_modN || function bits2int_modN_def(bytes) {
        return Fn.create(bits2int(bytes));
      };
      const ORDER_MASK = (0, utils_ts_1.bitMask)(fnBits);
      function int2octets(num) {
        (0, utils_ts_1.aInRange)("num < 2^" + fnBits, num, _0n, ORDER_MASK);
        return Fn.toBytes(num);
      }
      function validateMsgAndHash(message, prehash) {
        (0, utils_ts_1._abytes2)(message, void 0, "message");
        return prehash ? (0, utils_ts_1._abytes2)(hash(message), void 0, "prehashed message") : message;
      }
      function prepSig(message, privateKey, opts) {
        if (["recovered", "canonical"].some((k) => k in opts))
          throw new Error("sign() legacy options not supported");
        const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
        message = validateMsgAndHash(message, prehash);
        const h1int = bits2int_modN(message);
        const d = _normFnElement(Fn, privateKey);
        const seedArgs = [int2octets(d), int2octets(h1int)];
        if (extraEntropy != null && extraEntropy !== false) {
          const e = extraEntropy === true ? randomBytes(lengths.secretKey) : extraEntropy;
          seedArgs.push((0, utils_ts_1.ensureBytes)("extraEntropy", e));
        }
        const seed = (0, utils_ts_1.concatBytes)(...seedArgs);
        const m2 = h1int;
        function k2sig(kBytes) {
          const k = bits2int(kBytes);
          if (!Fn.isValidNot0(k))
            return;
          const ik = Fn.inv(k);
          const q = Point.BASE.multiply(k).toAffine();
          const r = Fn.create(q.x);
          if (r === _0n)
            return;
          const s = Fn.create(ik * Fn.create(m2 + r * d));
          if (s === _0n)
            return;
          let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n);
          let normS = s;
          if (lowS && isBiggerThanHalfOrder(s)) {
            normS = Fn.neg(s);
            recovery ^= 1;
          }
          return new Signature(r, normS, recovery);
        }
        return { seed, k2sig };
      }
      function sign(message, secretKey, opts = {}) {
        message = (0, utils_ts_1.ensureBytes)("message", message);
        const { seed, k2sig } = prepSig(message, secretKey, opts);
        const drbg = (0, utils_ts_1.createHmacDrbg)(hash.outputLen, Fn.BYTES, hmac);
        const sig = drbg(seed, k2sig);
        return sig;
      }
      function tryParsingSig(sg) {
        let sig = void 0;
        const isHex = typeof sg === "string" || (0, utils_ts_1.isBytes)(sg);
        const isObj = !isHex && sg !== null && typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint";
        if (!isHex && !isObj)
          throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
        if (isObj) {
          sig = new Signature(sg.r, sg.s);
        } else if (isHex) {
          try {
            sig = Signature.fromBytes((0, utils_ts_1.ensureBytes)("sig", sg), "der");
          } catch (derError) {
            if (!(derError instanceof exports.DER.Err))
              throw derError;
          }
          if (!sig) {
            try {
              sig = Signature.fromBytes((0, utils_ts_1.ensureBytes)("sig", sg), "compact");
            } catch (error) {
              return false;
            }
          }
        }
        if (!sig)
          return false;
        return sig;
      }
      function verify(signature, message, publicKey, opts = {}) {
        const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
        publicKey = (0, utils_ts_1.ensureBytes)("publicKey", publicKey);
        message = validateMsgAndHash((0, utils_ts_1.ensureBytes)("message", message), prehash);
        if ("strict" in opts)
          throw new Error("options.strict was renamed to lowS");
        const sig = format === void 0 ? tryParsingSig(signature) : Signature.fromBytes((0, utils_ts_1.ensureBytes)("sig", signature), format);
        if (sig === false)
          return false;
        try {
          const P = Point.fromBytes(publicKey);
          if (lowS && sig.hasHighS())
            return false;
          const { r, s } = sig;
          const h = bits2int_modN(message);
          const is2 = Fn.inv(s);
          const u1 = Fn.create(h * is2);
          const u2 = Fn.create(r * is2);
          const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
          if (R.is0())
            return false;
          const v = Fn.create(R.x);
          return v === r;
        } catch (e) {
          return false;
        }
      }
      function recoverPublicKey(signature, message, opts = {}) {
        const { prehash } = validateSigOpts(opts, defaultSigOpts);
        message = validateMsgAndHash(message, prehash);
        return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
      }
      return Object.freeze({
        keygen,
        getPublicKey,
        getSharedSecret,
        utils,
        lengths,
        Point,
        sign,
        verify,
        recoverPublicKey,
        Signature,
        hash
      });
    }
    function weierstrassPoints(c2) {
      const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c2);
      const Point = weierstrassN(CURVE, curveOpts);
      return _weierstrass_new_output_to_legacy(c2, Point);
    }
    function _weierstrass_legacy_opts_to_new(c2) {
      const CURVE = {
        a: c2.a,
        b: c2.b,
        p: c2.Fp.ORDER,
        n: c2.n,
        h: c2.h,
        Gx: c2.Gx,
        Gy: c2.Gy
      };
      const Fp = c2.Fp;
      let allowedLengths = c2.allowedPrivateKeyLengths ? Array.from(new Set(c2.allowedPrivateKeyLengths.map((l) => Math.ceil(l / 2)))) : void 0;
      const Fn = (0, modular_ts_1.Field)(CURVE.n, {
        BITS: c2.nBitLength,
        allowedLengths,
        modFromBytes: c2.wrapPrivateKey
      });
      const curveOpts = {
        Fp,
        Fn,
        allowInfinityPoint: c2.allowInfinityPoint,
        endo: c2.endo,
        isTorsionFree: c2.isTorsionFree,
        clearCofactor: c2.clearCofactor,
        fromBytes: c2.fromBytes,
        toBytes: c2.toBytes
      };
      return { CURVE, curveOpts };
    }
    function _ecdsa_legacy_opts_to_new(c2) {
      const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c2);
      const ecdsaOpts = {
        hmac: c2.hmac,
        randomBytes: c2.randomBytes,
        lowS: c2.lowS,
        bits2int: c2.bits2int,
        bits2int_modN: c2.bits2int_modN
      };
      return { CURVE, curveOpts, hash: c2.hash, ecdsaOpts };
    }
    function _legacyHelperEquat(Fp, a, b2) {
      function weierstrassEquation(x) {
        const x2 = Fp.sqr(x);
        const x3 = Fp.mul(x2, x);
        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b2);
      }
      return weierstrassEquation;
    }
    function _weierstrass_new_output_to_legacy(c2, Point) {
      const { Fp, Fn } = Point;
      function isWithinCurveOrder(num) {
        return (0, utils_ts_1.inRange)(num, _1n, Fn.ORDER);
      }
      const weierstrassEquation = _legacyHelperEquat(Fp, c2.a, c2.b);
      return Object.assign({}, {
        CURVE: c2,
        Point,
        ProjectivePoint: Point,
        normPrivateKeyToScalar: (key) => _normFnElement(Fn, key),
        weierstrassEquation,
        isWithinCurveOrder
      });
    }
    function _ecdsa_new_output_to_legacy(c2, _ecdsa) {
      const Point = _ecdsa.Point;
      return Object.assign({}, _ecdsa, {
        ProjectivePoint: Point,
        CURVE: Object.assign({}, c2, (0, modular_ts_1.nLength)(Point.Fn.ORDER, Point.Fn.BITS))
      });
    }
    function weierstrass(c2) {
      const { CURVE, curveOpts, hash, ecdsaOpts } = _ecdsa_legacy_opts_to_new(c2);
      const Point = weierstrassN(CURVE, curveOpts);
      const signs = ecdsa(Point, hash, ecdsaOpts);
      return _ecdsa_new_output_to_legacy(c2, signs);
    }
  }
});

// ../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/_shortw_utils.js
var require_shortw_utils = __commonJS({
  "../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/_shortw_utils.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getHash = getHash;
    exports.createCurve = createCurve;
    var weierstrass_ts_1 = require_weierstrass();
    function getHash(hash) {
      return { hash };
    }
    function createCurve(curveDef, defHash) {
      const create = (hash) => (0, weierstrass_ts_1.weierstrass)({ ...curveDef, hash });
      return { ...create(defHash), create };
    }
  }
});

// ../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/secp256k1.js
var require_secp256k1 = __commonJS({
  "../node_modules/.pnpm/@noble+curves@1.9.6/node_modules/@noble/curves/secp256k1.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeToCurve = exports.hashToCurve = exports.secp256k1_hasher = exports.schnorr = exports.secp256k1 = void 0;
    var sha2_js_1 = require_sha2();
    var utils_js_1 = require_utils4();
    var _shortw_utils_ts_1 = require_shortw_utils();
    var hash_to_curve_ts_1 = require_hash_to_curve();
    var modular_ts_1 = require_modular();
    var weierstrass_ts_1 = require_weierstrass();
    var utils_ts_1 = require_utils5();
    var secp256k1_CURVE = {
      p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
      n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
      h: BigInt(1),
      a: BigInt(0),
      b: BigInt(7),
      Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
      Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
    };
    var secp256k1_ENDO = {
      beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
      basises: [
        [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
        [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
      ]
    };
    var _0n = /* @__PURE__ */ BigInt(0);
    var _1n = /* @__PURE__ */ BigInt(1);
    var _2n = /* @__PURE__ */ BigInt(2);
    function sqrtMod(y) {
      const P = secp256k1_CURVE.p;
      const _3n = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
      const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
      const b2 = y * y * y % P;
      const b3 = b2 * b2 * y % P;
      const b6 = (0, modular_ts_1.pow2)(b3, _3n, P) * b3 % P;
      const b9 = (0, modular_ts_1.pow2)(b6, _3n, P) * b3 % P;
      const b11 = (0, modular_ts_1.pow2)(b9, _2n, P) * b2 % P;
      const b22 = (0, modular_ts_1.pow2)(b11, _11n, P) * b11 % P;
      const b44 = (0, modular_ts_1.pow2)(b22, _22n, P) * b22 % P;
      const b88 = (0, modular_ts_1.pow2)(b44, _44n, P) * b44 % P;
      const b176 = (0, modular_ts_1.pow2)(b88, _88n, P) * b88 % P;
      const b220 = (0, modular_ts_1.pow2)(b176, _44n, P) * b44 % P;
      const b223 = (0, modular_ts_1.pow2)(b220, _3n, P) * b3 % P;
      const t1 = (0, modular_ts_1.pow2)(b223, _23n, P) * b22 % P;
      const t2 = (0, modular_ts_1.pow2)(t1, _6n, P) * b2 % P;
      const root = (0, modular_ts_1.pow2)(t2, _2n, P);
      if (!Fpk1.eql(Fpk1.sqr(root), y))
        throw new Error("Cannot find square root");
      return root;
    }
    var Fpk1 = (0, modular_ts_1.Field)(secp256k1_CURVE.p, { sqrt: sqrtMod });
    exports.secp256k1 = (0, _shortw_utils_ts_1.createCurve)({ ...secp256k1_CURVE, Fp: Fpk1, lowS: true, endo: secp256k1_ENDO }, sha2_js_1.sha256);
    var TAGGED_HASH_PREFIXES = {};
    function taggedHash(tag, ...messages) {
      let tagP = TAGGED_HASH_PREFIXES[tag];
      if (tagP === void 0) {
        const tagH = (0, sha2_js_1.sha256)((0, utils_ts_1.utf8ToBytes)(tag));
        tagP = (0, utils_ts_1.concatBytes)(tagH, tagH);
        TAGGED_HASH_PREFIXES[tag] = tagP;
      }
      return (0, sha2_js_1.sha256)((0, utils_ts_1.concatBytes)(tagP, ...messages));
    }
    var pointToBytes = (point) => point.toBytes(true).slice(1);
    var Pointk1 = /* @__PURE__ */ (() => exports.secp256k1.Point)();
    var hasEven = (y) => y % _2n === _0n;
    function schnorrGetExtPubKey(priv) {
      const { Fn, BASE } = Pointk1;
      const d_ = (0, weierstrass_ts_1._normFnElement)(Fn, priv);
      const p2 = BASE.multiply(d_);
      const scalar = hasEven(p2.y) ? d_ : Fn.neg(d_);
      return { scalar, bytes: pointToBytes(p2) };
    }
    function lift_x(x) {
      const Fp = Fpk1;
      if (!Fp.isValidNot0(x))
        throw new Error("invalid x: Fail if x \u2265 p");
      const xx = Fp.create(x * x);
      const c2 = Fp.create(xx * x + BigInt(7));
      let y = Fp.sqrt(c2);
      if (!hasEven(y))
        y = Fp.neg(y);
      const p2 = Pointk1.fromAffine({ x, y });
      p2.assertValidity();
      return p2;
    }
    var num = utils_ts_1.bytesToNumberBE;
    function challenge(...args) {
      return Pointk1.Fn.create(num(taggedHash("BIP0340/challenge", ...args)));
    }
    function schnorrGetPublicKey(secretKey) {
      return schnorrGetExtPubKey(secretKey).bytes;
    }
    function schnorrSign(message, secretKey, auxRand = (0, utils_js_1.randomBytes)(32)) {
      const { Fn } = Pointk1;
      const m2 = (0, utils_ts_1.ensureBytes)("message", message);
      const { bytes: px, scalar: d } = schnorrGetExtPubKey(secretKey);
      const a = (0, utils_ts_1.ensureBytes)("auxRand", auxRand, 32);
      const t = Fn.toBytes(d ^ num(taggedHash("BIP0340/aux", a)));
      const rand = taggedHash("BIP0340/nonce", t, px, m2);
      const { bytes: rx, scalar: k } = schnorrGetExtPubKey(rand);
      const e = challenge(rx, px, m2);
      const sig = new Uint8Array(64);
      sig.set(rx, 0);
      sig.set(Fn.toBytes(Fn.create(k + e * d)), 32);
      if (!schnorrVerify(sig, m2, px))
        throw new Error("sign: Invalid signature produced");
      return sig;
    }
    function schnorrVerify(signature, message, publicKey) {
      const { Fn, BASE } = Pointk1;
      const sig = (0, utils_ts_1.ensureBytes)("signature", signature, 64);
      const m2 = (0, utils_ts_1.ensureBytes)("message", message);
      const pub = (0, utils_ts_1.ensureBytes)("publicKey", publicKey, 32);
      try {
        const P = lift_x(num(pub));
        const r = num(sig.subarray(0, 32));
        if (!(0, utils_ts_1.inRange)(r, _1n, secp256k1_CURVE.p))
          return false;
        const s = num(sig.subarray(32, 64));
        if (!(0, utils_ts_1.inRange)(s, _1n, secp256k1_CURVE.n))
          return false;
        const e = challenge(Fn.toBytes(r), pointToBytes(P), m2);
        const R = BASE.multiplyUnsafe(s).add(P.multiplyUnsafe(Fn.neg(e)));
        const { x, y } = R.toAffine();
        if (R.is0() || !hasEven(y) || x !== r)
          return false;
        return true;
      } catch (error) {
        return false;
      }
    }
    exports.schnorr = (() => {
      const size = 32;
      const seedLength = 48;
      const randomSecretKey = (seed = (0, utils_js_1.randomBytes)(seedLength)) => {
        return (0, modular_ts_1.mapHashToField)(seed, secp256k1_CURVE.n);
      };
      exports.secp256k1.utils.randomSecretKey;
      function keygen(seed) {
        const secretKey = randomSecretKey(seed);
        return { secretKey, publicKey: schnorrGetPublicKey(secretKey) };
      }
      return {
        keygen,
        getPublicKey: schnorrGetPublicKey,
        sign: schnorrSign,
        verify: schnorrVerify,
        Point: Pointk1,
        utils: {
          randomSecretKey,
          randomPrivateKey: randomSecretKey,
          taggedHash,
          // TODO: remove
          lift_x,
          pointToBytes,
          numberToBytesBE: utils_ts_1.numberToBytesBE,
          bytesToNumberBE: utils_ts_1.bytesToNumberBE,
          mod: modular_ts_1.mod
        },
        lengths: {
          secretKey: size,
          publicKey: size,
          publicKeyHasPrefix: false,
          signature: size * 2,
          seed: seedLength
        }
      };
    })();
    var isoMap = /* @__PURE__ */ (() => (0, hash_to_curve_ts_1.isogenyMap)(Fpk1, [
      // xNum
      [
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
        "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
        "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
        "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
      ],
      // xDen
      [
        "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
        "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ],
      // yNum
      [
        "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
        "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
        "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
        "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
      ],
      // yDen
      [
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
        "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
        "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ]
    ].map((i) => i.map((j) => BigInt(j)))))();
    var mapSWU = /* @__PURE__ */ (() => (0, weierstrass_ts_1.mapToCurveSimpleSWU)(Fpk1, {
      A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
      B: BigInt("1771"),
      Z: Fpk1.create(BigInt("-11"))
    }))();
    exports.secp256k1_hasher = (() => (0, hash_to_curve_ts_1.createHasher)(exports.secp256k1.Point, (scalars) => {
      const { x, y } = mapSWU(Fpk1.create(scalars[0]));
      return isoMap(x, y);
    }, {
      DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
      encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
      p: Fpk1.ORDER,
      m: 1,
      k: 128,
      expand: "xmd",
      hash: sha2_js_1.sha256
    }))();
    exports.hashToCurve = (() => exports.secp256k1_hasher.hashToCurve)();
    exports.encodeToCurve = (() => exports.secp256k1_hasher.encodeToCurve)();
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/utils/hex.js
var require_hex = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/utils/hex.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeHex = exports.remove0x = void 0;
    var utils_1 = require_utils3();
    var remove0x = function(hex) {
      return hex.startsWith("0x") || hex.startsWith("0X") ? hex.slice(2) : hex;
    };
    exports.remove0x = remove0x;
    var decodeHex = function(hex) {
      return (0, utils_1.hexToBytes)((0, exports.remove0x)(hex));
    };
    exports.decodeHex = decodeHex;
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/utils/elliptic.js
var require_elliptic = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/utils/elliptic.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hexToPublicKey = exports.convertPublicKeyFormat = exports.getSharedPoint = exports.getPublicKey = exports.isValidPrivateKey = exports.getValidSecret = void 0;
    var webcrypto_1 = require_webcrypto();
    var ed25519_1 = require_ed25519();
    var secp256k1_1 = require_secp256k1();
    var config_1 = require_config();
    var consts_1 = require_consts();
    var hex_1 = require_hex();
    var getValidSecret = function(curve) {
      var key;
      do {
        key = (0, webcrypto_1.randomBytes)(consts_1.SECRET_KEY_LENGTH);
      } while (!(0, exports.isValidPrivateKey)(key, curve));
      return key;
    };
    exports.getValidSecret = getValidSecret;
    var isValidPrivateKey = function(secret, curve) {
      return _exec(curve || (0, config_1.ellipticCurve)(), function(curve2) {
        return curve2.utils.isValidPrivateKey(secret);
      }, function() {
        return true;
      }, function() {
        return true;
      });
    };
    exports.isValidPrivateKey = isValidPrivateKey;
    var getPublicKey = function(secret, curve) {
      return _exec(curve || (0, config_1.ellipticCurve)(), function(curve2) {
        return curve2.getPublicKey(secret);
      }, function(curve2) {
        return curve2.getPublicKey(secret);
      }, function(curve2) {
        return curve2.getPublicKey(secret);
      });
    };
    exports.getPublicKey = getPublicKey;
    var getSharedPoint = function(sk, pk, compressed, curve) {
      return _exec(curve || (0, config_1.ellipticCurve)(), function(curve2) {
        return curve2.getSharedSecret(sk, pk, compressed);
      }, function(curve2) {
        return curve2.getSharedSecret(sk, pk);
      }, function(curve2) {
        return getSharedPointOnEd25519(curve2, sk, pk);
      });
    };
    exports.getSharedPoint = getSharedPoint;
    var convertPublicKeyFormat = function(pk, compressed, curve) {
      return _exec(curve || (0, config_1.ellipticCurve)(), function(curve2) {
        return curve2.getSharedSecret(BigInt(1), pk, compressed);
      }, function() {
        return pk;
      }, function() {
        return pk;
      });
    };
    exports.convertPublicKeyFormat = convertPublicKeyFormat;
    var hexToPublicKey = function(hex, curve) {
      var decoded = (0, hex_1.decodeHex)(hex);
      return _exec(curve || (0, config_1.ellipticCurve)(), function() {
        return compatEthPublicKey(decoded);
      }, function() {
        return decoded;
      }, function() {
        return decoded;
      });
    };
    exports.hexToPublicKey = hexToPublicKey;
    function _exec(curve, secp256k1Callback, x25519Callback, ed25519Callback) {
      if (curve === "secp256k1") {
        return secp256k1Callback(secp256k1_1.secp256k1);
      } else if (curve === "x25519") {
        return x25519Callback(ed25519_1.x25519);
      } else if (curve === "ed25519") {
        return ed25519Callback(ed25519_1.ed25519);
      } else {
        throw new Error("Not implemented");
      }
    }
    var compatEthPublicKey = function(pk) {
      if (pk.length === consts_1.ETH_PUBLIC_KEY_SIZE) {
        var fixed = new Uint8Array(1 + pk.length);
        fixed.set([4]);
        fixed.set(pk, 1);
        return fixed;
      }
      return pk;
    };
    var getSharedPointOnEd25519 = function(curve, sk, pk) {
      var scalar = curve.utils.getExtendedPublicKey(sk).scalar;
      var point = curve.ExtendedPoint.fromHex(pk).multiply(scalar);
      return point.toRawBytes();
    };
  }
});

// ../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/hkdf.js
var require_hkdf = __commonJS({
  "../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/hkdf.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hkdf = void 0;
    exports.extract = extract;
    exports.expand = expand;
    var hmac_ts_1 = require_hmac();
    var utils_ts_1 = require_utils4();
    function extract(hash, ikm, salt) {
      (0, utils_ts_1.ahash)(hash);
      if (salt === void 0)
        salt = new Uint8Array(hash.outputLen);
      return (0, hmac_ts_1.hmac)(hash, (0, utils_ts_1.toBytes)(salt), (0, utils_ts_1.toBytes)(ikm));
    }
    var HKDF_COUNTER = /* @__PURE__ */ Uint8Array.from([0]);
    var EMPTY_BUFFER = /* @__PURE__ */ Uint8Array.of();
    function expand(hash, prk, info, length = 32) {
      (0, utils_ts_1.ahash)(hash);
      (0, utils_ts_1.anumber)(length);
      const olen = hash.outputLen;
      if (length > 255 * olen)
        throw new Error("Length should be <= 255*HashLen");
      const blocks = Math.ceil(length / olen);
      if (info === void 0)
        info = EMPTY_BUFFER;
      const okm = new Uint8Array(blocks * olen);
      const HMAC = hmac_ts_1.hmac.create(hash, prk);
      const HMACTmp = HMAC._cloneInto();
      const T = new Uint8Array(HMAC.outputLen);
      for (let counter = 0; counter < blocks; counter++) {
        HKDF_COUNTER[0] = counter + 1;
        HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
        okm.set(T, olen * counter);
        HMAC._cloneInto(HMACTmp);
      }
      HMAC.destroy();
      HMACTmp.destroy();
      (0, utils_ts_1.clean)(T, HKDF_COUNTER);
      return okm.slice(0, length);
    }
    var hkdf = (hash, ikm, salt, info, length) => expand(hash, extract(hash, ikm, salt), info, length);
    exports.hkdf = hkdf;
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/utils/hash.js
var require_hash = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/utils/hash.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSharedKey = exports.deriveKey = void 0;
    var utils_1 = require_utils3();
    var hkdf_1 = require_hkdf();
    var sha2_1 = require_sha2();
    var deriveKey = function(master, salt, info) {
      return (0, hkdf_1.hkdf)(sha2_1.sha256, master, salt, info, 32);
    };
    exports.deriveKey = deriveKey;
    var getSharedKey = function() {
      var parts = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
      }
      return (0, exports.deriveKey)(utils_1.concatBytes.apply(void 0, parts));
    };
    exports.getSharedKey = getSharedKey;
  }
});

// ../node_modules/.pnpm/@ecies+ciphers@0.2.4_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/_node/compat.js
var require_compat = __commonJS({
  "../node_modules/.pnpm/@ecies+ciphers@0.2.4_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/_node/compat.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._compat = void 0;
    var utils_1 = require_utils3();
    var node_crypto_1 = __require("node:crypto");
    var AEAD_TAG_LENGTH = 16;
    var IS_DENO = globalThis.Deno !== void 0;
    var _compat = function(algorithm, key, nonce, AAD) {
      var isAEAD = algorithm === "aes-256-gcm" || algorithm === "chacha20-poly1305";
      var authTagLength = isAEAD ? AEAD_TAG_LENGTH : 0;
      var options = isAEAD ? { authTagLength } : void 0;
      var encrypt = function(plainText) {
        var cipher = (0, node_crypto_1.createCipheriv)(algorithm, key, nonce, options);
        if (isAEAD && AAD !== void 0) {
          cipher.setAAD(AAD);
        }
        var updated = cipher.update(plainText);
        var finalized = cipher.final();
        var tag = isAEAD ? cipher.getAuthTag() : new Uint8Array(0);
        return (0, utils_1.concatBytes)(updated, finalized, tag);
      };
      var decrypt = function(cipherText) {
        var rawCipherText = cipherText.subarray(0, cipherText.length - authTagLength);
        var tag = cipherText.subarray(cipherText.length - authTagLength);
        var decipher = (0, node_crypto_1.createDecipheriv)(algorithm, key, nonce, options);
        if (isAEAD) {
          if (AAD !== void 0) {
            decipher.setAAD(AAD);
          }
          decipher.setAuthTag(tag);
        }
        if (!isAEAD && IS_DENO) {
          decipher.setAutoPadding(false);
        }
        var updated = decipher.update(rawCipherText);
        var finalized = decipher.final();
        return (0, utils_1.concatBytes)(updated, finalized);
      };
      return {
        encrypt,
        decrypt
      };
    };
    exports._compat = _compat;
  }
});

// ../node_modules/.pnpm/@ecies+ciphers@0.2.4_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/aes/node.js
var require_node = __commonJS({
  "../node_modules/.pnpm/@ecies+ciphers@0.2.4_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/aes/node.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.aes256cbc = exports.aes256gcm = void 0;
    var compat_1 = require_compat();
    var aes256gcm = function(key, nonce, AAD) {
      return (0, compat_1._compat)("aes-256-gcm", key, nonce, AAD);
    };
    exports.aes256gcm = aes256gcm;
    var aes256cbc = function(key, nonce, AAD) {
      return (0, compat_1._compat)("aes-256-cbc", key, nonce);
    };
    exports.aes256cbc = aes256cbc;
  }
});

// ../node_modules/.pnpm/@ecies+ciphers@0.2.4_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/_node/hchacha.js
var require_hchacha = __commonJS({
  "../node_modules/.pnpm/@ecies+ciphers@0.2.4_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/_node/hchacha.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._hchacha20 = void 0;
    var _hchacha20 = function(s, k, i, o32) {
      var x00 = s[0], x01 = s[1], x02 = s[2], x03 = s[3], x04 = k[0], x05 = k[1], x06 = k[2], x07 = k[3], x08 = k[4], x09 = k[5], x10 = k[6], x11 = k[7], x12 = i[0], x13 = i[1], x14 = i[2], x15 = i[3];
      for (var r = 0; r < 20; r += 2) {
        x00 = x00 + x04 | 0;
        x12 = rotl(x12 ^ x00, 16);
        x08 = x08 + x12 | 0;
        x04 = rotl(x04 ^ x08, 12);
        x00 = x00 + x04 | 0;
        x12 = rotl(x12 ^ x00, 8);
        x08 = x08 + x12 | 0;
        x04 = rotl(x04 ^ x08, 7);
        x01 = x01 + x05 | 0;
        x13 = rotl(x13 ^ x01, 16);
        x09 = x09 + x13 | 0;
        x05 = rotl(x05 ^ x09, 12);
        x01 = x01 + x05 | 0;
        x13 = rotl(x13 ^ x01, 8);
        x09 = x09 + x13 | 0;
        x05 = rotl(x05 ^ x09, 7);
        x02 = x02 + x06 | 0;
        x14 = rotl(x14 ^ x02, 16);
        x10 = x10 + x14 | 0;
        x06 = rotl(x06 ^ x10, 12);
        x02 = x02 + x06 | 0;
        x14 = rotl(x14 ^ x02, 8);
        x10 = x10 + x14 | 0;
        x06 = rotl(x06 ^ x10, 7);
        x03 = x03 + x07 | 0;
        x15 = rotl(x15 ^ x03, 16);
        x11 = x11 + x15 | 0;
        x07 = rotl(x07 ^ x11, 12);
        x03 = x03 + x07 | 0;
        x15 = rotl(x15 ^ x03, 8);
        x11 = x11 + x15 | 0;
        x07 = rotl(x07 ^ x11, 7);
        x00 = x00 + x05 | 0;
        x15 = rotl(x15 ^ x00, 16);
        x10 = x10 + x15 | 0;
        x05 = rotl(x05 ^ x10, 12);
        x00 = x00 + x05 | 0;
        x15 = rotl(x15 ^ x00, 8);
        x10 = x10 + x15 | 0;
        x05 = rotl(x05 ^ x10, 7);
        x01 = x01 + x06 | 0;
        x12 = rotl(x12 ^ x01, 16);
        x11 = x11 + x12 | 0;
        x06 = rotl(x06 ^ x11, 12);
        x01 = x01 + x06 | 0;
        x12 = rotl(x12 ^ x01, 8);
        x11 = x11 + x12 | 0;
        x06 = rotl(x06 ^ x11, 7);
        x02 = x02 + x07 | 0;
        x13 = rotl(x13 ^ x02, 16);
        x08 = x08 + x13 | 0;
        x07 = rotl(x07 ^ x08, 12);
        x02 = x02 + x07 | 0;
        x13 = rotl(x13 ^ x02, 8);
        x08 = x08 + x13 | 0;
        x07 = rotl(x07 ^ x08, 7);
        x03 = x03 + x04 | 0;
        x14 = rotl(x14 ^ x03, 16);
        x09 = x09 + x14 | 0;
        x04 = rotl(x04 ^ x09, 12);
        x03 = x03 + x04 | 0;
        x14 = rotl(x14 ^ x03, 8);
        x09 = x09 + x14 | 0;
        x04 = rotl(x04 ^ x09, 7);
      }
      var oi = 0;
      o32[oi++] = x00;
      o32[oi++] = x01;
      o32[oi++] = x02;
      o32[oi++] = x03;
      o32[oi++] = x12;
      o32[oi++] = x13;
      o32[oi++] = x14;
      o32[oi++] = x15;
    };
    exports._hchacha20 = _hchacha20;
    var rotl = function(a, b2) {
      return a << b2 | a >>> 32 - b2;
    };
  }
});

// ../node_modules/.pnpm/@ecies+ciphers@0.2.4_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/chacha/node.js
var require_node2 = __commonJS({
  "../node_modules/.pnpm/@ecies+ciphers@0.2.4_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/chacha/node.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.chacha20 = exports.xchacha20 = void 0;
    var utils_1 = require_utils3();
    var compat_1 = require_compat();
    var hchacha_1 = require_hchacha();
    var xchacha20 = function(key, nonce, AAD) {
      if (nonce.length !== 24) {
        throw new Error("xchacha20's nonce must be 24 bytes");
      }
      var constants = new Uint32Array([1634760805, 857760878, 2036477234, 1797285236]);
      var subKey = new Uint32Array(8);
      (0, hchacha_1._hchacha20)(constants, (0, utils_1.u32)(key), (0, utils_1.u32)(nonce.subarray(0, 16)), subKey);
      var subNonce = new Uint8Array(12);
      subNonce.set([0, 0, 0, 0]);
      subNonce.set(nonce.subarray(16), 4);
      return (0, compat_1._compat)("chacha20-poly1305", (0, utils_1.u8)(subKey), subNonce, AAD);
    };
    exports.xchacha20 = xchacha20;
    var chacha20 = function(key, nonce, AAD) {
      if (nonce.length !== 12) {
        throw new Error("chacha20's nonce must be 12 bytes");
      }
      return (0, compat_1._compat)("chacha20-poly1305", key, nonce, AAD);
    };
    exports.chacha20 = chacha20;
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/utils/symmetric.js
var require_symmetric = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/utils/symmetric.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.aesDecrypt = exports.aesEncrypt = exports.symDecrypt = exports.symEncrypt = void 0;
    var utils_1 = require_utils3();
    var webcrypto_1 = require_webcrypto();
    var aes_1 = require_node();
    var chacha_1 = require_node2();
    var config_1 = require_config();
    var consts_1 = require_consts();
    var symEncrypt = function(key, plainText, AAD) {
      return _exec(_encrypt, key, plainText, AAD);
    };
    exports.symEncrypt = symEncrypt;
    var symDecrypt = function(key, cipherText, AAD) {
      return _exec(_decrypt, key, cipherText, AAD);
    };
    exports.symDecrypt = symDecrypt;
    exports.aesEncrypt = exports.symEncrypt;
    exports.aesDecrypt = exports.symDecrypt;
    function _exec(callback, key, data, AAD) {
      var algorithm = (0, config_1.symmetricAlgorithm)();
      if (algorithm === "aes-256-gcm") {
        return callback(aes_1.aes256gcm, key, data, (0, config_1.symmetricNonceLength)(), consts_1.AEAD_TAG_LENGTH, AAD);
      } else if (algorithm === "xchacha20") {
        return callback(chacha_1.xchacha20, key, data, consts_1.XCHACHA20_NONCE_LENGTH, consts_1.AEAD_TAG_LENGTH, AAD);
      } else if (algorithm === "aes-256-cbc") {
        return callback(aes_1.aes256cbc, key, data, 16, 0);
      } else {
        throw new Error("Not implemented");
      }
    }
    function _encrypt(func, key, data, nonceLength, tagLength, AAD) {
      var nonce = (0, webcrypto_1.randomBytes)(nonceLength);
      var cipher = func(key, nonce, AAD);
      var encrypted = cipher.encrypt(data);
      if (tagLength === 0) {
        return (0, utils_1.concatBytes)(nonce, encrypted);
      }
      var cipherTextLength = encrypted.length - tagLength;
      var cipherText = encrypted.subarray(0, cipherTextLength);
      var tag = encrypted.subarray(cipherTextLength);
      return (0, utils_1.concatBytes)(nonce, tag, cipherText);
    }
    function _decrypt(func, key, data, nonceLength, tagLength, AAD) {
      var nonce = data.subarray(0, nonceLength);
      var cipher = func(key, Uint8Array.from(nonce), AAD);
      var encrypted = data.subarray(nonceLength);
      if (tagLength === 0) {
        return cipher.decrypt(encrypted);
      }
      var tag = encrypted.subarray(0, tagLength);
      var cipherText = encrypted.subarray(tagLength);
      return cipher.decrypt((0, utils_1.concatBytes)(cipherText, tag));
    }
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/utils/index.js
var require_utils6 = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/utils/index.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc2 = Object.getOwnPropertyDescriptor(m2, k);
      if (!desc2 || ("get" in desc2 ? !m2.__esModule : desc2.writable || desc2.configurable)) {
        desc2 = { enumerable: true, get: function() {
          return m2[k];
        } };
      }
      Object.defineProperty(o, k2, desc2);
    } : function(o, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m2[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m2, exports2) {
      for (var p2 in m2) if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2)) __createBinding(exports2, m2, p2);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_elliptic(), exports);
    __exportStar(require_hash(), exports);
    __exportStar(require_hex(), exports);
    __exportStar(require_symmetric(), exports);
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/keys/PublicKey.js
var require_PublicKey = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/keys/PublicKey.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PublicKey = void 0;
    var utils_1 = require_utils3();
    var utils_2 = require_utils6();
    var PublicKey = (
      /** @class */
      function() {
        function PublicKey2(data, curve) {
          var compressed = (0, utils_2.convertPublicKeyFormat)(data, true, curve);
          var uncompressed = (0, utils_2.convertPublicKeyFormat)(data, false, curve);
          this.data = compressed;
          this.dataUncompressed = compressed.length !== uncompressed.length ? uncompressed : null;
        }
        PublicKey2.fromHex = function(hex, curve) {
          return new PublicKey2((0, utils_2.hexToPublicKey)(hex, curve), curve);
        };
        Object.defineProperty(PublicKey2.prototype, "_uncompressed", {
          get: function() {
            return this.dataUncompressed !== null ? this.dataUncompressed : this.data;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(PublicKey2.prototype, "uncompressed", {
          /** @deprecated - use `PublicKey.toBytes(false)` instead. You may also need `Buffer.from`. */
          get: function() {
            return Buffer.from(this._uncompressed);
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(PublicKey2.prototype, "compressed", {
          /** @deprecated - use `PublicKey.toBytes()` instead. You may also need `Buffer.from`. */
          get: function() {
            return Buffer.from(this.data);
          },
          enumerable: false,
          configurable: true
        });
        PublicKey2.prototype.toBytes = function(compressed) {
          if (compressed === void 0) {
            compressed = true;
          }
          return compressed ? this.data : this._uncompressed;
        };
        PublicKey2.prototype.toHex = function(compressed) {
          if (compressed === void 0) {
            compressed = true;
          }
          return (0, utils_1.bytesToHex)(this.toBytes(compressed));
        };
        PublicKey2.prototype.decapsulate = function(sk, compressed) {
          if (compressed === void 0) {
            compressed = false;
          }
          var senderPoint = this.toBytes(compressed);
          var sharedPoint = sk.multiply(this, compressed);
          return (0, utils_2.getSharedKey)(senderPoint, sharedPoint);
        };
        PublicKey2.prototype.equals = function(other) {
          return (0, utils_1.equalBytes)(this.data, other.data);
        };
        return PublicKey2;
      }()
    );
    exports.PublicKey = PublicKey;
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/keys/PrivateKey.js
var require_PrivateKey = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/keys/PrivateKey.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PrivateKey = void 0;
    var utils_1 = require_utils3();
    var utils_2 = require_utils6();
    var PublicKey_1 = require_PublicKey();
    var PrivateKey = (
      /** @class */
      function() {
        function PrivateKey2(secret, curve) {
          this.curve = curve;
          if (secret === void 0) {
            this.data = (0, utils_2.getValidSecret)(curve);
          } else if ((0, utils_2.isValidPrivateKey)(secret, curve)) {
            this.data = secret;
          } else {
            throw new Error("Invalid private key");
          }
          this.publicKey = new PublicKey_1.PublicKey((0, utils_2.getPublicKey)(this.data, curve), curve);
        }
        PrivateKey2.fromHex = function(hex, curve) {
          return new PrivateKey2((0, utils_2.decodeHex)(hex), curve);
        };
        Object.defineProperty(PrivateKey2.prototype, "secret", {
          /** @description From version 0.5.0, `Uint8Array` will be returned instead of `Buffer`. */
          get: function() {
            return Buffer.from(this.data);
          },
          enumerable: false,
          configurable: true
        });
        PrivateKey2.prototype.toHex = function() {
          return (0, utils_1.bytesToHex)(this.data);
        };
        PrivateKey2.prototype.encapsulate = function(pk, compressed) {
          if (compressed === void 0) {
            compressed = false;
          }
          var senderPoint = this.publicKey.toBytes(compressed);
          var sharedPoint = this.multiply(pk, compressed);
          return (0, utils_2.getSharedKey)(senderPoint, sharedPoint);
        };
        PrivateKey2.prototype.multiply = function(pk, compressed) {
          if (compressed === void 0) {
            compressed = false;
          }
          return (0, utils_2.getSharedPoint)(this.data, pk.toBytes(true), compressed, this.curve);
        };
        PrivateKey2.prototype.equals = function(other) {
          return (0, utils_1.equalBytes)(this.data, other.data);
        };
        return PrivateKey2;
      }()
    );
    exports.PrivateKey = PrivateKey;
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/keys/index.js
var require_keys = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/keys/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PublicKey = exports.PrivateKey = void 0;
    var PrivateKey_1 = require_PrivateKey();
    Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function() {
      return PrivateKey_1.PrivateKey;
    } });
    var PublicKey_1 = require_PublicKey();
    Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function() {
      return PublicKey_1.PublicKey;
    } });
  }
});

// ../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/index.js
var require_dist2 = __commonJS({
  "../node_modules/.pnpm/eciesjs@0.4.15/node_modules/eciesjs/dist/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.utils = exports.PublicKey = exports.PrivateKey = exports.ECIES_CONFIG = void 0;
    exports.encrypt = encrypt;
    exports.decrypt = decrypt;
    var utils_1 = require_utils3();
    var config_1 = require_config();
    var keys_1 = require_keys();
    var utils_2 = require_utils6();
    function encrypt(receiverRawPK, data) {
      return Buffer.from(_encrypt(receiverRawPK, data));
    }
    function _encrypt(receiverRawPK, data) {
      var curve = (0, config_1.ellipticCurve)();
      var ephemeralSK = new keys_1.PrivateKey(void 0, curve);
      var receiverPK = receiverRawPK instanceof Uint8Array ? new keys_1.PublicKey(receiverRawPK, curve) : keys_1.PublicKey.fromHex(receiverRawPK, curve);
      var sharedKey = ephemeralSK.encapsulate(receiverPK, (0, config_1.isHkdfKeyCompressed)());
      var ephemeralPK = ephemeralSK.publicKey.toBytes((0, config_1.isEphemeralKeyCompressed)());
      var encrypted = (0, utils_2.symEncrypt)(sharedKey, data);
      return (0, utils_1.concatBytes)(ephemeralPK, encrypted);
    }
    function decrypt(receiverRawSK, data) {
      return Buffer.from(_decrypt(receiverRawSK, data));
    }
    function _decrypt(receiverRawSK, data) {
      var curve = (0, config_1.ellipticCurve)();
      var receiverSK = receiverRawSK instanceof Uint8Array ? new keys_1.PrivateKey(receiverRawSK, curve) : keys_1.PrivateKey.fromHex(receiverRawSK, curve);
      var keySize = (0, config_1.ephemeralKeySize)();
      var ephemeralPK = new keys_1.PublicKey(data.subarray(0, keySize), curve);
      var encrypted = data.subarray(keySize);
      var sharedKey = ephemeralPK.decapsulate(receiverSK, (0, config_1.isHkdfKeyCompressed)());
      return (0, utils_2.symDecrypt)(sharedKey, encrypted);
    }
    var config_2 = require_config();
    Object.defineProperty(exports, "ECIES_CONFIG", { enumerable: true, get: function() {
      return config_2.ECIES_CONFIG;
    } });
    var keys_2 = require_keys();
    Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function() {
      return keys_2.PrivateKey;
    } });
    Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function() {
      return keys_2.PublicKey;
    } });
    exports.utils = {
      // TODO: remove these after 0.5.0
      aesEncrypt: utils_2.aesEncrypt,
      aesDecrypt: utils_2.aesDecrypt,
      symEncrypt: utils_2.symEncrypt,
      symDecrypt: utils_2.symDecrypt,
      decodeHex: utils_2.decodeHex,
      getValidSecret: utils_2.getValidSecret,
      remove0x: utils_2.remove0x
    };
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/truncate.js
var require_truncate = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/truncate.js"(exports, module) {
    function truncate(str, showChar = 7) {
      if (str && str.length > 0) {
        const visiblePart = str.slice(0, showChar);
        return visiblePart + "\u2026";
      } else {
        return "";
      }
    }
    module.exports = truncate;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/errors.js
var require_errors = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/errors.js"(exports, module) {
    var truncate = require_truncate();
    var Errors = class {
      constructor(options = {}) {
        this.filepath = options.filepath;
        this.envFilepath = options.envFilepath;
        this.key = options.key;
        this.privateKey = options.privateKey;
        this.privateKeyName = options.privateKeyName;
        this.command = options.command;
        this.message = options.message;
      }
      missingEnvFile() {
        const code = "MISSING_ENV_FILE";
        const message = `[${code}] missing ${this.envFilepath} file (${this.filepath})`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/484`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
      missingKey() {
        const code = "MISSING_KEY";
        const message = `[${code}] missing ${this.key} key`;
        const e = new Error(message);
        e.code = code;
        return e;
      }
      missingPrivateKey() {
        const code = "MISSING_PRIVATE_KEY";
        const message = `[${code}] could not decrypt ${this.key} using private key '${this.privateKeyName}=${truncate(this.privateKey)}'`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/464`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
      invalidPrivateKey() {
        const code = "INVALID_PRIVATE_KEY";
        const message = `[${code}] could not decrypt ${this.key} using private key '${this.privateKeyName}=${truncate(this.privateKey)}'`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/465`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
      looksWrongPrivateKey() {
        const code = "WRONG_PRIVATE_KEY";
        const message = `[${code}] could not decrypt ${this.key} using private key '${this.privateKeyName}=${truncate(this.privateKey)}'`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/466`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
      malformedEncryptedData() {
        const code = "MALFORMED_ENCRYPTED_DATA";
        const message = `[${code}] could not decrypt ${this.key} because encrypted data appears malformed`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/467`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
      decryptionFailed() {
        const code = "DECRYPTION_FAILED";
        const message = this.message;
        const e = new Error(message);
        e.code = code;
        return e;
      }
      commandSubstitutionFailed() {
        const code = "COMMAND_SUBSTITUTION_FAILED";
        const message = `[${code}] could not eval ${this.key} containing command '${this.command}': ${this.message}`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/532`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
    };
    module.exports = Errors;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/decryptKeyValue.js
var require_decryptKeyValue = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/decryptKeyValue.js"(exports, module) {
    var { decrypt } = require_dist2();
    var Errors = require_errors();
    var PREFIX = "encrypted:";
    function decryptKeyValue(key, value, privateKeyName, privateKey) {
      let decryptedValue;
      let decryptionError;
      if (!value.startsWith(PREFIX)) {
        return value;
      }
      privateKey = privateKey || "";
      if (privateKey.length <= 0) {
        decryptionError = new Errors({ key, privateKeyName, privateKey }).missingPrivateKey();
      } else {
        const privateKeys = privateKey.split(",");
        for (const privKey of privateKeys) {
          const secret = Buffer.from(privKey, "hex");
          const encoded = value.substring(PREFIX.length);
          const ciphertext = Buffer.from(encoded, "base64");
          try {
            decryptedValue = decrypt(secret, ciphertext).toString();
            decryptionError = null;
            break;
          } catch (e) {
            if (e.message === "Invalid private key") {
              decryptionError = new Errors({ key, privateKeyName, privateKey }).invalidPrivateKey();
            } else if (e.message === "Unsupported state or unable to authenticate data") {
              decryptionError = new Errors({ key, privateKeyName, privateKey }).looksWrongPrivateKey();
            } else if (e.message === "Point of length 65 was invalid. Expected 33 compressed bytes or 65 uncompressed bytes") {
              decryptionError = new Errors({ key, privateKeyName, privateKey }).malformedEncryptedData();
            } else {
              decryptionError = new Errors({ key, privateKeyName, privateKey, message: e.message }).decryptionFailed();
            }
          }
        }
      }
      if (decryptionError) {
        throw decryptionError;
      }
      return decryptedValue;
    }
    module.exports = decryptKeyValue;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/chomp.js
var require_chomp = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/chomp.js"(exports, module) {
    function chomp(value) {
      return value.replace(/[\r\n]+$/, "");
    }
    module.exports = chomp;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/evalKeyValue.js
var require_evalKeyValue = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/evalKeyValue.js"(exports, module) {
    var { execSync: execSync2 } = __require("child_process");
    var chomp = require_chomp();
    var Errors = require_errors();
    function evalKeyValue(key, value, processEnv, runningParsed) {
      const matches = value.match(/\$\(([^)]+(?:\)[^(]*)*)\)/g) || [];
      return matches.reduce((newValue, match) => {
        const command = match.slice(2, -1);
        let result;
        try {
          result = execSync2(command, { env: { ...processEnv, ...runningParsed } }).toString();
        } catch (e) {
          throw new Errors({ key, command, message: e.message.trim() }).commandSubstitutionFailed();
        }
        result = chomp(result);
        return newValue.replace(match, result);
      }, value);
    }
    module.exports = evalKeyValue;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/resolveEscapeSequences.js
var require_resolveEscapeSequences = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/resolveEscapeSequences.js"(exports, module) {
    function resolveEscapeSequences(value) {
      return value.replace(/\\\$/g, "$");
    }
    module.exports = resolveEscapeSequences;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/parse.js
var require_parse2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/parse.js"(exports, module) {
    var decryptKeyValue = require_decryptKeyValue();
    var evalKeyValue = require_evalKeyValue();
    var resolveEscapeSequences = require_resolveEscapeSequences();
    var Parse = class _Parse {
      static LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
      constructor(src, privateKey = null, processEnv = process.env, overload = false, privateKeyName = null) {
        this.src = src;
        this.privateKey = privateKey;
        this.privateKeyName = privateKeyName;
        this.processEnv = processEnv;
        this.overload = overload;
        this.parsed = {};
        this.preExisted = {};
        this.injected = {};
        this.errors = [];
        this.runningParsed = {};
        this.literals = {};
      }
      run() {
        const lines = this.getLines();
        let match;
        while ((match = _Parse.LINE.exec(lines)) !== null) {
          const key = match[1];
          const value = match[2];
          const quote = this.quote(value);
          this.parsed[key] = this.clean(value, quote);
          if (!this.overload && this.inProcessEnv(key)) {
            this.parsed[key] = this.processEnv[key];
          }
          try {
            this.parsed[key] = this.decrypt(key, this.parsed[key]);
          } catch (e) {
            this.errors.push(e);
          }
          let evaled = false;
          if (quote !== "'" && (!this.inProcessEnv(key) || this.processEnv[key] === this.parsed[key])) {
            const priorEvaled = this.parsed[key];
            try {
              this.parsed[key] = this.eval(key, priorEvaled);
            } catch (e) {
              this.errors.push(e);
            }
            if (priorEvaled !== this.parsed[key]) {
              evaled = true;
            }
          }
          if (!evaled && quote !== "'" && (!this.processEnv[key] || this.overload)) {
            this.parsed[key] = resolveEscapeSequences(this.expand(this.parsed[key]));
          }
          if (quote === "'") {
            this.literals[key] = this.parsed[key];
          }
          this.runningParsed[key] = this.parsed[key];
          if (Object.prototype.hasOwnProperty.call(this.processEnv, key) && !this.overload) {
            this.preExisted[key] = this.processEnv[key];
          } else {
            this.injected[key] = this.parsed[key];
          }
        }
        return {
          parsed: this.parsed,
          processEnv: this.processEnv,
          injected: this.injected,
          preExisted: this.preExisted,
          errors: this.errors
        };
      }
      trimmer(value) {
        return (value || "").trim();
      }
      quote(value) {
        const v = this.trimmer(value);
        const maybeQuote = v[0];
        let q = "";
        switch (maybeQuote) {
          // single
          case "'":
            q = "'";
            break;
          // double
          case '"':
            q = '"';
            break;
          // backtick
          case "`":
            q = "`";
            break;
          // empty
          default:
            q = "";
        }
        return q;
      }
      clean(value, _quote) {
        let v = this.trimmer(value);
        v = v.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (_quote === '"') {
          v = v.replace(/\\n/g, "\n");
          v = v.replace(/\\r/g, "\r");
          v = v.replace(/\\t/g, "	");
        }
        return v;
      }
      decrypt(key, value) {
        return decryptKeyValue(key, value, this.privateKeyName, this.privateKey);
      }
      eval(key, value) {
        return evalKeyValue(key, value, this.processEnv, this.runningParsed);
      }
      expand(value) {
        let env3 = { ...this.runningParsed, ...this.processEnv };
        if (this.overload) {
          env3 = { ...this.processEnv, ...this.runningParsed };
        }
        const regex = /(?<!\\)\${([^{}]+)}|(?<!\\)\$([A-Za-z_][A-Za-z0-9_]*)/g;
        let result = value;
        let match;
        while ((match = regex.exec(result)) !== null) {
          const [template, bracedExpression, unbracedExpression] = match;
          const expression = bracedExpression || unbracedExpression;
          const opRegex = /(:\+|\+|:-|-)/;
          const opMatch = expression.match(opRegex);
          const splitter = opMatch ? opMatch[0] : null;
          const r = expression.split(splitter);
          let defaultValue;
          let value2;
          const key = r.shift();
          if ([":+", "+"].includes(splitter)) {
            defaultValue = env3[key] ? r.join(splitter) : "";
            value2 = null;
          } else {
            defaultValue = r.join(splitter);
            value2 = env3[key];
          }
          if (value2) {
            result = result.replace(template, value2);
          } else {
            result = result.replace(template, defaultValue);
          }
          if (result === env3[key]) {
            break;
          }
          if (this.literals[key]) {
            break;
          }
          regex.lastIndex = 0;
        }
        return result;
      }
      inProcessEnv(key) {
        return Object.prototype.hasOwnProperty.call(this.processEnv, key);
      }
      getLines() {
        return (this.src || "").toString().replace(/\r\n?/mg, "\n");
      }
    };
    module.exports = Parse;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvParse.js
var require_dotenvParse = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvParse.js"(exports, module) {
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function dotenvParse(src, skipExpandForDoubleQuotes = false, skipConvertingWindowsNewlines = false) {
      const obj = {};
      let lines = src.toString();
      if (!skipConvertingWindowsNewlines) {
        lines = lines.replace(/\r\n?/mg, "\n");
      }
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"' && !skipExpandForDoubleQuotes) {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
          value = value.replace(/\\t/g, "	");
        }
        obj[key] = value;
      }
      return obj;
    }
    module.exports = dotenvParse;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/parseEnvironmentFromDotenvKey.js
var require_parseEnvironmentFromDotenvKey = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/parseEnvironmentFromDotenvKey.js"(exports, module) {
    function parseEnvironmentFromDotenvKey(dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (e) {
        throw new Error(`INVALID_DOTENV_KEY: ${e.message}`);
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        throw new Error("INVALID_DOTENV_KEY: Missing environment part");
      }
      return environment;
    }
    module.exports = parseEnvironmentFromDotenvKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/detectEncoding.js
var require_detectEncoding = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/detectEncoding.js"(exports, module) {
    var fs6 = __require("fs");
    function detectEncoding(filepath) {
      const buffer = fs6.readFileSync(filepath);
      if (buffer.length >= 2 && buffer[0] === 255 && buffer[1] === 254) {
        return "utf16le";
      }
      if (buffer.length >= 3 && buffer[0] === 239 && buffer[1] === 187 && buffer[2] === 191) {
        return "utf8";
      }
      return "utf8";
    }
    module.exports = detectEncoding;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessEnvironment.js
var require_guessEnvironment = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessEnvironment.js"(exports, module) {
    var path8 = __require("path");
    function guessEnvironment(filepath) {
      const filename = path8.basename(filepath);
      const parts = filename.split(".");
      const possibleEnvironmentList = [...parts.slice(2)];
      if (possibleEnvironmentList.length === 0) {
        const environment = filename.replace(".env", "development");
        return environment;
      }
      if (possibleEnvironmentList.length === 1) {
        return possibleEnvironmentList[0];
      }
      if (possibleEnvironmentList.length === 2) {
        return possibleEnvironmentList.join("_");
      }
      return possibleEnvironmentList.slice(0, 2).join("_");
    }
    module.exports = guessEnvironment;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPrivateKeyName.js
var require_guessPrivateKeyName = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPrivateKeyName.js"(exports, module) {
    var path8 = __require("path");
    var guessEnvironment = require_guessEnvironment();
    function guessPrivateKeyName(filepath) {
      const filename = path8.basename(filepath).toLowerCase();
      if (filename === ".env") {
        return "DOTENV_PRIVATE_KEY";
      }
      const environment = guessEnvironment(filename);
      return `DOTENV_PRIVATE_KEY_${environment.toUpperCase()}`;
    }
    module.exports = guessPrivateKeyName;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPublicKeyName.js
var require_guessPublicKeyName = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPublicKeyName.js"(exports, module) {
    var path8 = __require("path");
    var guessEnvironment = require_guessEnvironment();
    function guessPublicKeyName(filepath) {
      const filename = path8.basename(filepath).toLowerCase();
      if (filename === ".env") {
        return "DOTENV_PUBLIC_KEY";
      }
      const environment = guessEnvironment(filename);
      return `DOTENV_PUBLIC_KEY_${environment.toUpperCase()}`;
    }
    module.exports = guessPublicKeyName;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/proKeypair.js
var require_proKeypair = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/proKeypair.js"(exports, module) {
    var path8 = __require("path");
    var childProcess = __require("child_process");
    var guessPrivateKeyName = require_guessPrivateKeyName();
    var guessPublicKeyName = require_guessPublicKeyName();
    var ProKeypair = class {
      constructor(envFilepath) {
        this.envFilepath = envFilepath;
      }
      run() {
        let result = {};
        try {
          const projectRoot = path8.resolve(process.cwd());
          const dotenvxProPath = __require.resolve("@dotenvx/dotenvx-pro", { paths: [projectRoot] });
          const { keypair } = __require(dotenvxProPath);
          result = keypair(this.envFilepath);
        } catch (_e) {
          try {
            const output = childProcess.execSync(`dotenvx-pro keypair -f ${this.envFilepath}`, { stdio: ["pipe", "pipe", "ignore"] }).toString().trim();
            result = JSON.parse(output);
          } catch (_e2) {
            const privateKeyName = guessPrivateKeyName(this.envFilepath);
            const publicKeyName = guessPublicKeyName(this.envFilepath);
            result[privateKeyName] = null;
            result[publicKeyName] = null;
          }
        }
        return result;
      }
    };
    module.exports = ProKeypair;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/smartDotenvPublicKey.js
var require_smartDotenvPublicKey = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/smartDotenvPublicKey.js"(exports, module) {
    var fsx = require_fsx();
    var dotenvParse = require_dotenvParse();
    var guessPublicKeyName = require_guessPublicKeyName();
    function searchProcessEnv(publicKeyName) {
      if (process.env[publicKeyName] && process.env[publicKeyName].length > 0) {
        return process.env[publicKeyName];
      }
    }
    function searchEnvFile(publicKeyName, envFilepath) {
      if (fsx.existsSync(envFilepath)) {
        const keysSrc = fsx.readFileX(envFilepath);
        const keysParsed = dotenvParse(keysSrc);
        if (keysParsed[publicKeyName] && keysParsed[publicKeyName].length > 0) {
          return keysParsed[publicKeyName];
        }
      }
    }
    function smartDotenvPublicKey(envFilepath) {
      let publicKey = null;
      const publicKeyName = guessPublicKeyName(envFilepath);
      publicKey = searchProcessEnv(publicKeyName);
      if (publicKey) {
        return publicKey;
      }
      publicKey = searchEnvFile(publicKeyName, envFilepath);
      if (publicKey) {
        return publicKey;
      }
      return null;
    }
    module.exports = smartDotenvPublicKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/smartDotenvPrivateKey.js
var require_smartDotenvPrivateKey = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/smartDotenvPrivateKey.js"(exports, module) {
    var fsx = require_fsx();
    var path8 = __require("path");
    var PUBLIC_KEY_SCHEMA = "DOTENV_PUBLIC_KEY";
    var PRIVATE_KEY_SCHEMA = "DOTENV_PRIVATE_KEY";
    var dotenvParse = require_dotenvParse();
    var guessPrivateKeyName = require_guessPrivateKeyName();
    function searchProcessEnv(privateKeyName) {
      if (process.env[privateKeyName] && process.env[privateKeyName].length > 0) {
        return process.env[privateKeyName];
      }
    }
    function searchKeysFile(privateKeyName, envFilepath, envKeysFilepath = null) {
      let keysFilepath = path8.resolve(path8.dirname(envFilepath), ".env.keys");
      if (envKeysFilepath) {
        keysFilepath = path8.resolve(envKeysFilepath);
      }
      if (fsx.existsSync(keysFilepath)) {
        const keysSrc = fsx.readFileX(keysFilepath);
        const keysParsed = dotenvParse(keysSrc);
        if (keysParsed[privateKeyName] && keysParsed[privateKeyName].length > 0) {
          return keysParsed[privateKeyName];
        }
      }
    }
    function invertForPrivateKeyName(envFilepath) {
      if (!fsx.existsSync(envFilepath)) {
        return null;
      }
      const envSrc = fsx.readFileX(envFilepath);
      const envParsed = dotenvParse(envSrc);
      let publicKeyName;
      for (const keyName of Object.keys(envParsed)) {
        if (keyName === PUBLIC_KEY_SCHEMA || keyName.startsWith(PUBLIC_KEY_SCHEMA)) {
          publicKeyName = keyName;
        }
      }
      if (publicKeyName) {
        return publicKeyName.replace(PUBLIC_KEY_SCHEMA, PRIVATE_KEY_SCHEMA);
      }
      return null;
    }
    function smartDotenvPrivateKey(envFilepath, envKeysFilepath = null) {
      let privateKey = null;
      let privateKeyName = guessPrivateKeyName(envFilepath);
      privateKey = searchProcessEnv(privateKeyName);
      if (privateKey) {
        return privateKey;
      }
      privateKey = searchKeysFile(privateKeyName, envFilepath, envKeysFilepath);
      if (privateKey) {
        return privateKey;
      }
      privateKeyName = invertForPrivateKeyName(envFilepath);
      if (privateKeyName) {
        privateKey = searchProcessEnv(privateKeyName);
        if (privateKey) {
          return privateKey;
        }
        privateKey = searchKeysFile(privateKeyName, envFilepath, envKeysFilepath);
        if (privateKey) {
          return privateKey;
        }
      }
      return null;
    }
    module.exports = smartDotenvPrivateKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/keypair.js
var require_keypair = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/keypair.js"(exports, module) {
    var guessPublicKeyName = require_guessPublicKeyName();
    var smartDotenvPublicKey = require_smartDotenvPublicKey();
    var guessPrivateKeyName = require_guessPrivateKeyName();
    var smartDotenvPrivateKey = require_smartDotenvPrivateKey();
    var Keypair = class {
      constructor(envFile = ".env", envKeysFilepath = null) {
        this.envFile = envFile;
        this.envKeysFilepath = envKeysFilepath;
      }
      run() {
        const out = {};
        const envFilepaths = this._envFilepaths();
        for (const envFilepath of envFilepaths) {
          const publicKeyName = guessPublicKeyName(envFilepath);
          const publicKeyValue = smartDotenvPublicKey(envFilepath);
          out[publicKeyName] = publicKeyValue;
          const privateKeyName = guessPrivateKeyName(envFilepath);
          const privateKeyValue = smartDotenvPrivateKey(envFilepath, this.envKeysFilepath);
          out[privateKeyName] = privateKeyValue;
        }
        return out;
      }
      _envFilepaths() {
        if (!Array.isArray(this.envFile)) {
          return [this.envFile];
        }
        return this.envFile;
      }
    };
    module.exports = Keypair;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/findPrivateKey.js
var require_findPrivateKey = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/findPrivateKey.js"(exports, module) {
    var guessPrivateKeyName = require_guessPrivateKeyName();
    var ProKeypair = require_proKeypair();
    var Keypair = require_keypair();
    function findPrivateKey(envFilepath, envKeysFilepath = null) {
      const privateKeyName = guessPrivateKeyName(envFilepath);
      const proKeypairs = new ProKeypair(envFilepath).run();
      const keypairs = new Keypair(envFilepath, envKeysFilepath).run();
      return proKeypairs[privateKeyName] || keypairs[privateKeyName];
    }
    module.exports = findPrivateKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvPrivateKeyNames.js
var require_dotenvPrivateKeyNames = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvPrivateKeyNames.js"(exports, module) {
    var PRIVATE_KEY_NAME_SCHEMA = "DOTENV_PRIVATE_KEY";
    function dotenvPrivateKeyNames(processEnv) {
      return Object.keys(processEnv).filter((key) => key.startsWith(PRIVATE_KEY_NAME_SCHEMA));
    }
    module.exports = dotenvPrivateKeyNames;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPrivateKeyFilename.js
var require_guessPrivateKeyFilename = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPrivateKeyFilename.js"(exports, module) {
    var PREFIX = "DOTENV_PRIVATE_KEY";
    function guessPrivateKeyFilename(privateKeyName) {
      if (privateKeyName === PREFIX) {
        return ".env";
      }
      const filenameSuffix = privateKeyName.substring(`${PREFIX}_`.length).split("_").join(".").toLowerCase();
      return `.env.${filenameSuffix}`;
    }
    module.exports = guessPrivateKeyFilename;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/determineEnvs.js
var require_determineEnvs = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/determineEnvs.js"(exports, module) {
    var dotenvPrivateKeyNames = require_dotenvPrivateKeyNames();
    var guessPrivateKeyFilename = require_guessPrivateKeyFilename();
    var TYPE_ENV_FILE = "envFile";
    var TYPE_ENV_VAULT_FILE = "envVaultFile";
    var DEFAULT_ENVS = [{ type: TYPE_ENV_FILE, value: ".env" }];
    var DEFAULT_ENV_VAULTS = [{ type: TYPE_ENV_VAULT_FILE, value: ".env.vault" }];
    function determineEnvsFromDotenvPrivateKey(privateKeyNames) {
      const envs = [];
      for (const privateKeyName of privateKeyNames) {
        const filename = guessPrivateKeyFilename(privateKeyName);
        envs.push({ type: TYPE_ENV_FILE, value: filename });
      }
      return envs;
    }
    function determineEnvs(envs = [], processEnv, DOTENV_KEY = "") {
      const privateKeyNames = dotenvPrivateKeyNames(processEnv);
      if (!envs || envs.length <= 0) {
        if (privateKeyNames.length > 0) {
          return determineEnvsFromDotenvPrivateKey(privateKeyNames);
        }
        if (DOTENV_KEY.length > 0) {
          return DEFAULT_ENV_VAULTS;
        } else {
          return DEFAULT_ENVS;
        }
      } else {
        let fileAlreadySpecified = false;
        for (const env3 of envs) {
          if (DOTENV_KEY.length > 0 && env3.type === TYPE_ENV_VAULT_FILE) {
            fileAlreadySpecified = true;
          }
          if (DOTENV_KEY.length <= 0 && env3.type === TYPE_ENV_FILE) {
            fileAlreadySpecified = true;
          }
        }
        if (fileAlreadySpecified) {
          return envs;
        }
        if (DOTENV_KEY.length > 0) {
          return [...DEFAULT_ENV_VAULTS, ...envs];
        } else {
          return [...DEFAULT_ENVS, ...envs];
        }
      }
    }
    module.exports = determineEnvs;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/run.js
var require_run = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/run.js"(exports, module) {
    var fsx = require_fsx();
    var path8 = __require("path");
    var TYPE_ENV = "env";
    var TYPE_ENV_FILE = "envFile";
    var TYPE_ENV_VAULT_FILE = "envVaultFile";
    var decrypt = require_decrypt();
    var Parse = require_parse2();
    var Errors = require_errors();
    var dotenvParse = require_dotenvParse();
    var parseEnvironmentFromDotenvKey = require_parseEnvironmentFromDotenvKey();
    var detectEncoding = require_detectEncoding();
    var findPrivateKey = require_findPrivateKey();
    var guessPrivateKeyName = require_guessPrivateKeyName();
    var determineEnvs = require_determineEnvs();
    var Run = class {
      constructor(envs = [], overload = false, DOTENV_KEY = "", processEnv = process.env, envKeysFilepath = null) {
        this.envs = determineEnvs(envs, processEnv, DOTENV_KEY);
        this.overload = overload;
        this.DOTENV_KEY = DOTENV_KEY;
        this.processEnv = processEnv;
        this.envKeysFilepath = envKeysFilepath;
        this.processedEnvs = [];
        this.readableFilepaths = /* @__PURE__ */ new Set();
        this.readableStrings = /* @__PURE__ */ new Set();
        this.uniqueInjectedKeys = /* @__PURE__ */ new Set();
      }
      run() {
        for (const env3 of this.envs) {
          if (env3.type === TYPE_ENV_VAULT_FILE) {
            this._injectEnvVaultFile(env3.value);
          } else if (env3.type === TYPE_ENV_FILE) {
            this._injectEnvFile(env3.value);
          } else if (env3.type === TYPE_ENV) {
            this._injectEnv(env3.value);
          }
        }
        return {
          processedEnvs: this.processedEnvs,
          readableStrings: [...this.readableStrings],
          readableFilepaths: [...this.readableFilepaths],
          uniqueInjectedKeys: [...this.uniqueInjectedKeys]
        };
      }
      _injectEnv(env3) {
        const row = {};
        row.type = TYPE_ENV;
        row.string = env3;
        try {
          const { parsed, errors, injected, preExisted } = new Parse(env3, null, this.processEnv, this.overload).run();
          row.parsed = parsed;
          row.errors = errors;
          row.injected = injected;
          row.preExisted = preExisted;
          this.inject(row.parsed);
          this.readableStrings.add(env3);
          for (const key of Object.keys(injected)) {
            this.uniqueInjectedKeys.add(key);
          }
        } catch (e) {
          row.errors = [e];
        }
        this.processedEnvs.push(row);
      }
      _injectEnvFile(envFilepath) {
        const row = {};
        row.type = TYPE_ENV_FILE;
        row.filepath = envFilepath;
        const filepath = path8.resolve(envFilepath);
        try {
          const encoding = detectEncoding(filepath);
          const src = fsx.readFileX(filepath, { encoding });
          this.readableFilepaths.add(envFilepath);
          const privateKey = findPrivateKey(envFilepath, this.envKeysFilepath);
          const privateKeyName = guessPrivateKeyName(envFilepath);
          const { parsed, errors, injected, preExisted } = new Parse(src, privateKey, this.processEnv, this.overload, privateKeyName).run();
          row.parsed = parsed;
          row.errors = errors;
          row.injected = injected;
          row.preExisted = preExisted;
          this.inject(row.parsed);
          for (const key of Object.keys(injected)) {
            this.uniqueInjectedKeys.add(key);
          }
        } catch (e) {
          if (e.code === "ENOENT" || e.code === "EISDIR") {
            row.errors = [new Errors({ envFilepath, filepath }).missingEnvFile()];
          } else {
            row.errors = [e];
          }
        }
        this.processedEnvs.push(row);
      }
      _injectEnvVaultFile(envVaultFilepath) {
        const row = {};
        row.type = TYPE_ENV_VAULT_FILE;
        row.filepath = envVaultFilepath;
        const filepath = path8.resolve(envVaultFilepath);
        this.readableFilepaths.add(envVaultFilepath);
        if (!fsx.existsSync(filepath)) {
          const code = "MISSING_ENV_VAULT_FILE";
          const message = `you set DOTENV_KEY but your .env.vault file is missing: ${filepath}`;
          const error = new Error(message);
          error.code = code;
          throw error;
        }
        if (this.DOTENV_KEY.length < 1) {
          const code = "MISSING_DOTENV_KEY";
          const message = `your DOTENV_KEY appears to be blank: '${this.DOTENV_KEY}'`;
          const error = new Error(message);
          error.code = code;
          throw error;
        }
        let decrypted;
        const dotenvKeys = this._dotenvKeys();
        const parsedVault = this._parsedVault(filepath);
        for (let i = 0; i < dotenvKeys.length; i++) {
          try {
            const dotenvKey = dotenvKeys[i].trim();
            decrypted = this._decrypted(dotenvKey, parsedVault);
            break;
          } catch (error) {
            if (i + 1 >= dotenvKeys.length) {
              throw error;
            }
          }
        }
        try {
          const { parsed, errors, injected, preExisted } = new Parse(decrypted, null, this.processEnv, this.overload).run();
          row.parsed = parsed;
          row.errors = errors;
          row.injected = injected;
          row.preExisted = preExisted;
          this.inject(row.parsed);
          for (const key of Object.keys(injected)) {
            this.uniqueInjectedKeys.add(key);
          }
        } catch (e) {
          row.errors = [e];
        }
        this.processedEnvs.push(row);
      }
      inject(parsed) {
        for (const key of Object.keys(parsed)) {
          this.processEnv[key] = parsed[key];
        }
      }
      // handle scenario for comma separated keys - for use with key rotation
      // example: DOTENV_KEY="dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenvx.com/vault/.env.vault?environment=prod"
      _dotenvKeys() {
        return this.DOTENV_KEY.split(",");
      }
      // { "DOTENV_VAULT_DEVELOPMENT": "<ciphertext>" }
      _parsedVault(filepath) {
        const src = fsx.readFileX(filepath);
        return dotenvParse(src);
      }
      _decrypted(dotenvKey, parsedVault) {
        const environment = parseEnvironmentFromDotenvKey(dotenvKey);
        const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
        const ciphertext = parsedVault[environmentKey];
        if (!ciphertext) {
          const error = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: cannot locate environment ${environmentKey} in your .env.vault file`);
          error.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
          throw error;
        }
        return decrypt(ciphertext, dotenvKey);
      }
    };
    module.exports = Run;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/encryptValue.js
var require_encryptValue = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/encryptValue.js"(exports, module) {
    var { encrypt } = require_dist2();
    var PREFIX = "encrypted:";
    function encryptValue(value, publicKey) {
      const ciphertext = encrypt(publicKey, Buffer.from(value));
      const encoded = Buffer.from(ciphertext, "hex").toString("base64");
      return `${PREFIX}${encoded}`;
    }
    module.exports = encryptValue;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/quotes.js
var require_quotes = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/quotes.js"(exports, module) {
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function quotes(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === value[0]) {
          obj[key] = "";
        } else {
          obj[key] = maybeQuote;
        }
      }
      return obj;
    }
    module.exports = quotes;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/escapeForRegex.js
var require_escapeForRegex = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/escapeForRegex.js"(exports, module) {
    function escapeForRegex(str) {
      return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    }
    module.exports = escapeForRegex;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/escapeDollarSigns.js
var require_escapeDollarSigns = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/escapeDollarSigns.js"(exports, module) {
    function escapeDollarSigns(str) {
      return str.replace(/\$/g, "$$$$");
    }
    module.exports = escapeDollarSigns;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/replace.js
var require_replace = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/replace.js"(exports, module) {
    var quotes = require_quotes();
    var dotenvParse = require_dotenvParse();
    var escapeForRegex = require_escapeForRegex();
    var escapeDollarSigns = require_escapeDollarSigns();
    function replace(src, key, replaceValue) {
      let output;
      let newPart = "";
      const parsed = dotenvParse(src, true, true);
      const _quotes = quotes(src);
      if (Object.prototype.hasOwnProperty.call(parsed, key)) {
        const quote = _quotes[key];
        newPart += `${key}=${quote}${replaceValue}${quote}`;
        const originalValue = parsed[key];
        const escapedOriginalValue = escapeForRegex(originalValue);
        let enforceEndOfLine = "";
        if (escapedOriginalValue === "") {
          enforceEndOfLine = "$";
          const newlineMatch = src.match(new RegExp(`${key}\\s*=\\s*

`, "m"));
          if (quote === "" && newlineMatch) {
            const newlineCount = newlineMatch[0].match(/\n/g).length - 1;
            for (let i = 0; i < newlineCount; i++) {
              newPart += "\n";
            }
          }
        }
        const currentPart = new RegExp(
          "^(\\s*)?(export\\s+)?" + // export
          key + // KEY
          "\\s*=\\s*[\"'`]?" + // open quote
          escapedOriginalValue + // escaped value
          "[\"'`]?" + // close quote
          enforceEndOfLine,
          "gm"
          // (g)lobal (m)ultiline
        );
        const saferInput = escapeDollarSigns(newPart);
        output = src.replace(currentPart, `$1$2${saferInput}`);
      } else {
        newPart += `${key}="${replaceValue}"`;
        if (src.endsWith("\n")) {
          newPart = newPart + "\n";
        } else {
          newPart = "\n" + newPart;
        }
        output = src + newPart;
      }
      return output;
    }
    module.exports = replace;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/findPublicKey.js
var require_findPublicKey = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/findPublicKey.js"(exports, module) {
    var guessPublicKeyName = require_guessPublicKeyName();
    var ProKeypair = require_proKeypair();
    var Keypair = require_keypair();
    function findPublicKey(envFilepath) {
      const publicKeyName = guessPublicKeyName(envFilepath);
      const proKeypairs = new ProKeypair(envFilepath).run();
      const keypairs = new Keypair(envFilepath).run();
      return proKeypairs[publicKeyName] || keypairs[publicKeyName];
    }
    module.exports = findPublicKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/keypair.js
var require_keypair2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/keypair.js"(exports, module) {
    var { PrivateKey } = require_dist2();
    function keypair(existingPrivateKey) {
      let kp;
      if (existingPrivateKey) {
        kp = new PrivateKey(Buffer.from(existingPrivateKey, "hex"));
      } else {
        kp = new PrivateKey();
      }
      const publicKey = kp.publicKey.toHex();
      const privateKey = kp.secret.toString("hex");
      return {
        publicKey,
        privateKey
      };
    }
    module.exports = keypair;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/isEncrypted.js
var require_isEncrypted = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/isEncrypted.js"(exports, module) {
    var ENCRYPTION_PATTERN = /^encrypted:.+/;
    function isEncrypted(value) {
      return ENCRYPTION_PATTERN.test(value);
    }
    module.exports = isEncrypted;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/sets.js
var require_sets = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/sets.js"(exports, module) {
    var fsx = require_fsx();
    var path8 = __require("path");
    var TYPE_ENV_FILE = "envFile";
    var Errors = require_errors();
    var guessPrivateKeyName = require_guessPrivateKeyName();
    var guessPublicKeyName = require_guessPublicKeyName();
    var encryptValue = require_encryptValue();
    var decryptKeyValue = require_decryptKeyValue();
    var replace = require_replace();
    var dotenvParse = require_dotenvParse();
    var detectEncoding = require_detectEncoding();
    var determineEnvs = require_determineEnvs();
    var findPrivateKey = require_findPrivateKey();
    var findPublicKey = require_findPublicKey();
    var keypair = require_keypair2();
    var truncate = require_truncate();
    var isEncrypted = require_isEncrypted();
    var Sets = class {
      constructor(key, value, envs = [], encrypt = true, envKeysFilepath = null) {
        this.envs = determineEnvs(envs, process.env);
        this.key = key;
        this.value = value;
        this.encrypt = encrypt;
        this.envKeysFilepath = envKeysFilepath;
        this.processedEnvs = [];
        this.changedFilepaths = /* @__PURE__ */ new Set();
        this.unchangedFilepaths = /* @__PURE__ */ new Set();
        this.readableFilepaths = /* @__PURE__ */ new Set();
      }
      run() {
        for (const env3 of this.envs) {
          if (env3.type === TYPE_ENV_FILE) {
            this._setEnvFile(env3.value);
          }
        }
        return {
          processedEnvs: this.processedEnvs,
          changedFilepaths: [...this.changedFilepaths],
          unchangedFilepaths: [...this.unchangedFilepaths]
        };
      }
      _setEnvFile(envFilepath) {
        const row = {};
        row.key = this.key || null;
        row.value = this.value || null;
        row.type = TYPE_ENV_FILE;
        const filename = path8.basename(envFilepath);
        const filepath = path8.resolve(envFilepath);
        row.filepath = filepath;
        row.envFilepath = envFilepath;
        row.changed = false;
        try {
          const encoding = this._detectEncoding(filepath);
          let envSrc = fsx.readFileX(filepath, { encoding });
          const envParsed = dotenvParse(envSrc);
          row.originalValue = envParsed[row.key] || null;
          const wasPlainText = !isEncrypted(row.originalValue);
          this.readableFilepaths.add(envFilepath);
          if (this.encrypt) {
            let publicKey;
            let privateKey;
            const publicKeyName = guessPublicKeyName(envFilepath);
            const privateKeyName = guessPrivateKeyName(envFilepath);
            const existingPrivateKey = findPrivateKey(envFilepath, this.envKeysFilepath);
            const existingPublicKey = findPublicKey(envFilepath);
            let envKeysFilepath = path8.join(path8.dirname(filepath), ".env.keys");
            if (this.envKeysFilepath) {
              envKeysFilepath = path8.resolve(this.envKeysFilepath);
            }
            const relativeFilepath = path8.relative(path8.dirname(filepath), envKeysFilepath);
            if (existingPrivateKey) {
              const kp = keypair(existingPrivateKey);
              publicKey = kp.publicKey;
              privateKey = kp.privateKey;
              if (row.originalValue) {
                row.originalValue = decryptKeyValue(row.key, row.originalValue, privateKeyName, privateKey);
              }
              if (existingPublicKey && existingPublicKey !== publicKey) {
                const error = new Error(`derived public key (${truncate(publicKey)}) does not match the existing public key (${truncate(existingPublicKey)})`);
                error.code = "INVALID_DOTENV_PRIVATE_KEY";
                error.help = `debug info: ${privateKeyName}=${truncate(existingPrivateKey)} (derived ${publicKeyName}=${truncate(publicKey)} vs existing ${publicKeyName}=${truncate(existingPublicKey)})`;
                throw error;
              }
              if (!existingPublicKey) {
                const ps = this._preserveShebang(envSrc);
                const firstLinePreserved = ps.firstLinePreserved;
                envSrc = ps.envSrc;
                const prependPublicKey = this._prependPublicKey(publicKeyName, publicKey, filename, relativeFilepath);
                envSrc = `${firstLinePreserved}${prependPublicKey}
${envSrc}`;
              }
            } else if (existingPublicKey) {
              publicKey = existingPublicKey;
            } else {
              let keysSrc = "";
              if (fsx.existsSync(envKeysFilepath)) {
                keysSrc = fsx.readFileX(envKeysFilepath);
              }
              const ps = this._preserveShebang(envSrc);
              const firstLinePreserved = ps.firstLinePreserved;
              envSrc = ps.envSrc;
              const kp = keypair();
              publicKey = kp.publicKey;
              privateKey = kp.privateKey;
              const prependPublicKey = this._prependPublicKey(publicKeyName, publicKey, filename, relativeFilepath);
              const firstTimeKeysSrc = [
                "#/------------------!DOTENV_PRIVATE_KEYS!-------------------/",
                "#/ private decryption keys. DO NOT commit to source control /",
                "#/     [how it works](https://dotenvx.com/encryption)       /",
                "#/----------------------------------------------------------/"
              ].join("\n");
              const appendPrivateKey = [
                `# ${filename}`,
                `${privateKeyName}=${privateKey}`,
                ""
              ].join("\n");
              envSrc = `${firstLinePreserved}${prependPublicKey}
${envSrc}`;
              keysSrc = keysSrc.length > 1 ? keysSrc : `${firstTimeKeysSrc}
`;
              keysSrc = `${keysSrc}
${appendPrivateKey}`;
              fsx.writeFileX(envKeysFilepath, keysSrc);
              row.privateKeyAdded = true;
              row.envKeysFilepath = this.envKeysFilepath || path8.join(path8.dirname(envFilepath), path8.basename(envKeysFilepath));
            }
            row.publicKey = publicKey;
            row.privateKey = privateKey;
            row.encryptedValue = encryptValue(this.value, publicKey);
            row.privateKeyName = privateKeyName;
          }
          const goingFromPlainTextToEncrypted = wasPlainText && this.encrypt;
          const valueChanged = this.value !== row.originalValue;
          if (goingFromPlainTextToEncrypted || valueChanged) {
            row.envSrc = replace(envSrc, this.key, row.encryptedValue || this.value);
            this.changedFilepaths.add(envFilepath);
            row.changed = true;
          } else {
            row.envSrc = envSrc;
            this.unchangedFilepaths.add(envFilepath);
            row.changed = false;
          }
        } catch (e) {
          if (e.code === "ENOENT") {
            row.error = new Errors({ envFilepath, filepath }).missingEnvFile();
          } else {
            row.error = e;
          }
        }
        this.processedEnvs.push(row);
      }
      _detectEncoding(filepath) {
        return detectEncoding(filepath);
      }
      _prependPublicKey(publicKeyName, publicKey, filename, relativeFilepath = ".env.keys") {
        const comment = relativeFilepath === ".env.keys" ? "" : ` # -fk ${relativeFilepath}`;
        return [
          "#/-------------------[DOTENV_PUBLIC_KEY]--------------------/",
          "#/            public-key encryption for .env files          /",
          "#/       [how it works](https://dotenvx.com/encryption)     /",
          "#/----------------------------------------------------------/",
          `${publicKeyName}="${publicKey}"${comment}`,
          "",
          `# ${filename}`
        ].join("\n");
      }
      _preserveShebang(envSrc) {
        const [firstLine, ...remainingLines] = envSrc.split("\n");
        let firstLinePreserved = "";
        if (firstLine.startsWith("#!")) {
          firstLinePreserved = firstLine + "\n";
          envSrc = remainingLines.join("\n");
        }
        return {
          firstLinePreserved,
          envSrc
        };
      }
    };
    module.exports = Sets;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/get.js
var require_get = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/get.js"(exports, module) {
    var Run = require_run();
    var Errors = require_errors();
    var Get = class {
      constructor(key, envs = [], overload = false, DOTENV_KEY = "", all = false, envKeysFilepath = null) {
        this.key = key;
        this.envs = envs;
        this.overload = overload;
        this.DOTENV_KEY = DOTENV_KEY;
        this.all = all;
        this.envKeysFilepath = envKeysFilepath;
      }
      run() {
        const processEnv = { ...process.env };
        const { processedEnvs } = new Run(this.envs, this.overload, this.DOTENV_KEY, processEnv, this.envKeysFilepath).run();
        const errors = [];
        for (const processedEnv of processedEnvs) {
          for (const error of processedEnv.errors) {
            errors.push(error);
          }
        }
        if (this.key) {
          const parsed = {};
          const value = processEnv[this.key];
          parsed[this.key] = value;
          if (value === void 0) {
            errors.push(new Errors({ key: this.key }).missingKey());
          }
          return { parsed, errors };
        } else {
          if (this.all) {
            return { parsed: processEnv, errors };
          }
          const parsed = {};
          for (const processedEnv of processedEnvs) {
            if (processedEnv.parsed) {
              for (const key of Object.keys(processedEnv.parsed)) {
                parsed[key] = processEnv[key];
              }
            }
          }
          return { parsed, errors };
        }
      }
    };
    module.exports = Get;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/findEnvFiles.js
var require_findEnvFiles = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/findEnvFiles.js"(exports, module) {
    var fsx = require_fsx();
    var RESERVED_ENV_FILES = [".env.vault", ".env.project", ".env.keys", ".env.me", ".env.x", ".env.example"];
    function findEnvFiles(directory) {
      try {
        const files = fsx.readdirSync(directory);
        const envFiles = files.filter(
          (file) => file.startsWith(".env") && !file.endsWith(".previous") && !RESERVED_ENV_FILES.includes(file)
        );
        return envFiles;
      } catch (e) {
        if (e.code === "ENOENT") {
          const error = new Error(`missing directory (${directory})`);
          error.code = "MISSING_DIRECTORY";
          throw error;
        } else {
          throw e;
        }
      }
    }
    module.exports = findEnvFiles;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/genexample.js
var require_genexample = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/services/genexample.js"(exports, module) {
    var fsx = require_fsx();
    var path8 = __require("path");
    var Errors = require_errors();
    var findEnvFiles = require_findEnvFiles();
    var replace = require_replace();
    var dotenvParse = require_dotenvParse();
    var Genexample = class {
      constructor(directory = ".", envFile) {
        this.directory = directory;
        this.envFile = envFile || findEnvFiles(directory);
        this.exampleFilename = ".env.example";
        this.exampleFilepath = path8.resolve(this.directory, this.exampleFilename);
      }
      run() {
        if (this.envFile.length < 1) {
          const code = "MISSING_ENV_FILES";
          const message = "no .env* files found";
          const help = '? add one with [echo "HELLO=World" > .env] and then run [dotenvx genexample]';
          const error = new Error(message);
          error.code = code;
          error.help = help;
          throw error;
        }
        const keys = /* @__PURE__ */ new Set();
        const addedKeys = /* @__PURE__ */ new Set();
        const envFilepaths = this._envFilepaths();
        const injected = {};
        const preExisted = {};
        let exampleSrc = `# ${this.exampleFilename} - generated with dotenvx
`;
        for (const envFilepath of envFilepaths) {
          const filepath = path8.resolve(this.directory, envFilepath);
          if (!fsx.existsSync(filepath)) {
            const error = new Errors({ envFilepath, filepath }).missingEnvFile();
            error.help = `? add it with [echo "HELLO=World" > ${envFilepath}] and then run [dotenvx genexample]`;
            throw error;
          }
          let src = fsx.readFileX(filepath);
          const parsed = dotenvParse(src);
          for (const key in parsed) {
            keys.add(key);
            src = replace(src, key, "");
          }
          exampleSrc += `
${src}`;
        }
        if (!fsx.existsSync(this.exampleFilepath)) {
          for (const key of [...keys]) {
            addedKeys.add(key);
            injected[key] = "";
          }
        } else {
          exampleSrc = fsx.readFileX(this.exampleFilepath);
          const parsed = dotenvParse(exampleSrc);
          for (const key of [...keys]) {
            if (key in parsed) {
              preExisted[key] = parsed[key];
            } else {
              exampleSrc += `${key}=''
`;
              addedKeys.add(key);
              injected[key] = "";
            }
          }
        }
        return {
          envExampleFile: exampleSrc,
          envFile: this.envFile,
          exampleFilepath: this.exampleFilepath,
          addedKeys: [...addedKeys],
          injected,
          preExisted
        };
      }
      _envFilepaths() {
        if (!Array.isArray(this.envFile)) {
          return [this.envFile];
        }
        return this.envFile;
      }
    };
    module.exports = Genexample;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/conventions.js
var require_conventions = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/conventions.js"(exports, module) {
    function conventions(convention) {
      const env3 = process.env.DOTENV_ENV || process.env.NODE_ENV || "development";
      if (convention === "nextjs") {
        const canonicalEnv = ["development", "test", "production"].includes(env3) && env3;
        return [
          canonicalEnv && { type: "envFile", value: `.env.${canonicalEnv}.local` },
          canonicalEnv !== "test" && { type: "envFile", value: ".env.local" },
          canonicalEnv && { type: "envFile", value: `.env.${canonicalEnv}` },
          { type: "envFile", value: ".env" }
        ].filter(Boolean);
      } else if (convention === "flow") {
        return [
          { type: "envFile", value: `.env.${env3}.local` },
          { type: "envFile", value: `.env.${env3}` },
          { type: "envFile", value: ".env.local" },
          { type: "envFile", value: ".env" },
          { type: "envFile", value: ".env.defaults" }
        ];
      } else {
        throw new Error(`INVALID_CONVENTION: '${convention}'. permitted conventions: ['nextjs', 'flow']`);
      }
    }
    module.exports = conventions;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/resolveHome.js
var require_resolveHome = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/resolveHome.js"(exports, module) {
    var os2 = __require("os");
    var path8 = __require("path");
    function resolveHome(filepath) {
      if (filepath[0] === "~") {
        return path8.join(os2.homedir(), filepath.slice(1));
      }
      return filepath;
    }
    module.exports = resolveHome;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvOptionPaths.js
var require_dotenvOptionPaths = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvOptionPaths.js"(exports, module) {
    var resolveHome = require_resolveHome();
    function dotenvOptionPaths(options) {
      let optionPaths = [];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(resolveHome(filepath));
          }
        }
      }
      return optionPaths;
    }
    module.exports = dotenvOptionPaths;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/deprecationNotice.js
var require_deprecationNotice = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/deprecationNotice.js"(exports, module) {
    var { logger } = require_logger();
    var DeprecationNotice = class {
      constructor(options = {}) {
        this.DOTENV_KEY = options.DOTENV_KEY || process.env.DOTENV_KEY;
      }
      dotenvKey() {
        if (this.DOTENV_KEY) {
          logger.warn("[DEPRECATION NOTICE] Setting DOTENV_KEY with .env.vault is deprecated.");
          logger.warn("[DEPRECATION NOTICE] Run [dotenvx ext vault migrate] for instructions on converting your .env.vault file to encrypted .env files (using public key encryption algorithm secp256k1)");
          logger.warn("[DEPRECATION NOTICE] Read more at [https://github.com/dotenvx/dotenvx/blob/main/CHANGELOG.md#0380]");
        }
      }
    };
    module.exports = DeprecationNotice;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/buildEnvs.js
var require_buildEnvs = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/buildEnvs.js"(exports, module) {
    var path8 = __require("path");
    var conventions = require_conventions();
    var dotenvOptionPaths = require_dotenvOptionPaths();
    var DeprecationNotice = require_deprecationNotice();
    function buildEnvs(options, DOTENV_KEY = void 0) {
      const optionPaths = dotenvOptionPaths(options);
      let envs = [];
      if (options.convention) {
        envs = conventions(options.convention).concat(envs);
      }
      new DeprecationNotice({ DOTENV_KEY }).dotenvKey();
      for (const optionPath of optionPaths) {
        if (DOTENV_KEY) {
          envs.push({
            type: "envVaultFile",
            value: path8.join(path8.dirname(optionPath), ".env.vault")
          });
        } else {
          envs.push({ type: "envFile", value: optionPath });
        }
      }
      return envs;
    }
    module.exports = buildEnvs;
  }
});

// ../node_modules/.pnpm/ignore@5.3.2/node_modules/ignore/index.js
var require_ignore = __commonJS({
  "../node_modules/.pnpm/ignore@5.3.2/node_modules/ignore/index.js"(exports, module) {
    function makeArray(subject) {
      return Array.isArray(subject) ? subject : [subject];
    }
    var EMPTY = "";
    var SPACE = " ";
    var ESCAPE = "\\";
    var REGEX_TEST_BLANK_LINE = /^\s+$/;
    var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
    var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
    var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
    var REGEX_SPLITALL_CRLF = /\r?\n/g;
    var REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/;
    var SLASH = "/";
    var TMP_KEY_IGNORE = "node-ignore";
    if (typeof Symbol !== "undefined") {
      TMP_KEY_IGNORE = Symbol.for("node-ignore");
    }
    var KEY_IGNORE = TMP_KEY_IGNORE;
    var define = (object, key, value) => Object.defineProperty(object, key, { value });
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
        // remove BOM
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
      // replace (\ ) with ' '
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
      ],
      // trailing wildcard
      [
        /(\^|\\\/)?\\\*$/,
        (_, p1) => {
          const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
          return `${prefix}(?=$|\\/$)`;
        }
      ]
    ];
    var regexCache = /* @__PURE__ */ Object.create(null);
    var makeRegex = (pattern, ignoreCase) => {
      let source = regexCache[pattern];
      if (!source) {
        source = REPLACERS.reduce(
          (prev, [matcher, replacer]) => prev.replace(matcher, replacer.bind(pattern)),
          pattern
        );
        regexCache[pattern] = source;
      }
      return ignoreCase ? new RegExp(source, "i") : new RegExp(source);
    };
    var isString = (subject) => typeof subject === "string";
    var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
    var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF);
    var IgnoreRule = class {
      constructor(origin, pattern, negative, regex) {
        this.origin = origin;
        this.pattern = pattern;
        this.negative = negative;
        this.regex = regex;
      }
    };
    var createRule = (pattern, ignoreCase) => {
      const origin = pattern;
      let negative = false;
      if (pattern.indexOf("!") === 0) {
        negative = true;
        pattern = pattern.substr(1);
      }
      pattern = pattern.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
      const regex = makeRegex(pattern, ignoreCase);
      return new IgnoreRule(
        origin,
        pattern,
        negative,
        regex
      );
    };
    var throwError = (message, Ctor) => {
      throw new Ctor(message);
    };
    var checkPath = (path8, originalPath, doThrow) => {
      if (!isString(path8)) {
        return doThrow(
          `path must be a string, but got \`${originalPath}\``,
          TypeError
        );
      }
      if (!path8) {
        return doThrow(`path must not be empty`, TypeError);
      }
      if (checkPath.isNotRelative(path8)) {
        const r = "`path.relative()`d";
        return doThrow(
          `path should be a ${r} string, but got "${originalPath}"`,
          RangeError
        );
      }
      return true;
    };
    var isNotRelative = (path8) => REGEX_TEST_INVALID_PATH.test(path8);
    checkPath.isNotRelative = isNotRelative;
    checkPath.convert = (p2) => p2;
    var Ignore = class {
      constructor({
        ignorecase = true,
        ignoreCase = ignorecase,
        allowRelativePaths = false
      } = {}) {
        define(this, KEY_IGNORE, true);
        this._rules = [];
        this._ignoreCase = ignoreCase;
        this._allowRelativePaths = allowRelativePaths;
        this._initCache();
      }
      _initCache() {
        this._ignoreCache = /* @__PURE__ */ Object.create(null);
        this._testCache = /* @__PURE__ */ Object.create(null);
      }
      _addPattern(pattern) {
        if (pattern && pattern[KEY_IGNORE]) {
          this._rules = this._rules.concat(pattern._rules);
          this._added = true;
          return;
        }
        if (checkPattern(pattern)) {
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
        ).forEach(this._addPattern, this);
        if (this._added) {
          this._initCache();
        }
        return this;
      }
      // legacy
      addPattern(pattern) {
        return this.add(pattern);
      }
      //          |           ignored : unignored
      // negative |   0:0   |   0:1   |   1:0   |   1:1
      // -------- | ------- | ------- | ------- | --------
      //     0    |  TEST   |  TEST   |  SKIP   |    X
      //     1    |  TESTIF |  SKIP   |  TEST   |    X
      // - SKIP: always skip
      // - TEST: always test
      // - TESTIF: only test if checkUnignored
      // - X: that never happen
      // @param {boolean} whether should check if the path is unignored,
      //   setting `checkUnignored` to `false` could reduce additional
      //   path matching.
      // @returns {TestResult} true if a file is ignored
      _testOne(path8, checkUnignored) {
        let ignored = false;
        let unignored = false;
        this._rules.forEach((rule) => {
          const { negative } = rule;
          if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
            return;
          }
          const matched = rule.regex.test(path8);
          if (matched) {
            ignored = !negative;
            unignored = negative;
          }
        });
        return {
          ignored,
          unignored
        };
      }
      // @returns {TestResult}
      _test(originalPath, cache, checkUnignored, slices) {
        const path8 = originalPath && checkPath.convert(originalPath);
        checkPath(
          path8,
          originalPath,
          this._allowRelativePaths ? RETURN_FALSE : throwError
        );
        return this._t(path8, cache, checkUnignored, slices);
      }
      _t(path8, cache, checkUnignored, slices) {
        if (path8 in cache) {
          return cache[path8];
        }
        if (!slices) {
          slices = path8.split(SLASH);
        }
        slices.pop();
        if (!slices.length) {
          return cache[path8] = this._testOne(path8, checkUnignored);
        }
        const parent = this._t(
          slices.join(SLASH) + SLASH,
          cache,
          checkUnignored,
          slices
        );
        return cache[path8] = parent.ignored ? parent : this._testOne(path8, checkUnignored);
      }
      ignores(path8) {
        return this._test(path8, this._ignoreCache, false).ignored;
      }
      createFilter() {
        return (path8) => !this.ignores(path8);
      }
      filter(paths2) {
        return makeArray(paths2).filter(this.createFilter());
      }
      // @returns {TestResult}
      test(path8) {
        return this._test(path8, this._testCache, true);
      }
    };
    var factory = (options) => new Ignore(options);
    var isPathValid = (path8) => checkPath(path8 && checkPath.convert(path8), path8, RETURN_FALSE);
    factory.isPathValid = isPathValid;
    factory.default = factory;
    module.exports = factory;
    if (
      // Detect `process` so that it can run in browsers.
      typeof process !== "undefined" && (process.env && process.env.IGNORE_TEST_WIN32 || process.platform === "win32")
    ) {
      const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
      checkPath.convert = makePosix;
      const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
      checkPath.isNotRelative = (path8) => REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path8) || isNotRelative(path8);
    }
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/isIgnoringDotenvKeys.js
var require_isIgnoringDotenvKeys = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/helpers/isIgnoringDotenvKeys.js"(exports, module) {
    var fsx = require_fsx();
    var ignore = require_ignore();
    function isIgnoringDotenvKeys() {
      if (!fsx.existsSync(".gitignore")) {
        return false;
      }
      const gitignore = fsx.readFileX(".gitignore");
      const ig = ignore(gitignore).add(gitignore);
      if (!ig.ignores(".env.keys")) {
        return false;
      }
      return true;
    }
    module.exports = isIgnoringDotenvKeys;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/main.js
var require_main2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.39.0/node_modules/@dotenvx/dotenvx/src/lib/main.js"(exports, module) {
    var path8 = __require("path");
    var { setLogLevel, logger } = require_logger();
    var { getColor, bold } = require_colors();
    var Ls = require_ls();
    var Run = require_run();
    var Sets = require_sets();
    var Get = require_get();
    var Keypair = require_keypair();
    var Genexample = require_genexample();
    var buildEnvs = require_buildEnvs();
    var Parse = require_parse2();
    var fsx = require_fsx();
    var isIgnoringDotenvKeys = require_isIgnoringDotenvKeys();
    var config3 = function(options = {}) {
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      const overload = options.overload || options.override;
      const ignore = options.ignore || [];
      const strict = options.strict;
      const envKeysFile = options.envKeysFile;
      let DOTENV_KEY = process.env.DOTENV_KEY;
      if (options && options.DOTENV_KEY) {
        DOTENV_KEY = options.DOTENV_KEY;
      }
      if (options) setLogLevel(options);
      try {
        const envs = buildEnvs(options, DOTENV_KEY);
        const {
          processedEnvs,
          readableFilepaths,
          uniqueInjectedKeys
        } = new Run(envs, overload, DOTENV_KEY, processEnv, envKeysFile).run();
        let lastError;
        const parsedAll = {};
        for (const processedEnv of processedEnvs) {
          if (processedEnv.type === "envVaultFile") {
            logger.verbose(`loading env from encrypted ${processedEnv.filepath} (${path8.resolve(processedEnv.filepath)})`);
            logger.debug(`decrypting encrypted env from ${processedEnv.filepath} (${path8.resolve(processedEnv.filepath)})`);
          }
          if (processedEnv.type === "envFile") {
            logger.verbose(`loading env from ${processedEnv.filepath} (${path8.resolve(processedEnv.filepath)})`);
          }
          for (const error of processedEnv.errors || []) {
            if (ignore.includes(error.code)) {
              logger.verbose(`ignored: ${error.message}`);
              continue;
            }
            if (strict) throw error;
            lastError = error;
            if (error.code === "MISSING_ENV_FILE") {
              if (!options.convention) {
                console.error(error.message);
                if (error.help) {
                  console.error(error.help);
                }
              }
            } else {
              console.error(error.message);
              if (error.help) {
                console.error(error.help);
              }
            }
          }
          Object.assign(parsedAll, processedEnv.injected || {});
          Object.assign(parsedAll, processedEnv.preExisted || {});
          logger.debug(processedEnv.parsed);
          for (const [key, value] of Object.entries(processedEnv.injected || {})) {
            logger.verbose(`${key} set`);
            logger.debug(`${key} set to ${value}`);
          }
          for (const [key, value] of Object.entries(processedEnv.preExisted || {})) {
            logger.verbose(`${key} pre-exists (protip: use --overload to override)`);
            logger.debug(`${key} pre-exists as ${value} (protip: use --overload to override)`);
          }
        }
        let msg = `injecting env (${uniqueInjectedKeys.length})`;
        if (readableFilepaths.length > 0) {
          msg += ` from ${readableFilepaths.join(", ")}`;
        }
        logger.successv(msg);
        if (lastError) {
          return { parsed: parsedAll, error: lastError };
        } else {
          return { parsed: parsedAll };
        }
      } catch (error) {
        if (strict) throw error;
        logger.error(error.message);
        if (error.help) {
          logger.help(error.help);
        }
        return { parsed: {}, error };
      }
    };
    var parse2 = function(src, options = {}) {
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      const privateKey = options.privateKey || null;
      const overload = options.overload || options.override;
      const { parsed, errors } = new Parse(src, privateKey, processEnv, overload).run();
      for (const error of errors) {
        console.error(error.message);
        if (error.help) {
          console.error(error.help);
        }
      }
      return parsed;
    };
    var set = function(key, value, options = {}) {
      let encrypt = true;
      if (options.plain) {
        encrypt = false;
      } else if (options.encrypt === false) {
        encrypt = false;
      }
      const envs = buildEnvs(options);
      const envKeysFilepath = options.envKeysFile;
      const {
        processedEnvs,
        changedFilepaths,
        unchangedFilepaths
      } = new Sets(key, value, envs, encrypt, envKeysFilepath).run();
      let withEncryption = "";
      if (encrypt) {
        withEncryption = " with encryption";
      }
      for (const processedEnv of processedEnvs) {
        logger.verbose(`setting for ${processedEnv.envFilepath}`);
        if (processedEnv.error) {
          if (processedEnv.error.code === "MISSING_ENV_FILE") {
            logger.warn(processedEnv.error.message);
            logger.help(`? add one with [echo "HELLO=World" > ${processedEnv.envFilepath}] and re-run [dotenvx set]`);
          } else {
            logger.warn(processedEnv.error.message);
            if (processedEnv.error.help) {
              logger.help(processedEnv.error.help);
            }
          }
        } else {
          fsx.writeFileX(processedEnv.filepath, processedEnv.envSrc);
          logger.verbose(`${processedEnv.key} set${withEncryption} (${processedEnv.envFilepath})`);
          logger.debug(`${processedEnv.key} set${withEncryption} to ${processedEnv.value} (${processedEnv.envFilepath})`);
        }
      }
      if (changedFilepaths.length > 0) {
        logger.success(`\u2714 set ${key}${withEncryption} (${changedFilepaths.join(",")})`);
      } else if (unchangedFilepaths.length > 0) {
        logger.info(`no changes (${unchangedFilepaths})`);
      } else ;
      for (const processedEnv of processedEnvs) {
        if (processedEnv.privateKeyAdded) {
          logger.success(`\u2714 key added to ${processedEnv.envKeysFilepath} (${processedEnv.privateKeyName})`);
          if (!isIgnoringDotenvKeys()) {
            logger.help("\u2B95  next run [dotenvx ext gitignore --pattern .env.keys] to gitignore .env.keys");
          }
          logger.help(`\u2B95  next run [${processedEnv.privateKeyName}='${processedEnv.privateKey}' dotenvx get ${key}] to test decryption locally`);
        }
      }
      return {
        processedEnvs,
        changedFilepaths,
        unchangedFilepaths
      };
    };
    var get = function(key, options = {}) {
      const envs = buildEnvs(options);
      const ignore = options.ignore || [];
      const { parsed, errors } = new Get(key, envs, options.overload, process.env.DOTENV_KEY, options.all, options.envKeysFile).run();
      for (const error of errors || []) {
        if (ignore.includes(error.code)) {
          continue;
        }
        if (options.strict) throw error;
        console.error(error.message);
        if (error.help) {
          console.error(error.help);
        }
      }
      if (key) {
        const single = parsed[key];
        if (single === void 0) {
          return void 0;
        } else {
          return single;
        }
      } else {
        if (options.format === "eval") {
          let inline = "";
          for (const [key2, value] of Object.entries(parsed)) {
            inline += `${key2}=${escape(value)}
`;
          }
          inline = inline.trim();
          return inline;
        } else if (options.format === "shell") {
          let inline = "";
          for (const [key2, value] of Object.entries(parsed)) {
            inline += `${key2}=${value} `;
          }
          inline = inline.trim();
          return inline;
        } else {
          return parsed;
        }
      }
    };
    var ls = function(directory, envFile, excludeEnvFile) {
      return new Ls(directory, envFile, excludeEnvFile).run();
    };
    var genexample = function(directory, envFile) {
      return new Genexample(directory, envFile).run();
    };
    var keypair = function(envFile, key, envKeysFile = null) {
      const keypairs = new Keypair(envFile, envKeysFile).run();
      if (key) {
        return keypairs[key];
      } else {
        return keypairs;
      }
    };
    module.exports = {
      // dotenv proxies
      config: config3,
      parse: parse2,
      // actions related
      set,
      get,
      ls,
      keypair,
      genexample,
      // expose for libs depending on @dotenvx/dotenvx - like dotenvx-pro
      setLogLevel,
      logger,
      getColor,
      bold
    };
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/util.js
var require_util = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/util.js"(exports) {
    exports.getBooleanOption = (options, key) => {
      let value = false;
      if (key in options && typeof (value = options[key]) !== "boolean") {
        throw new TypeError(`Expected the "${key}" option to be a boolean`);
      }
      return value;
    };
    exports.cppdb = Symbol();
    exports.inspect = Symbol.for("nodejs.util.inspect.custom");
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/sqlite-error.js
var require_sqlite_error = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/sqlite-error.js"(exports, module) {
    var descriptor = { value: "SqliteError", writable: true, enumerable: false, configurable: true };
    function SqliteError(message, code) {
      if (new.target !== SqliteError) {
        return new SqliteError(message, code);
      }
      if (typeof code !== "string") {
        throw new TypeError("Expected second argument to be a string");
      }
      Error.call(this, message);
      descriptor.value = "" + message;
      Object.defineProperty(this, "message", descriptor);
      Error.captureStackTrace(this, SqliteError);
      this.code = code;
    }
    Object.setPrototypeOf(SqliteError, Error);
    Object.setPrototypeOf(SqliteError.prototype, Error.prototype);
    Object.defineProperty(SqliteError.prototype, "name", descriptor);
    module.exports = SqliteError;
  }
});

// ../node_modules/.pnpm/file-uri-to-path@1.0.0/node_modules/file-uri-to-path/index.js
var require_file_uri_to_path = __commonJS({
  "../node_modules/.pnpm/file-uri-to-path@1.0.0/node_modules/file-uri-to-path/index.js"(exports, module) {
    var sep = __require("path").sep || "/";
    module.exports = fileUriToPath;
    function fileUriToPath(uri) {
      if ("string" != typeof uri || uri.length <= 7 || "file://" != uri.substring(0, 7)) {
        throw new TypeError("must pass in a file:// URI to convert to a file path");
      }
      var rest = decodeURI(uri.substring(7));
      var firstSlash = rest.indexOf("/");
      var host = rest.substring(0, firstSlash);
      var path8 = rest.substring(firstSlash + 1);
      if ("localhost" == host) host = "";
      if (host) {
        host = sep + sep + host;
      }
      path8 = path8.replace(/^(.+)\|/, "$1:");
      if (sep == "\\") {
        path8 = path8.replace(/\//g, "\\");
      }
      if (/^.+\:/.test(path8)) ; else {
        path8 = sep + path8;
      }
      return host + path8;
    }
  }
});

// ../node_modules/.pnpm/bindings@1.5.0/node_modules/bindings/bindings.js
var require_bindings = __commonJS({
  "../node_modules/.pnpm/bindings@1.5.0/node_modules/bindings/bindings.js"(exports, module) {
    var fs6 = __require("fs");
    var path8 = __require("path");
    var fileURLToPath2 = require_file_uri_to_path();
    var join = path8.join;
    var dirname2 = path8.dirname;
    var exists2 = fs6.accessSync && function(path9) {
      try {
        fs6.accessSync(path9);
      } catch (e) {
        return false;
      }
      return true;
    } || fs6.existsSync || path8.existsSync;
    var defaults = {
      arrow: process.env.NODE_BINDINGS_ARROW || " \u2192 ",
      compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
      platform: process.platform,
      arch: process.arch,
      nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
      version: process.versions.node,
      bindings: "bindings.node",
      try: [
        // node-gyp's linked version in the "build" dir
        ["module_root", "build", "bindings"],
        // node-waf and gyp_addon (a.k.a node-gyp)
        ["module_root", "build", "Debug", "bindings"],
        ["module_root", "build", "Release", "bindings"],
        // Debug files, for development (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Debug", "bindings"],
        ["module_root", "Debug", "bindings"],
        // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Release", "bindings"],
        ["module_root", "Release", "bindings"],
        // Legacy from node-waf, node <= 0.4.x
        ["module_root", "build", "default", "bindings"],
        // Production "Release" buildtype binary (meh...)
        ["module_root", "compiled", "version", "platform", "arch", "bindings"],
        // node-qbs builds
        ["module_root", "addon-build", "release", "install-root", "bindings"],
        ["module_root", "addon-build", "debug", "install-root", "bindings"],
        ["module_root", "addon-build", "default", "install-root", "bindings"],
        // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
        ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
      ]
    };
    function bindings(opts) {
      if (typeof opts == "string") {
        opts = { bindings: opts };
      } else if (!opts) {
        opts = {};
      }
      Object.keys(defaults).map(function(i2) {
        if (!(i2 in opts)) opts[i2] = defaults[i2];
      });
      if (!opts.module_root) {
        opts.module_root = exports.getRoot(exports.getFileName());
      }
      if (path8.extname(opts.bindings) != ".node") {
        opts.bindings += ".node";
      }
      var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : __require;
      var tries = [], i = 0, l = opts.try.length, n, b2, err;
      for (; i < l; i++) {
        n = join.apply(
          null,
          opts.try[i].map(function(p2) {
            return opts[p2] || p2;
          })
        );
        tries.push(n);
        try {
          b2 = opts.path ? requireFunc.resolve(n) : requireFunc(n);
          if (!opts.path) {
            b2.path = n;
          }
          return b2;
        } catch (e) {
          if (e.code !== "MODULE_NOT_FOUND" && e.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(e.message)) {
            throw e;
          }
        }
      }
      err = new Error(
        "Could not locate the bindings file. Tried:\n" + tries.map(function(a) {
          return opts.arrow + a;
        }).join("\n")
      );
      err.tries = tries;
      throw err;
    }
    module.exports = exports = bindings;
    exports.getFileName = function getFileName(calling_file) {
      var origPST = Error.prepareStackTrace, origSTL = Error.stackTraceLimit, dummy = {}, fileName;
      Error.stackTraceLimit = 10;
      Error.prepareStackTrace = function(e, st) {
        for (var i = 0, l = st.length; i < l; i++) {
          fileName = st[i].getFileName();
          if (fileName !== __filename) {
            if (calling_file) {
              if (fileName !== calling_file) {
                return;
              }
            } else {
              return;
            }
          }
        }
      };
      Error.captureStackTrace(dummy);
      dummy.stack;
      Error.prepareStackTrace = origPST;
      Error.stackTraceLimit = origSTL;
      var fileSchema = "file://";
      if (fileName.indexOf(fileSchema) === 0) {
        fileName = fileURLToPath2(fileName);
      }
      return fileName;
    };
    exports.getRoot = function getRoot(file) {
      var dir = dirname2(file), prev;
      while (true) {
        if (dir === ".") {
          dir = process.cwd();
        }
        if (exists2(join(dir, "package.json")) || exists2(join(dir, "node_modules"))) {
          return dir;
        }
        if (prev === dir) {
          throw new Error(
            'Could not find module root given file: "' + file + '". Do you have a `package.json` file? '
          );
        }
        prev = dir;
        dir = join(dir, "..");
      }
    };
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/wrappers.js
var require_wrappers = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/wrappers.js"(exports) {
    var { cppdb } = require_util();
    exports.prepare = function prepare(sql2) {
      return this[cppdb].prepare(sql2, this, false);
    };
    exports.exec = function exec(sql2) {
      this[cppdb].exec(sql2);
      return this;
    };
    exports.close = function close() {
      this[cppdb].close();
      return this;
    };
    exports.loadExtension = function loadExtension(...args) {
      this[cppdb].loadExtension(...args);
      return this;
    };
    exports.defaultSafeIntegers = function defaultSafeIntegers(...args) {
      this[cppdb].defaultSafeIntegers(...args);
      return this;
    };
    exports.unsafeMode = function unsafeMode(...args) {
      this[cppdb].unsafeMode(...args);
      return this;
    };
    exports.getters = {
      name: {
        get: function name() {
          return this[cppdb].name;
        },
        enumerable: true
      },
      open: {
        get: function open() {
          return this[cppdb].open;
        },
        enumerable: true
      },
      inTransaction: {
        get: function inTransaction() {
          return this[cppdb].inTransaction;
        },
        enumerable: true
      },
      readonly: {
        get: function readonly() {
          return this[cppdb].readonly;
        },
        enumerable: true
      },
      memory: {
        get: function memory() {
          return this[cppdb].memory;
        },
        enumerable: true
      }
    };
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/transaction.js
var require_transaction = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/transaction.js"(exports, module) {
    var { cppdb } = require_util();
    var controllers = /* @__PURE__ */ new WeakMap();
    module.exports = function transaction(fn) {
      if (typeof fn !== "function") throw new TypeError("Expected first argument to be a function");
      const db2 = this[cppdb];
      const controller = getController(db2, this);
      const { apply } = Function.prototype;
      const properties = {
        default: { value: wrapTransaction(apply, fn, db2, controller.default) },
        deferred: { value: wrapTransaction(apply, fn, db2, controller.deferred) },
        immediate: { value: wrapTransaction(apply, fn, db2, controller.immediate) },
        exclusive: { value: wrapTransaction(apply, fn, db2, controller.exclusive) },
        database: { value: this, enumerable: true }
      };
      Object.defineProperties(properties.default.value, properties);
      Object.defineProperties(properties.deferred.value, properties);
      Object.defineProperties(properties.immediate.value, properties);
      Object.defineProperties(properties.exclusive.value, properties);
      return properties.default.value;
    };
    var getController = (db2, self) => {
      let controller = controllers.get(db2);
      if (!controller) {
        const shared = {
          commit: db2.prepare("COMMIT", self, false),
          rollback: db2.prepare("ROLLBACK", self, false),
          savepoint: db2.prepare("SAVEPOINT `	_bs3.	`", self, false),
          release: db2.prepare("RELEASE `	_bs3.	`", self, false),
          rollbackTo: db2.prepare("ROLLBACK TO `	_bs3.	`", self, false)
        };
        controllers.set(db2, controller = {
          default: Object.assign({ begin: db2.prepare("BEGIN", self, false) }, shared),
          deferred: Object.assign({ begin: db2.prepare("BEGIN DEFERRED", self, false) }, shared),
          immediate: Object.assign({ begin: db2.prepare("BEGIN IMMEDIATE", self, false) }, shared),
          exclusive: Object.assign({ begin: db2.prepare("BEGIN EXCLUSIVE", self, false) }, shared)
        });
      }
      return controller;
    };
    var wrapTransaction = (apply, fn, db2, { begin, commit, rollback, savepoint, release, rollbackTo }) => function sqliteTransaction() {
      let before, after, undo;
      if (db2.inTransaction) {
        before = savepoint;
        after = release;
        undo = rollbackTo;
      } else {
        before = begin;
        after = commit;
        undo = rollback;
      }
      before.run();
      try {
        const result = apply.call(fn, this, arguments);
        after.run();
        return result;
      } catch (ex) {
        if (db2.inTransaction) {
          undo.run();
          if (undo !== rollback) after.run();
        }
        throw ex;
      }
    };
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/pragma.js
var require_pragma = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/pragma.js"(exports, module) {
    var { getBooleanOption, cppdb } = require_util();
    module.exports = function pragma(source, options) {
      if (options == null) options = {};
      if (typeof source !== "string") throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
      const simple = getBooleanOption(options, "simple");
      const stmt = this[cppdb].prepare(`PRAGMA ${source}`, this, true);
      return simple ? stmt.pluck().get() : stmt.all();
    };
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/backup.js
var require_backup = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/backup.js"(exports, module) {
    var fs6 = __require("fs");
    var path8 = __require("path");
    var { promisify } = __require("util");
    var { cppdb } = require_util();
    var fsAccess = promisify(fs6.access);
    module.exports = async function backup(filename, options) {
      if (options == null) options = {};
      if (typeof filename !== "string") throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
      filename = filename.trim();
      const attachedName = "attached" in options ? options.attached : "main";
      const handler = "progress" in options ? options.progress : null;
      if (!filename) throw new TypeError("Backup filename cannot be an empty string");
      if (filename === ":memory:") throw new TypeError('Invalid backup filename ":memory:"');
      if (typeof attachedName !== "string") throw new TypeError('Expected the "attached" option to be a string');
      if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
      if (handler != null && typeof handler !== "function") throw new TypeError('Expected the "progress" option to be a function');
      await fsAccess(path8.dirname(filename)).catch(() => {
        throw new TypeError("Cannot save backup because the directory does not exist");
      });
      const isNewFile = await fsAccess(filename).then(() => false, () => true);
      return runBackup(this[cppdb].backup(this, attachedName, filename, isNewFile), handler || null);
    };
    var runBackup = (backup, handler) => {
      let rate = 0;
      let useDefault = true;
      return new Promise((resolve, reject) => {
        setImmediate(function step() {
          try {
            const progress = backup.transfer(rate);
            if (!progress.remainingPages) {
              backup.close();
              resolve(progress);
              return;
            }
            if (useDefault) {
              useDefault = false;
              rate = 100;
            }
            if (handler) {
              const ret = handler(progress);
              if (ret !== void 0) {
                if (typeof ret === "number" && ret === ret) rate = Math.max(0, Math.min(2147483647, Math.round(ret)));
                else throw new TypeError("Expected progress callback to return a number or undefined");
              }
            }
            setImmediate(step);
          } catch (err) {
            backup.close();
            reject(err);
          }
        });
      });
    };
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/serialize.js
var require_serialize = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/serialize.js"(exports, module) {
    var { cppdb } = require_util();
    module.exports = function serialize2(options) {
      if (options == null) options = {};
      if (typeof options !== "object") throw new TypeError("Expected first argument to be an options object");
      const attachedName = "attached" in options ? options.attached : "main";
      if (typeof attachedName !== "string") throw new TypeError('Expected the "attached" option to be a string');
      if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
      return this[cppdb].serialize(attachedName);
    };
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/function.js
var require_function = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/function.js"(exports, module) {
    var { getBooleanOption, cppdb } = require_util();
    module.exports = function defineFunction(name, options, fn) {
      if (options == null) options = {};
      if (typeof options === "function") {
        fn = options;
        options = {};
      }
      if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
      if (typeof fn !== "function") throw new TypeError("Expected last argument to be a function");
      if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
      if (!name) throw new TypeError("User-defined function name cannot be an empty string");
      const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
      const deterministic = getBooleanOption(options, "deterministic");
      const directOnly = getBooleanOption(options, "directOnly");
      const varargs = getBooleanOption(options, "varargs");
      let argCount = -1;
      if (!varargs) {
        argCount = fn.length;
        if (!Number.isInteger(argCount) || argCount < 0) throw new TypeError("Expected function.length to be a positive integer");
        if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
      }
      this[cppdb].function(fn, name, argCount, safeIntegers, deterministic, directOnly);
      return this;
    };
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/aggregate.js
var require_aggregate = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/aggregate.js"(exports, module) {
    var { getBooleanOption, cppdb } = require_util();
    module.exports = function defineAggregate(name, options) {
      if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object" || options === null) throw new TypeError("Expected second argument to be an options object");
      if (!name) throw new TypeError("User-defined function name cannot be an empty string");
      const start = "start" in options ? options.start : null;
      const step = getFunctionOption(options, "step", true);
      const inverse = getFunctionOption(options, "inverse", false);
      const result = getFunctionOption(options, "result", false);
      const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
      const deterministic = getBooleanOption(options, "deterministic");
      const directOnly = getBooleanOption(options, "directOnly");
      const varargs = getBooleanOption(options, "varargs");
      let argCount = -1;
      if (!varargs) {
        argCount = Math.max(getLength(step), inverse ? getLength(inverse) : 0);
        if (argCount > 0) argCount -= 1;
        if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
      }
      this[cppdb].aggregate(start, step, inverse, result, name, argCount, safeIntegers, deterministic, directOnly);
      return this;
    };
    var getFunctionOption = (options, key, required) => {
      const value = key in options ? options[key] : null;
      if (typeof value === "function") return value;
      if (value != null) throw new TypeError(`Expected the "${key}" option to be a function`);
      if (required) throw new TypeError(`Missing required option "${key}"`);
      return null;
    };
    var getLength = ({ length }) => {
      if (Number.isInteger(length) && length >= 0) return length;
      throw new TypeError("Expected function.length to be a positive integer");
    };
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/table.js
var require_table = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/table.js"(exports, module) {
    var { cppdb } = require_util();
    module.exports = function defineTable(name, factory) {
      if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
      if (!name) throw new TypeError("Virtual table module name cannot be an empty string");
      let eponymous = false;
      if (typeof factory === "object" && factory !== null) {
        eponymous = true;
        factory = defer(parseTableDefinition(factory, "used", name));
      } else {
        if (typeof factory !== "function") throw new TypeError("Expected second argument to be a function or a table definition object");
        factory = wrapFactory(factory);
      }
      this[cppdb].table(factory, name, eponymous);
      return this;
    };
    function wrapFactory(factory) {
      return function virtualTableFactory(moduleName, databaseName, tableName, ...args) {
        const thisObject = {
          module: moduleName,
          database: databaseName,
          table: tableName
        };
        const def = apply.call(factory, thisObject, args);
        if (typeof def !== "object" || def === null) {
          throw new TypeError(`Virtual table module "${moduleName}" did not return a table definition object`);
        }
        return parseTableDefinition(def, "returned", moduleName);
      };
    }
    function parseTableDefinition(def, verb, moduleName) {
      if (!hasOwnProperty.call(def, "rows")) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "rows" property`);
      }
      if (!hasOwnProperty.call(def, "columns")) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "columns" property`);
      }
      const rows = def.rows;
      if (typeof rows !== "function" || Object.getPrototypeOf(rows) !== GeneratorFunctionPrototype) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "rows" property (should be a generator function)`);
      }
      let columns = def.columns;
      if (!Array.isArray(columns) || !(columns = [...columns]).every((x) => typeof x === "string")) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "columns" property (should be an array of strings)`);
      }
      if (columns.length !== new Set(columns).size) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate column names`);
      }
      if (!columns.length) {
        throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with zero columns`);
      }
      let parameters;
      if (hasOwnProperty.call(def, "parameters")) {
        parameters = def.parameters;
        if (!Array.isArray(parameters) || !(parameters = [...parameters]).every((x) => typeof x === "string")) {
          throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "parameters" property (should be an array of strings)`);
        }
      } else {
        parameters = inferParameters(rows);
      }
      if (parameters.length !== new Set(parameters).size) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate parameter names`);
      }
      if (parameters.length > 32) {
        throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with more than the maximum number of 32 parameters`);
      }
      for (const parameter of parameters) {
        if (columns.includes(parameter)) {
          throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with column "${parameter}" which was ambiguously defined as both a column and parameter`);
        }
      }
      let safeIntegers = 2;
      if (hasOwnProperty.call(def, "safeIntegers")) {
        const bool = def.safeIntegers;
        if (typeof bool !== "boolean") {
          throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
        }
        safeIntegers = +bool;
      }
      let directOnly = false;
      if (hasOwnProperty.call(def, "directOnly")) {
        directOnly = def.directOnly;
        if (typeof directOnly !== "boolean") {
          throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "directOnly" property (should be a boolean)`);
        }
      }
      const columnDefinitions = [
        ...parameters.map(identifier).map((str) => `${str} HIDDEN`),
        ...columns.map(identifier)
      ];
      return [
        `CREATE TABLE x(${columnDefinitions.join(", ")});`,
        wrapGenerator(rows, new Map(columns.map((x, i) => [x, parameters.length + i])), moduleName),
        parameters,
        safeIntegers,
        directOnly
      ];
    }
    function wrapGenerator(generator, columnMap, moduleName) {
      return function* virtualTable(...args) {
        const output = args.map((x) => Buffer.isBuffer(x) ? Buffer.from(x) : x);
        for (let i = 0; i < columnMap.size; ++i) {
          output.push(null);
        }
        for (const row of generator(...args)) {
          if (Array.isArray(row)) {
            extractRowArray(row, output, columnMap.size, moduleName);
            yield output;
          } else if (typeof row === "object" && row !== null) {
            extractRowObject(row, output, columnMap, moduleName);
            yield output;
          } else {
            throw new TypeError(`Virtual table module "${moduleName}" yielded something that isn't a valid row object`);
          }
        }
      };
    }
    function extractRowArray(row, output, columnCount, moduleName) {
      if (row.length !== columnCount) {
        throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an incorrect number of columns`);
      }
      const offset = output.length - columnCount;
      for (let i = 0; i < columnCount; ++i) {
        output[i + offset] = row[i];
      }
    }
    function extractRowObject(row, output, columnMap, moduleName) {
      let count = 0;
      for (const key of Object.keys(row)) {
        const index = columnMap.get(key);
        if (index === void 0) {
          throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an undeclared column "${key}"`);
        }
        output[index] = row[key];
        count += 1;
      }
      if (count !== columnMap.size) {
        throw new TypeError(`Virtual table module "${moduleName}" yielded a row with missing columns`);
      }
    }
    function inferParameters({ length }) {
      if (!Number.isInteger(length) || length < 0) {
        throw new TypeError("Expected function.length to be a positive integer");
      }
      const params = [];
      for (let i = 0; i < length; ++i) {
        params.push(`$${i + 1}`);
      }
      return params;
    }
    var { hasOwnProperty } = Object.prototype;
    var { apply } = Function.prototype;
    var GeneratorFunctionPrototype = Object.getPrototypeOf(function* () {
    });
    var identifier = (str) => `"${str.replace(/"/g, '""')}"`;
    var defer = (x) => () => x;
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/inspect.js
var require_inspect = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/methods/inspect.js"(exports, module) {
    var DatabaseInspection = function Database2() {
    };
    module.exports = function inspect(depth, opts) {
      return Object.assign(new DatabaseInspection(), this);
    };
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/database.js
var require_database = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/database.js"(exports, module) {
    var fs6 = __require("fs");
    var path8 = __require("path");
    var util2 = require_util();
    var SqliteError = require_sqlite_error();
    var DEFAULT_ADDON;
    function Database2(filenameGiven, options) {
      if (new.target == null) {
        return new Database2(filenameGiven, options);
      }
      let buffer;
      if (Buffer.isBuffer(filenameGiven)) {
        buffer = filenameGiven;
        filenameGiven = ":memory:";
      }
      if (filenameGiven == null) filenameGiven = "";
      if (options == null) options = {};
      if (typeof filenameGiven !== "string") throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
      if ("readOnly" in options) throw new TypeError('Misspelled option "readOnly" should be "readonly"');
      if ("memory" in options) throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');
      const filename = filenameGiven.trim();
      const anonymous = filename === "" || filename === ":memory:";
      const readonly = util2.getBooleanOption(options, "readonly");
      const fileMustExist = util2.getBooleanOption(options, "fileMustExist");
      const timeout = "timeout" in options ? options.timeout : 5e3;
      const verbose = "verbose" in options ? options.verbose : null;
      const nativeBinding = "nativeBinding" in options ? options.nativeBinding : null;
      if (readonly && anonymous && !buffer) throw new TypeError("In-memory/temporary databases cannot be readonly");
      if (!Number.isInteger(timeout) || timeout < 0) throw new TypeError('Expected the "timeout" option to be a positive integer');
      if (timeout > 2147483647) throw new RangeError('Option "timeout" cannot be greater than 2147483647');
      if (verbose != null && typeof verbose !== "function") throw new TypeError('Expected the "verbose" option to be a function');
      if (nativeBinding != null && typeof nativeBinding !== "string" && typeof nativeBinding !== "object") throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');
      let addon;
      if (nativeBinding == null) {
        addon = DEFAULT_ADDON || (DEFAULT_ADDON = require_bindings()("better_sqlite3.node"));
      } else if (typeof nativeBinding === "string") {
        const requireFunc = typeof __non_webpack_require__ === "function" ? __non_webpack_require__ : __require;
        addon = requireFunc(path8.resolve(nativeBinding).replace(/(\.node)?$/, ".node"));
      } else {
        addon = nativeBinding;
      }
      if (!addon.isInitialized) {
        addon.setErrorConstructor(SqliteError);
        addon.isInitialized = true;
      }
      if (!anonymous && !fs6.existsSync(path8.dirname(filename))) {
        throw new TypeError("Cannot open database because the directory does not exist");
      }
      Object.defineProperties(this, {
        [util2.cppdb]: { value: new addon.Database(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null, buffer || null) },
        ...wrappers.getters
      });
    }
    var wrappers = require_wrappers();
    Database2.prototype.prepare = wrappers.prepare;
    Database2.prototype.transaction = require_transaction();
    Database2.prototype.pragma = require_pragma();
    Database2.prototype.backup = require_backup();
    Database2.prototype.serialize = require_serialize();
    Database2.prototype.function = require_function();
    Database2.prototype.aggregate = require_aggregate();
    Database2.prototype.table = require_table();
    Database2.prototype.loadExtension = wrappers.loadExtension;
    Database2.prototype.exec = wrappers.exec;
    Database2.prototype.close = wrappers.close;
    Database2.prototype.defaultSafeIntegers = wrappers.defaultSafeIntegers;
    Database2.prototype.unsafeMode = wrappers.unsafeMode;
    Database2.prototype[util2.inspect] = require_inspect();
    module.exports = Database2;
  }
});

// ../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/index.js
var require_lib = __commonJS({
  "../node_modules/.pnpm/better-sqlite3@11.9.0/node_modules/better-sqlite3/lib/index.js"(exports, module) {
    module.exports = require_database();
    module.exports.SqliteError = require_sqlite_error();
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/package.json
var require_package3 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/package.json"(exports, module) {
    module.exports = {
      version: "1.31.3",
      name: "@dotenvx/dotenvx",
      description: "a better dotenv\u2013from the creator of `dotenv`",
      author: "@motdotla",
      keywords: [
        "dotenv",
        "env"
      ],
      homepage: "https://github.com/dotenvx/dotenvx",
      repository: {
        type: "git",
        url: "git+https://github.com/dotenvx/dotenvx.git"
      },
      license: "BSD-3-Clause",
      files: [
        "src/**/*",
        "CHANGELOG.md"
      ],
      main: "src/lib/main.js",
      types: "src/lib/main.d.ts",
      bin: {
        dotenvx: "./src/cli/dotenvx.js",
        "git-dotenvx": "./src/cli/dotenvx.js"
      },
      scripts: {
        standard: "standard",
        "standard:fix": "standard --fix",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test-coverage": "tap run --show-full-coverage --timeout=60000",
        testshell: "bash shellspec",
        prerelease: "npm test && npm run testshell",
        release: "standard-version"
      },
      funding: "https://dotenvx.com",
      dependencies: {
        commander: "^11.1.0",
        dotenv: "^16.4.5",
        eciesjs: "^0.4.10",
        execa: "^5.1.1",
        fdir: "^6.2.0",
        ignore: "^5.3.0",
        "object-treeify": "1.1.33",
        picomatch: "^4.0.2",
        which: "^4.0.0"
      },
      devDependencies: {
        "@yao-pkg/pkg": "^5.14.2",
        "capture-console": "^1.0.2",
        esbuild: "^0.24.0",
        proxyquire: "^2.1.3",
        sinon: "^14.0.1",
        standard: "^17.1.0",
        "standard-version": "^9.5.0",
        tap: "^21.0.1"
      },
      publishConfig: {
        access: "public",
        provenance: true
      }
    };
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/packageJson.js
var require_packageJson2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/packageJson.js"(exports, module) {
    var { name, version: version2, description } = require_package3();
    module.exports = { name, version: version2, description };
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/colorDepth.js
var require_colorDepth2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/colorDepth.js"(exports, module) {
    var { WriteStream } = __require("tty");
    var getColorDepth = () => {
      try {
        return WriteStream.prototype.getColorDepth();
      } catch (error) {
        const term = process.env.TERM;
        if (term && (term.includes("256color") || term.includes("xterm"))) {
          return 8;
        }
        return 4;
      }
    };
    module.exports = { getColorDepth };
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/shared/colors.js
var require_colors2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/shared/colors.js"(exports, module) {
    var depth = require_colorDepth2();
    var colors16 = /* @__PURE__ */ new Map([
      ["blue", 34],
      ["gray", 37],
      ["green", 32],
      ["olive", 33],
      ["orangered", 31],
      // mapped to red
      ["plum", 35],
      // mapped to magenta
      ["red", 31],
      ["electricblue", 36],
      ["dodgerblue", 36]
    ]);
    var colors256 = /* @__PURE__ */ new Map([
      ["blue", 21],
      ["gray", 244],
      ["green", 34],
      ["olive", 142],
      ["orangered", 202],
      ["plum", 182],
      ["red", 196],
      ["electricblue", 45],
      ["dodgerblue", 33]
    ]);
    function getColor(color) {
      const colorDepth = depth.getColorDepth();
      if (!colors256.has(color)) {
        throw new Error(`Invalid color ${color}`);
      }
      if (colorDepth >= 8) {
        const code = colors256.get(color);
        return (message) => `\x1B[38;5;${code}m${message}\x1B[39m`;
      }
      if (colorDepth >= 4) {
        const code = colors16.get(color);
        return (message) => `\x1B[${code}m${message}\x1B[39m`;
      }
      return (message) => message;
    }
    function bold(message) {
      if (depth.getColorDepth() >= 4) {
        return `\x1B[1m${message}\x1B[22m`;
      }
      return message;
    }
    module.exports = {
      getColor,
      bold
    };
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/shared/logger.js
var require_logger2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/shared/logger.js"(exports, module) {
    var packageJson = require_packageJson2();
    var { getColor, bold } = require_colors2();
    var levels = {
      error: 0,
      errorv: 0,
      errorvp: 0,
      errorvpb: 0,
      errornocolor: 0,
      warn: 1,
      warnv: 1,
      warnvp: 1,
      warnvpb: 1,
      success: 2,
      successv: 2,
      successvp: 2,
      successvpb: 2,
      info: 2,
      help: 2,
      help2: 2,
      blank: 2,
      verbose: 4,
      debug: 5,
      silly: 6
    };
    var error = (m2) => bold(getColor("red")(m2));
    var warn = getColor("orangered");
    var success = getColor("green");
    var successv = getColor("olive");
    var help = getColor("dodgerblue");
    var help2 = getColor("gray");
    var verbose = getColor("plum");
    var debug2 = getColor("plum");
    var currentLevel = levels.info;
    function log(level, message) {
      if (levels[level] === void 0) {
        throw new Error(`MISSING_LOG_LEVEL: '${level}'. implement in logger.`);
      }
      if (levels[level] <= currentLevel) {
        const formattedMessage = formatMessage(level, message);
        console.log(formattedMessage);
      }
    }
    function formatMessage(level, message) {
      const formattedMessage = typeof message === "object" ? JSON.stringify(message) : message;
      switch (level.toLowerCase()) {
        // errors
        case "error":
          return error(formattedMessage);
        case "errorv":
          return error(`[dotenvx@${packageJson.version}] ${formattedMessage}`);
        case "errorvp":
          return error(`[dotenvx@${packageJson.version}][precommit] ${formattedMessage}`);
        case "errorvpb":
          return error(`[dotenvx@${packageJson.version}][prebuild] ${formattedMessage}`);
        case "errornocolor":
          return formattedMessage;
        // warns
        case "warn":
          return warn(formattedMessage);
        case "warnv":
          return warn(`[dotenvx@${packageJson.version}] ${formattedMessage}`);
        case "warnvp":
          return warn(`[dotenvx@${packageJson.version}][precommit] ${formattedMessage}`);
        case "warnvpb":
          return warn(`[dotenvx@${packageJson.version}][prebuild] ${formattedMessage}`);
        // successes
        case "success":
          return success(formattedMessage);
        case "successv":
          return successv(`[dotenvx@${packageJson.version}] ${formattedMessage}`);
        case "successvp":
          return success(`[dotenvx@${packageJson.version}][precommit] ${formattedMessage}`);
        case "successvpb":
          return success(`[dotenvx@${packageJson.version}][prebuild] ${formattedMessage}`);
        // info
        case "info":
          return formattedMessage;
        // help
        case "help":
          return help(formattedMessage);
        case "help2":
          return help2(formattedMessage);
        // verbose
        case "verbose":
          return verbose(formattedMessage);
        // debug
        case "debug":
          return debug2(formattedMessage);
        // blank
        case "blank":
          return formattedMessage;
      }
    }
    var logger = {
      // track level
      level: "info",
      // errors
      error: (msg) => log("error", msg),
      errorv: (msg) => log("errorv", msg),
      errorvp: (msg) => log("errorvp", msg),
      errorvpb: (msg) => log("errorvpb", msg),
      errornocolor: (msg) => log("errornocolor", msg),
      // warns
      warn: (msg) => log("warn", msg),
      warnv: (msg) => log("warnv", msg),
      warnvp: (msg) => log("warnvp", msg),
      warnvpb: (msg) => log("warnvpb", msg),
      // success
      success: (msg) => log("success", msg),
      successv: (msg) => log("successv", msg),
      successvp: (msg) => log("successvp", msg),
      successvpb: (msg) => log("successvpb", msg),
      // info
      info: (msg) => log("info", msg),
      // help
      help: (msg) => log("help", msg),
      help2: (msg) => log("help2", msg),
      // verbose
      verbose: (msg) => log("verbose", msg),
      // debug
      debug: (msg) => log("debug", msg),
      // blank
      blank: (msg) => log("blank", msg),
      setLevel: (level) => {
        if (levels[level] !== void 0) {
          currentLevel = levels[level];
          logger.level = level;
        }
      }
    };
    function setLogLevel(options) {
      const logLevel = options.debug ? "debug" : options.verbose ? "verbose" : options.quiet ? "error" : options.logLevel;
      if (!logLevel) return;
      logger.setLevel(logLevel);
      if (!options.quiet || options.quiet && logLevel !== "error") {
        logger.debug(`Setting log level to ${logLevel}`);
      }
    }
    module.exports = {
      logger,
      getColor,
      setLogLevel,
      levels
    };
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/services/ls.js
var require_ls2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/services/ls.js"(exports, module) {
    var { fdir: Fdir } = require_dist();
    var path8 = __require("path");
    var picomatch = require_picomatch2();
    var Ls = class {
      constructor(directory = "./", envFile = [".env*"], excludeEnvFile = []) {
        this.ignore = ["node_modules/**", ".git/**"];
        this.cwd = path8.resolve(directory);
        this.envFile = envFile;
        this.excludeEnvFile = excludeEnvFile;
      }
      run() {
        return this._filepaths();
      }
      _filepaths() {
        const exclude = picomatch(this._exclude());
        const include = picomatch(this._patterns(), {
          ignore: this._exclude()
        });
        return new Fdir().withRelativePaths().exclude((dir, path9) => exclude(path9)).filter((path9) => include(path9)).crawl(this.cwd).sync();
      }
      _patterns() {
        if (!Array.isArray(this.envFile)) {
          return [`**/${this.envFile}`];
        }
        return this.envFile.map((part) => `**/${part}`);
      }
      _excludePatterns() {
        if (!Array.isArray(this.excludeEnvFile)) {
          return [`**/${this.excludeEnvFile}`];
        }
        return this.excludeEnvFile.map((part) => `**/${part}`);
      }
      _exclude() {
        if (this._excludePatterns().length > 0) {
          return this.ignore.concat(this._excludePatterns());
        } else {
          return this.ignore;
        }
      }
    };
    module.exports = Ls;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/fsx.js
var require_fsx2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/fsx.js"(exports, module) {
    var fs6 = __require("fs");
    var ENCODING = "utf8";
    function readFileX(filepath, encoding = null) {
      if (!encoding) {
        encoding = ENCODING;
      }
      return fs6.readFileSync(filepath, encoding);
    }
    function writeFileX(filepath, str) {
      return fs6.writeFileSync(filepath, str, ENCODING);
    }
    var fsx = {
      chmodSync: fs6.chmodSync,
      existsSync: fs6.existsSync,
      readdirSync: fs6.readdirSync,
      readFileSync: fs6.readFileSync,
      writeFileSync: fs6.writeFileSync,
      appendFileSync: fs6.appendFileSync,
      // fsx special commands
      readFileX,
      writeFileX
    };
    module.exports = fsx;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/parseEncryptionKeyFromDotenvKey.js
var require_parseEncryptionKeyFromDotenvKey2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/parseEncryptionKeyFromDotenvKey.js"(exports, module) {
    function parseEncryptionKeyFromDotenvKey(dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (e) {
        throw new Error("INVALID_DOTENV_KEY: Incomplete format. It should be a dotenv uri. (dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development)");
      }
      const key = uri.password;
      if (!key) {
        throw new Error("INVALID_DOTENV_KEY: Missing key part");
      }
      return Buffer.from(key.slice(-64), "hex");
    }
    module.exports = parseEncryptionKeyFromDotenvKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/decrypt.js
var require_decrypt2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/decrypt.js"(exports, module) {
    var dotenv = require_main();
    var parseEncryptionKeyFromDotenvKey = require_parseEncryptionKeyFromDotenvKey2();
    function decrypt(ciphertext, dotenvKey) {
      const key = parseEncryptionKeyFromDotenvKey(dotenvKey);
      try {
        return dotenv.decrypt(ciphertext, key);
      } catch (e) {
        if (e.code === "DECRYPTION_FAILED") {
          const error = new Error("[DECRYPTION_FAILED] Unable to decrypt .env.vault with DOTENV_KEY.");
          error.code = "DECRYPTION_FAILED";
          error.help = "[DECRYPTION_FAILED] Run with debug flag [dotenvx run --debug -- yourcommand] or manually run [echo $DOTENV_KEY] to compare it to the one in .env.keys.";
          error.debug = `[DECRYPTION_FAILED] DOTENV_KEY is ${dotenvKey}`;
          throw error;
        }
        if (e.code === "ERR_CRYPTO_INVALID_AUTH_TAG") {
          const error = new Error("[INVALID_CIPHERTEXT] Unable to decrypt what appears to be invalid ciphertext.");
          error.code = "INVALID_CIPHERTEXT";
          error.help = "[INVALID_CIPHERTEXT] Run with debug flag [dotenvx run --debug -- yourcommand] or manually check .env.vault.";
          error.debug = `[INVALID_CIPHERTEXT] ciphertext is '${ciphertext}'`;
          throw error;
        }
        throw e;
      }
    }
    module.exports = decrypt;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/chomp.js
var require_chomp2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/chomp.js"(exports, module) {
    function chomp(value) {
      return value.replace(/[\r\n]+$/, "");
    }
    module.exports = chomp;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/truncate.js
var require_truncate2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/truncate.js"(exports, module) {
    function truncate(str, showChar = 7) {
      if (str && str.length > 0) {
        const visiblePart = str.slice(0, showChar);
        return visiblePart + "\u2026";
      } else {
        return "";
      }
    }
    module.exports = truncate;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/errors.js
var require_errors2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/errors.js"(exports, module) {
    var truncate = require_truncate2();
    var Errors = class {
      constructor(options = {}) {
        this.filepath = options.filepath;
        this.envFilepath = options.envFilepath;
        this.key = options.key;
        this.privateKey = options.privateKey;
        this.privateKeyName = options.privateKeyName;
        this.message = options.message;
      }
      missingEnvFile() {
        const code = "MISSING_ENV_FILE";
        const message = `[${code}] missing ${this.envFilepath} file (${this.filepath})`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/484`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
      missingKey() {
        const code = "MISSING_KEY";
        const message = `[${code}] missing ${this.key} key`;
        const e = new Error(message);
        e.code = code;
        return e;
      }
      missingPrivateKey() {
        const code = "MISSING_PRIVATE_KEY";
        const message = `[${code}] could not decrypt ${this.key} using private key '${this.privateKeyName}=${truncate(this.privateKey)}'`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/464`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
      invalidPrivateKey() {
        const code = "INVALID_PRIVATE_KEY";
        const message = `[${code}] could not decrypt ${this.key} using private key '${this.privateKeyName}=${truncate(this.privateKey)}'`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/465`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
      looksWrongPrivateKey() {
        const code = "WRONG_PRIVATE_KEY";
        const message = `[${code}] could not decrypt ${this.key} using private key '${this.privateKeyName}=${truncate(this.privateKey)}'`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/466`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
      malformedEncryptedData() {
        const code = "MALFORMED_ENCRYPTED_DATA";
        const message = `[${code}] could not decrypt ${this.key} because encrypted data appears malformed`;
        const help = `[${code}] https://github.com/dotenvx/dotenvx/issues/467`;
        const e = new Error(message);
        e.code = code;
        e.help = help;
        return e;
      }
      decryptionFailed() {
        const code = "DECRYPTION_FAILED";
        const message = this.message;
        const e = new Error(message);
        e.code = code;
        return e;
      }
    };
    module.exports = Errors;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/decryptKeyValue.js
var require_decryptKeyValue2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/decryptKeyValue.js"(exports, module) {
    var { decrypt } = require_dist2();
    var Errors = require_errors2();
    var PREFIX = "encrypted:";
    function decryptKeyValue(key, value, privateKeyName, privateKey) {
      let decryptedValue;
      let decryptionError;
      if (!value.startsWith(PREFIX)) {
        return value;
      }
      privateKey = privateKey || "";
      if (privateKey.length <= 0) {
        decryptionError = new Errors({ key, privateKeyName, privateKey }).missingPrivateKey();
      } else {
        const privateKeys = privateKey.split(",");
        for (const privKey of privateKeys) {
          const secret = Buffer.from(privKey, "hex");
          const encoded = value.substring(PREFIX.length);
          const ciphertext = Buffer.from(encoded, "base64");
          try {
            decryptedValue = decrypt(secret, ciphertext).toString();
            decryptionError = null;
            break;
          } catch (e) {
            if (e.message === "Invalid private key") {
              decryptionError = new Errors({ key, privateKeyName, privateKey }).invalidPrivateKey();
            } else if (e.message === "Unsupported state or unable to authenticate data") {
              decryptionError = new Errors({ key, privateKeyName, privateKey }).looksWrongPrivateKey();
            } else if (e.message === "Point of length 65 was invalid. Expected 33 compressed bytes or 65 uncompressed bytes") {
              decryptionError = new Errors({ key, privateKeyName, privateKey }).malformedEncryptedData();
            } else {
              decryptionError = new Errors({ key, privateKeyName, privateKey, message: e.message }).decryptionFailed();
            }
          }
        }
      }
      if (decryptionError) {
        throw decryptionError;
      }
      return decryptedValue;
    }
    module.exports = decryptKeyValue;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/resolveEscapeSequences.js
var require_resolveEscapeSequences2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/resolveEscapeSequences.js"(exports, module) {
    function resolveEscapeSequences(value) {
      return value.replace(/\\\$/g, "$");
    }
    module.exports = resolveEscapeSequences;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/parse.js
var require_parse3 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/parse.js"(exports, module) {
    var chomp = require_chomp2();
    var decryptKeyValue = require_decryptKeyValue2();
    var resolveEscapeSequences = require_resolveEscapeSequences2();
    var { execSync: execSync2 } = __require("child_process");
    var Parse = class _Parse {
      static LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
      constructor(src, privateKey = null, processEnv = process.env, overload = false, privateKeyName = null) {
        this.src = src;
        this.privateKey = privateKey;
        this.privateKeyName = privateKeyName;
        this.processEnv = processEnv;
        this.overload = overload;
        this.parsed = {};
        this.preExisted = {};
        this.injected = {};
        this.errors = [];
        this.runningParsed = {};
        this.literals = {};
      }
      run() {
        const lines = this.getLines();
        let match;
        while ((match = _Parse.LINE.exec(lines)) !== null) {
          const key = match[1];
          const value = match[2];
          const quote = this.quote(value);
          this.parsed[key] = this.clean(value, quote);
          if (!this.overload && this.inProcessEnv(key)) {
            this.parsed[key] = this.processEnv[key];
          }
          try {
            this.parsed[key] = this.decrypt(key, this.parsed[key]);
          } catch (e) {
            this.errors.push(e);
          }
          let evaled = false;
          if (quote !== "'" && (!this.inProcessEnv(key) || this.processEnv[key] === this.parsed[key])) {
            const priorEvaled = this.parsed[key];
            this.parsed[key] = this.eval(priorEvaled);
            if (priorEvaled !== this.parsed[key]) {
              evaled = true;
            }
          }
          if (!evaled && quote !== "'" && !this.processEnv[key]) {
            this.parsed[key] = resolveEscapeSequences(this.expand(this.parsed[key]));
          }
          if (quote === "'") {
            this.literals[key] = this.parsed[key];
          }
          this.runningParsed[key] = this.parsed[key];
          if (Object.prototype.hasOwnProperty.call(this.processEnv, key) && !this.overload) {
            this.preExisted[key] = this.processEnv[key];
          } else {
            this.injected[key] = this.parsed[key];
          }
        }
        return {
          parsed: this.parsed,
          processEnv: this.processEnv,
          injected: this.injected,
          preExisted: this.preExisted,
          errors: this.errors
        };
      }
      trimmer(value) {
        return (value || "").trim();
      }
      quote(value) {
        const v = this.trimmer(value);
        const maybeQuote = v[0];
        let q = "";
        switch (maybeQuote) {
          // single
          case "'":
            q = "'";
            break;
          // double
          case '"':
            q = '"';
            break;
          // backtick
          case "`":
            q = "`";
            break;
          // empty
          default:
            q = "";
        }
        return q;
      }
      clean(value, _quote) {
        let v = this.trimmer(value);
        v = v.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (_quote === '"') {
          v = v.replace(/\\n/g, "\n");
          v = v.replace(/\\r/g, "\r");
          v = v.replace(/\\t/g, "	");
        }
        return v;
      }
      decrypt(key, value) {
        return decryptKeyValue(key, value, this.privateKeyName, this.privateKey);
      }
      eval(value) {
        const matches = value.match(/\$\(([^)]+(?:\)[^(]*)*)\)/g) || [];
        return matches.reduce((newValue, match) => {
          const command = match.slice(2, -1);
          const result = chomp(execSync2(command, { env: { ...this.processEnv, ...this.runningParsed } }).toString());
          return newValue.replace(match, result);
        }, value);
      }
      expand(value) {
        let env3 = { ...this.runningParsed, ...this.processEnv };
        if (this.overload) {
          env3 = { ...this.processEnv, ...this.runningParsed };
        }
        const regex = /(?<!\\)\${([^{}]+)}|(?<!\\)\$([A-Za-z_][A-Za-z0-9_]*)/g;
        let result = value;
        let match;
        while ((match = regex.exec(result)) !== null) {
          const [template, bracedExpression, unbracedExpression] = match;
          const expression = bracedExpression || unbracedExpression;
          const opRegex = /(:\+|\+|:-|-)/;
          const opMatch = expression.match(opRegex);
          const splitter = opMatch ? opMatch[0] : null;
          const r = expression.split(splitter);
          let defaultValue;
          let value2;
          const key = r.shift();
          if ([":+", "+"].includes(splitter)) {
            defaultValue = env3[key] ? r.join(splitter) : "";
            value2 = null;
          } else {
            defaultValue = r.join(splitter);
            value2 = env3[key];
          }
          if (value2) {
            result = result.replace(template, value2);
          } else {
            result = result.replace(template, defaultValue);
          }
          if (result === env3[key]) {
            break;
          }
          if (this.literals[key]) {
            break;
          }
          regex.lastIndex = 0;
        }
        return result;
      }
      inProcessEnv(key) {
        return Object.prototype.hasOwnProperty.call(this.processEnv, key);
      }
      getLines() {
        return (this.src || "").toString().replace(/\r\n?/mg, "\n");
      }
    };
    module.exports = Parse;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvParse.js
var require_dotenvParse2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvParse.js"(exports, module) {
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function dotenvParse(src, skipExpandForDoubleQuotes = false) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"' && !skipExpandForDoubleQuotes) {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
          value = value.replace(/\\t/g, "	");
        }
        obj[key] = value;
      }
      return obj;
    }
    module.exports = dotenvParse;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/parseEnvironmentFromDotenvKey.js
var require_parseEnvironmentFromDotenvKey2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/parseEnvironmentFromDotenvKey.js"(exports, module) {
    function parseEnvironmentFromDotenvKey(dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (e) {
        throw new Error(`INVALID_DOTENV_KEY: ${e.message}`);
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        throw new Error("INVALID_DOTENV_KEY: Missing environment part");
      }
      return environment;
    }
    module.exports = parseEnvironmentFromDotenvKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/detectEncoding.js
var require_detectEncoding2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/detectEncoding.js"(exports, module) {
    var fs6 = __require("fs");
    function detectEncoding(filepath) {
      const buffer = fs6.readFileSync(filepath);
      if (buffer.length >= 2 && buffer[0] === 255 && buffer[1] === 254) {
        return "utf16le";
      }
      if (buffer.length >= 3 && buffer[0] === 239 && buffer[1] === 187 && buffer[2] === 191) {
        return "utf8";
      }
      return "utf8";
    }
    module.exports = detectEncoding;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessEnvironment.js
var require_guessEnvironment2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessEnvironment.js"(exports, module) {
    var path8 = __require("path");
    function guessEnvironment(filepath) {
      const filename = path8.basename(filepath);
      const parts = filename.split(".");
      const possibleEnvironmentList = [...parts.slice(2)];
      if (possibleEnvironmentList.length === 0) {
        const environment = filename.replace(".env", "development");
        return environment;
      }
      if (possibleEnvironmentList.length === 1) {
        return possibleEnvironmentList[0];
      }
      if (possibleEnvironmentList.length === 2) {
        return possibleEnvironmentList.join("_");
      }
      return possibleEnvironmentList.slice(0, 2).join("_");
    }
    module.exports = guessEnvironment;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPrivateKeyName.js
var require_guessPrivateKeyName2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPrivateKeyName.js"(exports, module) {
    var path8 = __require("path");
    var guessEnvironment = require_guessEnvironment2();
    function guessPrivateKeyName(filepath) {
      const filename = path8.basename(filepath).toLowerCase();
      if (filename === ".env") {
        return "DOTENV_PRIVATE_KEY";
      }
      const environment = guessEnvironment(filename);
      return `DOTENV_PRIVATE_KEY_${environment.toUpperCase()}`;
    }
    module.exports = guessPrivateKeyName;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPublicKeyName.js
var require_guessPublicKeyName2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPublicKeyName.js"(exports, module) {
    var path8 = __require("path");
    var guessEnvironment = require_guessEnvironment2();
    function guessPublicKeyName(filepath) {
      const filename = path8.basename(filepath).toLowerCase();
      if (filename === ".env") {
        return "DOTENV_PUBLIC_KEY";
      }
      const environment = guessEnvironment(filename);
      return `DOTENV_PUBLIC_KEY_${environment.toUpperCase()}`;
    }
    module.exports = guessPublicKeyName;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/proKeypair.js
var require_proKeypair2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/proKeypair.js"(exports, module) {
    var path8 = __require("path");
    var childProcess = __require("child_process");
    var guessPrivateKeyName = require_guessPrivateKeyName2();
    var guessPublicKeyName = require_guessPublicKeyName2();
    var ProKeypair = class {
      constructor(envFilepath) {
        this.envFilepath = envFilepath;
      }
      run() {
        let result = {};
        try {
          const projectRoot = path8.resolve(process.cwd());
          const dotenvxProPath = __require.resolve("@dotenvx/dotenvx-pro", { paths: [projectRoot] });
          const { keypair } = __require(dotenvxProPath);
          result = keypair(this.envFilepath);
        } catch (_e) {
          try {
            const output = childProcess.execSync(`dotenvx-pro keypair -f ${this.envFilepath}`, { stdio: ["pipe", "pipe", "ignore"] }).toString().trim();
            result = JSON.parse(output);
          } catch (_e2) {
            const privateKeyName = guessPrivateKeyName(this.envFilepath);
            const publicKeyName = guessPublicKeyName(this.envFilepath);
            result[privateKeyName] = null;
            result[publicKeyName] = null;
          }
        }
        return result;
      }
    };
    module.exports = ProKeypair;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/smartDotenvPublicKey.js
var require_smartDotenvPublicKey2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/smartDotenvPublicKey.js"(exports, module) {
    var fsx = require_fsx2();
    var dotenvParse = require_dotenvParse2();
    var guessPublicKeyName = require_guessPublicKeyName2();
    function searchProcessEnv(publicKeyName) {
      if (process.env[publicKeyName] && process.env[publicKeyName].length > 0) {
        return process.env[publicKeyName];
      }
    }
    function searchEnvFile(publicKeyName, envFilepath) {
      if (fsx.existsSync(envFilepath)) {
        const keysSrc = fsx.readFileX(envFilepath);
        const keysParsed = dotenvParse(keysSrc);
        if (keysParsed[publicKeyName] && keysParsed[publicKeyName].length > 0) {
          return keysParsed[publicKeyName];
        }
      }
    }
    function smartDotenvPublicKey(envFilepath) {
      let publicKey = null;
      const publicKeyName = guessPublicKeyName(envFilepath);
      publicKey = searchProcessEnv(publicKeyName);
      if (publicKey) {
        return publicKey;
      }
      publicKey = searchEnvFile(publicKeyName, envFilepath);
      if (publicKey) {
        return publicKey;
      }
      return null;
    }
    module.exports = smartDotenvPublicKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/smartDotenvPrivateKey.js
var require_smartDotenvPrivateKey2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/smartDotenvPrivateKey.js"(exports, module) {
    var fsx = require_fsx2();
    var path8 = __require("path");
    var PUBLIC_KEY_SCHEMA = "DOTENV_PUBLIC_KEY";
    var PRIVATE_KEY_SCHEMA = "DOTENV_PRIVATE_KEY";
    var dotenvParse = require_dotenvParse2();
    var guessPrivateKeyName = require_guessPrivateKeyName2();
    function searchProcessEnv(privateKeyName) {
      if (process.env[privateKeyName] && process.env[privateKeyName].length > 0) {
        return process.env[privateKeyName];
      }
    }
    function searchKeysFile(privateKeyName, envFilepath, envKeysFilepath = null) {
      let keysFilepath = path8.resolve(path8.dirname(envFilepath), ".env.keys");
      if (envKeysFilepath) {
        keysFilepath = path8.resolve(envKeysFilepath);
      }
      if (fsx.existsSync(keysFilepath)) {
        const keysSrc = fsx.readFileX(keysFilepath);
        const keysParsed = dotenvParse(keysSrc);
        if (keysParsed[privateKeyName] && keysParsed[privateKeyName].length > 0) {
          return keysParsed[privateKeyName];
        }
      }
    }
    function invertForPrivateKeyName(envFilepath) {
      if (!fsx.existsSync(envFilepath)) {
        return null;
      }
      const envSrc = fsx.readFileX(envFilepath);
      const envParsed = dotenvParse(envSrc);
      let publicKeyName;
      for (const keyName of Object.keys(envParsed)) {
        if (keyName === PUBLIC_KEY_SCHEMA || keyName.startsWith(PUBLIC_KEY_SCHEMA)) {
          publicKeyName = keyName;
        }
      }
      if (publicKeyName) {
        return publicKeyName.replace(PUBLIC_KEY_SCHEMA, PRIVATE_KEY_SCHEMA);
      }
      return null;
    }
    function smartDotenvPrivateKey(envFilepath, envKeysFilepath = null) {
      let privateKey = null;
      let privateKeyName = guessPrivateKeyName(envFilepath);
      privateKey = searchProcessEnv(privateKeyName);
      if (privateKey) {
        return privateKey;
      }
      privateKey = searchKeysFile(privateKeyName, envFilepath, envKeysFilepath);
      if (privateKey) {
        return privateKey;
      }
      privateKeyName = invertForPrivateKeyName(envFilepath);
      if (privateKeyName) {
        privateKey = searchProcessEnv(privateKeyName);
        if (privateKey) {
          return privateKey;
        }
        privateKey = searchKeysFile(privateKeyName, envFilepath, envKeysFilepath);
        if (privateKey) {
          return privateKey;
        }
      }
      return null;
    }
    module.exports = smartDotenvPrivateKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/services/keypair.js
var require_keypair3 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/services/keypair.js"(exports, module) {
    var guessPublicKeyName = require_guessPublicKeyName2();
    var smartDotenvPublicKey = require_smartDotenvPublicKey2();
    var guessPrivateKeyName = require_guessPrivateKeyName2();
    var smartDotenvPrivateKey = require_smartDotenvPrivateKey2();
    var Keypair = class {
      constructor(envFile = ".env", envKeysFilepath = null) {
        this.envFile = envFile;
        this.envKeysFilepath = envKeysFilepath;
      }
      run() {
        const out = {};
        const envFilepaths = this._envFilepaths();
        for (const envFilepath of envFilepaths) {
          const publicKeyName = guessPublicKeyName(envFilepath);
          const publicKeyValue = smartDotenvPublicKey(envFilepath);
          out[publicKeyName] = publicKeyValue;
          const privateKeyName = guessPrivateKeyName(envFilepath);
          const privateKeyValue = smartDotenvPrivateKey(envFilepath, this.envKeysFilepath);
          out[privateKeyName] = privateKeyValue;
        }
        return out;
      }
      _envFilepaths() {
        if (!Array.isArray(this.envFile)) {
          return [this.envFile];
        }
        return this.envFile;
      }
    };
    module.exports = Keypair;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/findPrivateKey.js
var require_findPrivateKey2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/findPrivateKey.js"(exports, module) {
    var guessPrivateKeyName = require_guessPrivateKeyName2();
    var ProKeypair = require_proKeypair2();
    var Keypair = require_keypair3();
    function findPrivateKey(envFilepath, envKeysFilepath = null) {
      const privateKeyName = guessPrivateKeyName(envFilepath);
      const proKeypairs = new ProKeypair(envFilepath).run();
      const keypairs = new Keypair(envFilepath, envKeysFilepath).run();
      return proKeypairs[privateKeyName] || keypairs[privateKeyName];
    }
    module.exports = findPrivateKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvPrivateKeyNames.js
var require_dotenvPrivateKeyNames2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvPrivateKeyNames.js"(exports, module) {
    var PRIVATE_KEY_NAME_SCHEMA = "DOTENV_PRIVATE_KEY";
    function dotenvPrivateKeyNames(processEnv) {
      return Object.keys(processEnv).filter((key) => key.startsWith(PRIVATE_KEY_NAME_SCHEMA));
    }
    module.exports = dotenvPrivateKeyNames;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPrivateKeyFilename.js
var require_guessPrivateKeyFilename2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/guessPrivateKeyFilename.js"(exports, module) {
    var PREFIX = "DOTENV_PRIVATE_KEY";
    function guessPrivateKeyFilename(privateKeyName) {
      if (privateKeyName === PREFIX) {
        return ".env";
      }
      const filenameSuffix = privateKeyName.substring(`${PREFIX}_`.length).split("_").join(".").toLowerCase();
      return `.env.${filenameSuffix}`;
    }
    module.exports = guessPrivateKeyFilename;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/determineEnvs.js
var require_determineEnvs2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/determineEnvs.js"(exports, module) {
    var dotenvPrivateKeyNames = require_dotenvPrivateKeyNames2();
    var guessPrivateKeyFilename = require_guessPrivateKeyFilename2();
    var TYPE_ENV_FILE = "envFile";
    var TYPE_ENV_VAULT_FILE = "envVaultFile";
    var DEFAULT_ENVS = [{ type: TYPE_ENV_FILE, value: ".env" }];
    var DEFAULT_ENV_VAULTS = [{ type: TYPE_ENV_VAULT_FILE, value: ".env.vault" }];
    function determineEnvsFromDotenvPrivateKey(privateKeyNames) {
      const envs = [];
      for (const privateKeyName of privateKeyNames) {
        const filename = guessPrivateKeyFilename(privateKeyName);
        envs.push({ type: TYPE_ENV_FILE, value: filename });
      }
      return envs;
    }
    function determineEnvs(envs = [], processEnv, DOTENV_KEY = "") {
      const privateKeyNames = dotenvPrivateKeyNames(processEnv);
      if (!envs || envs.length <= 0) {
        if (privateKeyNames.length > 0) {
          return determineEnvsFromDotenvPrivateKey(privateKeyNames);
        }
        if (DOTENV_KEY.length > 0) {
          return DEFAULT_ENV_VAULTS;
        } else {
          return DEFAULT_ENVS;
        }
      } else {
        let fileAlreadySpecified = false;
        for (const env3 of envs) {
          if (DOTENV_KEY.length > 0 && env3.type === TYPE_ENV_VAULT_FILE) {
            fileAlreadySpecified = true;
          }
          if (DOTENV_KEY.length <= 0 && env3.type === TYPE_ENV_FILE) {
            fileAlreadySpecified = true;
          }
        }
        if (fileAlreadySpecified) {
          return envs;
        }
        if (DOTENV_KEY.length > 0) {
          return [...DEFAULT_ENV_VAULTS, ...envs];
        } else {
          return [...DEFAULT_ENVS, ...envs];
        }
      }
    }
    module.exports = determineEnvs;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/services/run.js
var require_run2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/services/run.js"(exports, module) {
    var fsx = require_fsx2();
    var path8 = __require("path");
    var TYPE_ENV = "env";
    var TYPE_ENV_FILE = "envFile";
    var TYPE_ENV_VAULT_FILE = "envVaultFile";
    var decrypt = require_decrypt2();
    var Parse = require_parse3();
    var Errors = require_errors2();
    var dotenvParse = require_dotenvParse2();
    var parseEnvironmentFromDotenvKey = require_parseEnvironmentFromDotenvKey2();
    var detectEncoding = require_detectEncoding2();
    var findPrivateKey = require_findPrivateKey2();
    var guessPrivateKeyName = require_guessPrivateKeyName2();
    var determineEnvs = require_determineEnvs2();
    var Run = class {
      constructor(envs = [], overload = false, DOTENV_KEY = "", processEnv = process.env, envKeysFilepath = null) {
        this.envs = determineEnvs(envs, processEnv, DOTENV_KEY);
        this.overload = overload;
        this.DOTENV_KEY = DOTENV_KEY;
        this.processEnv = processEnv;
        this.envKeysFilepath = envKeysFilepath;
        this.processedEnvs = [];
        this.readableFilepaths = /* @__PURE__ */ new Set();
        this.readableStrings = /* @__PURE__ */ new Set();
        this.uniqueInjectedKeys = /* @__PURE__ */ new Set();
      }
      run() {
        for (const env3 of this.envs) {
          if (env3.type === TYPE_ENV_VAULT_FILE) {
            this._injectEnvVaultFile(env3.value);
          } else if (env3.type === TYPE_ENV_FILE) {
            this._injectEnvFile(env3.value);
          } else if (env3.type === TYPE_ENV) {
            this._injectEnv(env3.value);
          }
        }
        return {
          processedEnvs: this.processedEnvs,
          readableStrings: [...this.readableStrings],
          readableFilepaths: [...this.readableFilepaths],
          uniqueInjectedKeys: [...this.uniqueInjectedKeys]
        };
      }
      _injectEnv(env3) {
        const row = {};
        row.type = TYPE_ENV;
        row.string = env3;
        try {
          const { parsed, errors, injected, preExisted } = new Parse(env3, null, this.processEnv, this.overload).run();
          row.parsed = parsed;
          row.errors = errors;
          row.injected = injected;
          row.preExisted = preExisted;
          this.inject(row.parsed);
          this.readableStrings.add(env3);
          for (const key of Object.keys(injected)) {
            this.uniqueInjectedKeys.add(key);
          }
        } catch (e) {
          row.errors = [e];
        }
        this.processedEnvs.push(row);
      }
      _injectEnvFile(envFilepath) {
        const row = {};
        row.type = TYPE_ENV_FILE;
        row.filepath = envFilepath;
        const filepath = path8.resolve(envFilepath);
        try {
          const encoding = detectEncoding(filepath);
          const src = fsx.readFileX(filepath, { encoding });
          this.readableFilepaths.add(envFilepath);
          const privateKey = findPrivateKey(envFilepath, this.envKeysFilepath);
          const privateKeyName = guessPrivateKeyName(envFilepath);
          const { parsed, errors, injected, preExisted } = new Parse(src, privateKey, this.processEnv, this.overload, privateKeyName).run();
          row.parsed = parsed;
          row.errors = errors;
          row.injected = injected;
          row.preExisted = preExisted;
          this.inject(row.parsed);
          for (const key of Object.keys(injected)) {
            this.uniqueInjectedKeys.add(key);
          }
        } catch (e) {
          if (e.code === "ENOENT" || e.code === "EISDIR") {
            row.errors = [new Errors({ envFilepath, filepath }).missingEnvFile()];
          } else {
            row.errors = [e];
          }
        }
        this.processedEnvs.push(row);
      }
      _injectEnvVaultFile(envVaultFilepath) {
        const row = {};
        row.type = TYPE_ENV_VAULT_FILE;
        row.filepath = envVaultFilepath;
        const filepath = path8.resolve(envVaultFilepath);
        this.readableFilepaths.add(envVaultFilepath);
        if (!fsx.existsSync(filepath)) {
          const code = "MISSING_ENV_VAULT_FILE";
          const message = `you set DOTENV_KEY but your .env.vault file is missing: ${filepath}`;
          const error = new Error(message);
          error.code = code;
          throw error;
        }
        if (this.DOTENV_KEY.length < 1) {
          const code = "MISSING_DOTENV_KEY";
          const message = `your DOTENV_KEY appears to be blank: '${this.DOTENV_KEY}'`;
          const error = new Error(message);
          error.code = code;
          throw error;
        }
        let decrypted;
        const dotenvKeys = this._dotenvKeys();
        const parsedVault = this._parsedVault(filepath);
        for (let i = 0; i < dotenvKeys.length; i++) {
          try {
            const dotenvKey = dotenvKeys[i].trim();
            decrypted = this._decrypted(dotenvKey, parsedVault);
            break;
          } catch (error) {
            if (i + 1 >= dotenvKeys.length) {
              throw error;
            }
          }
        }
        try {
          const { parsed, errors, injected, preExisted } = new Parse(decrypted, null, this.processEnv, this.overload).run();
          row.parsed = parsed;
          row.errors = errors;
          row.injected = injected;
          row.preExisted = preExisted;
          this.inject(row.parsed);
          for (const key of Object.keys(injected)) {
            this.uniqueInjectedKeys.add(key);
          }
        } catch (e) {
          row.errors = [e];
        }
        this.processedEnvs.push(row);
      }
      inject(parsed) {
        for (const key of Object.keys(parsed)) {
          this.processEnv[key] = parsed[key];
        }
      }
      // handle scenario for comma separated keys - for use with key rotation
      // example: DOTENV_KEY="dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenvx.com/vault/.env.vault?environment=prod"
      _dotenvKeys() {
        return this.DOTENV_KEY.split(",");
      }
      // { "DOTENV_VAULT_DEVELOPMENT": "<ciphertext>" }
      _parsedVault(filepath) {
        const src = fsx.readFileX(filepath);
        return dotenvParse(src);
      }
      _decrypted(dotenvKey, parsedVault) {
        const environment = parseEnvironmentFromDotenvKey(dotenvKey);
        const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
        const ciphertext = parsedVault[environmentKey];
        if (!ciphertext) {
          const error = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: cannot locate environment ${environmentKey} in your .env.vault file`);
          error.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
          throw error;
        }
        return decrypt(ciphertext, dotenvKey);
      }
    };
    module.exports = Run;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/encryptValue.js
var require_encryptValue2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/encryptValue.js"(exports, module) {
    var { encrypt } = require_dist2();
    var PREFIX = "encrypted:";
    function encryptValue(value, publicKey) {
      const ciphertext = encrypt(publicKey, Buffer.from(value));
      const encoded = Buffer.from(ciphertext, "hex").toString("base64");
      return `${PREFIX}${encoded}`;
    }
    module.exports = encryptValue;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/quotes.js
var require_quotes2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/quotes.js"(exports, module) {
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function quotes(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === value[0]) {
          obj[key] = "";
        } else {
          obj[key] = maybeQuote;
        }
      }
      return obj;
    }
    module.exports = quotes;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/escapeForRegex.js
var require_escapeForRegex2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/escapeForRegex.js"(exports, module) {
    function escapeForRegex(str) {
      return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    }
    module.exports = escapeForRegex;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/escapeDollarSigns.js
var require_escapeDollarSigns2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/escapeDollarSigns.js"(exports, module) {
    function escapeDollarSigns(str) {
      return str.replace(/\$/g, "$$$$");
    }
    module.exports = escapeDollarSigns;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/replace.js
var require_replace2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/replace.js"(exports, module) {
    var quotes = require_quotes2();
    var dotenvParse = require_dotenvParse2();
    var escapeForRegex = require_escapeForRegex2();
    var escapeDollarSigns = require_escapeDollarSigns2();
    function replace(src, key, replaceValue) {
      let output;
      let newPart = "";
      const parsed = dotenvParse(src, true);
      const _quotes = quotes(src);
      if (Object.prototype.hasOwnProperty.call(parsed, key)) {
        const quote = _quotes[key];
        newPart += `${key}=${quote}${replaceValue}${quote}`;
        const originalValue = parsed[key];
        const escapedOriginalValue = escapeForRegex(originalValue);
        let enforceEndOfLine = "";
        if (escapedOriginalValue === "") {
          enforceEndOfLine = "$";
        }
        const currentPart = new RegExp(
          "^(\\s*)?(export\\s+)?" + // export
          key + // KEY
          "\\s*=\\s*[\"'`]?" + // open quote
          escapedOriginalValue + // escaped value
          "[\"'`]?" + // close quote
          enforceEndOfLine,
          "gm"
          // (g)lobal (m)ultiline
        );
        const saferInput = escapeDollarSigns(newPart);
        output = src.replace(currentPart, `$1$2${saferInput}`);
      } else {
        newPart += `${key}="${replaceValue}"`;
        if (src.endsWith("\n")) {
          newPart = newPart + "\n";
        } else {
          newPart = "\n" + newPart;
        }
        output = src + newPart;
      }
      return output;
    }
    module.exports = replace;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/findPublicKey.js
var require_findPublicKey2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/findPublicKey.js"(exports, module) {
    var guessPublicKeyName = require_guessPublicKeyName2();
    var ProKeypair = require_proKeypair2();
    var Keypair = require_keypair3();
    function findPublicKey(envFilepath) {
      const publicKeyName = guessPublicKeyName(envFilepath);
      const proKeypairs = new ProKeypair(envFilepath).run();
      const keypairs = new Keypair(envFilepath).run();
      return proKeypairs[publicKeyName] || keypairs[publicKeyName];
    }
    module.exports = findPublicKey;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/keypair.js
var require_keypair4 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/keypair.js"(exports, module) {
    var { PrivateKey } = require_dist2();
    function keypair(existingPrivateKey) {
      let kp;
      if (existingPrivateKey) {
        kp = new PrivateKey(Buffer.from(existingPrivateKey, "hex"));
      } else {
        kp = new PrivateKey();
      }
      const publicKey = kp.publicKey.toHex();
      const privateKey = kp.secret.toString("hex");
      return {
        publicKey,
        privateKey
      };
    }
    module.exports = keypair;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/isEncrypted.js
var require_isEncrypted2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/isEncrypted.js"(exports, module) {
    var ENCRYPTION_PATTERN = /^encrypted:.+/;
    function isEncrypted(value) {
      return ENCRYPTION_PATTERN.test(value);
    }
    module.exports = isEncrypted;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/services/sets.js
var require_sets2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/services/sets.js"(exports, module) {
    var fsx = require_fsx2();
    var path8 = __require("path");
    var TYPE_ENV_FILE = "envFile";
    var Errors = require_errors2();
    var guessPrivateKeyName = require_guessPrivateKeyName2();
    var guessPublicKeyName = require_guessPublicKeyName2();
    var encryptValue = require_encryptValue2();
    var decryptKeyValue = require_decryptKeyValue2();
    var replace = require_replace2();
    var dotenvParse = require_dotenvParse2();
    var detectEncoding = require_detectEncoding2();
    var determineEnvs = require_determineEnvs2();
    var findPrivateKey = require_findPrivateKey2();
    var findPublicKey = require_findPublicKey2();
    var keypair = require_keypair4();
    var truncate = require_truncate2();
    var isEncrypted = require_isEncrypted2();
    var Sets = class {
      constructor(key, value, envs = [], encrypt = true, envKeysFilepath = null) {
        this.envs = determineEnvs(envs, process.env);
        this.key = key;
        this.value = value;
        this.encrypt = encrypt;
        this.envKeysFilepath = envKeysFilepath;
        this.processedEnvs = [];
        this.changedFilepaths = /* @__PURE__ */ new Set();
        this.unchangedFilepaths = /* @__PURE__ */ new Set();
        this.readableFilepaths = /* @__PURE__ */ new Set();
      }
      run() {
        for (const env3 of this.envs) {
          if (env3.type === TYPE_ENV_FILE) {
            this._setEnvFile(env3.value);
          }
        }
        return {
          processedEnvs: this.processedEnvs,
          changedFilepaths: [...this.changedFilepaths],
          unchangedFilepaths: [...this.unchangedFilepaths]
        };
      }
      _setEnvFile(envFilepath) {
        const row = {};
        row.key = this.key || null;
        row.value = this.value || null;
        row.type = TYPE_ENV_FILE;
        const filename = path8.basename(envFilepath);
        const filepath = path8.resolve(envFilepath);
        row.filepath = filepath;
        row.envFilepath = envFilepath;
        row.changed = false;
        try {
          const encoding = this._detectEncoding(filepath);
          let envSrc = fsx.readFileX(filepath, { encoding });
          const envParsed = dotenvParse(envSrc);
          row.originalValue = envParsed[row.key] || null;
          const wasPlainText = !isEncrypted(row.originalValue);
          this.readableFilepaths.add(envFilepath);
          if (this.encrypt) {
            let publicKey;
            let privateKey;
            const publicKeyName = guessPublicKeyName(envFilepath);
            const privateKeyName = guessPrivateKeyName(envFilepath);
            const existingPrivateKey = findPrivateKey(envFilepath, this.envKeysFilepath);
            const existingPublicKey = findPublicKey(envFilepath);
            let envKeysFilepath = path8.join(path8.dirname(filepath), ".env.keys");
            if (this.envKeysFilepath) {
              envKeysFilepath = path8.resolve(this.envKeysFilepath);
            }
            const relativeFilepath = path8.relative(path8.dirname(filepath), envKeysFilepath);
            if (existingPrivateKey) {
              const kp = keypair(existingPrivateKey);
              publicKey = kp.publicKey;
              privateKey = kp.privateKey;
              if (row.originalValue) {
                row.originalValue = decryptKeyValue(row.key, row.originalValue, privateKeyName, privateKey);
              }
              if (existingPublicKey && existingPublicKey !== publicKey) {
                const error = new Error(`derived public key (${truncate(publicKey)}) does not match the existing public key (${truncate(existingPublicKey)})`);
                error.code = "INVALID_DOTENV_PRIVATE_KEY";
                error.help = `debug info: ${privateKeyName}=${truncate(existingPrivateKey)} (derived ${publicKeyName}=${truncate(publicKey)} vs existing ${publicKeyName}=${truncate(existingPublicKey)})`;
                throw error;
              }
              if (!existingPublicKey) {
                const ps = this._preserveShebang(envSrc);
                const firstLinePreserved = ps.firstLinePreserved;
                envSrc = ps.envSrc;
                const prependPublicKey = this._prependPublicKey(publicKeyName, publicKey, filename, relativeFilepath);
                envSrc = `${firstLinePreserved}${prependPublicKey}
${envSrc}`;
              }
            } else if (existingPublicKey) {
              publicKey = existingPublicKey;
            } else {
              let keysSrc = "";
              if (fsx.existsSync(envKeysFilepath)) {
                keysSrc = fsx.readFileX(envKeysFilepath);
              }
              const ps = this._preserveShebang(envSrc);
              const firstLinePreserved = ps.firstLinePreserved;
              envSrc = ps.envSrc;
              const kp = keypair();
              publicKey = kp.publicKey;
              privateKey = kp.privateKey;
              const prependPublicKey = this._prependPublicKey(publicKeyName, publicKey, filename, relativeFilepath);
              const firstTimeKeysSrc = [
                "#/------------------!DOTENV_PRIVATE_KEYS!-------------------/",
                "#/ private decryption keys. DO NOT commit to source control /",
                "#/     [how it works](https://dotenvx.com/encryption)       /",
                "#/----------------------------------------------------------/"
              ].join("\n");
              const appendPrivateKey = [
                `# ${filename}`,
                `${privateKeyName}=${privateKey}`,
                ""
              ].join("\n");
              envSrc = `${firstLinePreserved}${prependPublicKey}
${envSrc}`;
              keysSrc = keysSrc.length > 1 ? keysSrc : `${firstTimeKeysSrc}
`;
              keysSrc = `${keysSrc}
${appendPrivateKey}`;
              fsx.writeFileX(envKeysFilepath, keysSrc);
              row.privateKeyAdded = true;
              row.envKeysFilepath = this.envKeysFilepath || path8.join(path8.dirname(envFilepath), path8.basename(envKeysFilepath));
            }
            row.publicKey = publicKey;
            row.privateKey = privateKey;
            row.encryptedValue = encryptValue(this.value, publicKey);
            row.privateKeyName = privateKeyName;
          }
          const goingFromPlainTextToEncrypted = wasPlainText && this.encrypt;
          const valueChanged = this.value !== row.originalValue;
          if (goingFromPlainTextToEncrypted || valueChanged) {
            row.envSrc = replace(envSrc, this.key, row.encryptedValue || this.value);
            this.changedFilepaths.add(envFilepath);
            row.changed = true;
          } else {
            row.envSrc = envSrc;
            this.unchangedFilepaths.add(envFilepath);
            row.changed = false;
          }
        } catch (e) {
          if (e.code === "ENOENT") {
            row.error = new Errors({ envFilepath, filepath }).missingEnvFile();
          } else {
            row.error = e;
          }
        }
        this.processedEnvs.push(row);
      }
      _detectEncoding(filepath) {
        return detectEncoding(filepath);
      }
      _prependPublicKey(publicKeyName, publicKey, filename, relativeFilepath = ".env.keys") {
        const comment = relativeFilepath === ".env.keys" ? "" : ` # -fk ${relativeFilepath}`;
        return [
          "#/-------------------[DOTENV_PUBLIC_KEY]--------------------/",
          "#/            public-key encryption for .env files          /",
          "#/       [how it works](https://dotenvx.com/encryption)     /",
          "#/----------------------------------------------------------/",
          `${publicKeyName}="${publicKey}"${comment}`,
          "",
          `# ${filename}`
        ].join("\n");
      }
      _preserveShebang(envSrc) {
        const [firstLine, ...remainingLines] = envSrc.split("\n");
        let firstLinePreserved = "";
        if (firstLine.startsWith("#!")) {
          firstLinePreserved = firstLine + "\n";
          envSrc = remainingLines.join("\n");
        }
        return {
          firstLinePreserved,
          envSrc
        };
      }
    };
    module.exports = Sets;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/findEnvFiles.js
var require_findEnvFiles2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/findEnvFiles.js"(exports, module) {
    var fsx = require_fsx2();
    var RESERVED_ENV_FILES = [".env.vault", ".env.project", ".env.keys", ".env.me", ".env.x", ".env.example"];
    function findEnvFiles(directory) {
      try {
        const files = fsx.readdirSync(directory);
        const envFiles = files.filter(
          (file) => file.startsWith(".env") && !file.endsWith(".previous") && !RESERVED_ENV_FILES.includes(file)
        );
        return envFiles;
      } catch (e) {
        if (e.code === "ENOENT") {
          const error = new Error(`missing directory (${directory})`);
          error.code = "MISSING_DIRECTORY";
          throw error;
        } else {
          throw e;
        }
      }
    }
    module.exports = findEnvFiles;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/services/genexample.js
var require_genexample2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/services/genexample.js"(exports, module) {
    var fsx = require_fsx2();
    var path8 = __require("path");
    var Errors = require_errors2();
    var findEnvFiles = require_findEnvFiles2();
    var replace = require_replace2();
    var dotenvParse = require_dotenvParse2();
    var Genexample = class {
      constructor(directory = ".", envFile) {
        this.directory = directory;
        this.envFile = envFile || findEnvFiles(directory);
        this.exampleFilename = ".env.example";
        this.exampleFilepath = path8.resolve(this.directory, this.exampleFilename);
      }
      run() {
        if (this.envFile.length < 1) {
          const code = "MISSING_ENV_FILES";
          const message = "no .env* files found";
          const help = '? add one with [echo "HELLO=World" > .env] and then run [dotenvx genexample]';
          const error = new Error(message);
          error.code = code;
          error.help = help;
          throw error;
        }
        const keys = /* @__PURE__ */ new Set();
        const addedKeys = /* @__PURE__ */ new Set();
        const envFilepaths = this._envFilepaths();
        const injected = {};
        const preExisted = {};
        let exampleSrc = `# ${this.exampleFilename} - generated with dotenvx
`;
        for (const envFilepath of envFilepaths) {
          const filepath = path8.resolve(this.directory, envFilepath);
          if (!fsx.existsSync(filepath)) {
            const error = new Errors({ envFilepath, filepath }).missingEnvFile();
            error.help = `? add it with [echo "HELLO=World" > ${envFilepath}] and then run [dotenvx genexample]`;
            throw error;
          }
          let src = fsx.readFileX(filepath);
          const parsed = dotenvParse(src);
          for (const key in parsed) {
            keys.add(key);
            src = replace(src, key, "");
          }
          exampleSrc += `
${src}`;
        }
        if (!fsx.existsSync(this.exampleFilepath)) {
          for (const key of [...keys]) {
            addedKeys.add(key);
            injected[key] = "";
          }
        } else {
          exampleSrc = fsx.readFileX(this.exampleFilepath);
          const parsed = dotenvParse(exampleSrc);
          for (const key of [...keys]) {
            if (key in parsed) {
              preExisted[key] = parsed[key];
            } else {
              exampleSrc += `${key}=''
`;
              addedKeys.add(key);
              injected[key] = "";
            }
          }
        }
        return {
          envExampleFile: exampleSrc,
          envFile: this.envFile,
          exampleFilepath: this.exampleFilepath,
          addedKeys: [...addedKeys],
          injected,
          preExisted
        };
      }
      _envFilepaths() {
        if (!Array.isArray(this.envFile)) {
          return [this.envFile];
        }
        return this.envFile;
      }
    };
    module.exports = Genexample;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/conventions.js
var require_conventions2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/conventions.js"(exports, module) {
    function conventions(convention) {
      if (convention === "nextjs") {
        const nodeEnv2 = process.env.NODE_ENV || "development";
        const canonicalEnv = ["development", "test", "production"].includes(nodeEnv2) && nodeEnv2;
        return [
          canonicalEnv && { type: "envFile", value: `.env.${canonicalEnv}.local` },
          canonicalEnv !== "test" && { type: "envFile", value: ".env.local" },
          canonicalEnv && { type: "envFile", value: `.env.${canonicalEnv}` },
          { type: "envFile", value: ".env" }
        ].filter(Boolean);
      } else {
        throw new Error(`INVALID_CONVENTION: '${convention}'. permitted conventions: ['nextjs']`);
      }
    }
    module.exports = conventions;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/resolveHome.js
var require_resolveHome2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/resolveHome.js"(exports, module) {
    var os2 = __require("os");
    var path8 = __require("path");
    function resolveHome(filepath) {
      if (filepath[0] === "~") {
        return path8.join(os2.homedir(), filepath.slice(1));
      }
      return filepath;
    }
    module.exports = resolveHome;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvOptionPaths.js
var require_dotenvOptionPaths2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/dotenvOptionPaths.js"(exports, module) {
    var resolveHome = require_resolveHome2();
    function dotenvOptionPaths(options) {
      let optionPaths = [];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(resolveHome(filepath));
          }
        }
      }
      return optionPaths;
    }
    module.exports = dotenvOptionPaths;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/deprecationNotice.js
var require_deprecationNotice2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/deprecationNotice.js"(exports, module) {
    var { logger } = require_logger2();
    var DeprecationNotice = class {
      constructor(options = {}) {
        this.DOTENV_KEY = options.DOTENV_KEY || process.env.DOTENV_KEY;
      }
      dotenvKey() {
        if (this.DOTENV_KEY) {
          logger.warn("[DEPRECATION NOTICE] Setting DOTENV_KEY with .env.vault is deprecated.");
          logger.warn("[DEPRECATION NOTICE] Run [dotenvx ext vault migrate] for instructions on converting your .env.vault file to encrypted .env files (using public key encryption algorithm secp256k1)");
          logger.warn("[DEPRECATION NOTICE] Read more at [https://github.com/dotenvx/dotenvx/blob/main/CHANGELOG.md#0380]");
        }
      }
    };
    module.exports = DeprecationNotice;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/buildEnvs.js
var require_buildEnvs2 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/helpers/buildEnvs.js"(exports, module) {
    var path8 = __require("path");
    var conventions = require_conventions2();
    var dotenvOptionPaths = require_dotenvOptionPaths2();
    var DeprecationNotice = require_deprecationNotice2();
    function buildEnvs(options, DOTENV_KEY = void 0) {
      const optionPaths = dotenvOptionPaths(options);
      let envs = [];
      if (options.convention) {
        envs = conventions(options.convention).concat(envs);
      }
      new DeprecationNotice({ DOTENV_KEY }).dotenvKey();
      for (const optionPath of optionPaths) {
        if (DOTENV_KEY) {
          envs.push({
            type: "envVaultFile",
            value: path8.join(path8.dirname(optionPath), ".env.vault")
          });
        } else {
          envs.push({ type: "envFile", value: optionPath });
        }
      }
      return envs;
    }
    module.exports = buildEnvs;
  }
});

// ../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/main.js
var require_main3 = __commonJS({
  "../node_modules/.pnpm/@dotenvx+dotenvx@1.31.3/node_modules/@dotenvx/dotenvx/src/lib/main.js"(exports, module) {
    var path8 = __require("path");
    var { setLogLevel, logger } = require_logger2();
    var { getColor, bold } = require_colors2();
    var Ls = require_ls2();
    var Run = require_run2();
    var Sets = require_sets2();
    var Keypair = require_keypair3();
    var Genexample = require_genexample2();
    var buildEnvs = require_buildEnvs2();
    var Parse = require_parse3();
    var config3 = function(options = {}) {
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      const overload = options.overload || options.override;
      const ignore = options.ignore || [];
      const strict = options.strict;
      const envKeysFile = options.envKeysFile;
      let DOTENV_KEY = process.env.DOTENV_KEY;
      if (options && options.DOTENV_KEY) {
        DOTENV_KEY = options.DOTENV_KEY;
      }
      if (options) setLogLevel(options);
      try {
        const envs = buildEnvs(options, DOTENV_KEY);
        const {
          processedEnvs,
          readableFilepaths,
          uniqueInjectedKeys
        } = new Run(envs, overload, DOTENV_KEY, processEnv, envKeysFile).run();
        let lastError;
        const parsedAll = {};
        for (const processedEnv of processedEnvs) {
          if (processedEnv.type === "envVaultFile") {
            logger.verbose(`loading env from encrypted ${processedEnv.filepath} (${path8.resolve(processedEnv.filepath)})`);
            logger.debug(`decrypting encrypted env from ${processedEnv.filepath} (${path8.resolve(processedEnv.filepath)})`);
          }
          if (processedEnv.type === "envFile") {
            logger.verbose(`loading env from ${processedEnv.filepath} (${path8.resolve(processedEnv.filepath)})`);
          }
          for (const error of processedEnv.errors || []) {
            if (strict) throw error;
            if (ignore.includes(error.code)) {
              continue;
            }
            lastError = error;
            if (error.code === "MISSING_ENV_FILE") {
              if (!options.convention) {
                console.error(error.message);
                if (error.help) {
                  console.error(error.help);
                }
              }
            } else {
              console.error(error.message);
              if (error.help) {
                console.error(error.help);
              }
            }
          }
          Object.assign(parsedAll, processedEnv.injected || {});
          Object.assign(parsedAll, processedEnv.preExisted || {});
          logger.debug(processedEnv.parsed);
          for (const [key, value] of Object.entries(processedEnv.injected || {})) {
            logger.verbose(`${key} set`);
            logger.debug(`${key} set to ${value}`);
          }
          for (const [key, value] of Object.entries(processedEnv.preExisted || {})) {
            logger.verbose(`${key} pre-exists (protip: use --overload to override)`);
            logger.debug(`${key} pre-exists as ${value} (protip: use --overload to override)`);
          }
        }
        let msg = `injecting env (${uniqueInjectedKeys.length})`;
        if (readableFilepaths.length > 0) {
          msg += ` from ${readableFilepaths.join(", ")}`;
        }
        logger.successv(msg);
        if (lastError) {
          return { parsed: parsedAll, error: lastError };
        } else {
          return { parsed: parsedAll };
        }
      } catch (error) {
        if (strict) throw error;
        logger.error(error.message);
        if (error.help) {
          logger.help(error.help);
        }
        return { parsed: {}, error };
      }
    };
    var parse2 = function(src, options = {}) {
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      const privateKey = options.privateKey || null;
      const overload = options.overload || options.override;
      const { parsed, errors } = new Parse(src, privateKey, processEnv, overload).run();
      for (const error of errors) {
        console.error(error.message);
        if (error.help) {
          console.error(error.help);
        }
      }
      return parsed;
    };
    var set = function(key, value, options = {}) {
      let encrypt = true;
      if (options.plain) {
        encrypt = false;
      } else if (options.encrypt === false) {
        encrypt = false;
      }
      const envKeysFile = options.envKeysFile;
      const envs = buildEnvs(options);
      return new Sets(key, value, envs, encrypt, envKeysFile).run();
    };
    var ls = function(directory, envFile, excludeEnvFile) {
      return new Ls(directory, envFile, excludeEnvFile).run();
    };
    var genexample = function(directory, envFile) {
      return new Genexample(directory, envFile).run();
    };
    var keypair = function(envFile, key, envKeysFile = null) {
      const keypairs = new Keypair(envFile, envKeysFile).run();
      if (key) {
        return keypairs[key];
      } else {
        return keypairs;
      }
    };
    module.exports = {
      // dotenv proxies
      config: config3,
      parse: parse2,
      // actions related
      set,
      ls,
      keypair,
      genexample,
      // expose for libs depending on @dotenvx/dotenvx - like dotenvx-pro
      setLogLevel,
      logger,
      getColor,
      bold
    };
  }
});

// ../node_modules/.pnpm/@bugsnag+cuid@3.1.1/node_modules/@bugsnag/cuid/lib/pad.js
var require_pad = __commonJS({
  "../node_modules/.pnpm/@bugsnag+cuid@3.1.1/node_modules/@bugsnag/cuid/lib/pad.js"(exports, module) {
    module.exports = function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length - size);
    };
  }
});

// ../node_modules/.pnpm/@bugsnag+cuid@3.1.1/node_modules/@bugsnag/cuid/lib/fingerprint.js
var require_fingerprint = __commonJS({
  "../node_modules/.pnpm/@bugsnag+cuid@3.1.1/node_modules/@bugsnag/cuid/lib/fingerprint.js"(exports, module) {
    var pad = require_pad();
    var os2 = __require("os");
    function getHostname() {
      try {
        return os2.hostname();
      } catch (e) {
        return process.env._CLUSTER_NETWORK_NAME_ || process.env.COMPUTERNAME || "hostname";
      }
    }
    var padding = 2;
    var pid = pad(process.pid.toString(36), padding);
    var hostname = getHostname();
    var length = hostname.length;
    var hostId = pad(
      hostname.split("").reduce(function(prev, char) {
        return +prev + char.charCodeAt(0);
      }, +length + 36).toString(36),
      padding
    );
    module.exports = function fingerprint() {
      return pid + hostId;
    };
  }
});

// ../node_modules/.pnpm/@bugsnag+cuid@3.1.1/node_modules/@bugsnag/cuid/lib/is-cuid.js
var require_is_cuid = __commonJS({
  "../node_modules/.pnpm/@bugsnag+cuid@3.1.1/node_modules/@bugsnag/cuid/lib/is-cuid.js"(exports, module) {
    module.exports = function isCuid(value) {
      return typeof value === "string" && /^c[a-z0-9]{20,32}$/.test(value);
    };
  }
});

// ../node_modules/.pnpm/@bugsnag+cuid@3.1.1/node_modules/@bugsnag/cuid/index.js
var require_cuid = __commonJS({
  "../node_modules/.pnpm/@bugsnag+cuid@3.1.1/node_modules/@bugsnag/cuid/index.js"(exports, module) {
    var fingerprint = require_fingerprint();
    var isCuid = require_is_cuid();
    var pad = require_pad();
    var c2 = 0;
    var blockSize = 4;
    var base = 36;
    var discreteValues = Math.pow(base, blockSize);
    function randomBlock() {
      return pad((Math.random() * discreteValues << 0).toString(base), blockSize);
    }
    function safeCounter() {
      c2 = c2 < discreteValues ? c2 : 0;
      c2++;
      return c2 - 1;
    }
    function cuid() {
      var letter = "c", timestamp = (/* @__PURE__ */ new Date()).getTime().toString(base), counter = pad(safeCounter().toString(base), blockSize), print = fingerprint(), random = randomBlock() + randomBlock();
      return letter + timestamp + counter + print + random;
    }
    cuid.fingerprint = fingerprint;
    cuid.isCuid = isCuid;
    module.exports = cuid;
  }
});

// src/db-setup/db-setup.ts
var import_dotenvx2 = __toESM(require_main2());

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
        const integer2 = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          integer2 >> 16 & 255,
          integer2 >> 8 & 255,
          integer2 & 255
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
    const version2 = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version2 >= 3 ? 3 : 2;
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
var findScriptConfigFile = (configNames, startDir = process.cwd()) => {
  let dir = startDir;
  while (true) {
    for (const name of configNames) {
      const candidate = path4.join(dir, name);
      if (fs2.existsSync(candidate)) return candidate;
    }
    const parent = path4.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
};
var findProjectRoot = (startDir = process.cwd()) => {
  let dir = startDir;
  while (true) {
    if (fs2.existsSync(path4.join(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    if (fs2.existsSync(path4.join(dir, "lerna.json"))) {
      return dir;
    }
    if (fs2.existsSync(path4.join(dir, "rush.json"))) {
      return dir;
    }
    const parent = path4.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  dir = startDir;
  while (true) {
    if (fs2.existsSync(path4.join(dir, "package.json")) || fs2.existsSync(path4.join(dir, ".git"))) {
      return dir;
    }
    const parent = path4.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
};

// src/db-setup/schemas.config.ts
var PATH_FOLDER_ENV = ".";
var PATH_FOLDER_SCHEMAS = "apps/server/src/db/schemas";
var PATH_FILES_CONFIG = ["scripts/db-setup.config.ts", "db-setup.config.ts"];
var SCHEMAS_BETTER_AUTH = ["auth_account", "auth_session", "auth_verification"];
var SCHEMAS_BLOCKLIST = [...SCHEMAS_BETTER_AUTH];
var loadSeedConfig = async ({
  configFileGlob = PATH_FILES_CONFIG
} = {}) => {
  const projectRoot = findProjectRoot();
  const configFileGlobArr = Array.isArray(configFileGlob) ? configFileGlob : [configFileGlob];
  const configPath = findScriptConfigFile(
    configFileGlobArr.flatMap((pattern) => [
      pattern,
      pattern.replace(/\.ts$/, ".js"),
      `${pattern}.js`,
      `${pattern}.ts`
    ]),
    projectRoot
  );
  if (!configPath) {
    throw new Error("No config file found! Please create a db-setup.config.ts or db-setup.config.js file.");
  }
  try {
    const configModule = await import(configPath);
    return { seedConfigs: configModule.seedConfigs };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ERR_UNKNOWN_FILE_EXTENSION") {
      console.error(source_default.red("\n\u274C Error loading TypeScript config file."));
      console.error(source_default.yellow("Please either:"));
      console.error(source_default.yellow("1. Use a .js extension for your config file"));
      console.error(source_default.yellow("2. Run with tsx if you want to keep the .ts extension"));
      process.exit(1);
    }
    console.error(source_default.red(`\u274C Error loading config from ${configPath}:`), error);
    process.exit(1);
  }
};
var getAllSchemas = ({ seedConfigs }) => seedConfigs.map((config3) => config3.name);
var validateDependencies = ({
  seedConfigs,
  selectedSchemas
}) => {
  const missing = [];
  selectedSchemas.forEach((schema) => {
    const config3 = seedConfigs.find((c2) => c2.name === schema);
    if (config3?.dependencies) {
      const missingDeps = config3.dependencies.filter((dep) => !selectedSchemas.includes(dep));
      if (missingDeps.length > 0) {
        missing.push({ schema, dependencies: missingDeps });
      }
    }
  });
  return missing;
};
var getSortedSchemas = ({
  seedConfigs,
  selectedSchemas
}) => {
  const result = [];
  const visited = /* @__PURE__ */ new Set();
  function visit(schema) {
    if (visited.has(schema)) return;
    const config3 = seedConfigs.find((c2) => c2.name === schema);
    if (config3?.dependencies) {
      config3.dependencies.forEach((dep) => {
        if (selectedSchemas.includes(dep)) {
          visit(dep);
        }
      });
    }
    visited.add(schema);
    result.push(schema);
  }
  selectedSchemas.forEach((schema) => visit(schema));
  return result;
};
var getSchemaSelection = async ({ seedConfigs }) => {
  const schemasDir = path4.join(process.cwd(), PATH_FOLDER_SCHEMAS);
  if (!fs2.existsSync(schemasDir)) {
    console.error(source_default.red(`\u274C Schemas directory not found: ${schemasDir}`));
    process.exit(1);
  }
  const schemas = getAllSchemas({ seedConfigs }).filter((schema) => !SCHEMAS_BLOCKLIST.includes(schema));
  if (schemas.length === 0) {
    console.warn(source_default.yellow("\u26A0\uFE0F No schema files found"));
    return [];
  }
  const selectedSchemas = await checkbox({
    message: "Select schemas to process",
    choices: schemas.map((schema) => ({
      name: schema,
      value: schema,
      checked: true
    }))
  });
  const missingDeps = validateDependencies({ seedConfigs, selectedSchemas });
  if (missingDeps.length > 0) {
    console.error(source_default.red("\n\u274C Missing dependencies:"));
    missingDeps.forEach(({ schema, dependencies }) => {
      console.error(source_default.red(`  ${schema} requires: ${dependencies.join(", ")}`));
    });
    process.exit(1);
  }
  return getSortedSchemas({ seedConfigs, selectedSchemas });
};

// db-setup.config.ts
var viewConfigs = [
  {
    name: "orders_readable",
    description: "Database views (orders_readable) - created after all data is seeded"
    // dependencies: ['orders'], // TODO: views dependencies local or based on `seedConfigs` ??
  }
];

// ../apps/server/src/db/db.adapter.ts
var import_better_sqlite32 = __toESM(require_lib());

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/better-sqlite3/driver.js
var import_better_sqlite3 = __toESM(require_lib());

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/entity.js
var entityKind = Symbol.for("drizzle:entityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/logger.js
var ConsoleLogWriter = class {
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
};
var DefaultLogger = class {
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config3) {
    this.writer = config3?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p2) => {
      try {
        return JSON.stringify(p2);
      } catch {
        return String(p2);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
};
var NoopLogger = class {
  static [entityKind] = "NoopLogger";
  logQuery() {
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/table.utils.js
var TableName = Symbol.for("drizzle:Name");

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/table.js
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
  static [entityKind] = "Table";
  /** @internal */
  static Symbol = {
    Name: TableName,
    Schema,
    OriginalName,
    Columns,
    ExtraConfigColumns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [TableName];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName];
  /** @internal */
  [Schema];
  /** @internal */
  [Columns];
  /** @internal */
  [ExtraConfigColumns];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName];
  /** @internal */
  [IsAlias] = false;
  /** @internal */
  [IsDrizzleTable] = true;
  /** @internal */
  [ExtraConfigBuilder] = void 0;
  constructor(name, schema, baseName) {
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema;
    this[BaseName] = baseName;
  }
};
function getTableName(table) {
  return table[TableName];
}
function getTableUniqueName(table) {
  return `${table[Schema] ?? "public"}.${table[TableName]}`;
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/column.js
var Column = class {
  constructor(table, config3) {
    this.table = table;
    this.config = config3;
    this.name = config3.name;
    this.keyAsName = config3.keyAsName;
    this.notNull = config3.notNull;
    this.default = config3.default;
    this.defaultFn = config3.defaultFn;
    this.onUpdateFn = config3.onUpdateFn;
    this.hasDefault = config3.hasDefault;
    this.primary = config3.primaryKey;
    this.isUnique = config3.isUnique;
    this.uniqueName = config3.uniqueName;
    this.uniqueType = config3.uniqueType;
    this.dataType = config3.dataType;
    this.columnType = config3.columnType;
    this.generated = config3.generated;
    this.generatedIdentity = config3.generatedIdentity;
  }
  static [entityKind] = "Column";
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  generated = void 0;
  generatedIdentity = void 0;
  config;
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/column-builder.js
var ColumnBuilder = class {
  static [entityKind] = "ColumnBuilder";
  config;
  constructor(name, dataType, columnType) {
    this.config = {
      name,
      keyAsName: name === "",
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType,
      columnType,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    this.config.notNull = true;
    return this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $defaultFn}.
   */
  $default = this.$defaultFn;
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $onUpdateFn}.
   */
  $onUpdate = this.$onUpdateFn;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(name) {
    if (this.config.name !== "")
      return;
    this.config.name = name;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/pg-core/unique-constraint.js
function uniqueKeyName(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var PgColumn = class extends Column {
  constructor(table, config3) {
    if (!config3.uniqueName) {
      config3.uniqueName = uniqueKeyName(table, [config3.name]);
    }
    super(table, config3);
    this.table = table;
  }
  static [entityKind] = "PgColumn";
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/pg-core/columns/enum.js
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/subquery.js
var Subquery = class {
  static [entityKind] = "Subquery";
  constructor(sql2, selection, alias, isWith = false) {
    this._ = {
      brand: "Subquery",
      sql: sql2,
      selectedFields: selection,
      alias,
      isWith
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
};
var WithSubquery = class extends Subquery {
  static [entityKind] = "WithSubquery";
};
var tracer = {
  startActiveSpan(name, fn) {
    {
      return fn();
    }
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
var StringChunk = class {
  static [entityKind] = "StringChunk";
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
};
var SQL = class _SQL {
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
  }
  static [entityKind] = "SQL";
  /** @internal */
  decoder = noopDecoder;
  shouldInlineParams = false;
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config3) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config3);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config3 = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const {
      casing,
      escapeName,
      escapeParam,
      prepareTyping,
      inlineParams,
      paramStartIndex
    } = config3;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === void 0) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p2] of chunk.entries()) {
          result.push(p2);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config3);
      }
      if (is(chunk, _SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config3,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === void 0 ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        const columnName = casing.getColumnCasing(chunk);
        if (_config.invokeSource === "indexes") {
          return { sql: escapeName(columnName), params: [] };
        }
        const schemaName = chunk.table[Table.Symbol.Schema];
        return {
          sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
          params: []
        };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === void 0 ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        if (is(chunk.value, Placeholder)) {
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, _SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config3);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config3), params: [] };
        }
        let typings = ["none"];
        if (prepareTyping) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
      }
      if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk._.isWith) {
          return { sql: escapeName(chunk._.alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config3);
      }
      if (isPgEnum(chunk)) {
        if (chunk.schema) {
          return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
        }
        return { sql: escapeName(chunk.enumName), params: [] };
      }
      if (isSQLWrapper(chunk)) {
        if (chunk.shouldOmitSQLParens?.()) {
          return this.buildQueryFromSourceParams([chunk.getSQL()], config3);
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config3);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config3), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === void 0) {
      return this;
    }
    return new _SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(condition) {
    return condition ? this : void 0;
  }
};
var Name = class {
  constructor(value) {
    this.value = value;
  }
  static [entityKind] = "Name";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
var noopDecoder = {
  mapFromDriverValue: (value) => value
};
var noopEncoder = {
  mapToDriverValue: (value) => value
};
({
  ...noopDecoder,
  ...noopEncoder
});
var Param = class {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
  static [entityKind] = "Param";
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
((sql2) => {
  function empty() {
    return new SQL([]);
  }
  sql2.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  sql2.fromList = fromList;
  function raw(str) {
    return new SQL([new StringChunk(str)]);
  }
  sql2.raw = raw;
  function join(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== void 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  sql2.join = join;
  function identifier(value) {
    return new Name(value);
  }
  sql2.identifier = identifier;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
  class Aliased {
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    static [entityKind] = "SQL.Aliased";
    /** @internal */
    isSelectionField = false;
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
  constructor(name2) {
    this.name = name2;
  }
  static [entityKind] = "Placeholder";
  getSQL() {
    return new SQL([this]);
  }
};
function fillPlaceholders(params, values) {
  return params.map((p2) => {
    if (is(p2, Placeholder)) {
      if (!(p2.name in values)) {
        throw new Error(`No value for placeholder "${p2.name}" was provided`);
      }
      return values[p2.name];
    }
    if (is(p2, Param) && is(p2.value, Placeholder)) {
      if (!(p2.value.name in values)) {
        throw new Error(`No value for placeholder "${p2.value.name}" was provided`);
      }
      return p2.encoder.mapToDriverValue(values[p2.value.name]);
    }
    return p2;
  });
}
var View = class {
  static [entityKind] = "View";
  /** @internal */
  [ViewBaseConfig];
  constructor({ name: name2, schema, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
};
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Table.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path: path8, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path8.entries()) {
        if (pathChunkIndex < path8.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path8.length === 2) {
            const objectName = path8[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index, key] of leftKeys.entries()) {
    if (key !== rightKeys[index]) {
      return false;
    }
  }
  return true;
}
function mapUpdateSet(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL) || is(value, Column)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor")
        continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
function getTableColumns(table) {
  return table[Table.Symbol.Columns];
}
function getTableLikeName(table) {
  return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
function getColumnNameAndConfig(a, b2) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b2
  };
}
function isConfig(data) {
  if (typeof data !== "object" || data === null)
    return false;
  if (data.constructor.name !== "Object")
    return false;
  if ("logger" in data) {
    const type = typeof data["logger"];
    if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined")
      return false;
    return true;
  }
  if ("schema" in data) {
    const type = typeof data["logger"];
    if (type !== "object" && type !== "undefined")
      return false;
    return true;
  }
  if ("casing" in data) {
    const type = typeof data["logger"];
    if (type !== "string" && type !== "undefined")
      return false;
    return true;
  }
  if ("mode" in data) {
    if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0)
      return false;
    return true;
  }
  if ("connection" in data) {
    const type = typeof data["connection"];
    if (type !== "string" && type !== "object" && type !== "undefined")
      return false;
    return true;
  }
  if ("client" in data) {
    const type = typeof data["client"];
    if (type !== "object" && type !== "function" && type !== "undefined")
      return false;
    return true;
  }
  if (Object.keys(data).length === 0)
    return true;
  return false;
}
var PgChar = class extends PgColumn {
  static [entityKind] = "PgChar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
};
var PgUUID = class extends PgColumn {
  static [entityKind] = "PgUUID";
  getSQLType() {
    return "uuid";
  }
};
var PgVarchar = class extends PgColumn {
  static [entityKind] = "PgVarchar";
  length = this.config.length;
  enumValues = this.config.enumValues;
  getSQLType() {
    return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
var EnableRLS = Symbol.for("drizzle:EnableRLS");
var PgTable = class extends Table {
  static [entityKind] = "PgTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys,
    EnableRLS
  });
  /**@internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [EnableRLS] = false;
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/pg-core/primary-keys.js
var PrimaryKeyBuilder = class {
  static [entityKind] = "PgPrimaryKeyBuilder";
  /** @internal */
  columns;
  /** @internal */
  name;
  constructor(columns, name) {
    this.columns = columns;
    this.name = name;
  }
  /** @internal */
  build(table) {
    return new PrimaryKey(table, this.columns, this.name);
  }
};
var PrimaryKey = class {
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name;
  }
  static [entityKind] = "PgPrimaryKey";
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
var eq = (left, right) => {
  return sql`${left} = ${bindIfParam(right, left)}`;
};
var ne = (left, right) => {
  return sql`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c2) => c2 !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c2) => c2 !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
function not(condition) {
  return sql`not ${condition}`;
}
var gt = (left, right) => {
  return sql`${left} > ${bindIfParam(right, left)}`;
};
var gte = (left, right) => {
  return sql`${left} >= ${bindIfParam(right, left)}`;
};
var lt = (left, right) => {
  return sql`${left} < ${bindIfParam(right, left)}`;
};
var lte = (left, right) => {
  return sql`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`false`;
    }
    return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`true`;
    }
    return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
  return sql`${value} is null`;
}
function isNotNull(value) {
  return sql`${value} is not null`;
}
function exists(subquery) {
  return sql`exists ${subquery}`;
}
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
  return sql`${column} like ${value}`;
}
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/relations.js
var Relation = class {
  constructor(sourceTable, referencedTable, relationName) {
    this.sourceTable = sourceTable;
    this.referencedTable = referencedTable;
    this.relationName = relationName;
    this.referencedTableName = referencedTable[Table.Symbol.Name];
  }
  static [entityKind] = "Relation";
  referencedTableName;
  fieldName;
};
var Relations = class {
  constructor(table, config3) {
    this.table = table;
    this.config = config3;
  }
  static [entityKind] = "Relations";
};
var One = class _One extends Relation {
  constructor(sourceTable, referencedTable, config3, isNullable) {
    super(sourceTable, referencedTable, config3?.relationName);
    this.config = config3;
    this.isNullable = isNullable;
  }
  static [entityKind] = "One";
  withFieldName(fieldName) {
    const relation = new _One(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
var Many = class _Many extends Relation {
  constructor(sourceTable, referencedTable, config3) {
    super(sourceTable, referencedTable, config3?.relationName);
    this.config = config3;
  }
  static [entityKind] = "Many";
  withFieldName(fieldName) {
    const relation = new _Many(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
function extractTablesRelationalConfig(schema, configHelpers) {
  if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) {
    schema = schema["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema)) {
    if (is(value, Table)) {
      const dbName = getTableUniqueName(value);
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = getTableUniqueName(value.table);
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey2;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey: primaryKey2
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
function relations(table, relations2) {
  return new Relations(
    table,
    (helpers) => Object.fromEntries(
      Object.entries(relations2(helpers)).map(([key, value]) => [
        key,
        value.withFieldName(key)
      ])
    )
  );
}
function createOne(sourceTable) {
  return function one(table, config3) {
    return new One(
      sourceTable,
      table,
      config3,
      config3?.fields.reduce((res, f2) => res && f2.notNull, true) ?? false
    );
  };
}
function createMany(sourceTable) {
  return function many(referencedTable, config3) {
    return new Many(sourceTable, referencedTable, config3);
  };
}
function normalizeRelation(schema, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/alias.js
var ColumnAliasProxyHandler = class {
  constructor(table) {
    this.table = table;
  }
  static [entityKind] = "ColumnAliasProxyHandler";
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
};
var TableAliasProxyHandler = class {
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  static [entityKind] = "TableAliasProxyHandler";
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === ViewBaseConfig) {
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(
          columns[key],
          new ColumnAliasProxyHandler(new Proxy(target, this))
        );
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is(value, Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
};
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c2) => {
    if (is(c2, Column)) {
      return aliasedTableColumn(c2, alias);
    }
    if (is(c2, SQL)) {
      return mapColumnsInSQLToAlias(c2, alias);
    }
    if (is(c2, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c2, alias);
    }
    return c2;
  }));
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler = class _SelectionProxyHandler {
  static [entityKind] = "SelectionProxyHandler";
  config;
  constructor(config3) {
    this.config = { ...config3 };
  }
  get(subquery, prop) {
    if (prop === "_") {
      return {
        ...subquery["_"],
        selectedFields: new Proxy(
          subquery._.selectedFields,
          this
        )
      };
    }
    if (prop === ViewBaseConfig) {
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(
          subquery[ViewBaseConfig].selectedFields,
          this
        )
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if (is(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if (is(value, SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(
        `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    if (is(value, Column)) {
      if (this.config.alias) {
        return new Proxy(
          value,
          new ColumnAliasProxyHandler(
            new Proxy(
              value.table,
              new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
            )
          )
        );
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new _SelectionProxyHandler(this.config));
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/query-promise.js
var QueryPromise = class {
  static [entityKind] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/foreign-keys.js
var ForeignKeyBuilder2 = class {
  static [entityKind] = "SQLiteForeignKeyBuilder";
  /** @internal */
  reference;
  /** @internal */
  _onUpdate;
  /** @internal */
  _onDelete;
  constructor(config3, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config3();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action;
    return this;
  }
  /** @internal */
  build(table) {
    return new ForeignKey2(table, this);
  }
};
var ForeignKey2 = class {
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  static [entityKind] = "SQLiteForeignKey";
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/unique-constraint.js
function uniqueKeyName2(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/columns/common.js
var SQLiteColumnBuilder = class extends ColumnBuilder {
  static [entityKind] = "SQLiteColumnBuilder";
  foreignKeyConfigs = [];
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  generatedAlwaysAs(as, config3) {
    this.config.generated = {
      as,
      type: "always",
      mode: config3?.mode ?? "virtual"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return ((ref2, actions2) => {
        const builder = new ForeignKeyBuilder2(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table);
      })(ref, actions);
    });
  }
};
var SQLiteColumn = class extends Column {
  constructor(table, config3) {
    if (!config3.uniqueName) {
      config3.uniqueName = uniqueKeyName2(table, [config3.name]);
    }
    super(table, config3);
    this.table = table;
  }
  static [entityKind] = "SQLiteColumn";
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/columns/blob.js
var SQLiteBigIntBuilder = class extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteBigIntBuilder";
  constructor(name) {
    super(name, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(table) {
    return new SQLiteBigInt(table, this.config);
  }
};
var SQLiteBigInt = class extends SQLiteColumn {
  static [entityKind] = "SQLiteBigInt";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    return BigInt(Buffer.isBuffer(value) ? value.toString() : String.fromCodePoint(...value));
  }
  mapToDriverValue(value) {
    return Buffer.from(value.toString());
  }
};
var SQLiteBlobJsonBuilder = class extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteBlobJsonBuilder";
  constructor(name) {
    super(name, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(table) {
    return new SQLiteBlobJson(
      table,
      this.config
    );
  }
};
var SQLiteBlobJson = class extends SQLiteColumn {
  static [entityKind] = "SQLiteBlobJson";
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    return JSON.parse(Buffer.isBuffer(value) ? value.toString() : String.fromCodePoint(...value));
  }
  mapToDriverValue(value) {
    return Buffer.from(JSON.stringify(value));
  }
};
var SQLiteBlobBufferBuilder = class extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteBlobBufferBuilder";
  constructor(name) {
    super(name, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(table) {
    return new SQLiteBlobBuffer(table, this.config);
  }
};
var SQLiteBlobBuffer = class extends SQLiteColumn {
  static [entityKind] = "SQLiteBlobBuffer";
  getSQLType() {
    return "blob";
  }
};
function blob(a, b2) {
  const { name, config: config3 } = getColumnNameAndConfig(a, b2);
  if (config3?.mode === "json") {
    return new SQLiteBlobJsonBuilder(name);
  }
  if (config3?.mode === "bigint") {
    return new SQLiteBigIntBuilder(name);
  }
  return new SQLiteBlobBufferBuilder(name);
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/columns/custom.js
var SQLiteCustomColumnBuilder = class extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "SQLiteCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table) {
    return new SQLiteCustomColumn(
      table,
      this.config
    );
  }
};
var SQLiteCustomColumn = class extends SQLiteColumn {
  static [entityKind] = "SQLiteCustomColumn";
  sqlName;
  mapTo;
  mapFrom;
  constructor(table, config3) {
    super(table, config3);
    this.sqlName = config3.customTypeParams.dataType(config3.fieldConfig);
    this.mapTo = config3.customTypeParams.toDriver;
    this.mapFrom = config3.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
};
function customType(customTypeParams) {
  return (a, b2) => {
    const { name, config: config3 } = getColumnNameAndConfig(a, b2);
    return new SQLiteCustomColumnBuilder(
      name,
      config3,
      customTypeParams
    );
  };
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/columns/integer.js
var SQLiteBaseIntegerBuilder = class extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteBaseIntegerBuilder";
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  primaryKey(config3) {
    if (config3?.autoIncrement) {
      this.config.autoIncrement = true;
    }
    this.config.hasDefault = true;
    return super.primaryKey();
  }
};
var SQLiteBaseInteger = class extends SQLiteColumn {
  static [entityKind] = "SQLiteBaseInteger";
  autoIncrement = this.config.autoIncrement;
  getSQLType() {
    return "integer";
  }
};
var SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
  static [entityKind] = "SQLiteIntegerBuilder";
  constructor(name) {
    super(name, "number", "SQLiteInteger");
  }
  build(table) {
    return new SQLiteInteger(
      table,
      this.config
    );
  }
};
var SQLiteInteger = class extends SQLiteBaseInteger {
  static [entityKind] = "SQLiteInteger";
};
var SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
  static [entityKind] = "SQLiteTimestampBuilder";
  constructor(name, mode) {
    super(name, "date", "SQLiteTimestamp");
    this.config.mode = mode;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(table) {
    return new SQLiteTimestamp(
      table,
      this.config
    );
  }
};
var SQLiteTimestamp = class extends SQLiteBaseInteger {
  static [entityKind] = "SQLiteTimestamp";
  mode = this.config.mode;
  mapFromDriverValue(value) {
    if (this.config.mode === "timestamp") {
      return new Date(value * 1e3);
    }
    return new Date(value);
  }
  mapToDriverValue(value) {
    const unix = value.getTime();
    if (this.config.mode === "timestamp") {
      return Math.floor(unix / 1e3);
    }
    return unix;
  }
};
var SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
  static [entityKind] = "SQLiteBooleanBuilder";
  constructor(name, mode) {
    super(name, "boolean", "SQLiteBoolean");
    this.config.mode = mode;
  }
  build(table) {
    return new SQLiteBoolean(
      table,
      this.config
    );
  }
};
var SQLiteBoolean = class extends SQLiteBaseInteger {
  static [entityKind] = "SQLiteBoolean";
  mode = this.config.mode;
  mapFromDriverValue(value) {
    return Number(value) === 1;
  }
  mapToDriverValue(value) {
    return value ? 1 : 0;
  }
};
function integer(a, b2) {
  const { name, config: config3 } = getColumnNameAndConfig(a, b2);
  if (config3?.mode === "timestamp" || config3?.mode === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config3.mode);
  }
  if (config3?.mode === "boolean") {
    return new SQLiteBooleanBuilder(name, config3.mode);
  }
  return new SQLiteIntegerBuilder(name);
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/columns/numeric.js
var SQLiteNumericBuilder = class extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteNumericBuilder";
  constructor(name) {
    super(name, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(table) {
    return new SQLiteNumeric(
      table,
      this.config
    );
  }
};
var SQLiteNumeric = class extends SQLiteColumn {
  static [entityKind] = "SQLiteNumeric";
  getSQLType() {
    return "numeric";
  }
};
function numeric(name) {
  return new SQLiteNumericBuilder(name ?? "");
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/columns/real.js
var SQLiteRealBuilder = class extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteRealBuilder";
  constructor(name) {
    super(name, "number", "SQLiteReal");
  }
  /** @internal */
  build(table) {
    return new SQLiteReal(table, this.config);
  }
};
var SQLiteReal = class extends SQLiteColumn {
  static [entityKind] = "SQLiteReal";
  getSQLType() {
    return "real";
  }
};
function real(name) {
  return new SQLiteRealBuilder(name ?? "");
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/columns/text.js
var SQLiteTextBuilder = class extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteTextBuilder";
  constructor(name, config3) {
    super(name, "string", "SQLiteText");
    this.config.enumValues = config3.enum;
    this.config.length = config3.length;
  }
  /** @internal */
  build(table) {
    return new SQLiteText(table, this.config);
  }
};
var SQLiteText = class extends SQLiteColumn {
  static [entityKind] = "SQLiteText";
  enumValues = this.config.enumValues;
  length = this.config.length;
  constructor(table, config3) {
    super(table, config3);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
};
var SQLiteTextJsonBuilder = class extends SQLiteColumnBuilder {
  static [entityKind] = "SQLiteTextJsonBuilder";
  constructor(name) {
    super(name, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(table) {
    return new SQLiteTextJson(
      table,
      this.config
    );
  }
};
var SQLiteTextJson = class extends SQLiteColumn {
  static [entityKind] = "SQLiteTextJson";
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(value) {
    return JSON.parse(value);
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
};
function text(a, b2 = {}) {
  const { name, config: config3 } = getColumnNameAndConfig(a, b2);
  if (config3.mode === "json") {
    return new SQLiteTextJsonBuilder(name);
  }
  return new SQLiteTextBuilder(name, config3);
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/columns/all.js
function getSQLiteColumnBuilders() {
  return {
    blob,
    customType,
    integer,
    numeric,
    real,
    text
  };
}

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/table.js
var InlineForeignKeys2 = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var SQLiteTable = class extends Table {
  static [entityKind] = "SQLiteTable";
  /** @internal */
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys: InlineForeignKeys2
  });
  /** @internal */
  [Table.Symbol.Columns];
  /** @internal */
  [InlineForeignKeys2] = [];
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
};
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new SQLiteTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys2].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumns;
  return table;
}
var sqliteTable = (name, columns, extraConfig) => {
  return sqliteTableBase(name, columns);
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/query-builders/delete.js
var SQLiteDeleteBase = class extends QueryPromise {
  constructor(table, session2, dialect, withList) {
    super();
    this.table = table;
    this.session = session2;
    this.dialect = dialect;
    this.config = { table, withList };
  }
  static [entityKind] = "SQLiteDelete";
  /** @internal */
  config;
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.table[Table.Symbol.Columns],
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      this.config.orderBy = orderByArray;
    } else {
      const orderByArray = columns;
      this.config.orderBy = orderByArray;
    }
    return this;
  }
  limit(limit) {
    this.config.limit = limit;
    return this;
  }
  returning(fields = this.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = (placeholderValues) => {
    return this._prepare().run(placeholderValues);
  };
  all = (placeholderValues) => {
    return this._prepare().all(placeholderValues);
  };
  get = (placeholderValues) => {
    return this._prepare().get(placeholderValues);
  };
  values = (placeholderValues) => {
    return this._prepare().values(placeholderValues);
  };
  async execute(placeholderValues) {
    return this._prepare().execute(placeholderValues);
  }
  $dynamic() {
    return this;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.reduce((acc, word, i) => {
    const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
    return acc + formattedWord;
  }, "");
}
function noopCase(input) {
  return input;
}
var CasingCache = class {
  static [entityKind] = "CasingCache";
  /** @internal */
  cache = {};
  cachedTables = {};
  convert;
  constructor(casing) {
    this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
  }
  getColumnCasing(column) {
    if (!column.keyAsName)
      return column.name;
    const schema = column.table[Table.Symbol.Schema] ?? "public";
    const tableName = column.table[Table.Symbol.OriginalName];
    const key = `${schema}.${tableName}.${column.name}`;
    if (!this.cache[key]) {
      this.cacheTable(column.table);
    }
    return this.cache[key];
  }
  cacheTable(table) {
    const schema = table[Table.Symbol.Schema] ?? "public";
    const tableName = table[Table.Symbol.OriginalName];
    const tableKey = `${schema}.${tableName}`;
    if (!this.cachedTables[tableKey]) {
      for (const column of Object.values(table[Table.Symbol.Columns])) {
        const columnKey = `${tableKey}.${column.name}`;
        this.cache[columnKey] = this.convert(column.name);
      }
      this.cachedTables[tableKey] = true;
    }
  }
  clearCache() {
    this.cache = {};
    this.cachedTables = {};
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/errors.js
var DrizzleError = class extends Error {
  static [entityKind] = "DrizzleError";
  constructor({ message, cause }) {
    super(message);
    this.name = "DrizzleError";
    this.cause = cause;
  }
};
var TransactionRollbackError = class extends DrizzleError {
  static [entityKind] = "TransactionRollbackError";
  constructor() {
    super({ message: "Rollback" });
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/view-base.js
var SQLiteViewBase = class extends View {
  static [entityKind] = "SQLiteViewBase";
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/dialect.js
var SQLiteDialect = class {
  static [entityKind] = "SQLiteDialect";
  /** @internal */
  casing;
  constructor(config3) {
    this.casing = new CasingCache(config3?.casing);
  }
  escapeName(name) {
    return `"${name}"`;
  }
  escapeParam(_num) {
    return "?";
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!queries?.length)
      return void 0;
    const withSqlChunks = [sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1) {
        withSqlChunks.push(sql`, `);
      }
    }
    withSqlChunks.push(sql` `);
    return sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table, where, returning, withList, limit, orderBy }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    return sql`${withSql}delete from ${table}${whereSql}${returningSql}${orderBySql}${limitSql}`;
  }
  buildUpdateSet(table, set) {
    const tableColumns = table[Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter(
      (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
    );
    const setSize = columnNames.length;
    return sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const value = set[colName] ?? sql.param(col.onUpdateFn(), col);
      const res = sql`${sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
      if (i < setSize - 1) {
        return [res, sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning, withList, joins, from, limit, orderBy }) {
    const withSql = this.buildWithCTE(withList);
    const setSql = this.buildUpdateSet(table, set);
    const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
    const joinsSql = this.buildJoins(joins);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    return sql`${withSql}update ${table} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}${orderBySql}${limitSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if (is(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is(field, SQL.Aliased) || is(field, SQL)) {
        const query = is(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(
            new SQL(
              query.queryChunks.map((c2) => {
                if (is(c2, Column)) {
                  return sql.identifier(this.casing.getColumnCasing(c2));
                }
                return c2;
              })
            )
          );
        } else {
          chunk.push(query);
        }
        if (is(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is(field, Column)) {
        const tableName = field.table[Table.Symbol.Name];
        if (isSingleTable) {
          chunk.push(sql.identifier(this.casing.getColumnCasing(field)));
        } else {
          chunk.push(sql`${sql.identifier(tableName)}.${sql.identifier(this.casing.getColumnCasing(field))}`);
        }
      }
      if (i < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.join(chunks);
  }
  buildJoins(joins) {
    if (!joins || joins.length === 0) {
      return void 0;
    }
    const joinsArray = [];
    if (joins) {
      for (const [index, joinMeta] of joins.entries()) {
        if (index === 0) {
          joinsArray.push(sql` `);
        }
        const table = joinMeta.table;
        if (is(table, SQLiteTable)) {
          const tableName = table[SQLiteTable.Symbol.Name];
          const tableSchema = table[SQLiteTable.Symbol.Schema];
          const origTableName = table[SQLiteTable.Symbol.OriginalName];
          const alias = tableName === origTableName ? void 0 : joinMeta.alias;
          joinsArray.push(
            sql`${sql.raw(joinMeta.joinType)} join ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`
          );
        } else {
          joinsArray.push(
            sql`${sql.raw(joinMeta.joinType)} join ${table} on ${joinMeta.on}`
          );
        }
        if (index < joins.length - 1) {
          joinsArray.push(sql` `);
        }
      }
    }
    return sql.join(joinsArray);
  }
  buildLimit(limit) {
    return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
  }
  buildOrderBy(orderBy) {
    const orderByList = [];
    if (orderBy) {
      for (const [index, orderByValue] of orderBy.entries()) {
        orderByList.push(orderByValue);
        if (index < orderBy.length - 1) {
          orderByList.push(sql`, `);
        }
      }
    }
    return orderByList.length > 0 ? sql` order by ${sql.join(orderByList)}` : void 0;
  }
  buildFromTable(table) {
    if (is(table, Table) && table[Table.Symbol.OriginalName] !== table[Table.Symbol.Name]) {
      return sql`${sql.identifier(table[Table.Symbol.OriginalName])} ${sql.identifier(table[Table.Symbol.Name])}`;
    }
    return table;
  }
  buildSelectQuery({
    withList,
    fields,
    fieldsFlat,
    where,
    having,
    table,
    joins,
    orderBy,
    groupBy,
    limit,
    offset,
    distinct,
    setOperators
  }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f2 of fieldsList) {
      if (is(f2.field, Column) && getTableName(f2.field.table) !== (is(table, Subquery) ? table._.alias : is(table, SQLiteViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins?.some(
        ({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])
      ))(f2.field.table)) {
        const tableName = getTableName(f2.field.table);
        throw new Error(
          `Your "${f2.path.join("->")}" field references a column "${tableName}"."${f2.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
        );
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    const distinctSql = distinct ? sql` distinct` : void 0;
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = this.buildFromTable(table);
    const joinsSql = this.buildJoins(joins);
    const whereSql = where ? sql` where ${where}` : void 0;
    const havingSql = having ? sql` having ${having}` : void 0;
    const groupByList = [];
    if (groupBy) {
      for (const [index, groupByValue] of groupBy.entries()) {
        groupByList.push(groupByValue);
        if (index < groupBy.length - 1) {
          groupByList.push(sql`, `);
        }
      }
    }
    const groupBySql = groupByList.length > 0 ? sql` group by ${sql.join(groupByList)}` : void 0;
    const orderBySql = this.buildOrderBy(orderBy);
    const limitSql = this.buildLimit(limit);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
    if (setOperators.length > 0) {
      return this.buildSetOperations(finalQuery, setOperators);
    }
    return finalQuery;
  }
  buildSetOperations(leftSelect, setOperators) {
    const [setOperator, ...rest] = setOperators;
    if (!setOperator) {
      throw new Error("Cannot pass undefined values to any set operator");
    }
    if (rest.length === 0) {
      return this.buildSetOperationQuery({ leftSelect, setOperator });
    }
    return this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect, setOperator }),
      rest
    );
  }
  buildSetOperationQuery({
    leftSelect,
    setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
  }) {
    const leftChunk = sql`${leftSelect.getSQL()} `;
    const rightChunk = sql`${rightSelect.getSQL()}`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const singleOrderBy of orderBy) {
        if (is(singleOrderBy, SQLiteColumn)) {
          orderByValues.push(sql.identifier(singleOrderBy.name));
        } else if (is(singleOrderBy, SQL)) {
          for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
            const chunk = singleOrderBy.queryChunks[i];
            if (is(chunk, SQLiteColumn)) {
              singleOrderBy.queryChunks[i] = sql.identifier(this.casing.getColumnCasing(chunk));
            }
          }
          orderByValues.push(sql`${singleOrderBy}`);
        } else {
          orderByValues.push(sql`${singleOrderBy}`);
        }
      }
      orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)}`;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
    const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select }) {
    const valuesSqlList = [];
    const columns = table[Table.Symbol.Columns];
    const colEntries = Object.entries(columns).filter(
      ([_, col]) => !col.shouldDisableInsert()
    );
    const insertOrder = colEntries.map(([, column]) => sql.identifier(this.casing.getColumnCasing(column)));
    if (select) {
      const select2 = valuesOrSelect;
      if (is(select2, SQL)) {
        valuesSqlList.push(select2);
      } else {
        valuesSqlList.push(select2.getSQL());
      }
    } else {
      const values = valuesOrSelect;
      valuesSqlList.push(sql.raw("values "));
      for (const [valueIndex, value] of values.entries()) {
        const valueList = [];
        for (const [fieldName, col] of colEntries) {
          const colValue = value[fieldName];
          if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
            let defaultValue;
            if (col.default !== null && col.default !== void 0) {
              defaultValue = is(col.default, SQL) ? col.default : sql.param(col.default, col);
            } else if (col.defaultFn !== void 0) {
              const defaultFnResult = col.defaultFn();
              defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
            } else if (!col.default && col.onUpdateFn !== void 0) {
              const onUpdateFnResult = col.onUpdateFn();
              defaultValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
            } else {
              defaultValue = sql`null`;
            }
            valueList.push(defaultValue);
          } else {
            valueList.push(colValue);
          }
        }
        valuesSqlList.push(valueList);
        if (valueIndex < values.length - 1) {
          valuesSqlList.push(sql`, `);
        }
      }
    }
    const withSql = this.buildWithCTE(withList);
    const valuesSql = sql.join(valuesSqlList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const onConflictSql = onConflict ? sql` on conflict ${onConflict}` : void 0;
    return sql`${withSql}insert into ${table} ${insertOrder} ${valuesSql}${onConflictSql}${returningSql}`;
  }
  sqlToQuery(sql2, invokeSource) {
    return sql2.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      invokeSource
    });
  }
  buildRelationalQuery({
    fullSchema,
    schema,
    tableNamesMap,
    table,
    tableConfig,
    queryConfig: config3,
    tableAlias,
    nestedQueryRelation,
    joinOn
  }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    const joins = [];
    if (config3 === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(
        Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)])
      );
      if (config3.where) {
        const whereSql = typeof config3.where === "function" ? config3.where(aliasedColumns, getOperators()) : config3.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config3.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config3.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c2) => config3.columns?.[c2] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config3.with) {
        selectedRelations = Object.entries(config3.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config3.extras) {
        extras = typeof config3.extras === "function" ? config3.extras(aliasedColumns, { sql }) : config3.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config3.orderBy === "function" ? config3.orderBy(aliasedColumns, getOrderByOperators()) : config3.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config3.limit;
      offset = config3.offset;
      for (const {
        tsKey: selectedRelationTsKey,
        queryConfig: selectedRelationConfigValue,
        relation
      } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
        const relationTableName = getTableUniqueName(relation.referencedTable);
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(
          ...normalizedRelation.fields.map(
            (field2, i) => eq(
              aliasedTableColumn(normalizedRelation.references[i], relationTableAlias),
              aliasedTableColumn(field2, tableAlias)
            )
          )
        );
        const builtRelation = this.buildRelationalQuery({
          fullSchema,
          schema,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = sql`(${builtRelation.sql})`.as(selectedRelationTsKey);
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError({
        message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_array(${sql.join(
        selection.map(
          ({ field: field2 }) => is(field2, SQLiteColumn) ? sql.identifier(this.casing.getColumnCasing(field2)) : is(field2, SQL.Aliased) ? field2.sql : field2
        ),
        sql`, `
      )})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`coalesce(json_group_array(${field}), json_array())`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table, tableAlias),
          fields: {},
          fieldsFlat: [
            {
              path: [],
              field: sql.raw("*")
            }
          ],
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = void 0;
      } else {
        result = aliasedTable(table, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, SQLiteTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
};
var SQLiteSyncDialect = class extends SQLiteDialect {
  static [entityKind] = "SQLiteSyncDialect";
  migrate(migrations, session2, config3) {
    const migrationsTable = config3 === void 0 ? "__drizzle_migrations" : typeof config3 === "string" ? "__drizzle_migrations" : config3.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    session2.run(migrationTableCreate);
    const dbMigrations = session2.values(
      sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
    );
    const lastDbMigration = dbMigrations[0] ?? void 0;
    session2.run(sql`BEGIN`);
    try {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            session2.run(sql.raw(stmt));
          }
          session2.run(
            sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
      session2.run(sql`COMMIT`);
    } catch (e) {
      session2.run(sql`ROLLBACK`);
      throw e;
    }
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder = class {
  static [entityKind] = "TypedQueryBuilder";
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/query-builders/select.js
var SQLiteSelectBuilder = class {
  static [entityKind] = "SQLiteSelectBuilder";
  fields;
  session;
  dialect;
  withList;
  distinct;
  constructor(config3) {
    this.fields = config3.fields;
    this.session = config3.session;
    this.dialect = config3.dialect;
    this.withList = config3.withList;
    this.distinct = config3.distinct;
  }
  from(source) {
    const isPartialSelect = !!this.fields;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is(source, Subquery)) {
      fields = Object.fromEntries(
        Object.keys(source._.selectedFields).map((key) => [key, source[key]])
      );
    } else if (is(source, SQLiteViewBase)) {
      fields = source[ViewBaseConfig].selectedFields;
    } else if (is(source, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(source);
    }
    return new SQLiteSelectBase({
      table: source,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
};
var SQLiteSelectQueryBuilderBase = class extends TypedQueryBuilder {
  static [entityKind] = "SQLiteSelectQueryBuilder";
  _;
  /** @internal */
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  constructor({ table, fields, isPartialSelect, session: session2, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table,
      fields: { ...fields },
      distinct,
      setOperators: []
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session2;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields
    };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  createJoin(joinType) {
    return (table, on) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is(table, SQL)) {
          const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on === "function") {
        on = on(
          new Proxy(
            this.config.fields,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      if (!this.config.joins) {
        this.config.joins = [];
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  /**
   * Executes a `left join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet | null }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  leftJoin = this.createJoin("left");
  /**
   * Executes a `right join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  rightJoin = this.createJoin("right");
  /**
   * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  innerJoin = this.createJoin("inner");
  /**
   * Executes a `full join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet | null }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  fullJoin = this.createJoin("full");
  createSetOperator(type, isAll) {
    return (rightSelection) => {
      const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
      if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
      this.config.setOperators.push({ type, isAll, rightSelect });
      return this;
    };
  }
  /**
   * Adds `union` set operator to the query.
   *
   * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
   *
   * @example
   *
   * ```ts
   * // Select all unique names from customers and users tables
   * await db.select({ name: users.name })
   *   .from(users)
   *   .union(
   *     db.select({ name: customers.name }).from(customers)
   *   );
   * // or
   * import { union } from 'drizzle-orm/sqlite-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */
  union = this.createSetOperator("union", false);
  /**
   * Adds `union all` set operator to the query.
   *
   * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
   *
   * @example
   *
   * ```ts
   * // Select all transaction ids from both online and in-store sales
   * await db.select({ transaction: onlineSales.transactionId })
   *   .from(onlineSales)
   *   .unionAll(
   *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   *   );
   * // or
   * import { unionAll } from 'drizzle-orm/sqlite-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */
  unionAll = this.createSetOperator("union", true);
  /**
   * Adds `intersect` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
   *
   * @example
   *
   * ```ts
   * // Select course names that are offered in both departments A and B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .intersect(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { intersect } from 'drizzle-orm/sqlite-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  intersect = this.createSetOperator("intersect", false);
  /**
   * Adds `except` set operator to the query.
   *
   * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
   *
   * @example
   *
   * ```ts
   * // Select all courses offered in department A but not in department B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .except(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { except } from 'drizzle-orm/sqlite-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  except = this.createSetOperator("except", false);
  /** @internal */
  addSetOperators(setOperators) {
    this.config.setOperators.push(...setOperators);
    return this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    if (typeof where === "function") {
      where = where(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.where = where;
    return this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(having) {
    if (typeof having === "function") {
      having = having(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    } else {
      const orderByArray = columns;
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(limit) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).limit = limit;
    } else {
      this.config.limit = limit;
    }
    return this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(offset) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).offset = offset;
    } else {
      this.config.offset = offset;
    }
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    return new Proxy(
      new Subquery(this.getSQL(), this.config.fields, alias),
      new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
};
var SQLiteSelectBase = class extends SQLiteSelectQueryBuilderBase {
  static [entityKind] = "SQLiteSelect";
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    if (!this.session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    const fieldsList = orderSelectedFields(this.config.fields);
    const query = this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      fieldsList,
      "all",
      true
    );
    query.joinsNotNullableMap = this.joinsNotNullableMap;
    return query;
  }
  prepare() {
    return this._prepare(false);
  }
  run = (placeholderValues) => {
    return this._prepare().run(placeholderValues);
  };
  all = (placeholderValues) => {
    return this._prepare().all(placeholderValues);
  };
  get = (placeholderValues) => {
    return this._prepare().get(placeholderValues);
  };
  values = (placeholderValues) => {
    return this._prepare().values(placeholderValues);
  };
  async execute() {
    return this.all();
  }
};
applyMixins(SQLiteSelectBase, [QueryPromise]);
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select) => ({
      type,
      isAll,
      rightSelect: select
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
var getSQLiteSetOperators = () => ({
  union,
  unionAll,
  intersect,
  except
});
var union = createSetOperator("union", false);
var unionAll = createSetOperator("union", true);
var intersect = createSetOperator("intersect", false);
var except = createSetOperator("except", false);

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js
var QueryBuilder = class {
  static [entityKind] = "SQLiteQueryBuilder";
  dialect;
  dialectConfig;
  constructor(dialect) {
    this.dialect = is(dialect, SQLiteDialect) ? dialect : void 0;
    this.dialectConfig = is(dialect, SQLiteDialect) ? void 0 : dialect;
  }
  $with(alias) {
    const queryBuilder = this;
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(queryBuilder);
        }
        return new Proxy(
          new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true),
          new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
    };
  }
  with(...queries) {
    const self = this;
    function select(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries,
        distinct: true
      });
    }
    return { select, selectDistinct };
  }
  select(fields) {
    return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(fields) {
    return new SQLiteSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new SQLiteSyncDialect(this.dialectConfig);
    }
    return this.dialect;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/query-builders/insert.js
var SQLiteInsertBuilder = class {
  constructor(table, session2, dialect, withList) {
    this.table = table;
    this.session = session2;
    this.dialect = dialect;
    this.withList = withList;
  }
  static [entityKind] = "SQLiteInsertBuilder";
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
  }
  select(selectQuery) {
    const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
    if (!is(select, SQL) && !haveSameKeys(this.table[Columns], select._.selectedFields)) {
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    }
    return new SQLiteInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
  }
};
var SQLiteInsertBase = class extends QueryPromise {
  constructor(table, values, session2, dialect, withList, select) {
    super();
    this.session = session2;
    this.dialect = dialect;
    this.config = { table, values, withList, select };
  }
  static [entityKind] = "SQLiteInsert";
  /** @internal */
  config;
  returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(config3 = {}) {
    if (config3.target === void 0) {
      this.config.onConflict = sql`do nothing`;
    } else {
      const targetSql = Array.isArray(config3.target) ? sql`${config3.target}` : sql`${[config3.target]}`;
      const whereSql = config3.where ? sql` where ${config3.where}` : sql``;
      this.config.onConflict = sql`${targetSql} do nothing${whereSql}`;
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(config3) {
    if (config3.where && (config3.targetWhere || config3.setWhere)) {
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    }
    const whereSql = config3.where ? sql` where ${config3.where}` : void 0;
    const targetWhereSql = config3.targetWhere ? sql` where ${config3.targetWhere}` : void 0;
    const setWhereSql = config3.setWhere ? sql` where ${config3.setWhere}` : void 0;
    const targetSql = Array.isArray(config3.target) ? sql`${config3.target}` : sql`${[config3.target]}`;
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config3.set));
    this.config.onConflict = sql`${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = (placeholderValues) => {
    return this._prepare().run(placeholderValues);
  };
  all = (placeholderValues) => {
    return this._prepare().all(placeholderValues);
  };
  get = (placeholderValues) => {
    return this._prepare().get(placeholderValues);
  };
  values = (placeholderValues) => {
    return this._prepare().values(placeholderValues);
  };
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/query-builders/update.js
var SQLiteUpdateBuilder = class {
  constructor(table, session2, dialect, withList) {
    this.table = table;
    this.session = session2;
    this.dialect = dialect;
    this.withList = withList;
  }
  static [entityKind] = "SQLiteUpdateBuilder";
  set(values) {
    return new SQLiteUpdateBase(
      this.table,
      mapUpdateSet(this.table, values),
      this.session,
      this.dialect,
      this.withList
    );
  }
};
var SQLiteUpdateBase = class extends QueryPromise {
  constructor(table, set, session2, dialect, withList) {
    super();
    this.session = session2;
    this.dialect = dialect;
    this.config = { set, table, withList, joins: [] };
  }
  static [entityKind] = "SQLiteUpdate";
  /** @internal */
  config;
  from(source) {
    this.config.from = source;
    return this;
  }
  createJoin(joinType) {
    return (table, on) => {
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (typeof on === "function") {
        const from = this.config.from ? is(table, SQLiteTable) ? table[Table.Symbol.Columns] : is(table, Subquery) ? table._.selectedFields : is(table, SQLiteViewBase) ? table[ViewBaseConfig].selectedFields : void 0 : void 0;
        on = on(
          new Proxy(
            this.config.table[Table.Symbol.Columns],
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          from && new Proxy(
            from,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.table[Table.Symbol.Columns],
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      this.config.orderBy = orderByArray;
    } else {
      const orderByArray = columns;
      this.config.orderBy = orderByArray;
    }
    return this;
  }
  limit(limit) {
    this.config.limit = limit;
    return this;
  }
  returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = (placeholderValues) => {
    return this._prepare().run(placeholderValues);
  };
  all = (placeholderValues) => {
    return this._prepare().all(placeholderValues);
  };
  get = (placeholderValues) => {
    return this._prepare().get(placeholderValues);
  };
  values = (placeholderValues) => {
    return this._prepare().values(placeholderValues);
  };
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/query-builders/count.js
var SQLiteCountBuilder = class _SQLiteCountBuilder extends SQL {
  constructor(params) {
    super(_SQLiteCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
    this.params = params;
    this.session = params.session;
    this.sql = _SQLiteCountBuilder.buildCount(
      params.source,
      params.filters
    );
  }
  sql;
  static [entityKind] = "SQLiteCountBuilderAsync";
  [Symbol.toStringTag] = "SQLiteCountBuilderAsync";
  session;
  static buildEmbeddedCount(source, filters) {
    return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
  }
  static buildCount(source, filters) {
    return sql`select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters}`;
  }
  then(onfulfilled, onrejected) {
    return Promise.resolve(this.session.count(this.sql)).then(
      onfulfilled,
      onrejected
    );
  }
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/query-builders/query.js
var RelationalQueryBuilder = class {
  constructor(mode, fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session2) {
    this.mode = mode;
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session2;
  }
  static [entityKind] = "SQLiteAsyncRelationalQueryBuilder";
  findMany(config3) {
    return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config3 ? config3 : {},
      "many"
    ) : new SQLiteRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config3 ? config3 : {},
      "many"
    );
  }
  findFirst(config3) {
    return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config3 ? { ...config3, limit: 1 } : { limit: 1 },
      "first"
    ) : new SQLiteRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config3 ? { ...config3, limit: 1 } : { limit: 1 },
      "first"
    );
  }
};
var SQLiteRelationalQuery = class extends QueryPromise {
  constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session2, config3, mode) {
    super();
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session2;
    this.config = config3;
    this.mode = mode;
  }
  static [entityKind] = "SQLiteAsyncRelationalQuery";
  /** @internal */
  mode;
  /** @internal */
  getSQL() {
    return this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }).sql;
  }
  /** @internal */
  _prepare(isOneTimeQuery = false) {
    const { query, builtQuery } = this._toSQL();
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      builtQuery,
      void 0,
      this.mode === "first" ? "get" : "all",
      true,
      (rawRows, mapColumnValue) => {
        const rows = rawRows.map(
          (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
        );
        if (this.mode === "first") {
          return rows[0];
        }
        return rows;
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  _toSQL() {
    const query = this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return { query, builtQuery };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  /** @internal */
  executeRaw() {
    if (this.mode === "first") {
      return this._prepare(false).get();
    }
    return this._prepare(false).all();
  }
  async execute() {
    return this.executeRaw();
  }
};
var SQLiteSyncRelationalQuery = class extends SQLiteRelationalQuery {
  static [entityKind] = "SQLiteSyncRelationalQuery";
  sync() {
    return this.executeRaw();
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/query-builders/raw.js
var SQLiteRaw = class extends QueryPromise {
  constructor(execute, getSQL, action, dialect, mapBatchResult) {
    super();
    this.execute = execute;
    this.getSQL = getSQL;
    this.dialect = dialect;
    this.mapBatchResult = mapBatchResult;
    this.config = { action };
  }
  static [entityKind] = "SQLiteRaw";
  /** @internal */
  config;
  getQuery() {
    return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
  }
  mapResult(result, isFromBatch) {
    return isFromBatch ? this.mapBatchResult(result) : result;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return false;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/db.js
var BaseSQLiteDatabase = class {
  constructor(resultKind, dialect, session2, schema) {
    this.resultKind = resultKind;
    this.dialect = dialect;
    this.session = session2;
    this._ = schema ? {
      schema: schema.schema,
      fullSchema: schema.fullSchema,
      tableNamesMap: schema.tableNamesMap
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {}
    };
    this.query = {};
    const query = this.query;
    if (this._.schema) {
      for (const [tableName, columns] of Object.entries(this._.schema)) {
        query[tableName] = new RelationalQueryBuilder(
          resultKind,
          schema.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          schema.fullSchema[tableName],
          columns,
          dialect,
          session2
        );
      }
    }
  }
  static [entityKind] = "BaseSQLiteDatabase";
  query;
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with(alias) {
    const self = this;
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(new QueryBuilder(self.dialect));
        }
        return new Proxy(
          new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true),
          new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
    };
  }
  $count(source, filters) {
    return new SQLiteCountBuilder({ source, filters, session: this.session });
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...queries) {
    const self = this;
    function select(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: true
      });
    }
    function update(table) {
      return new SQLiteUpdateBuilder(table, self.session, self.dialect, queries);
    }
    function insert(into) {
      return new SQLiteInsertBuilder(into, self.session, self.dialect, queries);
    }
    function delete_(from) {
      return new SQLiteDeleteBase(from, self.session, self.dialect, queries);
    }
    return { select, selectDistinct, update, insert, delete: delete_ };
  }
  select(fields) {
    return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(fields) {
    return new SQLiteSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(table) {
    return new SQLiteUpdateBuilder(table, this.session, this.dialect);
  }
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(into) {
    return new SQLiteInsertBuilder(into, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(from) {
    return new SQLiteDeleteBase(from, this.session, this.dialect);
  }
  run(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.run(sequel),
        () => sequel,
        "run",
        this.dialect,
        this.session.extractRawRunValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.run(sequel);
  }
  all(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.all(sequel),
        () => sequel,
        "all",
        this.dialect,
        this.session.extractRawAllValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.all(sequel);
  }
  get(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.get(sequel),
        () => sequel,
        "get",
        this.dialect,
        this.session.extractRawGetValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.get(sequel);
  }
  values(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.values(sequel),
        () => sequel,
        "values",
        this.dialect,
        this.session.extractRawValuesValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.values(sequel);
  }
  transaction(transaction, config3) {
    return this.session.transaction(transaction, config3);
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/sqlite-core/session.js
var ExecuteResultSync = class extends QueryPromise {
  constructor(resultCb) {
    super();
    this.resultCb = resultCb;
  }
  static [entityKind] = "ExecuteResultSync";
  async execute() {
    return this.resultCb();
  }
  sync() {
    return this.resultCb();
  }
};
var SQLitePreparedQuery = class {
  constructor(mode, executeMethod, query) {
    this.mode = mode;
    this.executeMethod = executeMethod;
    this.query = query;
  }
  static [entityKind] = "PreparedQuery";
  /** @internal */
  joinsNotNullableMap;
  getQuery() {
    return this.query;
  }
  mapRunResult(result, _isFromBatch) {
    return result;
  }
  mapAllResult(_result, _isFromBatch) {
    throw new Error("Not implemented");
  }
  mapGetResult(_result, _isFromBatch) {
    throw new Error("Not implemented");
  }
  execute(placeholderValues) {
    if (this.mode === "async") {
      return this[this.executeMethod](placeholderValues);
    }
    return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
  }
  mapResult(response, isFromBatch) {
    switch (this.executeMethod) {
      case "run": {
        return this.mapRunResult(response, isFromBatch);
      }
      case "all": {
        return this.mapAllResult(response, isFromBatch);
      }
      case "get": {
        return this.mapGetResult(response, isFromBatch);
      }
    }
  }
};
var SQLiteSession = class {
  constructor(dialect) {
    this.dialect = dialect;
  }
  static [entityKind] = "SQLiteSession";
  prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode) {
    return this.prepareQuery(query, fields, executeMethod, isResponseInArrayMode);
  }
  run(query) {
    const staticQuery = this.dialect.sqlToQuery(query);
    try {
      return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
    } catch (err) {
      throw new DrizzleError({ cause: err, message: `Failed to run the query '${staticQuery.sql}'` });
    }
  }
  /** @internal */
  extractRawRunValueFromBatchResult(result) {
    return result;
  }
  all(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
  }
  /** @internal */
  extractRawAllValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
  get(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
  }
  /** @internal */
  extractRawGetValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
  values(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
  }
  async count(sql2) {
    const result = await this.values(sql2);
    return result[0][0];
  }
  /** @internal */
  extractRawValuesValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
};
var SQLiteTransaction = class extends BaseSQLiteDatabase {
  constructor(resultType, dialect, session2, schema, nestedIndex = 0) {
    super(resultType, dialect, session2, schema);
    this.schema = schema;
    this.nestedIndex = nestedIndex;
  }
  static [entityKind] = "SQLiteTransaction";
  rollback() {
    throw new TransactionRollbackError();
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/better-sqlite3/session.js
var BetterSQLiteSession = class extends SQLiteSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.logger = options.logger ?? new NoopLogger();
  }
  static [entityKind] = "BetterSQLiteSession";
  logger;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
    const stmt = this.client.prepare(query.sql);
    return new PreparedQuery(
      stmt,
      query,
      this.logger,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  transaction(transaction, config3 = {}) {
    const tx = new BetterSQLiteTransaction("sync", this.dialect, this, this.schema);
    const nativeTx = this.client.transaction(transaction);
    return nativeTx[config3.behavior ?? "deferred"](tx);
  }
};
var BetterSQLiteTransaction = class _BetterSQLiteTransaction extends SQLiteTransaction {
  static [entityKind] = "BetterSQLiteTransaction";
  transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new _BetterSQLiteTransaction("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = transaction(tx);
      this.session.run(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
};
var PreparedQuery = class extends SQLitePreparedQuery {
  constructor(stmt, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("sync", executeMethod, query);
    this.stmt = stmt;
    this.logger = logger;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  static [entityKind] = "BetterSQLitePreparedQuery";
  run(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.run(...params);
  }
  all(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return stmt.all(...params);
    }
    const rows = this.values(placeholderValues);
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  get(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const { fields, stmt, joinsNotNullableMap, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return stmt.get(...params);
    }
    const row = stmt.raw().get(...params);
    if (!row) {
      return void 0;
    }
    if (customResultMapper) {
      return customResultMapper([row]);
    }
    return mapResultRow(fields, row, joinsNotNullableMap);
  }
  values(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.raw().all(...params);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
};

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/better-sqlite3/driver.js
var BetterSQLite3Database = class extends BaseSQLiteDatabase {
  static [entityKind] = "BetterSQLite3Database";
};
function construct(client, config3 = {}) {
  const dialect = new SQLiteSyncDialect({ casing: config3.casing });
  let logger;
  if (config3.logger === true) {
    logger = new DefaultLogger();
  } else if (config3.logger !== false) {
    logger = config3.logger;
  }
  let schema;
  if (config3.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config3.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config3.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session2 = new BetterSQLiteSession(client, dialect, schema, { logger });
  const db2 = new BetterSQLite3Database("sync", dialect, session2, schema);
  db2.$client = client;
  return db2;
}
function drizzle(...params) {
  if (params[0] === void 0 || typeof params[0] === "string") {
    const instance = params[0] === void 0 ? new import_better_sqlite3.default() : new import_better_sqlite3.default(params[0]);
    return construct(instance, params[1]);
  }
  if (isConfig(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client)
      return construct(client, drizzleConfig);
    if (typeof connection === "object") {
      const { source, ...options } = connection;
      const instance2 = new import_better_sqlite3.default(source, options);
      return construct(instance2, drizzleConfig);
    }
    const instance = new import_better_sqlite3.default(connection);
    return construct(instance, drizzleConfig);
  }
  return construct(params[0], params[1]);
}
((drizzle2) => {
  function mock(config3) {
    return construct({}, config3);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path: path8, errorMaps, issueData } = params;
  const fullPath = [...path8, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m2) => !!m2).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// ../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path8, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path8;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ; else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b2) {
  const aType = getParsedType(a);
  const bType = getParsedType(b2);
  if (a === b2) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b2);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b2 };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b2[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b2.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b2[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b2) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b2) {
    return new _ZodPipeline({
      in: a,
      out: b2,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p2 = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p22 = typeof p2 === "string" ? { message: p2 } : p2;
  return p22;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;

// ../apps/server/src/env.shared.ts
var import_dotenvx = __toESM(require_main3());
var findRootDir = () => {
  let currentDir = process.cwd();
  while (currentDir !== path4.parse(currentDir).root) {
    if (fs2.existsSync(path4.join(currentDir, "pnpm-workspace.yaml"))) {
      return currentDir;
    }
    if (fs2.existsSync(path4.join(currentDir, "package.json"))) {
      const pkg = JSON.parse(fs2.readFileSync(path4.join(currentDir, "package.json"), "utf8"));
      if (pkg.name === "touch-monorepo") {
        return currentDir;
      }
    }
    currentDir = path4.dirname(currentDir);
  }
  return process.cwd();
};
var rootDir = findRootDir();
var NODE_ENV_VALUE = process.env.NODE_ENV || "development";
var envPaths = [path4.resolve(rootDir, `.env.${NODE_ENV_VALUE}`), path4.resolve(rootDir, ".env")];
var debug = process.env.DEBUG_DEPLOYMENT === "1";
if (debug) {
  console.log("[env.shared] resolving env file", {
    NODE_ENV_VALUE,
    rootDir,
    envPaths
  });
}
for (const envPath2 of envPaths) {
  if (fs2.existsSync(envPath2)) {
    if (debug) console.log("[env.shared] loading env file:", envPath2);
    (0, import_dotenvx.config)({ path: envPath2 });
    break;
  }
}
var envSharedSchema = external_exports.object({
  NODE_ENV: external_exports.enum(["development", "production", "test"]).default("development"),
  API_PROTOCOL: external_exports.enum(["http", "https"]).default("http"),
  API_HOST: external_exports.string().default("localhost"),
  API_PORT: external_exports.number().default(4040),
  API_BASE_PATH: external_exports.string().default("/api"),
  CLIENT_PROTOCOL: external_exports.enum(["http", "https"]).default("http"),
  CLIENT_HOST: external_exports.string().default("localhost"),
  CLIENT_PORT: external_exports.number().default(3e3)
}).transform((env3) => ({
  ...env3,
  API_URL: `${env3.API_PROTOCOL}://${env3.API_HOST}:${env3.API_PORT}${env3.API_BASE_PATH || ""}`,
  API_BASE_URL: `${env3.API_PROTOCOL}://${env3.API_HOST}:${env3.API_PORT}`,
  CLIENT_ORIGIN: `${env3.CLIENT_PROTOCOL}://${env3.CLIENT_HOST}:${env3.CLIENT_PORT}`
}));
var envShared = envSharedSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  API_PROTOCOL: process.env.API_PROTOCOL,
  API_HOST: process.env.API_HOST,
  API_PORT: Number(process.env.API_PORT),
  API_BASE_PATH: process.env.API_BASE_PATH,
  CLIENT_ORIGIN: process.env.ORIGIN,
  CLIENT_HOST: process.env.CLIENT_HOST,
  CLIENT_PORT: Number(process.env.CLIENT_PORT)
});
var dataDir = process.env.DATA_DIR || "data";
var logsDir = process.env.LOGS_DIR || "logs";
var uploadsDir = process.env.UPLOADS_DIR || path4.join(dataDir, "uploads");
var paths = {
  data: {
    dir: path4.join(rootDir, dataDir)},
  uploads: {
    dir: path4.join(rootDir, uploadsDir)},
  logs: {
    dir: path4.join(rootDir, logsDir)}
};

// ../apps/server/src/env.server.ts
var envServerSchema = external_exports.object({
  DB_HOST: external_exports.string(),
  DB_USER: external_exports.string(),
  DB_PASS: external_exports.string().optional(),
  DB_NAME: external_exports.string(),
  DB_DIALECT: external_exports.enum(["sqlite", "mysql", "postgres"]),
  DB_PORT: external_exports.number(),
  BETTER_AUTH_SECRET: external_exports.string().min(32),
  BETTER_AUTH_URL: external_exports.string().url()
}).transform((env3) => ({
  ...env3,
  DB_PATH: process.env.DB_PATH || path4.resolve(paths.data.dir, env3.DB_NAME)
}));
var envServerValidated = envServerSchema.parse({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_PORT: Number(process.env.DB_PORT),
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL
});
var env2 = {
  ...envShared,
  ...envServerValidated
};

// ../apps/server/src/db/schemas/index.ts
var schemas_exports = {};
__export(schemas_exports, {
  account: () => account,
  containerTypeSchemas: () => containerTypeSchemas,
  container_types: () => container_types,
  drinkSubtypeSchemas: () => drinkSubtypeSchemas,
  drinkTypeSchemas: () => drinkTypeSchemas,
  drink_subtypes: () => drink_subtypes,
  drink_types: () => drink_types,
  modeRelations: () => modeRelations,
  modeSchemas: () => modeSchemas,
  modes: () => modes,
  orderSchemas: () => orderSchemas,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  orders_readable: () => orders_readable,
  session: () => session,
  slot_configurations: () => slot_configurations,
  supportedLanguageSchemas: () => supportedLanguageSchemas,
  supported_languages: () => supported_languages,
  temperatureProfileSchemas: () => temperatureProfileSchemas,
  temperatureProfilesRelations: () => temperatureProfilesRelations,
  temperature_profiles: () => temperature_profiles,
  translatableEntitySchemas: () => translatableEntitySchemas,
  translatable_entities: () => translatable_entities,
  user: () => user,
  userSchemas: () => userSchemas,
  verification: () => verification,
  volumeSchemas: () => volumeSchemas,
  volumes: () => volumes
});

// ../node_modules/.pnpm/drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23_better-sqlite3@11.9.0_kysely@0.28.5_react@18.3.1/node_modules/drizzle-orm/mysql-core/unique-constraint.js
function uniqueKeyName3(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var MySqlColumn = class extends Column {
  constructor(table, config3) {
    if (!config3.uniqueName) {
      config3.uniqueName = uniqueKeyName3(table, [config3.name]);
    }
    super(table, config3);
    this.table = table;
  }
  static [entityKind] = "MySqlColumn";
};
var MySqlChar = class extends MySqlColumn {
  static [entityKind] = "MySqlChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `char` : `char(${this.length})`;
  }
};
var MySqlVarBinary = class extends MySqlColumn {
  static [entityKind] = "MySqlVarBinary";
  length = this.config.length;
  getSQLType() {
    return this.length === void 0 ? `varbinary` : `varbinary(${this.length})`;
  }
};
var MySqlVarChar = class extends MySqlColumn {
  static [entityKind] = "MySqlVarChar";
  length = this.config.length;
  enumValues = this.config.enum;
  getSQLType() {
    return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
  }
};

// ../node_modules/.pnpm/drizzle-zod@0.5.1_drizzle-orm@0.36.4_@types+better-sqlite3@7.6.13_@types+react@18.3.23__fd06058232b61455879bbfc7e572b8dd/node_modules/drizzle-zod/index.mjs
var m = external_exports.union([external_exports.string(), external_exports.number(), external_exports.boolean(), external_exports.null()]);
var f = external_exports.lazy(() => external_exports.union([m, external_exports.array(f), external_exports.record(f)]));
function c(t, n) {
  const r = getTableColumns(t), o = Object.entries(r);
  let i = Object.fromEntries(o.map(([e, t2]) => [e, p(t2)]));
  n && (i = Object.assign(i, Object.fromEntries(Object.entries(n).map(([e, t2]) => [e, "function" == typeof t2 ? t2(i) : t2]))));
  for (const [e, t2] of o) t2.notNull ? t2.hasDefault && (i[e] = i[e].optional()) : i[e] = i[e].nullable().optional();
  return external_exports.object(i);
}
function b(t, n) {
  const r = getTableColumns(t), o = Object.entries(r);
  let i = Object.fromEntries(o.map(([e, t2]) => [e, p(t2)]));
  n && (i = Object.assign(i, Object.fromEntries(Object.entries(n).map(([e, t2]) => [e, "function" == typeof t2 ? t2(i) : t2]))));
  for (const [e, t2] of o) t2.notNull || (i[e] = i[e].nullable());
  return external_exports.object(i);
}
function p(e) {
  let m2;
  if (function(e2) {
    return "enumValues" in e2 && Array.isArray(e2.enumValues) && e2.enumValues.length > 0;
  }(e) && (m2 = e.enumValues.length ? external_exports.enum(e.enumValues) : external_exports.string()), !m2) {
    if (is(e, PgUUID)) m2 = external_exports.string().uuid();
    else if ("custom" === e.dataType) m2 = external_exports.any();
    else if ("json" === e.dataType) m2 = f;
    else if ("array" === e.dataType) m2 = external_exports.array(p(e.baseColumn));
    else if ("number" === e.dataType) m2 = external_exports.number();
    else if ("bigint" === e.dataType) m2 = external_exports.bigint();
    else if ("boolean" === e.dataType) m2 = external_exports.boolean();
    else if ("date" === e.dataType) m2 = external_exports.date();
    else if ("string" === e.dataType) {
      let i = external_exports.string();
      (is(e, PgChar) || is(e, PgVarchar) || is(e, MySqlVarChar) || is(e, MySqlVarBinary) || is(e, MySqlChar) || is(e, SQLiteText)) && "number" == typeof e.length && (i = i.max(e.length)), m2 = i;
    }
  }
  return m2 || (m2 = external_exports.any()), m2;
}

// ../apps/server/src/db/schemas/auth_user.schema.ts
var user = sqliteTable("auth_user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});
var insertUserSchema = c(user).omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true
});
var userSchemas = {
  select: b(user),
  patch: insertUserSchema.partial()
};

// ../apps/server/src/db/schemas/auth_account.schema.ts
var account = sqliteTable("auth_account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

// ../apps/server/src/db/schemas/auth_session.schema.ts
var session = sqliteTable("auth_session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id)
});

// ../apps/server/src/db/schemas/auth_verification.schema.ts
var verification = sqliteTable("auth_verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
});

// ../apps/server/src/db/schemas/container_types.schema.ts
var import_cuid = __toESM(require_cuid());

// ../apps/server/src/lib/zod-utils.ts
function sqliteBooleanField(defaultValue) {
  const baseSchema = external_exports.union([
    external_exports.boolean(),
    // Accept actual booleans
    external_exports.number().int().min(0).max(1),
    // Accept 0 or 1
    external_exports.literal("true").transform(() => true),
    // Accept string 'true'
    external_exports.literal("false").transform(() => false),
    // Accept string 'false'
    external_exports.literal("1").transform(() => true),
    // Accept string '1'
    external_exports.literal("0").transform(() => false)
    // Accept string '0'
  ]).transform((value) => {
    if (typeof value === "boolean") {
      return value ? 1 : 0;
    }
    return value;
  });
  return defaultValue !== void 0 ? baseSchema.default(0) : baseSchema;
}

// ../apps/server/src/db/schemas/container_types.schema.ts
var container_types = sqliteTable("container_types", {
  id: text("id").primaryKey().$defaultFn(() => (0, import_cuid.default)()),
  name: text("name").notNull().unique(),
  // Internal name: 'plastic', 'glass', 'metal'
  // JSON translations column for dynamic language support
  translations: text("translations", { mode: "json" }).$type().notNull().default({ "en-GB": "" }),
  thermalConductivity: integer("thermal_conductivity").notNull(),
  // Affects cooling time
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date())
});
var insertContainerTypeSchema = c(container_types, {
  name: (schema) => schema.name.min(1).max(50),
  thermalConductivity: (schema) => schema.thermalConductivity.min(1).max(100),
  // Scale of 1-100
  isActive: () => sqliteBooleanField()
  // Handle boolean/integer conversion
}).required({
  name: true,
  thermalConductivity: true
}).omit({ id: true, createdAt: true, updatedAt: true });
var patchContainerTypeSchema = insertContainerTypeSchema.partial().extend({
  translations: b(container_types).shape.translations.optional(),
  isActive: sqliteBooleanField().optional()
  // Handle boolean/integer conversion for PATCH
});
var containerTypeSchemas = {
  select: b(container_types, {
    translations: (schema) => schema.translations.optional()
    // Simplified schema for translations
  }),
  insert: insertContainerTypeSchema,
  patch: patchContainerTypeSchema
};

// ../apps/server/src/db/schemas/drink_subtypes.schema.ts
var import_cuid3 = __toESM(require_cuid());

// ../apps/server/src/db/schemas/drink_types.schema.ts
var import_cuid2 = __toESM(require_cuid());
var drink_types = sqliteTable("drink_types", {
  id: text("id").primaryKey().$defaultFn(() => (0, import_cuid2.default)()),
  name: text("name").notNull().unique(),
  // e.g., 'Cerveza', 'Vino', 'Licor', etc.
  // JSON translations column for dynamic language support
  translations: text("translations", { mode: "json" }).$type().notNull().default({ "en-GB": "" }),
  hasSubtypes: integer("has_subtypes", { mode: "boolean" }).notNull().default(false),
  defaultTempConsume: integer("default_temp_consume").notNull(),
  // in Celsius
  defaultTempFreeze: integer("default_temp_freeze").notNull(),
  // in Celsius
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date())
});
var insertDrinkTypeSchema = c(drink_types, {
  name: (schema) => schema.name.min(1).max(50),
  defaultTempConsume: (schema) => schema.defaultTempConsume.min(-10).max(30),
  defaultTempFreeze: (schema) => schema.defaultTempFreeze.min(-20).max(10),
  hasSubtypes: () => sqliteBooleanField(),
  // Handle boolean/integer conversion
  isActive: () => sqliteBooleanField()
  // Handle boolean/integer conversion
}).required({
  name: true,
  defaultTempConsume: true,
  defaultTempFreeze: true
}).omit({ id: true, createdAt: true, updatedAt: true });
var patchDrinkTypeSchema = insertDrinkTypeSchema.partial().extend({
  translations: b(drink_types).shape.translations.optional(),
  hasSubtypes: sqliteBooleanField().optional(),
  // Handle boolean/integer conversion for PATCH
  isActive: sqliteBooleanField().optional()
  // Handle boolean/integer conversion for PATCH
});
var drinkTypeSchemas = {
  select: b(drink_types, {
    translations: (schema) => schema.translations.optional()
    // Simplified schema for translations
  }),
  insert: insertDrinkTypeSchema,
  patch: patchDrinkTypeSchema
};

// ../apps/server/src/db/schemas/drink_subtypes.schema.ts
var drink_subtypes = sqliteTable("drink_subtypes", {
  id: text("id").primaryKey().$defaultFn(() => (0, import_cuid3.default)()),
  drinkTypeId: text("drink_type_id").notNull().references(() => drink_types.id, { onDelete: "cascade" }),
  name: text("name").notNull().unique(),
  // e.g., 'Rubia', 'Negra'
  // JSON translations column for dynamic language support
  translations: text("translations", { mode: "json" }).$type().notNull().default({ "en-GB": "" }),
  defaultTempConsume: integer("default_temp_consume").notNull(),
  // Can override parent's default
  defaultTempFreeze: integer("default_temp_freeze").notNull(),
  // Can override parent's default
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date())
});
var insertDrinkSubtypeSchema = c(drink_subtypes, {
  name: (schema) => schema.name.min(1).max(50),
  defaultTempConsume: (schema) => schema.defaultTempConsume.min(-10).max(30),
  defaultTempFreeze: (schema) => schema.defaultTempFreeze.min(-20).max(10),
  isActive: () => sqliteBooleanField()
  // Handle boolean/integer conversion
}).required({
  drinkTypeId: true,
  name: true,
  defaultTempConsume: true,
  defaultTempFreeze: true
}).omit({ id: true, createdAt: true, updatedAt: true });
var patchDrinkSubtypeSchema = insertDrinkSubtypeSchema.partial().extend({
  translations: b(drink_subtypes).shape.translations.optional(),
  isActive: sqliteBooleanField().optional()
  // Handle boolean/integer conversion for PATCH
});
var drinkSubtypeSchemas = {
  select: b(drink_subtypes, {
    translations: (schema) => schema.translations.optional()
    // Simplified schema for translations
  }),
  insert: insertDrinkSubtypeSchema,
  patch: patchDrinkSubtypeSchema
};

// ../apps/server/src/db/schemas/orders.schema.ts
var import_cuid5 = __toESM(require_cuid());

// ../apps/server/src/db/schemas/volumes.schema.ts
var import_cuid4 = __toESM(require_cuid());
var volumes = sqliteTable("volumes", {
  id: text("id").primaryKey().$defaultFn(() => (0, import_cuid4.default)()),
  name: text("name").notNull().unique(),
  // Internal key: '25cl', '1l', etc.
  // JSON translations column for dynamic language support
  translations: text("translations", { mode: "json" }).$type().notNull().default({ "en-GB": "" }),
  valueInMl: integer("value_in_ml").notNull(),
  // Normalized to milliliters
  sortOrder: integer("sort_order").notNull(),
  // For display ordering
  coolingFactor: real("cooling_factor").notNull().default(1),
  // Multiplier for cooling time
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date())
});
var insertVolumeSchema = c(volumes, {
  name: (schema) => schema.name.min(1).max(20),
  valueInMl: (schema) => schema.valueInMl.min(1).max(5e3),
  // Up to 5L
  sortOrder: (schema) => schema.sortOrder.min(0),
  coolingFactor: (schema) => schema.coolingFactor.min(0.1).max(5),
  // Reasonable range for multiplier
  isActive: () => sqliteBooleanField()
  // Handle boolean/integer conversion
}).required({
  name: true,
  valueInMl: true,
  sortOrder: true
}).omit({ id: true, createdAt: true, updatedAt: true });
var patchVolumeSchema = insertVolumeSchema.partial().extend({
  translations: b(volumes).shape.translations.optional(),
  isActive: sqliteBooleanField().optional()
  // Handle boolean/integer conversion for PATCH
});
var volumeSchemas = {
  select: b(volumes, {
    translations: (schema) => schema.translations.optional()
    // Simplified schema for translations
  }),
  insert: insertVolumeSchema,
  patch: patchVolumeSchema
};

// ../node_modules/.pnpm/stoker@1.4.2_@asteasolutions+zod-to-openapi@7.3.4_zod@3.25.76__@hono+zod-openapi@0.18.4_75fc4b95d9a85f953938ef1c37e43d48/node_modules/stoker/dist/esm/http-status-phrases.js
var NOT_FOUND = "Not Found";

// ../node_modules/.pnpm/@asteasolutions+zod-to-openapi@7.3.4_zod@3.25.76/node_modules/@asteasolutions/zod-to-openapi/dist/index.mjs
function __rest(s, e) {
  var t = {};
  for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2) && e.indexOf(p2) < 0)
    t[p2] = s[p2];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i]))
        t[p2[i]] = s[p2[i]];
    }
  return t;
}
function isZodType(schema, typeName) {
  var _a;
  return ((_a = schema === null || schema === void 0 ? void 0 : schema._def) === null || _a === void 0 ? void 0 : _a.typeName) === typeName;
}
function preserveMetadataFromModifier(zod, modifier) {
  const zodModifier = zod.ZodType.prototype[modifier];
  zod.ZodType.prototype[modifier] = function(...args) {
    const result = zodModifier.apply(this, args);
    result._def.openapi = this._def.openapi;
    return result;
  };
}
function extendZodWithOpenApi(zod) {
  if (typeof zod.ZodType.prototype.openapi !== "undefined") {
    return;
  }
  zod.ZodType.prototype.openapi = function(refOrOpenapi, metadata) {
    var _a, _b, _c, _d, _e, _f;
    const openapi = typeof refOrOpenapi === "string" ? metadata : refOrOpenapi;
    const _g = openapi !== null && openapi !== void 0 ? openapi : {}, { param } = _g, restOfOpenApi = __rest(_g, ["param"]);
    const _internal = Object.assign(Object.assign({}, (_a = this._def.openapi) === null || _a === void 0 ? void 0 : _a._internal), typeof refOrOpenapi === "string" ? { refId: refOrOpenapi } : void 0);
    const resultMetadata = Object.assign(Object.assign(Object.assign({}, (_b = this._def.openapi) === null || _b === void 0 ? void 0 : _b.metadata), restOfOpenApi), ((_d = (_c = this._def.openapi) === null || _c === void 0 ? void 0 : _c.metadata) === null || _d === void 0 ? void 0 : _d.param) || param ? {
      param: Object.assign(Object.assign({}, (_f = (_e = this._def.openapi) === null || _e === void 0 ? void 0 : _e.metadata) === null || _f === void 0 ? void 0 : _f.param), param)
    } : void 0);
    const result = new this.constructor(Object.assign(Object.assign({}, this._def), { openapi: Object.assign(Object.assign({}, Object.keys(_internal).length > 0 ? { _internal } : void 0), Object.keys(resultMetadata).length > 0 ? { metadata: resultMetadata } : void 0) }));
    if (isZodType(this, "ZodObject")) {
      const originalExtend = this.extend;
      result.extend = function(...args) {
        var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
        const extendedResult = originalExtend.apply(this, args);
        extendedResult._def.openapi = {
          _internal: {
            extendedFrom: ((_b2 = (_a2 = this._def.openapi) === null || _a2 === void 0 ? void 0 : _a2._internal) === null || _b2 === void 0 ? void 0 : _b2.refId) ? { refId: (_d2 = (_c2 = this._def.openapi) === null || _c2 === void 0 ? void 0 : _c2._internal) === null || _d2 === void 0 ? void 0 : _d2.refId, schema: this } : (_f2 = (_e2 = this._def.openapi) === null || _e2 === void 0 ? void 0 : _e2._internal) === null || _f2 === void 0 ? void 0 : _f2.extendedFrom
          },
          metadata: (_g2 = extendedResult._def.openapi) === null || _g2 === void 0 ? void 0 : _g2.metadata
        };
        return extendedResult;
      };
    }
    return result;
  };
  preserveMetadataFromModifier(zod, "optional");
  preserveMetadataFromModifier(zod, "nullable");
  preserveMetadataFromModifier(zod, "default");
  preserveMetadataFromModifier(zod, "transform");
  preserveMetadataFromModifier(zod, "refine");
  const zodDeepPartial = zod.ZodObject.prototype.deepPartial;
  zod.ZodObject.prototype.deepPartial = function() {
    const initialShape = this._def.shape();
    const result = zodDeepPartial.apply(this);
    const resultShape = result._def.shape();
    Object.entries(resultShape).forEach(([key, value]) => {
      var _a, _b;
      value._def.openapi = (_b = (_a = initialShape[key]) === null || _a === void 0 ? void 0 : _a._def) === null || _b === void 0 ? void 0 : _b.openapi;
    });
    result._def.openapi = void 0;
    return result;
  };
  const zodPick = zod.ZodObject.prototype.pick;
  zod.ZodObject.prototype.pick = function(...args) {
    const result = zodPick.apply(this, args);
    result._def.openapi = void 0;
    return result;
  };
  const zodOmit = zod.ZodObject.prototype.omit;
  zod.ZodObject.prototype.omit = function(...args) {
    const result = zodOmit.apply(this, args);
    result._def.openapi = void 0;
    return result;
  };
}
new Set(".\\+*[^]$()");

// ../node_modules/.pnpm/@hono+zod-openapi@0.18.4_hono@4.6.10_zod@3.25.76/node_modules/@hono/zod-openapi/dist/index.mjs
extendZodWithOpenApi(external_exports);

// ../node_modules/.pnpm/stoker@1.4.2_@asteasolutions+zod-to-openapi@7.3.4_zod@3.25.76__@hono+zod-openapi@0.18.4_75fc4b95d9a85f953938ef1c37e43d48/node_modules/stoker/dist/esm/openapi/schemas/create-message-object.js
var createMessageObjectSchema = (exampleMessage = "Hello World") => {
  return external_exports.object({
    message: external_exports.string()
  }).openapi({
    example: {
      message: exampleMessage
    }
  });
};
var create_message_object_default = createMessageObjectSchema;

// ../apps/server/src/lib/constants.ts
var TEMPERATURE_RANGES = {
  CONSUMPTION: {
    MIN: 3,
    MAX: 8
  },
  FREEZING: {
    MIN: -10,
    MAX: 0
  }
};
var ZOD_ERROR_MESSAGES = {
  TEMPERATURE_CONSUMPTION_RANGE: `Temperature consumption must be between ${TEMPERATURE_RANGES.CONSUMPTION.MIN}\xB0C and ${TEMPERATURE_RANGES.CONSUMPTION.MAX}\xB0C`,
  TEMPERATURE_FREEZING_RANGE: `Temperature freeze must be between ${TEMPERATURE_RANGES.FREEZING.MIN}\xB0C and ${TEMPERATURE_RANGES.FREEZING.MAX}\xB0C`
};
create_message_object_default(NOT_FOUND);

// ../apps/server/src/db/schemas/orders.schema.ts
var orders = sqliteTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => (0, import_cuid5.default)()),
  // Cooling profile reference
  modeId: text("mode_id").notNull().references(() => modes.id, { onDelete: "cascade" }),
  // Proper ID-based foreign keys
  drinkTypeId: text("drink_type_id").notNull().references(() => drink_types.id, { onDelete: "cascade" }),
  drinkSubtypeId: text("drink_subtype_id").references(() => drink_subtypes.id, { onDelete: "set null" }),
  volumeId: text("volume_id").notNull().references(() => volumes.id, { onDelete: "cascade" }),
  containerTypeId: text("container_type_id").notNull().references(() => container_types.id, { onDelete: "cascade" }),
  // Temperature defaults
  defaultTempConsume: integer("default_temp_consume").notNull().$defaultFn(() => TEMPERATURE_RANGES.CONSUMPTION.MAX),
  defaultTempFreeze: integer("default_temp_freeze").notNull().$defaultFn(() => TEMPERATURE_RANGES.FREEZING.MIN),
  // Meta fields
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date())
});
var ordersRelations = relations(orders, ({ one, many }) => ({
  mode: one(modes, {
    fields: [orders.modeId],
    references: [modes.id]
  }),
  drinkType: one(drink_types, {
    fields: [orders.drinkTypeId],
    references: [drink_types.id]
  }),
  drinkSubtype: one(drink_subtypes, {
    fields: [orders.drinkSubtypeId],
    references: [drink_subtypes.id]
  }),
  volume: one(volumes, {
    fields: [orders.volumeId],
    references: [volumes.id]
  }),
  containerType: one(container_types, {
    fields: [orders.containerTypeId],
    references: [container_types.id]
  }),
  temperatureProfiles: many(temperature_profiles)
}));
var insertOrderSchema = c(orders, {
  modeId: (schema) => schema.modeId.min(1, "Mode is required"),
  drinkTypeId: (schema) => schema.drinkTypeId.min(1).max(50),
  drinkSubtypeId: (schema) => schema.drinkSubtypeId.max(50),
  volumeId: (schema) => schema.volumeId.min(1).max(50),
  containerTypeId: (schema) => schema.containerTypeId.min(1).max(50),
  defaultTempConsume: (schema) => schema.defaultTempConsume.min(TEMPERATURE_RANGES.CONSUMPTION.MIN, ZOD_ERROR_MESSAGES.TEMPERATURE_CONSUMPTION_RANGE).max(TEMPERATURE_RANGES.CONSUMPTION.MAX, ZOD_ERROR_MESSAGES.TEMPERATURE_CONSUMPTION_RANGE),
  defaultTempFreeze: (schema) => schema.defaultTempFreeze.min(TEMPERATURE_RANGES.FREEZING.MIN, ZOD_ERROR_MESSAGES.TEMPERATURE_FREEZING_RANGE).max(TEMPERATURE_RANGES.FREEZING.MAX, ZOD_ERROR_MESSAGES.TEMPERATURE_FREEZING_RANGE),
  isActive: () => sqliteBooleanField()
  // Handle boolean/integer conversion
}).required({
  modeId: true,
  drinkTypeId: true,
  volumeId: true,
  containerTypeId: true,
  defaultTempConsume: true,
  defaultTempFreeze: true
}).omit({ id: true, createdAt: true, updatedAt: true });
var orderSchemas = {
  select: b(orders),
  insert: insertOrderSchema,
  patch: insertOrderSchema.partial().extend({
    isActive: sqliteBooleanField().optional()
    // Handle boolean/integer conversion for PATCH
  })
};

// ../apps/server/src/db/schemas/temperature_profiles.schema.ts
var import_cuid6 = __toESM(require_cuid());
var temperature_profiles = sqliteTable("temperature_profiles", {
  id: text("id").primaryKey().$defaultFn(() => (0, import_cuid6.default)()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  modeId: text("mode_id").notNull().references(() => modes.id, { onDelete: "cascade" }),
  temperature: integer("temperature").notNull(),
  timeA: integer("time_a").notNull(),
  timeB: integer("time_b").notNull(),
  timeC: integer("time_c").notNull()
});
var temperatureProfilesRelations = relations(temperature_profiles, ({ one }) => ({
  order: one(orders, {
    fields: [temperature_profiles.orderId],
    references: [orders.id]
  }),
  mode: one(modes, {
    fields: [temperature_profiles.modeId],
    references: [modes.id]
  })
}));
var temperatureProfileSchemas = {
  select: b(temperature_profiles),
  insert: c(temperature_profiles).omit({ id: true }),
  patch: c(temperature_profiles).partial()
};

// ../apps/server/src/db/schemas/modes.schema.ts
var import_cuid7 = __toESM(require_cuid());
var modes = sqliteTable("modes", {
  id: text("id").primaryKey().$defaultFn(() => (0, import_cuid7.default)()),
  name: text("name").notNull(),
  description: text("description")
});
var modeRelations = relations(modes, ({ many }) => ({
  temperaturePoints: many(temperature_profiles)
}));
var modeSchemas = {
  select: b(modes),
  insert: c(modes).omit({ id: true }),
  patch: c(modes).partial()
};

// ../apps/server/src/db/schemas/orders_readable_view.schema.ts
var orders_readable = {
  // This provides the table name for raw SQL queries
  _: {
    name: "orders_readable"
  }
};

// ../apps/server/src/db/schemas/slot_configurations.schema.ts
var slot_configurations = sqliteTable("slot_configurations", {
  id: text("id").primaryKey(),
  slotNumber: integer("slot_number").notNull(),
  itemType: text("item_type", { enum: ["A", "B", "C"] }).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`)
});

// ../apps/server/src/db/schemas/supported_languages.schema.ts
var import_cuid8 = __toESM(require_cuid());
var supported_languages = sqliteTable("supported_languages", {
  id: text("id").primaryKey().$defaultFn(() => (0, import_cuid8.default)()),
  isoCode: text("iso_code").notNull().unique(),
  // 'en', 'es', 'ca', 'de'
  nativeName: text("native_name").notNull(),
  // 'English', 'Español', 'Català'
  displayName: text("display_name").notNull(),
  // For admin interface display
  flagCode: text("flag_code"),
  // 'US', 'ES', 'CAT', 'DE' (for flag icons)
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date())
});
var insertSupportedLanguageSchema = c(supported_languages, {
  isoCode: (schema) => schema.isoCode.min(2).max(5).regex(/^[a-z]{2,3}(-[A-Z]{2})?$/),
  nativeName: (schema) => schema.nativeName.min(1).max(50),
  displayName: (schema) => schema.displayName.min(1).max(50),
  flagCode: (schema) => schema.flagCode.min(2).max(5),
  sortOrder: (schema) => schema.sortOrder.min(0).max(999),
  isActive: () => sqliteBooleanField(),
  // Handle boolean/integer conversion
  isDefault: () => sqliteBooleanField()
  // Handle boolean/integer conversion
}).required({
  isoCode: true,
  nativeName: true,
  displayName: true
}).omit({ id: true, createdAt: true, updatedAt: true });
var supportedLanguageSchemas = {
  select: b(supported_languages),
  insert: insertSupportedLanguageSchema,
  patch: insertSupportedLanguageSchema.partial().extend({
    isActive: sqliteBooleanField().optional(),
    // Handle boolean/integer conversion for PATCH
    isDefault: sqliteBooleanField().optional()
    // Handle boolean/integer conversion for PATCH
  })
};

// ../apps/server/src/db/schemas/translatable_entities.schema.ts
var import_cuid9 = __toESM(require_cuid());
var translatable_entities = sqliteTable("translatable_entities", {
  id: text("id").primaryKey().$defaultFn(() => (0, import_cuid9.default)()),
  tableName: text("table_name").notNull().unique(),
  // 'drink_types', 'volumes', etc.
  entityName: text("entity_name").notNull(),
  // 'Drink Types', 'Volumes'
  description: text("description"),
  // Optional description for admin
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()).$onUpdate(() => /* @__PURE__ */ new Date())
});
var insertTranslatableEntitySchema = c(translatable_entities, {
  tableName: (schema) => schema.tableName.min(1).max(50).regex(/^[a-z_]+$/),
  entityName: (schema) => schema.entityName.min(1).max(100),
  description: (schema) => schema.description.max(255),
  sortOrder: (schema) => schema.sortOrder.min(0).max(999),
  isActive: () => sqliteBooleanField()
  // Handle boolean/integer conversion
}).required({
  tableName: true,
  entityName: true
}).omit({ id: true, createdAt: true, updatedAt: true });
var translatableEntitySchemas = {
  select: b(translatable_entities),
  insert: insertTranslatableEntitySchema,
  patch: insertTranslatableEntitySchema.partial().extend({
    isActive: sqliteBooleanField().optional()
    // Handle boolean/integer conversion for PATCH
  })
};
var dbPath = process.env.NODE_ENV === "production" ? path6.resolve(dirname(fileURLToPath(import.meta.url)), "../data/db/production.sqlite.db") : env2.DB_PATH;
var sqlite = new import_better_sqlite32.default(dbPath);
if (sqlite.open) {
  console.log("\n\u2705 Connected to database:", source_default.green(env2.DB_NAME));
} else {
  console.error("\n\u274C Failed to open database");
}
drizzle(sqlite, { schema: schemas_exports });
var sqliteAny = sqlite;

// src/db-setup/db-setup.ts
var autoConfirm = process.argv.includes("-y") || process.argv.includes("--yes");
console.log("--- [db-setup] Script started ---");
var nodeEnv = process.env.NODE_ENV || "development";
console.log("[db-setup] NODE_ENV:", nodeEnv);
if (!["development", "test", "production"].includes(nodeEnv)) {
  console.warn(source_default.yellow(`\u26A0\uFE0F Unexpected NODE_ENV: ${nodeEnv}, defaulting to development`));
}
var envPath = path4.resolve(process.cwd(), `${PATH_FOLDER_ENV}/.env.${nodeEnv}`);
console.log("[db-setup] Looking for env file at:", envPath);
if (!fs2.existsSync(envPath)) {
  console.error(source_default.red(`\u274C Environment file not found: ${envPath}`));
  process.exit(1);
}
(0, import_dotenvx2.config)({ path: envPath });
console.log("[db-setup] Loaded env config");
async function generateMigrations() {
  console.log("[db-setup] Running generateMigrations...");
  execSync("pnpm --filter @workspace/server db.migrations.generate", {
    stdio: "inherit"
  });
}
async function runMigrations() {
  console.log("[db-setup] Running runMigrations...");
  execSync("pnpm --filter @workspace/server db.migrations.run", {
    stdio: "inherit"
  });
}
async function seedData(schemas) {
  for (const schema of schemas) {
    try {
      console.log(source_default.blue(`
Seeding ${schema}...`));
      const seedName = schema.startsWith("auth_") ? schema.replace("auth_", "") : schema;
      console.log(`[db-setup] Seeding: ${seedName}`);
      execSync(`pnpm --filter @workspace/server db.migrations.seed ${seedName}`, {
        stdio: "inherit"
      });
      console.log(source_default.green(`\u2705 Seeded ${schema} successfully!`));
    } catch (error) {
      console.error(source_default.red(`\u274C Error seeding ${schema}:`), error);
      throw error;
    }
  }
}
async function createViews() {
  for (const view of viewConfigs) {
    const sqlPath = path4.resolve(process.cwd(), "apps/server/src/db/views", `${view.name}.sql`);
    if (!fs2.existsSync(sqlPath)) {
      console.warn(source_default.yellow(`View SQL file not found: ${sqlPath}`));
      continue;
    }
    const sql2 = fs2.readFileSync(sqlPath, "utf-8");
    try {
      console.log(source_default.blue(`Dropping view if exists: ${view.name}`));
      sqliteAny.exec(`DROP VIEW IF EXISTS ${view.name};`);
      console.log(source_default.blue(`Creating view: ${view.name}`));
      sqliteAny.exec(sql2);
      console.log(source_default.green(`\u2705 Created view: ${view.name}`));
    } catch (err) {
      console.error(source_default.red(`\u274C Error creating view ${view.name}:`), err);
    }
  }
}
async function main() {
  try {
    console.log("[db-setup] About to show operations prompt...");
    let operations;
    if (autoConfirm) {
      operations = ["seed", "views"];
      console.log("[db-setup] Auto-confirm enabled: defaulting to operations:", operations);
    } else {
      operations = await checkbox({
        message: "Select operations to perform",
        choices: [
          { name: "Seed data", value: "seed", checked: true },
          { name: "Create views", value: "views", checked: true },
          { name: "Run migrations", value: "migrate", checked: false },
          { name: "Generate migrations", value: "generate", checked: false }
        ]
      });
    }
    console.log("[db-setup] Operations selected:", operations);
    if (operations.length === 0) {
      console.log("No operations selected. Exiting...");
      process.exit(0);
    }
    console.log("[db-setup] Loading seed config...");
    let schemas = [];
    if (operations.includes("seed")) {
      if (autoConfirm) {
        const { seedConfigs } = await loadSeedConfig();
        schemas = seedConfigs.map((s) => s.name);
        console.log("[db-setup] Auto-confirm enabled: seeding all schemas:", schemas);
      } else {
        const { seedConfigs } = await loadSeedConfig();
        schemas = await getSchemaSelection({ seedConfigs });
      }
    }
    console.log("[db-setup] Schemas selected:", schemas);
    if (operations.includes("generate")) {
      console.log(source_default.blue("\n1. Generating migrations..."));
      await generateMigrations();
    }
    if (operations.includes("migrate")) {
      console.log(source_default.blue("\n2. Running migrations..."));
      await runMigrations();
    }
    if (operations.includes("seed")) {
      console.log(source_default.blue("\n3. Seeding data..."));
      await seedData(schemas);
    }
    if (operations.includes("views")) {
      console.log(source_default.blue("\n4. Creating views..."));
      await createViews();
    }
    console.log("--- [db-setup] Script finished ---");
  } catch (error) {
    console.error(source_default.red("\n\u274C Unexpected error:"));
    console.error(error);
    process.exit(1);
  }
}
var db_setup_default = main;
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error("Failed to run db-setup:", error);
    process.exit(1);
  });
}
/*! Bundled license information:

@noble/ciphers/utils.js:
  (*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) *)

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/edwards.js:
@noble/curves/abstract/montgomery.js:
@noble/curves/ed25519.js:
@noble/curves/abstract/weierstrass.js:
@noble/curves/_shortw_utils.js:
@noble/curves/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/

export { db_setup_default as default, main };
