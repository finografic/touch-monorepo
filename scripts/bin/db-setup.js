#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { config } from '@dotenvx/dotenvx';
import { checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import { execSync } from 'node:child_process';

var findScriptConfigFile = (configNames, startDir = process.cwd()) => {
  let dir = startDir;
  while (true) {
    for (const name of configNames) {
      const candidate = path.join(dir, name);
      if (fs.existsSync(candidate)) return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
};
var ROOT_MARKERS = ["pnpm-workspace.yaml", "package.json", ".git"];
var findProjectRoot = (startDir = process.cwd()) => {
  let dir = startDir;
  while (true) {
    if (ROOT_MARKERS.some((marker) => fs.existsSync(path.join(dir, marker)))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
};

// src/db-setup/schemas.config.ts
var PATH_FOLDER_ENV = "apps/server";
var PATH_FOLDER_SCHEMAS = "apps/server/src/db/schemas";
var PATH_FILES_CONFIG = ["scripts/seed.config.ts", "seed.config.ts"];
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
    throw new Error("No config file found! Please create a seed.config.ts or seed.config.js file.");
  }
  try {
    const configModule = await import(configPath);
    return { seedOrder: configModule.seedOrder };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ERR_UNKNOWN_FILE_EXTENSION") {
      console.error(chalk.red("\n\u274C Error loading TypeScript config file."));
      console.error(chalk.yellow("Please either:"));
      console.error(chalk.yellow("1. Use a .js extension for your config file"));
      console.error(chalk.yellow("2. Run with tsx if you want to keep the .ts extension"));
      process.exit(1);
    }
    console.error(chalk.red(`\u274C Error loading config from ${configPath}:`), error);
    process.exit(1);
  }
};
var getAllSchemas = ({ seedOrder }) => seedOrder.map((config2) => config2.name);
var validateDependencies = ({
  seedOrder,
  selectedSchemas
}) => {
  const missing = [];
  selectedSchemas.forEach((schema) => {
    const config2 = seedOrder.find((c) => c.name === schema);
    if (config2?.dependencies) {
      const missingDeps = config2.dependencies.filter((dep) => !selectedSchemas.includes(dep));
      if (missingDeps.length > 0) {
        missing.push({ schema, dependencies: missingDeps });
      }
    }
  });
  return missing;
};
var getSortedSchemas = ({
  seedOrder,
  selectedSchemas
}) => {
  const result = [];
  const visited = /* @__PURE__ */ new Set();
  function visit(schema) {
    if (visited.has(schema)) return;
    const config2 = seedOrder.find((c) => c.name === schema);
    if (config2?.dependencies) {
      config2.dependencies.forEach((dep) => {
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
var getSchemaSelection = async ({ seedOrder }) => {
  const schemasDir = path.join(process.cwd(), PATH_FOLDER_SCHEMAS);
  if (!fs.existsSync(schemasDir)) {
    console.error(chalk.red(`\u274C Schemas directory not found: ${schemasDir}`));
    process.exit(1);
  }
  const schemas = getAllSchemas({ seedOrder }).filter((schema) => !SCHEMAS_BLOCKLIST.includes(schema));
  if (schemas.length === 0) {
    console.warn(chalk.yellow("\u26A0\uFE0F No schema files found"));
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
  const missingDeps = validateDependencies({ seedOrder, selectedSchemas });
  if (missingDeps.length > 0) {
    console.error(chalk.red("\n\u274C Missing dependencies:"));
    missingDeps.forEach(({ schema, dependencies }) => {
      console.error(chalk.red(`  ${schema} requires: ${dependencies.join(", ")}`));
    });
    process.exit(1);
  }
  return getSortedSchemas({ seedOrder, selectedSchemas });
};

// src/db-setup/db-setup.ts
console.log("--- [db-setup] Script started ---");
var nodeEnv = process.env.NODE_ENV || "development";
console.log("[db-setup] NODE_ENV:", nodeEnv);
if (!["development", "test", "production"].includes(nodeEnv)) {
  console.warn(chalk.yellow(`\u26A0\uFE0F Unexpected NODE_ENV: ${nodeEnv}, defaulting to development`));
}
var envPath = path.resolve(process.cwd(), `${PATH_FOLDER_ENV}/.env.${nodeEnv}`);
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
async function main() {
  try {
    console.log("[db-setup] About to show operations prompt...");
    const operations = await checkbox({
      message: "Select operations to perform",
      choices: [
        { name: "Seed data", value: "seed", checked: true },
        { name: "Run migrations", value: "migrate", checked: false },
        { name: "Generate migrations", value: "generate", checked: false }
      ]
    });
    console.log("[db-setup] Operations selected:", operations);
    if (operations.length === 0) {
      console.log("No operations selected. Exiting...");
      process.exit(0);
    }
    console.log("[db-setup] Loading seed config...");
    const { seedOrder } = await loadSeedConfig();
    console.log("[db-setup] Loaded seedOrder:", seedOrder);
    const schemas = operations.includes("seed") ? await getSchemaSelection({ seedOrder }) : [];
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
