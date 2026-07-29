#!/bin/bash
set -e
npm install
npm run db:push
# Exclude live-server integration tests — these require a running app + database
# and will time out / fail in beforeAll during headless post-merge execution:
#   criminal-charges-api.test.ts  — HTTP calls to localhost:5000
#   guidance-route.test.ts        — imports server/routes; needs DB connection
#   guidance-ownership.test.ts    — imports server/routes; needs DB connection
npx vitest run \
  --exclude="**/criminal-charges-api.test.ts" \
  --exclude="**/guidance-route.test.ts" \
  --exclude="**/guidance-ownership.test.ts"

# Remove stale subrepl-* remotes left behind by task agent environments.
# Each task agent adds a subrepl-* remote to .git/config and never cleans it up;
# this prevents them from accumulating and breaking the git sync tab.
STALE_REMOTES=$(git remote | grep '^subrepl-' || true)
if [ -n "$STALE_REMOTES" ]; then
  echo "$STALE_REMOTES" | xargs -I{} git remote remove {}
  echo "[post-merge] Removed stale subrepl-* remotes: $(echo "$STALE_REMOTES" | tr '\n' ' ')"
else
  echo "[post-merge] No stale subrepl-* remotes found."
fi

# Re-apply GitHub remote URL with PAT after every task-agent merge.
# Replit's merge process resets the remote to the plain HTTPS URL, stripping
# the token. This ensures git push always works without manual intervention.
if [ -n "$GH_PAT" ] && [ -n "$GH_USER" ]; then
  git remote set-url origin "https://${GH_USER}:${GH_PAT}@github.com/publicdefenderai-ai/OpenDefender.git"
  echo "[post-merge] Git remote URL updated with PAT."
else
  echo "[post-merge] WARNING: GH_PAT or GH_USER not set — git remote URL not updated. Push may fail."
fi
