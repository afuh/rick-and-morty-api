const express = require('express')

const { baseUrl, message } = require('../utils/helpers')
const getHandler = require('./middlewares')
const api = require('./api')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    characters: `${baseUrl}/character`,
    locations: `${baseUrl}/location`,
    episodes: `${baseUrl}/episode`,
  })
})

router.get('/character/avatar', (req, res) => {
  res.status(404).json({ error: message.noPage })
})

api.forEach((endpoint) => {
  const handler = getHandler(endpoint.model)
  router.get(endpoint.path, handler[endpoint.handler])
})

module.exports = router
