FROM nginx:1.13.8-alpine

RUN rm /etc/nginx/conf.d/*.conf

WORKDIR /usr/src
COPY proxy.conf ./
COPY start.sh ./

ENTRYPOINT ["/bin/sh", "start.sh"]
