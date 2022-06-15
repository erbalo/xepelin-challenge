FROM node:16.15.1-alpine3.15

# adding bash to the container
RUN apk add --no-cache bash

USER node

# base directory app
WORKDIR /xepelin/app

RUN mkdir -p scripts
COPY scripts/wait-for.sh scripts/wait-for.sh

# priviages only on root user
USER root
RUN chmod +x ./scripts/wait-for.sh

USER node

COPY --chown=node:node package*.json ./
COPY tsconfig.json .

RUN npm install
RUN mkdir -p src

COPY src src

RUN npm run build

VOLUME /xepelin/app/input

EXPOSE 8080
