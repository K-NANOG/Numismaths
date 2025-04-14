# Kill any running Node.js processes
Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Node.js processes stopped successfully" -ForegroundColor Green
} else {
    Write-Host "No Node.js processes were running" -ForegroundColor Gray
}

# Kill any processes using ports 5173, 5174, and 8080
Write-Host "`nFreeing up ports..." -ForegroundColor Yellow
$ports = @(5173, 5174, 8080)
foreach ($port in $ports) {
    $processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
    if ($processId) {
        Stop-Process -Id $processId -Force
        Write-Host "Freed port $port" -ForegroundColor Green
    }
}

# Small delay to ensure all processes are properly terminated
Start-Sleep -Seconds 2

# Start the application
Write-Host "`nStarting the application..." -ForegroundColor Yellow
npm start 