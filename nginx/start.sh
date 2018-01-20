#!/bin/sh

cp /usr/src/proxy.conf /etc/nginx/conf.d/proxy.conf

echo "settings host ${PROXY_HOST}"
if [ -n "${PROXY_HOST}" ]; then
  PROXY_SERVICE=$PROXY_HOST
fi

echo "settings port ${PROXY_PORT}"
if [ -n "${PROXY_PORT}" ]; then
  PROXY_SERVICE="${PROXY_SERVICE}:${PROXY_PORT}"
fi

sed -i "s/{{PROXY_SERVICE}}/${PROXY_SERVICE}/g;" /etc/nginx/conf.d/proxy.conf

echo "Updated service ${PROXY_SERVICE}"
echo "Starting nginx..."
nginx -g 'daemon off;'