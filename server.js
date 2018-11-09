require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const { ApolloServer } = require('apollo-server-express')

const app = express()

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const handle = require('./handlers')
const api = require('./routes/api')

const db = process.env.NODE_ENV === "production" ? process.env.DATABASE : 'mongodb://localhost:27017/rickmorty-api'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  validationRules: [ handle.depth(4) ]
})

mongoose.connect(db, { useNewUrlParser: true })
mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)

mongoose.connection.on('error', err => {
  console.error(`→ ${err.message}`)
})

if (app.get('env') !== 'test') {
  app.use(morgan('dev'))
}

app.set('trust proxy', 1)

app.use(express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('*', handle.limit)
app.get('/', (req, res) => res.redirect('/api'))
app.use('/api', api)

server.applyMiddleware({ app })

app.use(handle.error.notFound)
app.use(handle.error.productionErrors)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log('\x1b[34m%s\x1b[0m', `
  ${app.get('env').toUpperCase()}

  REST      → http://localhost:${PORT}/api/
  GraphQL   → http://localhost:${PORT}${server.graphqlPath}/
  Database  → ${mongoose.connection.host}/${mongoose.connection.name}
  `
))

module.exports = app
