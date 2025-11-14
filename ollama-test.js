#!/usr/bin/env node

/**
 * Ollama Test Script - Node.js
 *
 * Tests local Ollama connection with streaming support
 *
 * Usage:
 *   ollama-test "Your prompt here"
 *   ollama-test --model llama2 "Your prompt"
 *   ollama-test --list (list available models)
 *   ollama-test --check (check connection only)
 *
 * Installation (make global):
 *   chmod +x ollama-test.js
 *   ln -s $(pwd)/ollama-test.js ~/bin/ollama-test
 *   # Then use from anywhere: ollama-test "prompt"
 */

const OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3:latest';
const TIMEOUT = 30000; // 30 seconds

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}❌${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset} ${msg}`),
  debug: (msg) => console.log(`${colors.gray}→${colors.reset} ${msg}`),
};

/**
 * Check if Ollama server is running
 */
async function checkOllamaConnection() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    log.success(`Ollama is running at ${OLLAMA_URL}`);
    return true;
  } catch (e) {
    log.error(`Cannot reach Ollama at ${OLLAMA_URL}\n` + `Make sure Ollama is running: ${e.message}`);
    return false;
  }
}

/**
 * List available models
 */
async function listModels() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();

    if (!data.models || data.models.length === 0) {
      log.info('No models downloaded yet. Download one in the Ollama app.');
      return;
    }

    log.success(`Available models (${data.models.length}):`);
    data.models.forEach((model) => {
      const size = (model.size / 1024 / 1024 / 1024).toFixed(2);
      console.log(`  ${colors.blue}→${colors.reset} ${model.name} (${size}GB)`);
    });
  } catch (e) {
    log.error(`Failed to list models: ${e.message}`);
  }
}

/**
 * Run prompt with streaming response
 */
async function runOllamaStreaming(prompt, model = DEFAULT_MODEL) {
  try {
    log.info(`Using model: ${colors.blue}${model}${colors.reset}`);
    log.debug('Sending request...\n');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Ollama error ${response.status}: ${err}`);
    }

    // Stream the response
    console.log(`${colors.green}Response:${colors.reset}\n`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const json = JSON.parse(line);
          if (json.response) {
            process.stdout.write(json.response);
          }
        } catch (e) {
          // Skip parse errors
        }
      }
    }

    console.log(`\n\n${colors.green}✅ Response complete${colors.reset}`);
  } catch (e) {
    if (e.name === 'AbortError') {
      log.error(`Request timeout (${TIMEOUT / 1000}s) - model took too long`);
    } else {
      log.error(`Failed to run prompt: ${e.message}`);
    }
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
${colors.blue}Ollama Test Script${colors.reset}

Usage:
  node ollama-test.js "Your prompt here"
  node ollama-test.js --model llama2 "Your prompt"
  node ollama-test.js --list
  node ollama-test.js --check

Or if installed to ~/bin:
  ollama-test "Your prompt here"
  ollama-test --model llama2 "Your prompt"
  ollama-test --list
  ollama-test --check

Options:
  --list              List all downloaded models
  --check             Check Ollama connection status
  --model <name>      Specify model (default: ${DEFAULT_MODEL})
  --help, -h          Show this help message

Installation as global command:
  1. chmod +x ollama-test.js
  2. ln -s $(pwd)/ollama-test.js ~/bin/ollama-test
  3. Make sure ~/bin is in your PATH
  4. Then use from anywhere: ollama-test "prompt"
    `);
    return null;
  }

  let model = DEFAULT_MODEL;
  let prompt = '';
  let command = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--list') {
      command = 'list';
    } else if (args[i] === '--check') {
      command = 'check';
    } else if (args[i] === '--model' && args[i + 1]) {
      model = args[i + 1];
      i++;
    } else {
      prompt += (prompt ? ' ' : '') + args[i];
    }
  }

  return { command, model, prompt };
}

/**
 * Main entry point
 */
async function main() {
  const parsed = parseArgs();

  if (parsed === null) {
    return;
  }

  // Check connection first
  const isConnected = await checkOllamaConnection();
  if (!isConnected) {
    return;
  }

  if (parsed.command === 'list') {
    await listModels();
  } else if (parsed.command === 'check') {
    log.success('Ollama is ready!');
  } else if (parsed.prompt) {
    await runOllamaStreaming(parsed.prompt, parsed.model);
  } else {
    log.error('No prompt provided. Use --help for usage info.');
  }
}

main().catch((e) => {
  log.error(`Unexpected error: ${e.message}`);
  process.exit(1);
});
