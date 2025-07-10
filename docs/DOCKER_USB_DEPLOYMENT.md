# Preparing Touch Client for USB Deployment

This guide explains how to prepare the Touch Client application for USB deployment.

### Prerequisites

1. **Development Environment**
   - macOS or Linux system
   - Node.js 20.x installed
   - pnpm installed
   - Docker installed

### Steps to Prepare USB Package

1. **Clone and Build Project**

   ```bash
   # Clone the repository
   git clone <repository-url> touch-monorepo
   cd touch-monorepo

   # Install dependencies
   pnpm install

   # Build the project
   pnpm build
   ```

2. **Create Initial Database**

   ```bash
   # Initialize SQLite database
   pnpm db:setup
   ```

3. **Test Docker Build**

   ```bash
   # Build Docker image locally
   docker-compose build

   # Test the build
   docker-compose up
   ```

   Verify the application works at `http://localhost:3000`

4. **Prepare USB Drive**
   - Format USB drive (minimum 8GB recommended)
   - Name it "TOUCH_CLIENT" for consistency

5. **Copy Files to USB**
   Copy the following to your USB drive:

   ```
   touch-monorepo/
   ├── apps/
   ├── packages/
   ├── data/           # Contains SQLite database
   ├── Dockerfile
   ├── docker-compose.yml
   ├── .dockerignore
   ├── package.json
   ├── pnpm-lock.yaml
   └── docs/
       ├── DOCKER-CLIENT-SETUP_EN.md
       └── DOCKER-CLIENT-SETUP_ES.md
   ```

6. **Test USB Deployment**
   - Eject and reinsert USB drive
   - Follow instructions in `DOCKER-CLIENT-SETUP_EN.md` to verify everything works
   - Test both application startup and data persistence

### Important Notes

1. **Files to Exclude**
   - `.git` directory
   - `node_modules` directories
   - Any environment files (`.env`, etc.)
   - Build artifacts (unless specifically needed)

2. **Database**
   - Ensure `data/` directory exists and contains initial SQLite database
   - Test database connectivity before distributing

3. **Documentation**
   - Include both English and Spanish setup guides
   - Ensure all paths and commands in documentation match the USB structure

### Verification Checklist

- [ ] All necessary files copied to USB
- [ ] Docker builds successfully from USB
- [ ] Application runs correctly from USB
- [ ] Database persists between restarts
- [ ] Both language versions of documentation present
- [ ] USB has sufficient free space for Docker images and data
