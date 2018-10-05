const { sanitizeQuery } = require('express-validator/filter')

const Episode = require('../models/Episode')
const handleSingle = require('./_handleSingleQuery')

exports.sanitize = sanitizeQuery(['name', 'episode']).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, episode } = req.query
  const { skip, limit, page } = req.body

  const { results, count } = await Episode.findAndCount({
    name, episode, skip, limit
  })

  const pages = Math.ceil(count / limit)

  if (page > pages) {
    res.status(404).json({ error: message.noPage })
    return
  }

  req.body.results = results
  req.body.count = count
  req.body.pages = pages

  next()
}

// ================ GET BY ID ================ //
exports.getById = async ({ params: { id } }, res) => handleSingle(Episode, id, res)
