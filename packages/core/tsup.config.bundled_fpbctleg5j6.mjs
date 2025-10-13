// tsup.config.ts
import { defineConfig } from "tsup";
var tsup_config_default = defineConfig({
  entry: [
    // NOTE: should match package.json exports
    "src/index.ts",
    // API files
    "src/api/index.ts",
    "src/api/error.types.ts",
    "src/api/error.constants.ts",
    "src/api/error.schema.ts",
    "src/api/api.utils.ts",
    "src/api/api.types.ts",
    // Constants files
    "src/constants/index.ts",
    "src/constants/zod-errors.ts",
    "src/constants/misc.constants.ts",
    // React hooks files
    "src/react/hooks/index.ts",
    "src/react/hooks/useKeyPressToggle/index.ts",
    "src/react/hooks/useKeyPressToggle/useKeyPressToggle.ts",
    "src/react/hooks/useKeyPressToggle/keypress.constants.ts",
    // Types files
    "src/types/index.ts",
    "src/types/utility.types.ts",
    "src/types/language.types.ts",
    "src/types/countries.types.ts",
    "src/types/utils/casing.utils.types.ts",
    "src/types/utils/enum.utils.types.ts",
    "src/types/utils/object.utils.types.ts",
    "src/types/utils/props.utils.types.ts",
    "src/types/utils/index.ts",
    // Globals files
    "src/globals/index.ts",
    "src/globals/log.ts",
    "src/globals/types.ts",
    // Utils files
    "src/utils/index.ts",
    "src/utils/string.utils.ts"
  ],
  outDir: "./dist",
  clean: true,
  experimentalDts: true,
  format: ["esm"],
  bundle: false,
  splitting: false,
  treeshake: true
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL1VzZXJzL2p1c3Rpbi9yZXBvcy1maW5vZ3JhZmljL3RvdWNoLW1vbm9yZXBvL3BhY2thZ2VzL2NvcmUvdHN1cC5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL1VzZXJzL2p1c3Rpbi9yZXBvcy1maW5vZ3JhZmljL3RvdWNoLW1vbm9yZXBvL3BhY2thZ2VzL2NvcmVcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL1VzZXJzL2p1c3Rpbi9yZXBvcy1maW5vZ3JhZmljL3RvdWNoLW1vbm9yZXBvL3BhY2thZ2VzL2NvcmUvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJztcbmltcG9ydCB0eXBlIHsgT3B0aW9ucyB9IGZyb20gJ3RzdXAnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBlbnRyeTogW1xuICAgIC8vIE5PVEU6IHNob3VsZCBtYXRjaCBwYWNrYWdlLmpzb24gZXhwb3J0c1xuICAgICdzcmMvaW5kZXgudHMnLFxuICAgIC8vIEFQSSBmaWxlc1xuICAgICdzcmMvYXBpL2luZGV4LnRzJyxcbiAgICAnc3JjL2FwaS9lcnJvci50eXBlcy50cycsXG4gICAgJ3NyYy9hcGkvZXJyb3IuY29uc3RhbnRzLnRzJyxcbiAgICAnc3JjL2FwaS9lcnJvci5zY2hlbWEudHMnLFxuXG4gICAgJ3NyYy9hcGkvYXBpLnV0aWxzLnRzJyxcbiAgICAnc3JjL2FwaS9hcGkudHlwZXMudHMnLFxuICAgIC8vIENvbnN0YW50cyBmaWxlc1xuICAgICdzcmMvY29uc3RhbnRzL2luZGV4LnRzJyxcbiAgICAnc3JjL2NvbnN0YW50cy96b2QtZXJyb3JzLnRzJyxcbiAgICAnc3JjL2NvbnN0YW50cy9taXNjLmNvbnN0YW50cy50cycsXG4gICAgLy8gUmVhY3QgaG9va3MgZmlsZXNcbiAgICAnc3JjL3JlYWN0L2hvb2tzL2luZGV4LnRzJyxcbiAgICAnc3JjL3JlYWN0L2hvb2tzL3VzZUtleVByZXNzVG9nZ2xlL2luZGV4LnRzJyxcbiAgICAnc3JjL3JlYWN0L2hvb2tzL3VzZUtleVByZXNzVG9nZ2xlL3VzZUtleVByZXNzVG9nZ2xlLnRzJyxcbiAgICAnc3JjL3JlYWN0L2hvb2tzL3VzZUtleVByZXNzVG9nZ2xlL2tleXByZXNzLmNvbnN0YW50cy50cycsXG4gICAgLy8gVHlwZXMgZmlsZXNcbiAgICAnc3JjL3R5cGVzL2luZGV4LnRzJyxcbiAgICAnc3JjL3R5cGVzL3V0aWxpdHkudHlwZXMudHMnLFxuICAgICdzcmMvdHlwZXMvbGFuZ3VhZ2UudHlwZXMudHMnLFxuICAgICdzcmMvdHlwZXMvY291bnRyaWVzLnR5cGVzLnRzJyxcbiAgICAnc3JjL3R5cGVzL3V0aWxzL2Nhc2luZy51dGlscy50eXBlcy50cycsXG4gICAgJ3NyYy90eXBlcy91dGlscy9lbnVtLnV0aWxzLnR5cGVzLnRzJyxcbiAgICAnc3JjL3R5cGVzL3V0aWxzL29iamVjdC51dGlscy50eXBlcy50cycsXG4gICAgJ3NyYy90eXBlcy91dGlscy9wcm9wcy51dGlscy50eXBlcy50cycsXG4gICAgJ3NyYy90eXBlcy91dGlscy9pbmRleC50cycsXG4gICAgLy8gR2xvYmFscyBmaWxlc1xuICAgICdzcmMvZ2xvYmFscy9pbmRleC50cycsXG4gICAgJ3NyYy9nbG9iYWxzL2xvZy50cycsXG4gICAgJ3NyYy9nbG9iYWxzL3R5cGVzLnRzJyxcbiAgICAvLyBVdGlscyBmaWxlc1xuICAgICdzcmMvdXRpbHMvaW5kZXgudHMnLFxuICAgICdzcmMvdXRpbHMvc3RyaW5nLnV0aWxzLnRzJyxcbiAgXSxcbiAgb3V0RGlyOiAnLi9kaXN0JyxcbiAgY2xlYW46IHRydWUsXG4gIGV4cGVyaW1lbnRhbER0czogdHJ1ZSxcbiAgZm9ybWF0OiBbJ2VzbSddLFxuICBidW5kbGU6IGZhbHNlLFxuICBzcGxpdHRpbmc6IGZhbHNlLFxuICB0cmVlc2hha2U6IHRydWUsXG59IHNhdGlzZmllcyBPcHRpb25zKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1QsU0FBUyxvQkFBb0I7QUFHNVYsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBO0FBQUEsSUFFTDtBQUFBO0FBQUEsSUFFQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBRUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUVBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQTtBQUFBLElBRUE7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQTtBQUFBLElBRUE7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFFQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUVBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxFQUNSLE9BQU87QUFBQSxFQUNQLGlCQUFpQjtBQUFBLEVBQ2pCLFFBQVEsQ0FBQyxLQUFLO0FBQUEsRUFDZCxRQUFRO0FBQUEsRUFDUixXQUFXO0FBQUEsRUFDWCxXQUFXO0FBQ2IsQ0FBbUI7IiwKICAibmFtZXMiOiBbXQp9Cg==
