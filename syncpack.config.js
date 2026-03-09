module.exports = {
  versionGroups: [
    {
      // link: paths can't be version-compared — ignore them
      dependencies: ['@workspace/*'],
      isIgnored: true,
    },
    {
      // Sync these critical packages across all packages (both dependencies and devDependencies)
      dependencies: [
        '@finografic/eslint-config',
        '@finografic/lucide-manager',
        '@finografic/project-scripts',
        '@types/node',
        'drizzle-kit',
        'drizzle-orm',
        'eslint',
        'picocolors',
        'tsup',
        'tsx',
        'typescript',
        'valibot',
        'vite',
      ],
      packages: ['**'],
    },
  ],
};
