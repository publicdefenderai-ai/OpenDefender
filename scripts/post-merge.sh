#!/bin/bash
set -e
npm install
npm run db:push
npx vitest run tests/
