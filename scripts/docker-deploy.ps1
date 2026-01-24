param(
  [Parameter(Mandatory = $true)][string]$Host,
  [string]$Tag = $env:IMAGE_TAG,
  [string]$Registry = $env:REGISTRY,
  [string]$RemotePath = "/opt/openspell"
)

if (-not $Tag) { $Tag = "latest" }
if (-not $Registry) { $Registry = "ghcr.io/openspell" }

$remoteCmd = @"
cd $RemotePath
REGISTRY=$Registry IMAGE_TAG=$Tag docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
REGISTRY=$Registry IMAGE_TAG=$Tag docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
"@

Write-Host "Deploying to $Host"
ssh $Host $remoteCmd
