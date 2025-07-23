@echo off
echo ========================================
echo Touch Client - Test Setup
echo ========================================
echo.
echo This is a test to verify the setup process works.
echo.
echo Current directory: %CD%
echo.
echo Checking if files exist:
if exist "..\touch-client.tar" (
    echo ✓ touch-client.tar found
) else (
    echo ✗ touch-client.tar NOT found
)
if exist "..\docker-compose.yml" (
    echo ✓ docker-compose.yml found
) else (
    echo ✗ docker-compose.yml NOT found
)
echo.
echo Checking Docker:
docker --version
if %errorlevel% neq 0 (
    echo ✗ Docker not found or not in PATH
) else (
    echo ✓ Docker found
)
echo.
echo Checking Docker Desktop:
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Docker Desktop not running
) else (
    echo ✓ Docker Desktop is running
)
echo.
echo Test completed.
echo.
pause
