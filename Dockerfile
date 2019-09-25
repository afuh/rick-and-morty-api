FROM node:12-alpine

WORKDIR /app
COPY . .

ENV NODE_ENV production
ENV DATABASE mongodb://localhost:27017/rickmorty-api

RUN npm i --only=production

CMD ["npm", "start"]
