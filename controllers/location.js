const Location = require('../models/Location')
const { sanitizeQuery } = require('express-validator/filter')

const { message, exclude } = require('../helpers')

exports.sanitize = sanitizeQuery(['name', 'dimension', 'type']).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, type, dimension } = req.query
  const { skip, limit, page } = req.body

  const { results, count } = await Location.findAndCount({
    name, type, dimension, skip, limit
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
    const chars = await Location.find({
      id: { $in: id }
    }).select(exclude)

    return res.json(Location.structure(chars))
  }
  // Check if the param is a number
  if (Number.isNaN(parseInt(id))) {
    return res.status(500).json({ error: message.badParam })
  }

  const loc = await Location.findOne({ id }).select(exclude)
  if (!loc) return res.status(404).json({ error: message.noLocation })

  res.json(Location.structure(loc))
}
