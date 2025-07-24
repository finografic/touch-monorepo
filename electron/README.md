# Touch Client Electron

Desktop application for Touch Client built with Electron.

## Build Scripts

### Development

```bash
pnpm run dev          # Start development mode
```

### Windows Builds

```bash
pnpm run build:win    # Build Windows x64 installer (.exe)
```

### macOS Builds

```bash
pnpm run build:mac           # Build macOS x64 (.app and .dmg)
pnpm run build:mac-arm       # Build macOS ARM64 (.app and .dmg)
pnpm run build:mac-universal # Build macOS Universal (x64 + ARM64)
pnpm run build:mac-app       # Build macOS .app only (unpacked)
pnpm run build:mac-dmg       # Build macOS .dmg only
```

### Distribution

```bash
pnpm run dist         # Build Windows + macOS Universal
```

## From Root Directory

You can also run these scripts from the root directory:

```bash
pnpm run electron:dev              # Development mode
pnpm run electron:build            # Windows build
pnpm run electron:build:mac        # macOS x64 build
pnpm run electron:build:mac-arm    # macOS ARM64 build
pnpm run electron:build:mac-universal # macOS Universal build
pnpm run electron:build:mac-app    # macOS .app only
pnpm run electron:build:mac-dmg    # macOS .dmg only
pnpm run electron:dist             # Full distribution build
```

## Build Output

Builds are output to the `dist/` directory:
- Windows: `Touch Client Setup.exe`
- macOS: `Touch Client.app` and `Touch Client.dmg`

## Requirements

- Node.js 20.15.0+
- pnpm 10.8.0+
- For macOS builds: macOS 10.15+ (Catalina)
- For Windows builds: Windows 10+ (can be built on macOS with cross-compilation)
