#!/usr/bin/env node
/**
 * Touch Monorepo Production Server Startup Script
 * Auto-generated production launcher
 */

import { spawn } from 'child_process';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { killPortIfOccupied } from './ports.utils.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname_resolved = dirname(__filename);

// Load environment variables from dist directory
import dotenv from 'dotenv';
const envPath = path.join(__dirname_resolved, 'dist/.env.production');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ Loaded environment from:', envPath);
} else {
  console.log('⚠️  Environment file not found:', envPath);
}

console.log('🚀 Starting Touch Monorepo Production Server...');
console.log('📍 Working directory:', __dirname_resolved);

// Ensure ports are available
console.log('🔧 Checking for occupied ports...');
killPortIfOccupied('4040');
// killPortIfOccupied('3000');

// Verify required files exist
const serverPath = path.join(__dirname_resolved, 'dist/server/index.js');
const clientPath = path.join(__dirname_resolved, 'dist/client/index.html');
const dbPath = path.join(__dirname_resolved, 'dist/data/db/production.sqlite.db');

console.log('🔍 Checking required files...');
if (!existsSync(serverPath)) {
  console.error('❌ Server file not found:', serverPath);
  process.exit(1);
}
if (!existsSync(clientPath)) {
  console.error('❌ Client files not found:', clientPath);
  process.exit(1);
}
if (!existsSync(dbPath)) {
  console.error('❌ Database file not found:', dbPath);
  process.exit(1);
}

console.log('✅ All required files found');

// Set up environment for server
const serverEnv = {
  ...process.env,
  NODE_ENV: 'production',
  DATABASE_URL: path.join(__dirname_resolved, 'dist/data/db/production.sqlite.db'),
  DB_NAME: 'production.sqlite.db',
  UPLOAD_DIR: path.join(__dirname_resolved, 'dist/data/uploads'),
  // Disable pino worker threads to prevent crashes
  PINO_DISABLE_WORKER_THREADS: 'true',
  PINO_LOG_LEVEL: 'info',
};

console.log('🏗️  Starting server process...');

// Start server (using .js extension for ESM bundle)
const server = spawn('node', ['dist/server/index.js'], {
  cwd: __dirname_resolved,
  stdio: 'inherit',
  env: serverEnv,
});

server.on('error', (error) => {
  console.error('❌ Server failed to start:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log('🛑 Server process exited with code ' + code);
  process.exit(code || 0);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});

console.log('');
console.log('🌟 Touch Monorepo Server is running!');
console.log('🌐 Server: http://localhost:4040');
console.log('🎨 To serve the client, run: node start-client.js');
console.log('');
console.log('Press Ctrl+C to stop');
