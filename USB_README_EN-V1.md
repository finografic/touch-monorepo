# Touch Client - Quick Start Guide

## First Time Setup (One-time only)

1. **Install Docker Desktop**
   - Download from: <https://www.docker.com/products/docker-desktop/>
   - Or search "Docker Desktop" in Microsoft Store
   - Follow the installation wizard
   - Restart your computer when prompted

## Daily Usage

1. **Insert USB drive**
2. **Right-click** on `setup-windows.ps1` → **"Run with PowerShell"**
   - **OR** double-click `setup-windows.bat`
   - **OR** open PowerShell and type: `.\setup-windows.ps1`
3. **Wait** for the application to start
4. **Open your browser** and go to: <http://localhost:3000>

## Troubleshooting

- **If you get an error about Docker not running**: Start Docker Desktop from the Start menu
- **If you get an error about Docker not installed**: Follow the "First Time Setup" steps above
- **If the script doesn't work**: Try the `.bat` file instead of the `.ps1` file
- **If PowerShell shows a security error**: Type `.\setup-windows.ps1` (with the dot and backslash)
- **If PowerShell says "execution of scripts is disabled"**:
  - **Easiest**: Double-click `setup-windows.bat` instead
  - **Alternative**:
  1. Press **Windows Key + X** → Select **"Windows PowerShell (Admin)"**
  2. Type: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
  3. Type **"Y"** when prompted

## Stopping the Application

- Press `Ctrl+C` in the terminal window
- Or close the terminal window

## Need Help?

- Check the `docs/` folder for detailed instructions
- Contact your system administrator

---
*Touch Client - Portable Application*
