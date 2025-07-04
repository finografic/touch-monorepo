import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
import type { ScriptInfo } from '../script-runner.types';
import { addToRecentSelections } from '../favorites.utils';

/**
 * Check if a script is potentially destructive
 */
function isDestructiveScript(script: ScriptInfo): boolean {
  const destructivePatterns = ['drop', 'clean', 'reset', 'delete', 'remove', 'purge'];
  return destructivePatterns.some(
    (pattern) =>
      script.fullName.toLowerCase().includes(pattern) || script.command.toLowerCase().includes(pattern),
  );
}

/**
 * Ask for confirmation before executing a destructive script
 */
async function confirmDestructiveScript(): Promise<boolean> {
  return await confirm({
    message: chalk.yellow(`⚠️  This script appears to be destructive. Continue?`),
    default: false,
  });
}

/**
 * Execute a script with proper feedback and error handling
 */
export async function executeScript(scriptInfo: ScriptInfo): Promise<void> {
  const { name, command, fullName } = scriptInfo;

  // Show execution info
  console.log(chalk.blue(`\n🔄 Executing: ${chalk.bold(name)}`));
  console.log(chalk.dim(`Command: ${command}\n`));

  // Check for destructive scripts and ask for confirmation
  if (isDestructiveScript(scriptInfo)) {
    const shouldProceed = await confirmDestructiveScript();

    if (!shouldProceed) {
      console.log(chalk.yellow('⏹️  Script execution cancelled.'));
      return;
    }
  }

  try {
    // Add to recent selections before execution
    addToRecentSelections(fullName);

    // Execute the script
    const startTime = Date.now();
    execSync(`pnpm ${fullName}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    const duration = Date.now() - startTime;
    console.log(chalk.green(`\n✅ Script completed successfully in ${duration}ms`));
  } catch (error) {
    console.error(chalk.red('\n❌ Script execution failed:'));
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    throw error;
  }
}

/**
 * Ask if the user wants to run another script
 */
export async function askRunAnother(): Promise<boolean> {
  return await confirm({
    message: chalk.cyan('🔄 Run another script?'),
    default: true,
  });
}

/**
 * Show goodbye message
 */
export function showGoodbyeMessage(): void {
  console.log(chalk.blue('\n👋 Goodbye!'));
}
