./scripts/load_python_env.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Azure Voice Agent - Development Mode" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the project root directory
$projectRoot = Split-Path -Parent $PSScriptRoot

# Set Python path
$venvPythonPath = Join-Path $projectRoot ".venv\Scripts\python.exe"
if (Test-Path -Path "/usr") {
    # fallback to Linux venv path
    $venvPythonPath = Join-Path $projectRoot ".venv/bin/python"
}

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
$backendPath = Join-Path $projectRoot "app\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host ''; Write-Host 'Backend Server Starting...' -ForegroundColor Green; Write-Host 'URL: http://localhost:8765' -ForegroundColor Cyan; Write-Host ''; & '$venvPythonPath' app.py"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend Dev Server
Write-Host "Starting Frontend Dev Server..." -ForegroundColor Yellow
$frontendPath = Join-Path $projectRoot "app\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host ''; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; Write-Host ''; npm run dev; Write-Host ''"

# Wait for frontend to start
Start-Sleep -Seconds 5

# Display URLs
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servers Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  " -NoNewline
Write-Host "http://localhost:8765" -ForegroundColor Cyan
Write-Host "Frontend: " -NoNewline
Write-Host "http://127.0.0.1:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check the new PowerShell windows for server status" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop servers: Close the PowerShell windows" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
