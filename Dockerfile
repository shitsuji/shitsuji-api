FROM 'node:8-wheezy'

WORKDIR /shitsuji
EXPOSE 3000

# RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y build-essential \
#     && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm install && npm run build

ENTRYPOINT ["docker-entrypoint.sh"]