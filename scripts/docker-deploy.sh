#!/usr/bin/env sh
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/docker-deploy.sh user@host [remote_path]"
  exit 1
fi

HOST="$1"
REMOTE_PATH="${2:-/opt/openspell}"
TAG="${IMAGE_TAG:-latest}"
REGISTRY="${REGISTRY:-ghcr.io/openspell}"

ssh "$HOST" "cd $REMOTE_PATH && REGISTRY=$REGISTRY IMAGE_TAG=$TAG docker compose -f docker-compose.yml -f docker-compose.prod.yml pull && REGISTRY=$REGISTRY IMAGE_TAG=$TAG docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
