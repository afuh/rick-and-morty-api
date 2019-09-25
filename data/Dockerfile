FROM mongo:4

ENV DATABASE mongodb://mongo:27017/rickmorty-api

WORKDIR /data
COPY . .

CMD mongorestore --uri="$DATABASE" --db=rickmorty-api .

