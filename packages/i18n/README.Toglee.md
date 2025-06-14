# Toglee - i18n Management

#### Remote Project: `SERVI_FRESC`

<https://app.tolgee.io/projects/18817>

#### local setup

```sh
pnpm add -D @tolgee/cli --filter @workspace/i18n
```

---

## `toglee --help`

```sh

⬢  Node Task List
? Select a task to run:         tolgee:help › tolgee --help

> @workspace/i18n@0.0.1 tolgee:help
> tolgee --help

Usage: tolgee [options] [command]

Command Line Interface to interact with the Tolgee Platform

Options:
  -V, --version                    output the version number
  -v, --verbose [rules...]         Enable verbose logging. If you want more info to be logged pass an option. (choices: "extractor")
  -c, --config [config]            A path to tolgeerc config file.
  -au, --api-url <url>             The url of Tolgee API. (default: "https://app.tolgee.io/")
  -ak, --api-key <key>             Tolgee API Key. Can be a Project API Key or a Personal Access Token. (env: TOLGEE_API_KEY)
  -p, --project-id <id>            Project ID. Only required when using a Personal Access Token. (default: -1)
  --format <format>                Localization files format. (choices: "JSON_TOLGEE", "JSON_ICU", "JSON_I18NEXT", "JSON_JAVA", "JSON_PHP", "JSON_RUBY",
                                   "JSON_C", "PO_PHP", "PO_C", "PO_JAVA", "PO_ICU", "PO_RUBY", "PO_PYTHON", "APPLE_STRINGS", "APPLE_XLIFF",
                                   "APPLE_XCSTRINGS", "PROPERTIES_ICU", "PROPERTIES_JAVA", "ANDROID_XML", "COMPOSE_XML", "FLUTTER_ARB", "CSV_ICU",
                                   "CSV_JAVA", "CSV_PHP", "CSV_RUBY", "YAML_RUBY", "YAML_JAVA", "YAML_ICU", "YAML_PHP", "XLIFF_ICU", "XLIFF_JAVA",
                                   "XLIFF_PHP", "XLIFF_RUBY", "RESX_ICU", "XLSX_ICU", "XLSX_JAVA", "XLSX_PHP", "XLSX_RUBY", default: "JSON_TOLGEE")
  -e, --extractor <extractor>      A path to a custom extractor to use instead of the default one.
  -pt, --patterns <patterns...>    File glob patterns to include (hint: make sure to escape it in quotes, or your shell might attempt to unroll some tokens
                                   like *)
  --parser <parser>                Override parser detection. (choices: "react", "vue", "svelte", "ngx")
  --no-strict-namespace            No require namespace to be reachable, use if you don't use namespaces.
  --default-namespace <namespace>  Default namespace used in extraction if not specified otherwise.
  -h, --help                       display help for command

Commands:
  login [options] [API Key]        Login to Tolgee with an API key. You can be logged into multiple Tolgee instances at the same time by using --api-url
  logout [options]                 Logs out of Tolgee
  push [options]                   Pushes translations to Tolgee
  pull [options]                   Pulls translations from Tolgee
  extract                          Extracts strings from your projects
  compare                          Compares the keys in your code project and in the Tolgee project.
  sync [options]                   Synchronizes the keys in your code project and in the Tolgee project, by creating missing keys and optionally deleting
                                   unused ones. For a dry-run, use `tolgee compare`.
  tag [options]                    Update tags in your project.
  help [command]                   display help for command

```


---

Perfect! Let's get Tolgee set up properly. Here's the step-by-step approach I recommend:

## 🚀 **Phase 1: Tolgee Account & Project Setup**

### **1. Create Tolgee Account**

1. Go to [app.tolgee.io](https://app.tolgee.io)
2. Sign up (free tier: 1000 strings, unlimited languages - perfect for your needs)
3. Verify email

### **2. Create Your Project**

1. Click "Create Project"
2. Name: `SERVI_FRESC`
3. Languages: Add `English (en)`, `Spanish (es)`, `Catalan (cat)`
4. Set English as base language

## 🛠️ **Phase 2: Install Dependencies**

Let me set up the necessary packages:

```bash
cd packages/i18n && npm install @tolgee/cli --save-dev
```

Let me try a different approach with pnpm since you're using a monorepo:

```bash
pnpm add -D @tolgee/cli --filter @workspace/i18n
```

Great! Now let me also install the client-side Tolgee integration for the web interface:

```bash
pnpm add @tolgee/react --filter client
```

```bash
pnpm add @tolgee/react --filter client --force
```

Perfect! Now let me create the Tolgee configuration files:
Let me add the package.json scripts for easier Tolgee management:
Read file: packages/i18n/package.json


Perfect! Now let me provide you with the complete setup guide:

## 🎯 Complete Tolgee Setup Guide

### Phase 1: Account & Project Setup

1. **Create Account**: Go to [app.tolgee.io](https://app.tolgee.io) and sign up
2. **Create Project**:
   - Name: `SERVI_FRESC`
   - Languages: `English (en)`, `Spanish (es)`, `Catalan (cat)`
   - Base language: `English`
3. **Get Credentials**:
   - Go to Project Settings → API Keys
   - Create a new API key with `translations.edit` permission
   - Copy the Project ID and API Key

### Phase 2: Configuration

1. **Update Tolgee Config**:

   ```bash
   # Edit packages/i18n/tolgee.config.js
   # Replace YOUR_PROJECT_ID and YOUR_API_KEY with actual values
   ```

2. **Create Environment File**:

   ```bash
   # Create packages/i18n/.env
   TOLGEE_PROJECT_ID=your_actual_project_id
   TOLGEE_API_KEY=your_actual_api_key
   TOLGEE_API_URL=https://app.tolgee.io
   ```

### **Phase 3: Initial Upload**

1. **Push existing translations**:

   ```bash
   cd packages/i18n
   pnpm run tolgee:init    # Initialize Tolgee config
   pnpm run tolgee:push    # Upload your existing translations
   ```

### Phase 4: Integration Strategy

I recommend a **hybrid approach**:

#### 📁 Translation Management Split

- **`common/`** → Keep developer-managed (shared across projects)
- **`app/`** → Move key sections to Tolgee (pages, components)
- **`dynamic/`** → Full Tolgee management (perfect for client)

#### 🔄 Workflow

1. **Developer**: Manages `common/` translations locally
2. **Client**: Manages `dynamic/` content via Tolgee web UI
3. **Mixed**: `app/` content can be managed by both

### Phase 5: Database Integration

For your drink_types and container_types, the pattern would be:

```typescript
// In your components:
const drinkTypeName = t(`drink_types.${drinkTypeKey}`);
const containerName = t(`container_types.${containerKey}`);
```

### Phase 6: Available Commands

```bash
# In packages/i18n/
pnpm run tolgee:push      # Upload local changes to Tolgee
pnpm run tolgee:pull      # Download changes from Tolgee
pnpm run tolgee:status    # Check sync status
pnpm run translations:sync # Pull + build (for CI/CD)
```

## 🚀 Recommended Next Steps

1. **Set up Tolgee account** (you)
2. **Get credentials** and update config
3. **Test initial push** of existing translations
4. **Start with `dynamic/` translations** for database content
5. **Gradually move `app/` keys** to Tolgee as needed

This setup gives you:
- ✅ **Client-friendly** translation management
- ✅ **Developer control** over core translations
- ✅ **Seamless integration** with existing code
- ✅ **Build-time optimization** (no runtime API calls)

Ready to proceed with the Tolgee account setup? Once you have the credentials, we can test the initial sync!


---

## `togglee.config.js`

```js

module.exports = {
  // Your Tolgee project configuration
  projectId: 'YOUR_PROJECT_ID', // Replace with actual project ID from Tolgee
  apiKey: 'YOUR_API_KEY', // Replace with actual API key

  // File paths for different translation types
  patterns: {
    // Dynamic content that client will manage
    'src/translations/dynamic/*.json': {
      keyDelimiter: '.',
      nested: true,
      namespaceSeparator: false
    },

    // App-specific content (mixed management)
    'src/translations/app/*.json': {
      keyDelimiter: '.',
      nested: true,
      namespaceSeparator: false
    }
  },

  // Languages to sync
  languages: ['en', 'es', 'cat'],

  // Default language (source)
  defaultLanguage: 'en',

  // Push/pull configuration
  push: {
    removeOtherKeys: false, // Keep existing keys
    forceMode: false,       // Don't overwrite without confirmation
  },

  pull: {
    overwrite: true,        // Overwrite local files when pulling
  }
};


```
