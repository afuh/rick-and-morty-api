const express = require('express')

const { site } = require('../utils/helpers')
const getHandler = require('./middlewares')
const api = require('./api')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    characters: `${site}/character`,
    locations: `${site}/location`,
    episodes: `${site}/episode`,
  })
})

router.get('/character/avatar', (req, res) => {
  res.redirect('/api/character')
})

api.forEach((endpoint) => {
  const handler = getHandler(endpoint.model)
  router.get(endpoint.path, handler[endpoint.handler])
})

module.exports = router
