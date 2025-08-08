@echo off
echo Starting Touch Monorepo Server...
cd /d "%~dp0"
node dist/server/index.js
pause
