# OpenSpell Game Server Setup Script (Windows PowerShell)
# Note: .env files are managed by the root setup-env.ps1 script
# Run that first, or ensure .env files exist before running this script
#
# Usage (from apps/game):
#   .\setup.ps1
#
# Usage (from repo root):
#   cd .\apps\game
#   .\setup.ps1

$ErrorActionPreference = "Stop"

Write-Host "Setting up OpenSpell Game Server..." -ForegroundColor Green

# Ensure .env exists (should be created by root setup-env.ps1)
if (-not (Test-Path .env)) {
    Write-Host "Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "Please run setup-env.ps1 from the repo root first." -ForegroundColor Yellow
    Write-Host ""
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Installing shared DB package dependencies..." -ForegroundColor Yellow
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Push-Location (Join-Path $repoRoot "packages\db")
npm install
Pop-Location

Write-Host ""
Write-Host "Setup complete! Start the server with:" -ForegroundColor Green
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected local URL (HTTPS):" -ForegroundColor Green
Write-Host "  https://localhost:$((Get-Content .env | Select-String '^PORT=' | ForEach-Object { $_.Line.Split('=')[1] }) -join '')/socket.io/" -ForegroundColor Cyan

