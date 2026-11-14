#!/bin/sh
# Preview the proposed merge order. Arguments are local Git revision names.
set -eu

if [ "$#" -lt 2 ]; then
  echo "Usage: sh scripts/data-review/check-batch-integration.sh BASE DRAFT [DRAFT ...]" >&2
  exit 2
fi
base=$1
shift
integrated=$(git rev-parse --verify --end-of-options "$base^{commit}")
for draft do
  tip=$(git rev-parse --verify --end-of-options "$draft^{commit}")
  if git merge-base --is-ancestor "$tip" "$integrated"; then
    echo "$draft is already included"
    continue
  fi
  if tree=$(git merge-tree --write-tree --name-only "$integrated" "$tip"); then
    # Keep both parents so the next comparison sees shared/stacked history.
    integrated=$(git -c user.name=Preflight -c user.email=preflight@invalid.example \
      commit-tree "$tree" -p "$integrated" -p "$tip" -m "Local integration preview")
    echo "$draft merges cleanly"
  else
    status=$?
    echo "Integration stopped at $draft" >&2
    echo "$tree" >&2
    exit "$status"
  fi
done
