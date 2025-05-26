# Start client
Write-Host "Starting client..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

# Start server
Write-Host "Starting server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npx tsx src/server.ts"

Write-Host "`nApplication started!" -ForegroundColor Green
Write-Host "Client running at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Server running at: http://localhost:8080" -ForegroundColor Cyan 