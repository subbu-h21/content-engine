# Stops ONLY the scratch engine on port 4170 (and its Studios/terminals). Never touches 4100/4101.
$c = Get-NetTCPConnection -LocalPort 4170 -State Listen -ErrorAction SilentlyContinue
if ($c) { taskkill /PID $c.OwningProcess /T /F | Out-Null; "stopped scratch engine $($c.OwningProcess)" } else { "scratch engine not running" }
