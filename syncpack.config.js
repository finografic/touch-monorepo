module.exports = {
  versionGroups: [
    {
      dependencies: ['@workspace/*'],
      isIgnored: true,
    },
    {
      // Sync these critical packages across all packages (both dependencies and devDependencies)
      dependencies: [
        '@finografic/eslint-config',
        '@finografic/project-scripts',
        '@types/node',
        'drizzle-kit',
        'drizzle-orm',
        'drizzle-zod',
        'eslint',
        'tsup',
        'tsx',
        'typescript',
        'zod',
      ],
      packages: ['**'],
    },
  ],
};
