@echo off
setlocal ENABLEDELAYEDEXPANSION
echo ========================================
echo Touch Monorepo - Windows Setup
echo ========================================
echo.

REM 1) Ensure Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Attempting to install Node.js LTS via winget...
    winget --version >nul 2>&1
    if %errorlevel% EQU 0 (
        winget install OpenJS.NodeJS.LTS -e --silent --accept-source-agreements --accept-package-agreements
        if %errorlevel% NEQ 0 (
            echo ⚠️  winget install failed. Checking for Chocolatey...
            choco -v >nul 2>&1
            if %errorlevel% EQU 0 (
                choco install nodejs-lts -y
            ) else (
                echo ⚠️  Chocolatey not found. Opening Node.js download page...
                start https://nodejs.org/
                echo Please install Node.js LTS manually, then press any key to continue.
                pause >nul
            )
        )
    ) else (
        echo ⚠️  winget not available. Checking for Chocolatey...
        choco -v >nul 2>&1
        if %errorlevel% EQU 0 (
            choco install nodejs-lts -y
        ) else (
            echo ⚠️  Chocolatey not found. Opening Node.js download page...
            start https://nodejs.org/
            echo Please install Node.js LTS manually, then press any key to continue.
            pause >nul
        )
    )
)

REM Refresh PATH for current session (common install location)
set PATH=%PATH%;C:\Program Files\nodejs

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js still not detected. Please close this window, install Node.js, then run setup.bat again.
    pause
    exit /b 1
)

echo ✅ Node.js found:
node --version

echo ✅ npm found:
npm --version

echo.
echo 📦 Installing dependencies (production)...
npm install --production
if %errorlevel% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🚀 Starting application (server + client)...
start "server" cmd /c start-server.bat
start "client" cmd /c start-client.bat

echo.
echo 🎉 Setup completed. Two windows should be running (server and client).
pause
