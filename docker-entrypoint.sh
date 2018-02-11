#!/bin/sh

if [! orientjs db list | grep -q ${ORIENTDB_DB_NAME}]; then
  npm run db:create
fi

npm run migrate:up
npm run start