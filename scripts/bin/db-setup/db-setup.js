#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { config } from '@dotenvx/dotenvx';
import { checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
import { loadSeedConfig, getSchemaSelection } from './schemas.utils';
import { PATH_FOLDER_ENV } from './schemas.config';
import { viewConfigs } from '../../db-setup.config';
import { sqliteAny } from '../../../apps/server/src/db/db.adapter';

const autoConfirm = process.argv.includes("-y") || process.argv.includes("--yes");
console.log("--- [db-setup] Script started ---");
const nodeEnv = process.env.NODE_ENV || "development";
console.log("[db-setup] NODE_ENV:", nodeEnv);
if (!["development", "test", "production"].includes(nodeEnv)) {
  console.warn(chalk.yellow(`\u26A0\uFE0F Unexpected NODE_ENV: ${nodeEnv}, defaulting to development`));
}
const envPath = path.resolve(process.cwd(), `${PATH_FOLDER_ENV}/.env.${nodeEnv}`);
console.log("[db-setup] Looking for env file at:", envPath);
if (!fs.existsSync(envPath)) {
  console.error(chalk.red(`\u274C Environment file not found: ${envPath}`));
  process.exit(1);
}
config({ path: envPath });
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
      console.log(chalk.blue(`
Seeding ${schema}...`));
      const seedName = schema.startsWith("auth_") ? schema.replace("auth_", "") : schema;
      console.log(`[db-setup] Seeding: ${seedName}`);
      execSync(`pnpm --filter @workspace/server db.migrations.seed ${seedName}`, {
        stdio: "inherit"
      });
      console.log(chalk.green(`\u2705 Seeded ${schema} successfully!`));
    } catch (error) {
      console.error(chalk.red(`\u274C Error seeding ${schema}:`), error);
      throw error;
    }
  }
}
async function createViews() {
  for (const view of viewConfigs) {
    const sqlPath = path.resolve(process.cwd(), "apps/server/src/db/views", `${view.name}.sql`);
    if (!fs.existsSync(sqlPath)) {
      console.warn(chalk.yellow(`View SQL file not found: ${sqlPath}`));
      continue;
    }
    const sql = fs.readFileSync(sqlPath, "utf-8");
    try {
      console.log(chalk.blue(`Dropping view if exists: ${view.name}`));
      sqliteAny.exec(`DROP VIEW IF EXISTS ${view.name};`);
      console.log(chalk.blue(`Creating view: ${view.name}`));
      sqliteAny.exec(sql);
      console.log(chalk.green(`\u2705 Created view: ${view.name}`));
    } catch (err) {
      console.error(chalk.red(`\u274C Error creating view ${view.name}:`), err);
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
      console.log(chalk.blue("\n1. Generating migrations..."));
      await generateMigrations();
    }
    if (operations.includes("migrate")) {
      console.log(chalk.blue("\n2. Running migrations..."));
      await runMigrations();
    }
    if (operations.includes("seed")) {
      console.log(chalk.blue("\n3. Seeding data..."));
      await seedData(schemas);
    }
    if (operations.includes("views")) {
      console.log(chalk.blue("\n4. Creating views..."));
      await createViews();
    }
    console.log("--- [db-setup] Script finished ---");
  } catch (error) {
    console.error(chalk.red("\n\u274C Unexpected error:"));
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

export { db_setup_default as default, main };
