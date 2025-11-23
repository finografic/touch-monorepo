module.exports = {
  versionGroups: [
    {
      dependencies: ['@workspace/*'],
      isIgnored: true,
    },
    {
      // Sync these critical packages across all packages (both dependencies and devDependencies)
      dependencies: [
        'zod',
        'typescript',
        'eslint',
        '@types/node',
        '@finografic/eslint-config',
        '@finografic/project-scripts',
        'drizzle-orm',
        'drizzle-zod',
        'drizzle-kit',
      ],
      packages: ['**'],
    },
  ],
};
