// Simple Node script to call Ollama from the local IDE terminal.
// ---------------------------------------------------------------
// Requires Node 18+ (built‑in fetch). If you’re on an older Node
// version, replace the fetch block with the axios example below.

const MODEL = 'llama3'; // change to the model you pulled
const PROMPT = process.argv.slice(2).join(' ') || 'Hello, world!';

async function runOllama(prompt) {
  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Ollama error ${response.status}: ${err}`);
    }

    const data = await response.json();
    console.log('✅ Ollama reply:');
    console.log(data.message.content);
  } catch (e) {
    console.error('❌ Failed to contact Ollama:', e.message);
  }
}

runOllama(PROMPT);
