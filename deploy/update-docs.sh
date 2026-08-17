#!/usr/bin/env bash

set -Eeuo pipefail

export PATH="/usr/local/bin:/usr/bin:/bin:${PATH:-}"

SCRIPT_DIRECTORY="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPOSITORY_DIRECTORY="$(dirname -- "${SCRIPT_DIRECTORY}")"
LOCK_FILE="${TMPDIR:-/tmp}/artisan-toolbox-docs-deploy.lock"

log() {
    printf '[%s] %s\n' "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$*"
}

trap 'status=$?; log "Deployment failed at line ${LINENO} (exit ${status})."; exit "${status}"' ERR

if ! command -v flock >/dev/null 2>&1; then
    log "The flock command is required to prevent concurrent deployments."
    exit 1
fi

exec 9>"${LOCK_FILE}"

if ! flock --nonblock 9; then
    log "Another documentation deployment is already running; skipping this execution."
    exit 0
fi

cd "${REPOSITORY_DIRECTORY}"

log "Restoring the repository working tree."
git reset --hard HEAD
git clean -fd

log "Updating the main branch from origin."
git checkout main
git pull --ff-only origin main

log "Installing locked npm dependencies."
npm ci

log "Building the documentation site."
npm run build

log "Documentation deployment completed successfully."
