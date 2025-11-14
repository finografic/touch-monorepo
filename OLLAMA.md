# Ollama Local AI Setup

## Overview

Local AI models running on your Mac for **private, offline development assistance**. No cloud, no API keys, no data leaving your machine.

```
Ollama.app (Server: localhost:11434)
├── Model: llama3:latest (4.3GB)
├── Model: gpt-oss:20b (12.8GB)
└── Serves multiple clients:
    ├── Continue Extension (Cursor IDE)
    ├── Terminal: ollama-test script
    └── Any tool connecting to localhost:11434
```

---

## Setup

### Prerequisites

- ✅ **Ollama.app** installed and running
- ✅ **Continue Extension** installed in Cursor
- ✅ **Node 18+** (for ollama-test script)

### Quick Start

1. **Start Ollama.app** (leave running in background)
2. **Open Cursor** → Continue panel opens automatically
3. **Start chatting** with local llama3:latest model

---

## Usage

### Option 1: Continue Extension (Recommended for Development)

In Cursor IDE:

```
Click Continue panel → Type your question → Get response

Best for:
- Code generation
- Refactoring suggestions
- Documentation
- Real-time IDE assistance
```

### Option 2: Terminal Script

```bash
# Quick test
ollama-test "Explain Node.js modules"

# With specific model
ollama-test --model gpt-oss:20b "Generate TypeScript interface"

# List available models
ollama-test --list

# Check Ollama status
ollama-test --check
```

Best for:
- Scripting & automation
- Batch processing
- CI/CD integration
- Offline analysis

### Option 3: Ollama.app Window

- Model management (download, delete)
- System monitoring
- Settings

**Note:** Not a chat interface - just for admin tasks.

---

## Use Cases

### Use Case 1: Rapid Component Refactoring

**Scenario:** You need to extract the ProfilesPanel component.

```
1. Open Continue in Cursor
2. Ask: "@OrdersForm.tsx Extract the Panel section into a new component.
          Keep state local. Create accompanying styles file."
3. Continue generates the component structure
4. Review & refine
5. Done! ✅
```

**Benefit:** No cloud calls, instant feedback, private code.

---

### Use Case 2: Script Generation & Debugging

**Scenario:** Need to generate a utility script for your monorepo.

```bash
# Terminal approach
ollama-test "Generate a Node.js script that validates
            JSON files in a directory and reports errors"

# Output streams to terminal, ready to use
# Copy into your project, customize as needed
```

**Benefit:** Quick, offline, great for repetitive tasks.

---

## Architecture

### Single Instance, Multiple Clients

```
Your Mac
└── Ollama Server (Port 11434)
    └── Stores models locally
    └── Processes requests

All clients connect to same instance:
├── Client 1: Continue (Cursor IDE)
├── Client 2: ollama-test (terminal)
└── Client 3: Any tool at localhost:11434

Benefits:
✅ No duplication
✅ Shared models
✅ 100% local/private
✅ Zero cloud exposure
```

---

## Configuration

### Default Settings

- **Server:** `http://localhost:11434`
- **Default Model:** `llama3:latest`
- **Alternative Model:** `gpt-oss:20b`
- **Timeout:** 30 seconds

### Files

- **Script:** `/Users/justin/bin/ollama-test`
- **Source:** `/Users/justin/repos-finografic/touch-monorepo/ollama-test.js`
- **Config:** `~/.continue/config.yaml`

---

## Troubleshooting

### "Cannot reach Ollama"

```bash
# Check if running
ollama-test --check

# Make sure Ollama.app is open
# Check: lsof -i :11434
```

### "Model not found"

```bash
# List available models
ollama-test --list

# Download new model in Ollama.app
```

### Slow responses

- Model is processing (first run is slower)
- Try smaller model: `gpt-oss:20b` instead of `llama3:latest`
- Check Mac resources (Activity Monitor)

---

## Privacy & Security

✅ **All processing local:** No data leaves your Mac
✅ **Perfect for work machine:** No company data to cloud
✅ **Offline capable:** Works without internet (after model download)
✅ **No accounts/logins:** Just the app running locally

---

## Next Steps

- **Explore:** Use Continue for your next refactoring task
- **Automate:** Create scripts using ollama-test
- **Download more models:** Add specialized models from Ollama.app
- **Integrate:** Use in your development workflows

---

## Resources

- [Ollama](https://ollama.ai)
- [Continue.dev](https://continue.dev)
- Script: `ollama-test --help`

