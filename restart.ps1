# Kill all Node.js processes
Write-Host "Killing all Node.js processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 1

# Clean client
Write-Host "`nCleaning client..." -ForegroundColor Yellow
Set-Location -Path "client"
npm cache clean --force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
Set-Location -Path ".."

# Clean server
Write-Host "`nCleaning server..." -ForegroundColor Yellow
Set-Location -Path "server"
npm cache clean --force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
Set-Location -Path ".."

# Start the application
Write-Host "`nStarting the application..." -ForegroundColor Green
npm start 