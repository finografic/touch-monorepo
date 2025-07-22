@echo off
echo ========================================
echo Touch Client Setup for Windows
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo.
    echo Please install Docker Desktop for Windows:
    echo https://docs.docker.com/desktop/install/windows-install/
    echo.
    echo After installation, restart this script.
    pause
    exit /b 1
)

REM Check if Docker Desktop is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not running
    echo.
    echo Please start Docker Desktop and wait for it to fully load.
    echo Then restart this script.
    pause
    exit /b 1
)

echo Docker is installed and running.
echo.

REM Check if touch-client.tar exists
if not exist "touch-client.tar" (
    echo ERROR: touch-client.tar not found in current directory
    echo.
    echo Please ensure you have the touch-client.tar file in this directory.
    pause
    exit /b 1
)

echo Loading Docker image...
docker load -i touch-client.tar
if %errorlevel% neq 0 (
    echo ERROR: Failed to load Docker image
    echo.
    echo Please check that:
    echo 1. touch-client.tar is not corrupted
    echo 2. You have sufficient disk space
    echo 3. Docker Desktop has enough resources allocated
    pause
    exit /b 1
)

echo Docker image loaded successfully.
echo.

REM Check if docker-compose.yml exists
if not exist "docker-compose.yml" (
    echo ERROR: docker-compose.yml not found
    echo.
    echo Please ensure you have the complete Touch Client package.
    pause
    exit /b 1
)

echo Starting Touch Client...
echo.
echo The application will be available at: http://localhost:3000
echo Press Ctrl+C to stop the application
echo.

docker-compose up

echo.
echo Touch Client stopped.
pause
