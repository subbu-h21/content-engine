@echo off
rem Content engine: starts the website (http://127.0.0.1:4100) and opens it in the browser.
rem Ctrl+C or closing this window stops it, and the Studios and Claude sessions it started.
rem If the engine is already running, it just opens the page. Extra arguments go to ce app (e.g. --no-open).
setlocal
cd /d "%~dp0"

node --version >nul 2>nul || goto :setup
if not exist "runtime\node_modules\remotion\package.json" goto :setup
if not exist "app\node_modules\express\package.json" goto :setup

node -e "let s={};try{s=require('./settings.json')}catch{}const u='http://127.0.0.1:'+(process.env.CE_APP_PORT||s.appPort||4100);fetch(u+'/api/settings',{signal:AbortSignal.timeout(2000)}).then(r=>{if(!r.ok)process.exit(1);console.log('The engine is already running: '+u);if(!process.argv.includes('--no-open'))require('child_process').spawn('cmd.exe',['/c','start','',u],{stdio:'ignore',detached:true}).unref()},()=>process.exit(1))" -- %* && exit /b 0

node cli\ce.mjs app %*
if errorlevel 1 pause
exit /b

:setup
echo The engine isn't set up on this computer yet: run setup.bat first.
pause
exit /b 1
