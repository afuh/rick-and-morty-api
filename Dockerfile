FROM node:current-alpine3.12

RUN apk update && apk add --no-cache mongodb-tools

COPY . /var/src

WORKDIR /var/src

RUN npm install --only=prod

EXPOSE 8080 8080

ENTRYPOINT ["npm", "run", "start"]
