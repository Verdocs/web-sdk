#!/bin/sh
# Bumps @verdocs/web-sdk and @verdocs/web-sdk-react together (patch unless told otherwise). Commit and push the result
# to main, and the Publish workflow releases it.
set -e
cd "$(dirname "$0")/.."

BUMP=${1:-patch}

# We build first so a broken build never gets a version number.
(cd verdocs-web-sdk && npm run build)

NEXTVER=$(cd verdocs-web-sdk && npm version "$BUMP" --no-git-tag-version | sed 's/^v//')
(cd verdocs-web-sdk-react && npm pkg set version="$NEXTVER" "dependencies.@verdocs/web-sdk=^$NEXTVER")

echo "Bumped @verdocs/web-sdk and @verdocs/web-sdk-react to $NEXTVER. Commit and push to main to publish."
