require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')

const app = express()

const api = require('./routes/api')
const errors = require('./handlers/errors')

const db = process.env.NODE_ENV === "production" ? process.env.DATABASE : 'mongodb://localhost:27017/rickmorty-api'

mongoose.connect(db, { useNewUrlParser: true })
mongoose.Promise = global.Promise

mongoose.connection.on('error', err => {
  console.error(`→ ${err.message}`)
})

if (app.get('env') !== 'test') {
  app.use(morgan('dev', {
    skip(req) {
      return req.path.match(/(ico|png|svg|jpeg|woff2|css|js|txt|)$/ig)[0] ? true : false
    }
  }))
}

app.set('trust proxy', 1)

app.use(express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.redirect('/api'))
app.use('/api', api)

app.use(errors.notFound)
app.use(errors.productionErrors)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log('\x1b[34m%s\x1b[0m', `
  ${app.get('env').toUpperCase()}

  Port      → http://localhost:${PORT}
  Database  → ${mongoose.connection.host}/${mongoose.connection.name}
  `
))

module.exports = app
