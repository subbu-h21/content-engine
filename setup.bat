@echo off
rem Content engine setup: checks the tools the engine needs, installs its own packages, builds the website.
rem Safe to run again: anything already installed is skipped. It does not install Node, Python, ffmpeg,
rem Blender or Claude Code; it says which are missing and where to get them.
setlocal
cd /d "%~dp0"
set "FAILED="

echo Checking tools...
node --version >nul 2>nul && (set "HAVE_NODE=1") || call :missing "Node.js 20 or newer" "https://nodejs.org/"

rem The engine runs the Python named in settings.json ("python" unless changed in Settings).
set "PY=python"
if defined HAVE_NODE for /f "usebackq delims=" %%P in (`node -p "(()=>{try{return require('./settings.json').python||'python'}catch{return 'python'}})()"`) do set "PY=%%P"
"%PY%" --version >nul 2>nul && (set "HAVE_PY=1") || call :missing "Python 3.12 (%PY%)" "https://www.python.org/downloads/  (tick 'Add python.exe to PATH')"

ffmpeg -version >nul 2>nul || call :missing "ffmpeg on PATH" "winget install Gyan.FFmpeg"
ffprobe -version >nul 2>nul || call :missing "ffprobe on PATH (comes with ffmpeg)" "winget install Gyan.FFmpeg"
where claude >nul 2>nul || call :missing "Claude Code (the chat panel)" "https://claude.com/claude-code  then run claude once to sign in"

if not defined HAVE_NODE (
  echo.
  echo Node.js is needed for everything else: install it, then run setup.bat again.
  set "FAILED=1"
  goto :end
)

echo.
if exist "runtime\node_modules\remotion\package.json" (
  echo  ok   video packages already installed
) else (
  call :npm runtime || set "FAILED=1"
)
if exist "app\node_modules\express\package.json" (
  echo  ok   website packages already installed
) else (
  call :npm app || set "FAILED=1"
)
if exist "app\dist\index.html" (
  echo  ok   website already built
) else if exist "app\node_modules\esbuild\package.json" (
  echo Building the website...
  pushd app
  node build.mjs || set "FAILED=1"
  popd
)

echo.
if defined HAVE_PY (
  echo Installing Python packages: numpy, scipy, pillow, Whisper, yt-dlp...
  "%PY%" -m pip install --disable-pip-version-check numpy==2.5.3 scipy==1.18.1 pillow==12.3.0 openai-whisper==20250625 yt-dlp || set "FAILED=1"
  where yt-dlp >nul 2>nul || call :missing "yt-dlp on PATH" "add Python's Scripts folder to PATH"
  where whisper >nul 2>nul || call :missing "whisper on PATH" "add Python's Scripts folder to PATH"
) else (
  echo Skipping the Python packages: install Python, then run setup.bat again.
)

echo.
echo Checking the machine:
node cli\ce.mjs doctor

echo.
echo Next:
echo  - Anything marked MISSING or FAIL above: install it, then run setup.bat again.
echo    Blender 5.1: https://www.blender.org/download/  (another location can be set in Settings)
echo  - Voice and music need an OpenRouter key: a .env file in the workspace folder with
echo    OPENROUTER_API_KEY=...
echo  - Run start.bat, then choose the workspace and connect YouTube / Facebook in Settings.

:end
echo.
if defined FAILED (echo Setup finished with problems: see above.) else (echo Setup finished.)
pause
exit /b

:missing
echo MISSING  %~1
echo          get it: %~2
set "FAILED=1"
exit /b 0

:npm
echo Installing packages in %~1 (exact versions from package-lock.json)...
pushd "%~1"
call npm ci --no-audit --no-fund
set "RC=%errorlevel%"
popd
exit /b %RC%
