FROM node:20-alpine AS base
WORKDIR /usr/local/app

FROM base AS backend-dev

COPY package.json /usr/local/app/package.json
COPY package-lock.json /usr/local/app/package-lock.json

RUN npm i

EXPOSE 8000
CMD ["npm", "run", "dev"]