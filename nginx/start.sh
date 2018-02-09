#!/bin/sh
cp /usr/src/proxy.conf /etc/nginx/conf.d/proxy.conf
if [ -n "${PROXY_HOST}" ]; then
  PROXY_SERVICE=$PROXY_HOST
fi
if [ -n "${PROXY_PORT}" ]; then
  PROXY_SERVICE="${PROXY_SERVICE}:${PROXY_PORT}"
fi
sed -i "s~{{PROXY_SERVICE}}~${PROXY_SERVICE}~g;" /etc/nginx/conf.d/proxy.conf
nginx -g 'daemon off;'