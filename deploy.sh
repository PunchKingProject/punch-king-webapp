#!/bin/bash
set -e

echo "=== Punch King Prod Frontend deploy started at $(date) ==="

# Navigate to the correct directory
cd /opt/prod/frontend/punch-king-webapp

# 1. Sync with GitHub dev branch
git fetch origin main
git reset --hard origin/main

# 2. Build and Restart using Docker Compose
docker compose build --no-cache
docker compose up -d --remove-orphans

# 3. Cleanup unused images
docker image prune -f

echo "=== Punch King Prod Frontend deploy complete at $(date) ==="
