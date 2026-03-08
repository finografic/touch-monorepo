/**
 * server/icons-server.ts
 *
 * Minimal Hono HTTP server for the icon picker workflow.
 *
 * Routes:
 *   GET  /api/icons-json  → returns current src/icons.json as JSON array
 *   POST /api/icons-json  → validates + writes src/icons.json, runs generate in-process
 *
 * Started via:
 *   pnpm icons.server  — server only (called by root `pnpm dev`)
 *   pnpm icons.config  — server + picker UI together (concurrently)
 *
 * Port: starts at 3001, auto-increments if busy.
 * The actual port is written to lucide-manager.config.json so the picker
 * always connects to the right URL.
 *
 * This server is dev-only. It is not part of the package build output.
 */

import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import pc from 'picocolors';

// ── Paths ──────────────────────────────────────────────────────────────────────

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const jsonPath = path.join(root, 'src', 'icons.json');
const configPath = path.join(root, 'lucide-manager.config.json');

// ── Port discovery ─────────────────────────────────────────────────────────────

function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => resolve(port));
    });
    server.on('error', () => resolve(findAvailablePort(startPort + 1)));
  });
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface IconEntry {
  lucideName: string;
  exportName: string;
}

// ── Generate (in-process) ─────────────────────────────────────────────────────

/**
 * Runs codegen in-process. generate() is an exported function (not a
 * top-level side effect) so ESM module caching is not an issue —
 * the import is cached once, the function is called fresh each time.
 */
async function runGenerate(): Promise<void> {
  const { generate } = await import('../scripts/generate.ts');
  generate();
}

// ── App ────────────────────────────────────────────────────────────────────────

const app = new Hono();

// Allow the picker UI (Vite dev server on a different port) to call this server
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  }),
);

// ── GET /api/icons-json ───────────────────────────────────────────────────────

app.get('/api/icons-json', async (c) => {
  try {
    const content = fs.readFileSync(jsonPath, 'utf8');
    return c.json(JSON.parse(content));
  } catch (err) {
    console.error('[icons-server] Failed to read icons.json:', err);
    return c.json({ error: 'Failed to read icons.json' }, 500);
  }
});

// ── POST /api/icons-json ──────────────────────────────────────────────────────

app.post('/api/icons-json', async (c) => {
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  // Basic shape validation — must be an array of { lucideName, exportName }
  if (!Array.isArray(body)) {
    return c.json({ error: 'Body must be a JSON array' }, 400);
  }

  for (const entry of body) {
    if (
      typeof entry !== 'object' ||
      entry === null ||
      typeof (entry as IconEntry).lucideName !== 'string' ||
      typeof (entry as IconEntry).exportName !== 'string'
    ) {
      return c.json({ error: 'Each entry must have lucideName and exportName strings' }, 400);
    }
  }

  const entries = body as IconEntry[];

  // Write icons.json — exportName first so the file reads alphabetically
  const ordered = entries.map(({ exportName, lucideName }) => ({ exportName, lucideName }));
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(ordered, null, 2) + '\n', 'utf8');
  } catch (err) {
    console.error('[icons-server] Failed to write icons.json:', err);
    return c.json({ error: 'Failed to write icons.json' }, 500);
  }

  // Run generate in-process
  try {
    await runGenerate();
  } catch (err) {
    // icons.json was saved successfully — generation failure shouldn't block the picker.
    // Log the error and return a partial-success response so the UI can surface it.
    console.error('[icons-server] Generate failed:', err);
    return c.json({ ok: true, count: entries.length, generateError: String(err) }, 200);
  }

  return c.json({ ok: true, count: entries.length });
});

// ── Start ─────────────────────────────────────────────────────────────────────

const port = await findAvailablePort(5001);
const serverUrl = `http://localhost:${port}`;

// Write the actual port to lucide-manager.config.json so the picker connects
// to the right URL regardless of which port we landed on.
fs.writeFileSync(configPath, JSON.stringify({ serverUrl }, null, 2) + '\n', 'utf8');

serve({ fetch: app.fetch, port }, () => {
  console.log('');
  console.log(`  ${pc.cyan('●')}  Icons Server:  ${pc.cyan(serverUrl)}`);
  console.log('');
});
