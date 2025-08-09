@echo off
echo Starting Touch Monorepo Client...
cd /d "%~dp0"
node dist/client/server.js
