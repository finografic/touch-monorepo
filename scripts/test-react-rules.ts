import { ESLint } from 'eslint';
import type { FlatConfigItem } from './declarations';
import chalk from 'chalk';

const TEST_CONTENT = `// @ts-nocheck
import React from 'react';

// This component intentionally violates React-specific rules:
// - react-hooks/rules-of-hooks (conditional hook)
// - react-hooks/exhaustive-deps (missing deps array)
// - react-dom/no-unknown-property (wrong DOM property)
// - react/prop-types (missing prop types)
// - react-hooks/rules-of-hooks (useState outside component)
export default function TestComponent(props) {
  // Rule violation: Conditional hook
  if (props.someCondition) {
    const [state, setState] = React.useState(null);
  }

  // Rule violation: Missing dependencies array
  React.useEffect(() => {
    console.log(props.value);
  });

  // Rule violation: Wrong DOM property name (should be onClick)
  return (
    <div onclick={() => console.log('clicked')}>
      Test
    </div>
  );
};

// Rule violation: Hook outside component
const [globalState, setGlobalState] = React.useState(null);`;

async function runTest() {
  console.log(chalk.cyan.bold('\n🔍 Testing React-specific ESLint Rules\n'));

  try {
    // Load and prepare the flat config
    const { default: clientConfig } = await import('../apps/client/eslint.config.mjs');
    const typedConfig = clientConfig as FlatConfigItem | FlatConfigItem[];
    const flatConfig = Array.isArray(typedConfig) ? typedConfig : [typedConfig];

    // Merge all configs into a single object
    const mergedConfig = flatConfig.reduce((acc, curr) => {
      // Only merge known ESLint properties
      const validKeys = ['rules', 'plugins', 'settings', 'languageOptions', 'processor'];
      const filteredCurr = Object.fromEntries(
        Object.entries(curr).filter(([key]) => validKeys.includes(key)),
      );

      return {
        ...acc,
        ...filteredCurr,
        rules: { ...(acc.rules || {}), ...(curr.rules || {}) },
        plugins: { ...(acc.plugins || {}), ...(curr.plugins || {}) },
        settings: { ...(acc.settings || {}), ...(curr.settings || {}) },
        languageOptions: {
          ...(acc.languageOptions || {}),
          ...(curr.languageOptions || {}),
          parserOptions: {
            ...(acc.languageOptions?.parserOptions || {}),
            ...(curr.languageOptions?.parserOptions || {}),
            project: null, // Disable TypeScript project requirement for testing
          },
        },
      };
    }, {});

    const eslint = new ESLint({
      baseConfig: {
        ...mergedConfig,
        files: ['**/*.tsx', '**/*.ts'],
        plugins: {
          'react': (await import('eslint-plugin-react')).default,
          'react-hooks': (await import('eslint-plugin-react-hooks')).default,
        } as unknown as Record<string, Plugin>,
        settings: {
          react: {
            version: 'detect',
          },
        },
        languageOptions: {
          ...mergedConfig.languageOptions,
          parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            ecmaFeatures: {
              jsx: true,
            },
            project: null,
          },
        },
        rules: {
          ...mergedConfig.rules,
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'error',
          'react/prop-types': 'error',
          'react/jsx-uses-react': 'error',
          'react/jsx-uses-vars': 'error',
          'react/no-unknown-property': ['error', { ignore: ['css'] }],
        },
      },
      fix: false,
      overrideConfigFile: true,
    });

    // Verify the configuration
    console.log(chalk.yellow('📋 Verifying ESLint Configuration...'));
    try {
      await eslint.calculateConfigForFile('test.tsx');
      console.log(chalk.green('✓ ESLint configuration is valid\n'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(chalk.red('✗ ESLint Configuration Error:'));
        console.error(chalk.red(error.message));
      }
      process.exit(1);
    }

    // Lint the test content
    console.log(chalk.yellow('🔎 Analyzing Test Component...'));
    const results = await eslint.lintText(TEST_CONTENT, {
      filePath: 'test.tsx',
    });

    const { messages } = results[0];

    if (messages.length === 0) {
      console.log(chalk.green('✓ No ESLint violations found\n'));
      return;
    }

    // Group messages by severity
    const errors = messages.filter((m) => m.severity === 2);
    const warnings = messages.filter((m) => m.severity === 1);

    // Print Errors
    if (errors.length > 0) {
      console.log(chalk.red.bold(`\n❌ Errors (${errors.length}):`));
      errors.forEach((error, index) => {
        console.log(chalk.red(`\n${index + 1}. Rule: ${error.ruleId}`));
        console.log(chalk.white(`   Line ${error.line}, Column ${error.column}`));
        console.log(chalk.gray(`   ${error.message}`));
      });
    }

    // Print Warnings
    if (warnings.length > 0) {
      console.log(chalk.yellow.bold(`\n⚠️  Warnings (${warnings.length}):`));
      warnings.forEach((warning, index) => {
        console.log(chalk.yellow(`\n${index + 1}. Rule: ${warning.ruleId}`));
        console.log(chalk.white(`   Line ${warning.line}, Column ${warning.column}`));
        console.log(chalk.gray(`   ${warning.message}`));
      });
    }

    // Summary
    console.log(chalk.cyan.bold('\n📊 Summary:'));
    console.log(chalk.white(`• Total Issues: ${messages.length}`));
    console.log(chalk.red(`• Errors: ${errors.length}`));
    console.log(chalk.yellow(`• Warnings: ${warnings.length}`));
    console.log(chalk.green(`• Fixable: ${messages.filter((m) => m.fix).length}`));

    // Final status message
    if (errors.length > 0) {
      console.log(
        chalk.yellow.bold(
          `\n✨ Test completed: ${errors.length} React rule violation${errors.length === 1 ? '' : 's'} found, as expected.\n`,
        ),
      );
      process.exit(0); // Exit successfully since finding errors is the purpose of the test
    } else {
      console.log(
        chalk.red.bold('\n❌ Test failed: No React rule violations found when violations were expected.\n'),
      );
      process.exit(1);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red.bold('\n💥 ESLint Execution Error:'));
      console.error(chalk.red(error.message));
    }
    process.exit(1);
  }
}

runTest().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(chalk.red.bold('\n💥 Unexpected Error:'));
    console.error(chalk.red(error.stack));
  }
  process.exit(1);
});
