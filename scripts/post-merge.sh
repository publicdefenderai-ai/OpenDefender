#!/bin/bash
set -e
npm install

# The workspace exposes both DATABASE_URL (the managed development database)
# and, in some environments, NEON_DATABASE_URL from an older connection setup.
# drizzle.config.ts prefers the latter, but it can be stale and cause the
# schema pull to retry until post-merge setup is killed. Prefer the managed
# development URL for this dev-only merge hook without changing the app's
# runtime connection selection.
if [ -n "${DATABASE_URL:-}" ]; then
  echo "[post-merge] Applying schema to the managed development database."
  timeout --signal=TERM --kill-after=10s 60s env -u NEON_DATABASE_URL npm run db:push
else
  echo "[post-merge] DATABASE_URL is not set; using the configured fallback."
  timeout --signal=TERM --kill-after=10s 60s npm run db:push
fi

# Exclude live-server integration tests — these require a running app + database
# and will time out / fail in beforeAll during headless post-merge execution:
#   criminal-charges-api.test.ts  — HTTP calls to localhost:5000
#   guidance-route.test.ts        — imports server/routes; needs DB connection
#   guidance-ownership.test.ts    — imports server/routes; needs DB connection
#   mitigation-polish.test.ts     — HTTP calls to localhost:5000/api/mitigation/polish;
#                                   server runs on pre-merge code so new routes return 404
npx vitest run \
  --exclude="**/criminal-charges-api.test.ts" \
  --exclude="**/guidance-route.test.ts" \
  --exclude="**/guidance-ownership.test.ts" \
  --exclude="**/mitigation-polish.test.ts"

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
