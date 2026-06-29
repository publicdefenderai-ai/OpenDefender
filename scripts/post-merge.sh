#!/bin/bash
set -e
npm install
npm run db:push
npx vitest run tests/

# Re-apply GitHub remote URL with PAT after every task-agent merge.
# Replit's merge process resets the remote to the plain HTTPS URL, stripping
# the token. This ensures git push always works without manual intervention.
if [ -n "$GH_PAT" ] && [ -n "$GH_USER" ]; then
  git remote set-url origin "https://${GH_USER}:${GH_PAT}@github.com/publicdefenderai-ai/OpenDefender.git"
  echo "[post-merge] Git remote URL updated with PAT."
else
  echo "[post-merge] WARNING: GH_PAT or GH_USER not set — git remote URL not updated. Push may fail."
fi
