require('dotenv').config()

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')

const app = express()

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { Character, Location, Episode } = require('./graphql/sources')

const handle = require('./handlers')
const routes = require('./routes')

const LOCAL = `mongodb://localhost:27017/rickmorty${process.env.NODE_ENV === 'test' ? '-test' : ''}`
const db = process.env.NODE_ENV === 'production' ? process.env.DATABASE : LOCAL

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  validationRules: [handle.depth(4)],
  dataSources: () => ({
    character: new Character(),
    location: new Location(),
    episode: new Episode(),
  }),
})

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = global.Promise

mongoose.connection.on('error', (err) => {
  console.error(`→ ${err.message}`)
})

/* istanbul ignore next */
if (app.get('env') !== 'test') {
  app.use(
    morgan(':status | :method :url :response-time ms | :remote-addr', {
      skip: (req) => req.method !== 'GET',
    }),
  )
}

app.use(cors())

app.set('trust proxy', 1)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/character/avatar', express.static(path.join(__dirname, 'images')))
app.use('/api', routes)

server.applyMiddleware({ app })

app.use(handle.error.notFound)
app.use(handle.error.productionErrors)

const PORT = process.env.PORT || 8080
app.listen(PORT, () =>
  console.log(
    '\x1b[34m%s\x1b[0m',
    `
  ${app.get('env').toUpperCase()}

  REST      → http://localhost:${PORT}/api/
  GraphQL   → http://localhost:${PORT}${server.graphqlPath}/
  Database  → ${mongoose.connection.host}/${mongoose.connection.name}
  `,
  ),
)

module.exports = app
