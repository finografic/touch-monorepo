# Touch Monorepo - Deployment

This is a self-contained deployment build of the Touch Monorepo application.

## Quick Start

```bash
# Start both server and client
npm start

# Or start them separately
npm run start:server  # Backend server on port 4040
npm run start:client  # Frontend with API proxy on port 3000

# Or run directly
node start-server.js & node start-client.js
```

## Structure

```
deployment/
├── dist/                    # Build artifacts (regenerated each time)
│   ├── client/             # Client build output
│   ├── server/             # Server build output
│   └── data/               # Database, migrations, uploads
├── node_modules/           # Dependencies (preserved)
├── .env                    # Environment configuration
├── .env.production         # Production environment
├── package.json            # Dependencies and scripts
├── ports.utils.js          # Port management utility
├── start-server.js         # Backend server startup
├── start-client.js         # Frontend server with API proxy
├── test-production.js      # Test script
└── README.md               # This file
```

## Scripts

- `start-server.js` - Starts the backend API server on port 4040
- `start-client.js` - Starts the frontend server on port 3000 with API proxy
- `ports.utils.js` - Utility for managing port conflicts
- `test-production.js` - Tests the deployment build

## Configuration

Edit `.env` to customize:
- `API_PORT` - Backend server port (default: 4040)
- `CLIENT_PORT` - Frontend server port (default: 3000)
- Database settings
- Other environment variables

## Data

The SQLite database is located at `dist/data/db/production.sqlite.db`.
Uploads are stored in `dist/data/uploads/`.

## Requirements

- Node.js 20.0.0 or higher
- No other dependencies required

## Troubleshooting

1. **Port conflicts**: The scripts automatically kill processes on occupied ports
2. **Database issues**: Check that `dist/data/db/production.sqlite.db` exists
3. **Permission issues**: Ensure scripts are executable (`chmod +x start-server.js start-client.js`)

## Architecture

This deployment structure separates:
- **Build artifacts** (`dist/`) - Regenerated on each build
- **Runtime files** (scripts, configs) - Preserved between builds
- **Dependencies** (`node_modules/`) - Installed once and preserved

Generated on: 2025-08-09T02:58:07.472Z
