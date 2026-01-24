param(
  [string]$OutDir = ".\backups"
)

if (-not (Test-Path $OutDir)) {
  New-Item -ItemType Directory -Path $OutDir | Out-Null
}

$ts = Get-Date -Format "yyyyMMdd-HHmmss"
$outFile = Join-Path $OutDir "openspell-$ts.sql"

Write-Host "Creating backup in $outFile"
docker exec openspell-postgres pg_dump -U openspell openspell | Out-File -FilePath $outFile -Encoding utf8
