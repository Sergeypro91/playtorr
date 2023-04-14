FROM node:18-alpine

WORKDIR /app/backend

COPY package*.json ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm install

COPY . .
