#!/usr/bin/env sh
set -e

OUT_DIR="${1:-./backups}"
TS="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT_DIR"

echo "Creating backup in $OUT_DIR/openspell-$TS.sql"
docker exec openspell-postgres pg_dump -U openspell openspell > "$OUT_DIR/openspell-$TS.sql"
