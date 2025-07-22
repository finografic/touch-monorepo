# Touch Client Setup for Windows (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Touch Client Setup for Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not found"
    }
    Write-Host "✓ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker Desktop for Windows:" -ForegroundColor Yellow
    Write-Host "https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Blue
    Write-Host ""
    Write-Host "After installation, restart this script." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker Desktop is running
try {
    $dockerInfo = docker info 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
    Write-Host "✓ Docker Desktop is running" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker Desktop is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start Docker Desktop and wait for it to fully load." -ForegroundColor Yellow
    Write-Host "Then restart this script." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if touch-client.tar exists
if (-not (Test-Path "touch-client.tar")) {
    Write-Host "ERROR: touch-client.tar not found in current directory" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure you have the touch-client.tar file in this directory." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Loading Docker image..." -ForegroundColor Yellow
docker load -i touch-client.tar
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to load Docker image" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check that:" -ForegroundColor Yellow
    Write-Host "1. touch-client.tar is not corrupted" -ForegroundColor Yellow
    Write-Host "2. You have sufficient disk space" -ForegroundColor Yellow
    Write-Host "3. Docker Desktop has enough resources allocated" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Docker image loaded successfully" -ForegroundColor Green
Write-Host ""

# Check if docker-compose.yml exists
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "ERROR: docker-compose.yml not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure you have the complete Touch Client package." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Starting Touch Client..." -ForegroundColor Yellow
Write-Host ""
Write-Host "The application will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Yellow
Write-Host ""

docker-compose up

Write-Host ""
Write-Host "Touch Client stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit"
