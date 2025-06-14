# @finografic/i18n



## Lokalize - VSCode extension

```sh

💼 Workspace root changed to "/Users/justin/repos-finografic/touch-monorepo"
🌞 Enabled
🧩 Enabled frameworks: React, i18next, React I18next
🧬 Enabled parsers: json, yaml, json5

🚀 Initializing loader "/Users/justin/repos-finografic/touch-monorepo"
📂 Directory structure: file
🗃 Custom Path Matcher: translations/{locale}.json
🗃 Path Matcher Regex: /^translations\/(?<locale>[\w-_]+)\.json$/

📂 Loading locales under touch-monorepo/packages/i18n/src/translations

👀 Watching change on touch-monorepo/packages/i18n/src/translations
✅ Loading finished

```

---

## Toglee - i18n Management

#### Remote Project: `SERVI_FRESC`

<https://app.tolgee.io/projects/18817>

#### local setup

```sh
pnpm add -D @tolgee/cli --filter @workspace/i18n
```

---


## Login

```sh

tolgee login "tgpak_ge4dqmjxl5wgqodhofwday3nmftdomlem44toy3pmzqxaz3movvq"

```


---

## Toglee - SCRIPTS

Absolutely! Looking at your nice organized package.json structure, let's update those Tolgee scripts to use the **explicit commands that we know work**. The generic scripts we had might not work properly without the specific parameters.
Perfect! 🎉 Now you have a complete set of **organized Tolgee scripts** that match your package.json style:

## 🚀 **New Tolgee Workflow Commands**

### **For Dynamic Content** (client-managed database translations)

```bash
pnpm run tolgee:push:dynamic    # Upload drink_types, container_types, etc.
pnpm run tolgee:pull:dynamic    # Download client's edits
```

### **For App Content** (mixed management)

```bash
pnpm run tolgee:push:app        # Upload pages, components, etc.
pnpm run tolgee:pull:app        # Download any app translation edits
```

### **For Everything**

```bash
pnpm run tolgee:push:all        # Upload all translations
pnpm run tolgee:pull:all        # Download all translations
pnpm run translations:sync      # Pull all + rebuild package
```

## 🎯 **Recommended Usage**

- **`tolgee:pull:dynamic`** - Most common (after client edits database content)
- **`translations:sync`** - For CI/CD or major updates
- **`tolgee:push:dynamic`** - When you add new database tables/fields

This gives you **granular control** over which translations to sync, which is perfect for your **two-tier translation system**:
- **Common** (developer-managed locally)
- **Dynamic** (client-managed via Tolgee)
- **App** (mixed management)

Try testing one now:

```bash
pnpm run tolgee:pull:dynamic
```

Ready to check your Tolgee web interface to see your uploaded translations! 🌟

