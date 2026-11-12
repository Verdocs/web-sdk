#!/bin/sh
# This script will let us resolve `@verdocs/js-sdk` to our local codebase, whenever we're running locally.
# Steps:
# 1.) cd ../hub && pnpm --filter @verdocs/js-sdk run build
# 2.) scripts/local-js-sdk.sh link
# 3.) cd ./verdocs-web-sdk && npm run start
# 4.) cd ./storybook && LOCAL_JS_SDK=1 npm run start
# 5.) scripts/local-js-sdk.sh unlink (You must do this before you publish)
#
# `link` moves each package's npm copy aside and symlinks the local js-sdk in its place. `unlink` puts the npm copy
# back, without running npm, so lockfiles are never touched. `status` (or no argument) just reports.

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
JS_SDK="$(cd "$ROOT/../hub/packages/js-sdk" && pwd)"

status() {
  if [ -L "$1" ]; then
    echo "LINKED -> $(readlink "$1")"
  elif [ -f "$1/package.json" ]; then
    echo "npm release $(node -p "JSON.parse(require('fs').readFileSync('$1/package.json', 'utf8')).version")"
  else
    echo "MISSING (run npm ci in this folder)"
  fi
}

case "${1:-status}" in
  link | unlink | status) ;;
  *)
    echo "Usage: $0 [link|unlink|status]" >&2
    exit 1
    ;;
esac

for pkg in verdocs-web-sdk storybook; do
  target="$ROOT/$pkg/node_modules/@verdocs/js-sdk"
  # Outside node_modules/@verdocs, so npm and scripts/check-no-local-links.mjs both ignore it.
  backup="$ROOT/$pkg/node_modules/.js-sdk-npm-backup"

  case "${1:-status}" in
    link)
      if [ ! -L "$target" ]; then
        rm -rf "$backup"
        [ -e "$target" ] && mv "$target" "$backup"
        ln -s "$JS_SDK" "$target"
      fi
      ;;
    unlink)
      if [ -L "$target" ]; then
        rm "$target"
        if [ -d "$backup" ]; then
          mv "$backup" "$target"
        else
          echo "$pkg: no saved npm copy to restore, reinstalling from the lockfile with npm ci..."
          (cd "$ROOT/$pkg" && npm ci --no-audit --no-fund)
        fi
      fi
      rm -rf "$backup"
      ;;
  esac

  echo "$pkg: $(status "$target")"
done

[ "$1" = "unlink" ] && echo "Rebuild verdocs-web-sdk (npm run build) so dist isn't the one compiled against the local js-sdk."
exit 0
