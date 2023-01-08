FROM node:19-alpine

WORKDIR /app

COPY ./envs/.env ./envs/

WORKDIR /app/backend

COPY package*.json ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm install

COPY . .
