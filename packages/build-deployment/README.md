# Touch Monorepo Deployment Builder

A modular deployment system for creating cross-platform, standalone distributions of the Touch Monorepo application.

## Features

- **Cross-platform**: Windows, Linux, macOS, Universal
- **Architecture support**: x64, ARM64, Universal
- **Standalone packaging**: Self-contained deployments with minimal deps
- **Dynamic host detection**: Client uses `window.location.hostname` at runtime — works on localhost and LAN
- **Automatic setup scripts**: Platform-specific installation and startup
- **Zip archives**: Timestamped archives for distribution

## Quick Start

```bash
# Interactive mode (prompts for options)
pnpm build.deployment

# Platform-specific
pnpm build.deployment --platform linux --arch arm64 --zip

# Standalone with zip
pnpm build.deployment --standalone --zip
```

## Source Structure

```
src/
├── build-deployment.ts           # Main orchestrator (~150 lines)
├── build-deployment.types.ts     # BuildConfig, BuildOptions interfaces
├── build-deployment.constants.ts # Paths, config object
├── cli.ts                        # CLI argument parsing + interactive prompts
├── platforms.config.ts           # Platform/arch metadata
├── utils/
│   ├── build.utils.ts            # buildClient(), buildServer(), installDependencies()
│   ├── file.utils.ts             # cleanDistDirectory(), createDistStructure(), copyDataFiles(), copyEnvExample(), cleanPlatformArtifacts()
│   ├── env.utils.ts              # consolidateEnvironmentFiles()
│   ├── scripts.utils.ts          # createStartupScript(), createClientServer(), createSetupScripts(), createStartScript(), createPlatformSpecificScripts(), createPortsUtility(), createReadme(), createTestScript()
│   ├── package.utils.ts          # createPackageJson(), addWindowsScriptsToPackageJson(), createStandalonePackage()
│   ├── archive.utils.ts          # createZipArchive()
│   ├── cleanup.utils.ts          # cleanupTempDirectory(), killPortsIfOccupied()
│   └── docs.utils.ts             # createUserDocumentation()
└── templates/                    # Script and doc templates
```

## Build Pipeline

The orchestrator in `build-deployment.ts` runs these steps in order:

1. **Prepare** — Kill occupied ports, clean dist, create directory structure
2. **Build** — Build client (Vite) and server (tsup)
3. **Data & environment** — Copy data files, consolidate `.env.production`
4. **Scripts & utilities** — Generate ports utility, startup scripts, client server, README, test script
5. **Package & dependencies** — Create `package.json`, install deps (or create standalone package)
6. **Platform assets** — Copy `.env.example`, clean platform artifacts, create setup/start/platform scripts, user docs
7. **Archive** — Create timestamped zip (if `--zip`)
8. **Cleanup** — Remove `.temp` build directory

## CLI Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--platform` | `-p` | Target platform (windows, linux, macos, universal) | universal |
| `--arch` | `-a` | Target architecture (x64, arm64, universal) | universal |
| `--include-node` | `-n` | Include Node.js runtime | false |
| `--standalone` | `-s` | Create standalone package | false |
| `--zip` | `-z` | Create zip archive | false |

## Deployment Output

```
deployment/
├── dist/
│   ├── client/              # Vite-built frontend
│   ├── server/              # tsup-built backend
│   └── data/                # Database, migrations, uploads
├── package.json             # Production dependencies
├── .env                     # Environment config (localhost-based)
├── .env.example             # Environment template
├── setup.sh / setup.bat     # Platform setup scripts
├── start                    # Main start script
├── start-server.js          # Server launcher
├── start-client.js          # Client server with API proxy
├── ports.utils.js           # Port management utility
├── USER_GUIDE_EN.md         # English user guide
└── GUIA_USUARIO_ES.md       # Spanish user guide
```

## Host Detection

The client uses `window.location.hostname` at runtime instead of baked-in environment variables. This means:

- **localhost** access works out of the box
- **LAN access** (e.g., `http://<PI_IP_ADDRESS>:3000`) works automatically — the client detects the hostname from the browser URL and makes API calls to the same host on port 4040
