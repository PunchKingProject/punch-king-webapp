#!/bin/bash
set -e

echo "=== Punch King Dev Frontend deploy started at $(date) ==="

# Navigate to the correct directory
cd /opt/dev/frontend/punch-king-webapp

# 1. Sync with GitHub dev branch
git fetch origin development
git reset --hard origin/development

# 2. Build and Restart using Docker Compose
docker compose build --no-cache
docker compose up -d --remove-orphans

# 3. Cleanup unused images
docker image prune -f

echo "=== Punch King Dev Frontend deploy complete at $(date) ==="