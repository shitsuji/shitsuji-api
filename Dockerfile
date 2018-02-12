FROM 'node:8-stretch'

WORKDIR /shitsuji
EXPOSE 3000

RUN apt-get update \
    && apt-get install \
    --no-install-recommends --no-install-suggests -y \
    realpath build-essential libstdc++-6-dev \
    && rm -rf /var/lib/apt/lists/*
COPY ./package.json .
RUN npm install
COPY . .
RUN npm run build

ENTRYPOINT ["/bin/bash", "docker-entrypoint.sh"]