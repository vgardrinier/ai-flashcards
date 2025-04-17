#!/bin/bash
# entrypoint.sh for Rails backend

set -e

# Remove a potentially pre-existing server.pid for Rails
rm -f /app/tmp/pids/server.pid

# Wait for database to be ready
until pg_isready -h db -p 5432 -U ubuntu; do
  echo "Waiting for database to be ready..."
  sleep 2
done

# Then exec the container's main process (what's set as CMD in the Dockerfile)
exec "$@"
