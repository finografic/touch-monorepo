@echo off
echo ========================================
echo Touch Monorepo - Windows Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Choose the LTS version (recommended)
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found:
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available
    pause
    exit /b 1
)

echo ✅ npm found:
npm --version

REM Install dependencies
echo.
echo 📦 Installing dependencies...
npm install --production
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 🚀 To start the application:
echo   1. Double-click start-server.bat (for backend)
echo   2. Double-click start-client.bat (for frontend)
echo   3. Or run: npm start (for both)
echo.
pause
