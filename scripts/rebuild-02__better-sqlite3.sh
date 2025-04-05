#!/bin/bash

# NOTE: no need to rebuild the db file (i dont think)... just `better-sqlite3`

if [[ -d ./node_modules ]]; then
  echo "Node folder found."

  # NOTE: path v1
  # cd ./node_modules
  # pnpm rebuild better-sqlite3

  # TODO: path v2 -- ⭐ DO THIS !! ⭐
  # cd ./node_modules/.pnpm/better-sqlite3@9.6.0/node_modules/better-sqlite3
  # pnpm node-gyp rebuild --debug

  if [[ ! -d ./better-sqlite3/build ]]; then
    echo "Building release.."
    npm run build-release
  fi
fi
