# Starts the SCRATCH engine (port 4170, workspace D:\tmp\ce-x) with the fake Google and the fake `claude` (fakebin\).
# Never point this at the real workspace. Create D:\tmp\ce-x\settings.json first (node write_settings.mjs).
$env:CE_WORKSPACE='D:\tmp\ce-x'; $env:CE_SETTINGS_FILE='D:\tmp\ce-x\settings.json'; $env:CE_SECRETS_DIR='D:\tmp\ce-x\secrets'
$env:CE_APP_PORT='4170'; $env:CE_RENDER_NO_GPU_WAIT='1'; $env:CE_APP_DIST='D:\tmp\ce-chat-dist'
$env:CE_GOOGLE_AUTH_URL='http://127.0.0.1:4180/auth'; $env:CE_GOOGLE_TOKEN_URL='http://127.0.0.1:4180/token'; $env:CE_YOUTUBE_API='http://127.0.0.1:4180'
$env:PATH = (Join-Path $PSScriptRoot 'fakebin') + ';' + $env:PATH
node D:\code_files\content-engine\app\server\index.mjs *>> D:\tmp\ce-x\engine.log
