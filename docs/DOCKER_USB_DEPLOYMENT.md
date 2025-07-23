# Preparing Touch Client for USB Deployment

This guide explains how to prepare the Touch Client application for USB deployment.

### Prerequisites

1. **Development Environment**
   - macOS or Linux system
   - Node.js 20.x installed
   - pnpm installed
   - Docker installed
   - GitHub Personal Access Token with package read permissions

### Steps to Prepare USB Package

1. **Setup Environment**

   ```bash
   ```

   # Create .env file with GitHub token

   echo "GITHUB_TOKEN=your_github_token" > .env

2. **Clone and Build Project**

   ```bash
   # Clone the repository
   git clone <repository-url> touch-monorepo
   cd touch-monorepo

   # Install dependencies
   pnpm install

   # Build the project
   pnpm build
   ```

3. **Build and Save Docker Image**

   ```bash
   # Build Docker image
   docker-compose build

   # Save image to portable file
   docker save touch-monorepo-touch-client -o touch-client.tar
   ```

4. **Prepare USB Drive**
   - Format USB drive (minimum 8GB recommended)
   - Name it "TOUCH_CLIENT" for consistency

5. **Copy Files to USB**
   Copy the following to your USB drive:

   ```
   TOUCH_CLIENT/
   ├── USB_README_EN.md      # Quick start guide (English)
   ├── USB_README_ES.md      # Quick start guide (Spanish)
   ├── touch-client.tar      # Saved Docker image
   ├── touch-monorepo/
   │   ├── docker-compose.yml
   │   ├── scripts/
   │   │   ├── setup-windows.bat
   │   │   └── setup-windows.ps1
   │   ├── data/            # Contains SQLite database
   │   └── docs/
   │       ├── DOCKER_WIN10_SETUP_EN.md
   │       └── DOCKER_WIN10_SETUP_ES.md
   ```

6. **Test USB Deployment**
   - Eject and reinsert USB drive
   - Follow instructions in `DOCKER_CLIENT_SETUP_EN.md`:

     ```bash
     docker load -i touch-client.tar
     cd touch-monorepo
     docker-compose up
     ```

   - Verify application works at `http://localhost:3000`
   - Test data persistence by creating and retrieving data

### Important Notes

1. **Security**
   - Remove any hardcoded GitHub tokens from:
     - Dockerfile
     - docker-compose.yml
     - .npmrc
     - .env files
   - The saved Docker image already contains all necessary packages

2. **Files to Exclude**
   - `.git` directory
   - `node_modules` directories
   - `.env` and other environment files
   - Build artifacts
   - Any files containing tokens or sensitive information

3. **Database**
   - Ensure `data/` directory exists and contains initial SQLite database
   - Test database connectivity and persistence
   - Backup database if needed

4. **Documentation**
   - Include both English and Spanish setup guides
   - Verify all paths and commands match the USB structure
   - Ensure Windows-specific instructions are clear

### Verification Checklist

- [ ] GitHub tokens removed from all files
- [ ] Docker image saved as touch-client.tar
- [ ] Docker image loads and runs successfully
- [ ] Application runs correctly from USB
- [ ] Database persists between restarts
- [ ] Both language versions of documentation present
- [ ] Documentation accurately reflects current setup
- [ ] USB has sufficient free space (~4GB minimum recommended)

### Troubleshooting Common Issues

1. **Build Issues**
   - Ensure GITHUB_TOKEN is set in .env during build
   - Use `NODE_OPTIONS="--max-old-space-size=4096"` if build fails
   - Check network connectivity for package downloads

2. **Docker Issues**
   - Verify image was saved correctly: `docker images`
   - Test image load before distributing USB
   - Ensure docker-compose.yml uses correct image name

3. **Database Issues**
   - Check data directory permissions
   - Verify SQLite file is not corrupted
   - Test data persistence before distribution
