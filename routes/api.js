const express = require('express')
const router = express.Router()

const char = require('../controllers/character')
const loc = require('../controllers/location')
const epi = require('../controllers/episode')

const { catchErrors } = require('../handlers/errors')
const { site } = require('../utils/helpers')
const rateLimit = require('../handlers/rate')

const { pagination, checkArray, showData, checkData } = require('./middlewares')

router.all('/*', rateLimit)

router.get('/', (req, res) => {
  res.json({
    characters: `${site}/character`,
    locations: `${site}/location`,
    episodes: `${site}/episode`
  })
})

router.get('/character/avatar', (req, res) => res.redirect('/api/character'))

router.get('/character', char.sanitize, pagination, catchErrors(char.getAll), checkData, showData)
router.get('/character/:id', checkArray, catchErrors(char.getById))

router.get('/location', loc.sanitize, pagination, catchErrors(loc.getAll), checkData, showData)
router.get('/location/:id', checkArray, catchErrors(loc.getById))

router.get('/episode', epi.sanitize, pagination, catchErrors(epi.getAll), checkData, showData)
router.get('/episode/:id', checkArray, catchErrors(epi.getById))

module.exports = router
