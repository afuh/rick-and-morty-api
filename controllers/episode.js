const Episode = require('../models/Episode')
const { sanitizeQuery } = require('express-validator/filter')

const { message, exclude } = require('../helpers')

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
exports.getById = async ({ params: { id } }, res) => {

  // Check if the param is an array
  if (Array.isArray(id)) {
    const chars = await Episode.find({
      id: { $in: id }
    }).select(exclude)

    return res.json(Episode.structure(chars))
  }

  // Check if the param is a number
  if (Number.isNaN(parseInt(id))) {
    return res.status(500).json({ error: message.badParam })
  }

  const epi = await Episode.findOne({ id }).select(exclude)
  if (!epi) return res.status(404).json({ error: message.noEpisode })

  res.json(Episode.structure(epi))
}
