@echo off
cd /d "%~dp0"
start "server" cmd /c start-server.bat
start "client" cmd /c start-client.bat
