#!/bin/bash

if [ -n "${ORIENTDB_HOST}" ]; then
  HOST=$ORIENTDB_HOST
else
  ORIENTDB_HOST="localhost"
  HOST="localhost"
fi
ORIENTDB_OPTS="--host=${HOST}"

if [ -n "${ORIENTDB_PORT}" ]; then
  PORT=$ORIENTDB_PORT
else
  ORIENTDB_PORT="2424"
  PORT="2424"
fi
ORIENTDB_OPTS="${ORIENTDB_OPTS} --port=${ORIENTDB_PORT}"

if [[ ! -n "${ORIENTDB_USER}" ]]; then
  ORIENTDB_USER="root"
fi
ORIENTDB_OPTS="${ORIENTDB_OPTS} --user=${ORIENTDB_USER}"

if [[ ! -n "${ORIENTDB_PASSWORD}" ]]; then
  ORIENTDB_PASSWORD="shitsuji"
fi
ORIENTDB_OPTS="${ORIENTDB_OPTS} --password=${ORIENTDB_PASSWORD}"

if [[ ! -n "${ORIENTDB_DB_NAME}" ]]; then
  ORIENTDB_DB_NAME="shitsuji"
fi
ORIENTDB_OPTS="${ORIENTDB_OPTS} --dbname=${ORIENTDB_DB_NAME}"
DATABASE_NAME=$ORIENTDB_DB_NAME

if [[ ! -n "${ORIENTDB_DB_USER}" ]]; then
  ORIENTDB_DB_USER="root"
fi
ORIENTDB_OPTS="${ORIENTDB_OPTS} --dbuser=${ORIENTDB_DB_USER}"

if [[ ! -n "${ORIENTDB_DB_PASSWORD}" ]]; then
  ORIENTDB_DB_PASSWORD="shitsuji"
fi
ORIENTDB_OPTS="${ORIENTDB_OPTS} --dbpassword=${ORIENTDB_DB_PASSWORD}"

echo "Waiting for ${HOST}:${PORT}..."
chmod +x wait-for-it.sh
bash ./wait-for-it.sh "${HOST}:${PORT}"
echo "${HOST}:${PORT} is up, continuing..."

echo "Listing databases with ${ORIENTDB_OPTS}"
DATABASES=$(./node_modules/.bin/orientjs db list $ORIENTDB_OPTS)
echo "Found such databases: ${DATABASES}"

if [[ ${DATABASES} != *$DATABASE_NAME* ]]; then
  echo "Creating database with options: ${ORIENTDB_OPTS}"
  ./node_modules/.bin/orientjs db create $DATABASE_NAME graph plocal $ORIENTDB_OPTS
fi

./node_modules/.bin/orientjs migrate up $ORIENTDB_OPTS
npm run start