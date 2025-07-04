# 🚀 Script Runner

A sophisticated CLI tool for choosing and executing npm/pnpm scripts with a beautiful two-level menu interface.

## Architecture

The script runner follows a modular architecture similar to React components:

```
scripts/src/script-runner/
├── script-runner.ts          # Main orchestrator
├── script-runner.types.ts    # TypeScript types
├── script-parser.utils.ts    # Script parsing & categorization
├── favorites.utils.ts        # Favorites & caching logic
├── views/                    # UI view components
│   ├── formatters.ts         # Display formatting utilities
│   ├── category-view.ts      # Category selection menu
│   ├── script-view.ts        # Script selection menu
│   └── execution-view.ts     # Script execution & confirmation
├── index.ts                  # Exports
└── README.md                 # Documentation
```

## Features

- 📦 **Two-level navigation**: Categories → Scripts
- ⭐ **Favorites system**: Hardcoded + recent selections
- 🎨 **Beautiful UI**: Emojis, colors, and clear formatting
- 🔍 **Smart categorization**: Auto-detects script categories
- 🛡️ **Safety features**: Confirmation for destructive scripts
- 💾 **Recent history**: Tracks last 5 script executions
- ⬅️ **Easy navigation**: Back buttons and ESC support

## Usage

```bash
# From project root
pnpm scripts

# Or via tsx directly
tsx scripts/src/script-runner/script-runner.ts
```

## Script Categories

The tool automatically categorizes scripts based on naming patterns:

- 🚀 **Development** - `dev.*`, `start.*`
- 🏗️ **Build & Compile** - `build.*`
- 🗄️ **Database** - `db.*`
- ✨ **Code Quality** - `lint.*`
- 🧹 **Cleanup** - `clean.*`
- 🔄 **Reset & Rebuild** - `reset.*`
- And many more...

## Favorites

### Hardcoded Favorites

- `dev`
- `dev.server`
- `dev.client`
- `db.reset.v3-RECOMMENDED`
- `db.studio`
- `build`
- `lint.fix`

### Recent Selections

The last 5 executed scripts are automatically added to favorites.

## Indicators

- ⭐ **Favorite script**
- 🔥 **Recommended script** (contains "RECOMMENDED", "preferred", etc.)
- `[category]` **Category indicator** (in favorites view)

## Navigation

- **Arrow keys**: Navigate up/down
- **Enter**: Select item
- **ESC/Ctrl+C**: Quit
- **⬅️ Back**: Return to previous level

## Cache Location

Recent selections are cached at:

```
~/.touch-monorepo/script-runner-favorites.json
```

## Safety Features

- **Destructive script detection**: Scripts containing keywords like `drop`, `clean`, `reset` require confirmation
- **Execution feedback**: Shows command being run and execution time
- **Error handling**: Graceful error handling with clear messages

## Example Output

```
🚀 Script Runner - Choose and execute npm scripts

📄 Parsing package.json scripts...
📊 Found 66 scripts in 17 categories

? 📦 Select a script category:
❯ ⭐ Favorites (7 scripts)
  🚀 Development 3⭐ (4 scripts)
  🏗️ Build & Compile 1⭐ (4 scripts)
  🗄️ Database 2⭐ 1🔥 (17 scripts)
  ✨ Code Quality 1⭐ (10 scripts)
```
