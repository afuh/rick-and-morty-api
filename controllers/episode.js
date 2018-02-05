const Episode = require('../models/Episode')
const { sanitizeQuery } = require('express-validator/filter');

const { message, exclude } = require('../helpers')

exports.sanitize = sanitizeQuery(['name', 'episode']).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, episode } = req.query
  const { skip, limit, page } = req.body

  const { results, count } = await Episode.findAndCount({
    name, episode, skip, limit
  })

  const pages = Math.ceil(count / limit);

  if (page > pages) {
    res.status(404).json({ error: message.noPage })
    return
  }

  req.body.results = results
  req.body.count = count
  req.body.pages = pages

  next()
}

// ================ GET SINGLE ================ //
exports.getSingle = async (req, res) => {
  // Check if the param is a number
  if (Number.isNaN(parseInt(req.params.id))) {
    return res.status(500).json({error: message.badParam})
  }

  const epi = await Episode.findOne({id: req.params.id}).select(exclude);
  if (!epi) return res.status(404).json({ error: message.noEpisode })

  res.json(Episode.structure(epi))
}
