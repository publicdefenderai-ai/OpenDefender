#!/bin/bash
set -eu

# Recovery hold: merging code must not install packages (which can restart
# workflows), push schema, run database-connected tests, or modify credentials.
# Do not silently restore the old automatic setup when merging another task.
echo "[post-merge] Recovery hold: automatic setup is disabled."
echo "[post-merge] Dependencies, schema changes and tests require separately approved, scoped commands."
echo "[post-merge] Do not restart workflows or production as part of recovery."
