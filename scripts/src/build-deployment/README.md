# Touch Monorepo Deployment Builder

A comprehensive deployment system for creating cross-platform, standalone distributions of the Touch Monorepo application.

## 🎯 Features

- **Cross-platform support**: Windows, Linux, macOS
- **Architecture support**: x64, ARM64, Universal
- **Standalone packaging**: Self-contained deployments
- **Automatic setup scripts**: Platform-specific installation
- **Zip archives**: Easy distribution
- **No external dependencies**: Works on target machines without Node.js setup

## 🚀 Quick Start

### Basic Deployment

```bash
# Create universal deployment (all platforms)
pnpm build.deployment.universal

# Create Windows-specific deployment
pnpm build.deployment.windows

# Create Linux-specific deployment
pnpm build.deployment.linux

# Create macOS-specific deployment
pnpm build.deployment.macos

# Create standalone package
pnpm build.deployment.standalone
```

### Advanced Options

```bash
# Custom platform and architecture
pnpm build.deployment --platform windows --arch x64 --zip

# Standalone package with custom output
pnpm build.deployment --standalone --zip --output-dir ./dist

# Universal deployment with Node.js included
pnpm build.deployment --platform universal --include-node --zip
```

## 📦 Deployment Structure

```
deployment/
├── dist/                    # Application build artifacts
│   ├── client/             # Frontend application
│   ├── server/             # Backend application
│   └── data/               # Database, migrations, uploads
├── node_modules/           # Dependencies (if not standalone)
├── package.json            # Dependencies and scripts
├── .env                    # Environment configuration
├── .env.example           # Environment template
├── setup.bat              # Windows setup script
├── setup.sh               # Linux setup script
├── setup-macos.sh         # macOS setup script
├── start-server.bat       # Windows server startup
├── start-client.bat       # Windows client startup
├── start-server.sh        # Linux/macOS server startup
├── start-client.sh        # Linux/macOS client startup
├── ports.utils.js         # Port management utility
└── README.md              # Deployment instructions
```

## 🎯 Target Environments

### Windows 10/11

- **Requirements**: Node.js 20+ (auto-detected by setup script)
- **Setup**: Double-click `setup.bat`
- **Start**: Double-click `start-server.bat` and `start-client.bat`

### Linux (Ubuntu/Debian)

- **Requirements**: Node.js 20+ (auto-detected by setup script)
- **Setup**: `./setup.sh`
- **Start**: `./start-server.sh` and `./start-client.sh`

### macOS

- **Requirements**: Node.js 20+ (auto-detected by setup script)
- **Setup**: `./setup-macos.sh`
- **Start**: `./start-server-macos.sh` and `./start-client-macos.sh`

## 🔧 Build Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--platform` | `-p` | Target platform (windows\|linux\|macos\|universal) | universal |
| `--arch` | `-a` | Target architecture (x64\|arm64\|universal) | universal |
| `--include-node` | `-n` | Include Node.js runtime | false |
| `--standalone` | `-s` | Create standalone package | false |
| `--zip` | `-z` | Create zip archive | false |
| `--output-dir` | `-o` | Output directory for zip | workspace root |

## 📋 Build Scripts

### Pre-configured Scripts

```bash
# Universal deployment (recommended for distribution)
pnpm build.deployment.universal

# Platform-specific deployments
pnpm build.deployment.windows    # Windows x64
pnpm build.deployment.linux      # Linux x64
pnpm build.deployment.macos      # macOS x64

# Standalone package
pnpm build.deployment.standalone
```

### Custom Builds

```bash
# Windows ARM64 deployment
pnpm build.deployment --platform windows --arch arm64 --zip

# Linux standalone package
pnpm build.deployment --platform linux --standalone --zip

# Universal deployment with custom output
pnpm build.deployment --platform universal --zip --output-dir ./releases
```

## 🎯 Use Cases

### 1. **Windows Distribution**

```bash
# Create Windows deployment
pnpm build.deployment.windows

# Result: touch-monorepo-windows-x64-2024-01-15T10-30-00.zip
# Contains: setup.bat, start-server.bat, start-client.bat
```

### 2. **Linux Server Deployment**

```bash
# Create Linux standalone package
pnpm build.deployment --platform linux --standalone --zip

# Result: touch-monorepo-linux-x64-2024-01-15T10-30-00.zip
# Contains: setup.sh, start-server.sh, start-client.sh
```

### 3. **Cross-platform Distribution**

```bash
# Create universal deployment
pnpm build.deployment.universal

# Result: touch-monorepo-universal-universal-2024-01-15T10-30-00.zip
# Contains: All platform scripts and setup files
```

## 🔍 Setup Scripts

### Windows Setup (`setup.bat`)

- Checks for Node.js installation
- Installs production dependencies
- Creates startup shortcuts
- Provides user-friendly error messages

### Linux Setup (`setup.sh`)

- Checks for Node.js and npm
- Installs production dependencies
- Makes scripts executable
- Provides installation instructions

### macOS Setup (`setup-macos.sh`)

- Checks for Node.js and npm
- Installs production dependencies
- Makes scripts executable
- Provides Homebrew installation option

## 🚀 Startup Scripts

### Windows

- `start-server.bat` - Starts backend server on port 4040
- `start-client.bat` - Starts frontend with API proxy on port 3000

### Linux/macOS

- `start-server.sh` - Starts backend server on port 4040
- `start-client.sh` - Starts frontend with API proxy on port 3000

## 📊 Deployment Process

1. **Build Applications**
   - Builds client and server applications
   - Bundles all dependencies
   - Creates optimized production builds

2. **Package Dependencies**
   - Installs production dependencies
   - Creates standalone package.json (if standalone mode)
   - Excludes development dependencies

3. **Create Setup Scripts**
   - Platform-specific setup scripts
   - Automatic dependency detection
   - User-friendly installation process

4. **Generate Archives**
   - Creates zip archives with timestamp
   - Excludes unnecessary files
   - Optimized for distribution

## 🔧 Troubleshooting

### Common Issues

1. **Node.js Not Found**
   - Setup scripts will detect and guide installation
   - Download from <https://nodejs.org/> (LTS recommended)

2. **Port Conflicts**
   - Scripts automatically kill conflicting processes
   - Manual port configuration available in `.env`

3. **Permission Issues**
   - Linux/macOS scripts are automatically made executable
   - Windows scripts run with current user permissions

4. **Database Issues**
   - SQLite database is included in deployment
   - Automatic migration on first run

### Build Failures

1. **Missing Dependencies**

   ```bash
   pnpm install
   pnpm build.deployment
   ```

2. **Port Conflicts**

   ```bash
   # Kill processes on ports 3000 and 4040
   lsof -ti:3000 | xargs kill -9
   lsof -ti:4040 | xargs kill -9
   ```

3. **Permission Issues**

   ```bash
   # Make scripts executable
   chmod +x scripts/src/build-deployment/build-deployment.ts
   ```

## 📝 Notes

- **Standalone mode**: Creates minimal package.json with only essential dependencies
- **Universal mode**: Includes scripts for all platforms
- **Zip archives**: Automatically named with platform, architecture, and timestamp
- **Environment variables**: Production-ready configuration included
- **Database**: SQLite database included and pre-configured
- **Security**: Production secrets should be configured on target machines

## 🎉 Success Indicators

When deployment completes successfully:
- ✅ All platform scripts created
- ✅ Setup scripts generated
- ✅ Dependencies installed
- ✅ Zip archive created (if requested)
- 📦 Deployment ready for distribution

The deployment is ready to be distributed to target machines and run with minimal setup!
