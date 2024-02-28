FROM node:18.16.1-alpine

WORKDIR /app

RUN apk update

COPY package-lock.json package.json /app/

RUN npm install

COPY . .

RUN npm run build && \
    npm prune --production --silent

EXPOSE 8000

CMD ["node", "dist/main"]