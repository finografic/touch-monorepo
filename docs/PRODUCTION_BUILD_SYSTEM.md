# Touch Monorepo - Production Build System

📅 Aug 3, 2025

## Overview

The Touch Monorepo Production Build System creates a self-contained, portable distribution that can be deployed anywhere without requiring the full development environment. This system eliminates the need for `node_modules`, development dependencies, and complex build tools in production.

## 🎯 Key Features

- **🚀 Zero Development Dependencies**: Bundled server eliminates `node_modules` requirement
- **📦 Self-Contained**: Everything needed is in one directory
- **🔧 Environment Consolidation**: All `.env` files merged into single production config
- **💾 Data Management**: Database, uploads, and migrations included
- **⚡ Production Optimized**: Minified, bundled, and optimized for performance
- **🛡️ Security**: Isolated production environment with proper permissions

## 📁 Build Output Structure

```
deployment/
├── client/                 # Static client application files
│   ├── index.html         # Main HTML entry point
│   ├── assets/            # CSS, JS, and other assets
│   └── ...                # Additional client files
├── server/                # Bundled server application
│   ├── index.cjs          # Main server bundle (CommonJS)
│   ├── db/               # Database schema files
│   ├── routes/           # API route handlers
│   └── ...               # Additional server modules
├── data/                  # Application data
│   ├── db/               # Database files
│   │   └── production.sqlite.db
│   ├── uploads/          # User-uploaded files
│   └── migrations/       # Database migration files
├── .env                   # Consolidated environment configuration
├── package.json           # Production dependencies only
├── start.js               # Main server launcher script
├── start-client.js        # Client static file server
└── README.md              # Production usage instructions
```

## 🏗️ Build Process

### 1. Building the Distribution

From the monorepo root:

```bash
# Build production distribution
pnpm build.production
```

This command executes the build script located at `scripts/src/build-production/build-production.ts`.

### 2. Build Steps Explained

#### **Step 1: Clean and Setup**

- Removes any existing `deployment` directory
- Creates the required directory structure

#### **Step 2: Client Build**

- Runs `pnpm --filter @workspace/client build.production`
- Uses Vite to create optimized static files
- Outputs to `deployment/client/`

#### **Step 3: Server Build**

- Runs `pnpm --filter @workspace/server build.production`
- Uses `tsup` with production configuration
- Bundles all dependencies into single `index.cjs` file
- Keeps only native modules (like `better-sqlite3`) external

#### **Step 4: Data Files**

- Copies `development.sqlite.db` as `production.sqlite.db`
- Copies database migrations
- Copies existing uploads directory

#### **Step 5: Environment Consolidation**

- Merges environment files from:
  - `config/.env.development`
  - `apps/server/.env.development`
  - Root `.env.development`
- Sets production-specific overrides
- Creates single `.env` file

#### **Step 6: Startup Scripts**

- Creates `start.js` - Main server launcher
- Creates `start-client.js` - Static file server for client
- Sets proper file permissions

#### **Step 7: Package Configuration**

- Creates minimal `package.json` with only required dependencies
- Includes helpful npm scripts

## ⚙️ Configuration Files

### Server Bundle Configuration

The server bundling is configured in `apps/server/tsup.config.production.ts`:

```typescript
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],                    // CommonJS for compatibility
  bundle: true,                       // Bundle all dependencies
  minify: true,                       // Minify output
  external: [
    'better-sqlite3',                 // Native modules stay external
    'fsevents',
  ],
  noExternal: [
    'hono', '@hono/*',               // Force bundle web framework
    'drizzle-orm', 'valibot',        // Database and validation
    '@workspace/*',                   // All workspace packages
  ],
});
```

### Environment Consolidation

The build process merges multiple environment files:

```bash
# Source files (in order of precedence):
config/.env.development
apps/server/.env.development
.env.development

# Output:
deployment/.env
```

Production overrides include:
- `NODE_ENV=production`
- `DATABASE_URL=./data/db/production.sqlite.db`
- Correct API and client ports

## 🚀 Running in Production

### Prerequisites

- Node.js 20.0.0 or higher
- No other dependencies required

### Quick Start

1. **Navigate to distribution:**

   ```bash
   cd deployment
   ```

2. **Install minimal dependencies:**

   ```bash
   npm install
   ```

3. **Start the application:**

   ```bash
   # Server only (API)
   node start.js

   # Full application (Server + Client)
   node start.js & node start-client.js
   ```

### Alternative Methods

#### Using npm scripts

```bash
npm run start              # Server only
npm run start:server       # Server only
npm run start:client       # Client only
npm run start:both         # Both (requires npm-run-all)
```

#### Using external static servers

```bash
# Start server
node start.js &

# Serve client with external tool
npx serve -s client -p 3000
# OR
python3 -m http.server 3000 --directory client
# OR
http-server client -p 3000
```

## 🌐 Network Configuration

### Default Ports

- **Server**: `http://localhost:4040`
- **Client**: `http://localhost:3000`

### Changing Ports

Edit the `.env` file in the distribution:

```bash
API_PORT=8080        # Change server port
CLIENT_PORT=8000     # Change client port
```

## 📊 Database Management

### Database Location

- **File**: `data/db/production.sqlite.db`
- **Migrations**: `data/migrations/`
- **Uploads**: `data/uploads/`

### Database Operations

The production database is automatically created from your development database during the build process. No additional setup required.

## 🔧 Troubleshooting

### Common Issues

#### "Cannot find module 'dotenv'"

**Solution**: Run `npm install` in the `deployment` directory.

#### "Server failed to start"

**Causes**:
- Port already in use
- Database file permissions
- Missing dependencies

**Solution**:

```bash
# Check port usage
lsof -i :4040

# Check file permissions
ls -la data/db/production.sqlite.db

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### "ENOENT: no such file or directory"

**Cause**: Missing required files in distribution.

**Solution**: Rebuild the distribution:

```bash
cd /path/to/monorepo
pnpm build.production
```

### Performance Optimization

#### Large Bundle Size

The server bundle (~217KB) includes all dependencies. This is intentional to eliminate `node_modules`. If size is critical:

1. Review `noExternal` configuration in `tsup.config.production.ts`
2. Consider keeping more dependencies external
3. Remember that external dependencies require `node_modules`

#### Memory Usage

The bundled server is memory-efficient. If you experience issues:

```bash
# Increase Node.js memory limit
node --max-old-space-size=2048 start.js
```

## 🔒 Security Considerations

### File Permissions

The build process sets proper permissions:
- Startup scripts: `755` (executable)
- Data files: Default permissions
- Configuration files: Default permissions

### Environment Variables

- Sensitive values are consolidated in `.env`
- Ensure `.env` file has appropriate permissions in production
- Consider using environment-specific secrets management

### Network Security

- Default configuration binds to `localhost` only
- For external access, modify host settings in `.env`
- Always use HTTPS in production environments

## 📈 Deployment Strategies

### Single Server Deployment

1. Build distribution on development machine
2. Copy `deployment` directory to server
3. Run `npm install && node start.js`

### Container Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY deployment/ .
RUN npm install --production
EXPOSE 4040 3000
CMD ["node", "start.js"]
```

### Reverse Proxy Configuration

Example Nginx configuration:

```nginx
# API Server
location /api/ {
    proxy_pass http://localhost:4040;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Client Application
location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 🛠️ Customization

### Adding Custom Scripts

Edit `deployment/package.json` to add custom scripts:

```json
{
  "scripts": {
    "start": "node start.js",
    "backup": "cp data/db/production.sqlite.db backups/",
    "migrate": "echo 'Custom migration command'"
  }
}
```

### Environment Customization

Modify the build script at `scripts/src/build-production/build-production.ts` to:
- Add additional environment variables
- Include custom configuration files
- Modify the directory structure

### Build Customization

Modify `apps/server/tsup.config.production.ts` to:
- Change output format
- Add/remove bundled dependencies
- Adjust optimization settings

## 📝 Maintenance

### Updating the Distribution

When you make changes to the monorepo:

1. **Rebuild**: `pnpm build.production`
2. **Deploy**: Copy new `deployment` to server
3. **Restart**: Stop and start the production services

### Backup Strategy

Important files to backup:
- `data/db/production.sqlite.db` - Main database
- `data/uploads/` - User uploads
- `.env` - Configuration (if customized)

### Log Management

Production logs are output to stdout/stderr. Consider using a process manager:

```bash
# Using PM2
pm2 start start.js --name "touch-server"
pm2 logs touch-server

# Using systemd
sudo systemctl start touch-server
sudo journalctl -f -u touch-server
```

## 🔄 Development vs Production

| Aspect | Development | Production |
|--------|------------|------------|
| **Dependencies** | Full `node_modules` | Minimal runtime deps |
| **Build Time** | Fast incremental | Slower, optimized |
| **Bundle Size** | Large, unoptimized | Small, minified |
| **Hot Reload** | Yes | No |
| **Source Maps** | Yes | No |
| **Environment** | Multiple `.env` files | Single `.env` |
| **Database** | `development.sqlite.db` | `production.sqlite.db` |

## 🎓 Best Practices

1. **Always test the production build** before deploying
2. **Use version control** for production configurations
3. **Monitor disk space** for database and uploads growth
4. **Regular backups** of database and uploads
5. **Security updates** for Node.js runtime
6. **Environment isolation** between dev and production
7. **Process monitoring** with tools like PM2 or systemd

---

## Support

For issues with the production build system:
1. Check this documentation
2. Review the build script: `scripts/src/build-production/build-production.ts`
3. Examine server bundle config: `apps/server/tsup.config.production.ts`
4. Test with a fresh build: `pnpm build.production`

The production build system is designed to be robust and self-contained. Most issues can be resolved by rebuilding the distribution or checking file permissions.
