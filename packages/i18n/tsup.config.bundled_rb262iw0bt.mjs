// tsup.config.ts
import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
var tsup_config_default = defineConfig({
  entry: {
    'index': 'src/index.ts',
    'index.node': 'src/index.node.ts',
    'config/index': 'src/config/index.ts',
    'config/types': 'src/config/types.ts',
    'config/defaults': 'src/config/defaults.ts',
    'config/loader': 'src/config/loader.ts',
    'generators/index': 'src/generators/index.ts',
    'generators/generate-types': 'src/generators/generate-types.ts',
    'generators/generate-constants': 'src/generators/generate-constants.ts',
    'generators/cli': 'src/generators/cli.ts',
    'translations/index': 'src/translations/index.ts',
  },
  outDir: './dist',
  clean: true,
  experimentalDts: true,
  format: ['esm'],
  bundle: false,
  splitting: false,
  treeshake: true,
  publicDir: false,
  // Don't use publicDir, we'll copy manually
  loader: {
    '.json': 'copy',
  },
  onSuccess: async () => {
    const jsonFiles = [
      { src: 'src/translations/app/ca-ES.json', dest: 'dist/translations/app/ca-ES.json' },
      { src: 'src/translations/app/en-GB.json', dest: 'dist/translations/app/en-GB.json' },
      { src: 'src/translations/app/es-ES.json', dest: 'dist/translations/app/es-ES.json' },
      { src: 'src/translations/admin/ca-ES.json', dest: 'dist/translations/admin/ca-ES.json' },
      { src: 'src/translations/admin/en-GB.json', dest: 'dist/translations/admin/en-GB.json' },
      { src: 'src/translations/admin/es-ES.json', dest: 'dist/translations/admin/es-ES.json' },
      { src: 'src/translations/ui/ca-ES.json', dest: 'dist/translations/ui/ca-ES.json' },
      { src: 'src/translations/ui/en-GB.json', dest: 'dist/translations/ui/en-GB.json' },
      { src: 'src/translations/ui/es-ES.json', dest: 'dist/translations/ui/es-ES.json' },
    ];
    for (const { src, dest } of jsonFiles) {
      try {
        mkdirSync(dirname(dest), { recursive: true });
        copyFileSync(src, dest);
      } catch (error) {
        console.warn(`Failed to copy ${src} to ${dest}:`, error);
      }
    }
  },
});
export { tsup_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL1VzZXJzL2p1c3Rpbi9yZXBvcy1maW5vZ3JhZmljL3RvdWNoLW1vbm9yZXBvL3BhY2thZ2VzL2kxOG4vdHN1cC5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL1VzZXJzL2p1c3Rpbi9yZXBvcy1maW5vZ3JhZmljL3RvdWNoLW1vbm9yZXBvL3BhY2thZ2VzL2kxOG5cIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL1VzZXJzL2p1c3Rpbi9yZXBvcy1maW5vZ3JhZmljL3RvdWNoLW1vbm9yZXBvL3BhY2thZ2VzL2kxOG4vdHN1cC5jb25maWcudHNcIjtpbXBvcnQgdHlwZSB7IE9wdGlvbnMgfSBmcm9tICd0c3VwJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3RzdXAnO1xuaW1wb3J0IHsgY29weUZpbGVTeW5jLCBta2RpclN5bmMgfSBmcm9tICdub2RlOmZzJztcbmltcG9ydCB7IGRpcm5hbWUgfSBmcm9tICdub2RlOnBhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBlbnRyeToge1xuICAgICdpbmRleCc6ICdzcmMvaW5kZXgudHMnLFxuICAgICdpbmRleC5ub2RlJzogJ3NyYy9pbmRleC5ub2RlLnRzJyxcbiAgICAnY29uZmlnL2luZGV4JzogJ3NyYy9jb25maWcvaW5kZXgudHMnLFxuICAgICdjb25maWcvdHlwZXMnOiAnc3JjL2NvbmZpZy90eXBlcy50cycsXG4gICAgJ2NvbmZpZy9kZWZhdWx0cyc6ICdzcmMvY29uZmlnL2RlZmF1bHRzLnRzJyxcbiAgICAnY29uZmlnL2xvYWRlcic6ICdzcmMvY29uZmlnL2xvYWRlci50cycsXG4gICAgJ2dlbmVyYXRvcnMvaW5kZXgnOiAnc3JjL2dlbmVyYXRvcnMvaW5kZXgudHMnLFxuICAgICdnZW5lcmF0b3JzL2dlbmVyYXRlLXR5cGVzJzogJ3NyYy9nZW5lcmF0b3JzL2dlbmVyYXRlLXR5cGVzLnRzJyxcbiAgICAnZ2VuZXJhdG9ycy9nZW5lcmF0ZS1jb25zdGFudHMnOiAnc3JjL2dlbmVyYXRvcnMvZ2VuZXJhdGUtY29uc3RhbnRzLnRzJyxcbiAgICAnZ2VuZXJhdG9ycy9jbGknOiAnc3JjL2dlbmVyYXRvcnMvY2xpLnRzJyxcbiAgICAndHJhbnNsYXRpb25zL2luZGV4JzogJ3NyYy90cmFuc2xhdGlvbnMvaW5kZXgudHMnLFxuICB9LFxuICBvdXREaXI6ICcuL2Rpc3QnLFxuICBjbGVhbjogdHJ1ZSxcbiAgZXhwZXJpbWVudGFsRHRzOiB0cnVlLFxuICBmb3JtYXQ6IFsnZXNtJ10sXG4gIGJ1bmRsZTogZmFsc2UsXG4gIHNwbGl0dGluZzogZmFsc2UsXG4gIHRyZWVzaGFrZTogdHJ1ZSxcbiAgcHVibGljRGlyOiBmYWxzZSwgLy8gRG9uJ3QgdXNlIHB1YmxpY0Rpciwgd2UnbGwgY29weSBtYW51YWxseVxuICBsb2FkZXI6IHtcbiAgICAnLmpzb24nOiAnY29weScsXG4gIH0sXG4gIG9uU3VjY2VzczogYXN5bmMgKCkgPT4ge1xuICAgIC8vIENvcHkgSlNPTiBmaWxlcyB0byBtYWludGFpbiBmb2xkZXIgc3RydWN0dXJlIGluc2lkZSBkaXN0L3RyYW5zbGF0aW9ucy9cbiAgICBjb25zdCBqc29uRmlsZXMgPSBbXG4gICAgICB7IHNyYzogJ3NyYy90cmFuc2xhdGlvbnMvYXBwL2NhLUVTLmpzb24nLCBkZXN0OiAnZGlzdC90cmFuc2xhdGlvbnMvYXBwL2NhLUVTLmpzb24nIH0sXG4gICAgICB7IHNyYzogJ3NyYy90cmFuc2xhdGlvbnMvYXBwL2VuLUdCLmpzb24nLCBkZXN0OiAnZGlzdC90cmFuc2xhdGlvbnMvYXBwL2VuLUdCLmpzb24nIH0sXG4gICAgICB7IHNyYzogJ3NyYy90cmFuc2xhdGlvbnMvYXBwL2VzLUVTLmpzb24nLCBkZXN0OiAnZGlzdC90cmFuc2xhdGlvbnMvYXBwL2VzLUVTLmpzb24nIH0sXG4gICAgICB7IHNyYzogJ3NyYy90cmFuc2xhdGlvbnMvY29tbW9uL2NhLUVTLmpzb24nLCBkZXN0OiAnZGlzdC90cmFuc2xhdGlvbnMvY29tbW9uL2NhLUVTLmpzb24nIH0sXG4gICAgICB7IHNyYzogJ3NyYy90cmFuc2xhdGlvbnMvY29tbW9uL2VuLUdCLmpzb24nLCBkZXN0OiAnZGlzdC90cmFuc2xhdGlvbnMvY29tbW9uL2VuLUdCLmpzb24nIH0sXG4gICAgICB7IHNyYzogJ3NyYy90cmFuc2xhdGlvbnMvY29tbW9uL2VzLUVTLmpzb24nLCBkZXN0OiAnZGlzdC90cmFuc2xhdGlvbnMvY29tbW9uL2VzLUVTLmpzb24nIH0sXG4gICAgICB7IHNyYzogJ3NyYy90cmFuc2xhdGlvbnMvZHluYW1pYy9jYS1FUy5qc29uJywgZGVzdDogJ2Rpc3QvdHJhbnNsYXRpb25zL2R5bmFtaWMvY2EtRVMuanNvbicgfSxcbiAgICAgIHsgc3JjOiAnc3JjL3RyYW5zbGF0aW9ucy9keW5hbWljL2VuLUdCLmpzb24nLCBkZXN0OiAnZGlzdC90cmFuc2xhdGlvbnMvZHluYW1pYy9lbi1HQi5qc29uJyB9LFxuICAgICAgeyBzcmM6ICdzcmMvdHJhbnNsYXRpb25zL2R5bmFtaWMvZXMtRVMuanNvbicsIGRlc3Q6ICdkaXN0L3RyYW5zbGF0aW9ucy9keW5hbWljL2VzLUVTLmpzb24nIH0sXG4gICAgXTtcblxuICAgIGZvciAoY29uc3QgeyBzcmMsIGRlc3QgfSBvZiBqc29uRmlsZXMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG1rZGlyU3luYyhkaXJuYW1lKGRlc3QpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgY29weUZpbGVTeW5jKHNyYywgZGVzdCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oYEZhaWxlZCB0byBjb3B5ICR7c3JjfSB0byAke2Rlc3R9OmAsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLGNBQWMsaUJBQWlCO0FBQ3hDLFNBQVMsZUFBZTtBQUV4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsSUFDVCxjQUFjO0FBQUEsSUFDZCxnQkFBZ0I7QUFBQSxJQUNoQixnQkFBZ0I7QUFBQSxJQUNoQixtQkFBbUI7QUFBQSxJQUNuQixpQkFBaUI7QUFBQSxJQUNqQixvQkFBb0I7QUFBQSxJQUNwQiw2QkFBNkI7QUFBQSxJQUM3QixpQ0FBaUM7QUFBQSxJQUNqQyxrQkFBa0I7QUFBQSxJQUNsQixzQkFBc0I7QUFBQSxFQUN4QjtBQUFBLEVBQ0EsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsaUJBQWlCO0FBQUEsRUFDakIsUUFBUSxDQUFDLEtBQUs7QUFBQSxFQUNkLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQTtBQUFBLEVBQ1gsUUFBUTtBQUFBLElBQ04sU0FBUztBQUFBLEVBQ1g7QUFBQSxFQUNBLFdBQVcsWUFBWTtBQUVyQixVQUFNLFlBQVk7QUFBQSxNQUNoQixFQUFFLEtBQUssbUNBQW1DLE1BQU0sbUNBQW1DO0FBQUEsTUFDbkYsRUFBRSxLQUFLLG1DQUFtQyxNQUFNLG1DQUFtQztBQUFBLE1BQ25GLEVBQUUsS0FBSyxtQ0FBbUMsTUFBTSxtQ0FBbUM7QUFBQSxNQUNuRixFQUFFLEtBQUssc0NBQXNDLE1BQU0sc0NBQXNDO0FBQUEsTUFDekYsRUFBRSxLQUFLLHNDQUFzQyxNQUFNLHNDQUFzQztBQUFBLE1BQ3pGLEVBQUUsS0FBSyxzQ0FBc0MsTUFBTSxzQ0FBc0M7QUFBQSxNQUN6RixFQUFFLEtBQUssdUNBQXVDLE1BQU0sdUNBQXVDO0FBQUEsTUFDM0YsRUFBRSxLQUFLLHVDQUF1QyxNQUFNLHVDQUF1QztBQUFBLE1BQzNGLEVBQUUsS0FBSyx1Q0FBdUMsTUFBTSx1Q0FBdUM7QUFBQSxJQUM3RjtBQUVBLGVBQVcsRUFBRSxLQUFLLEtBQUssS0FBSyxXQUFXO0FBQ3JDLFVBQUk7QUFDRixrQkFBVSxRQUFRLElBQUksR0FBRyxFQUFFLFdBQVcsS0FBSyxDQUFDO0FBQzVDLHFCQUFhLEtBQUssSUFBSTtBQUFBLE1BQ3hCLFNBQVMsT0FBTztBQUNkLGdCQUFRLEtBQUssa0JBQWtCLEdBQUcsT0FBTyxJQUFJLEtBQUssS0FBSztBQUFBLE1BQ3pEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
