@echo off
rem Phone viewer: a read-only page with your rendered videos, opened on your phone through a cloudflared tunnel.
rem It can only list and play videos (no Claude, no deleting, no posting), and every link carries a secret key.
rem The engine website itself stays on this PC only. Closing this window stops the viewer and the tunnel.
rem Extra arguments go to ce viewer (e.g. --new-key to make a new key, so old links stop working).
setlocal
cd /d "%~dp0"

node --version >nul 2>nul || goto :setup

node cli\ce.mjs viewer --tunnel %*
if errorlevel 1 pause
exit /b

:setup
echo The engine isn't set up on this computer yet: run setup.bat first.
pause
exit /b 1
