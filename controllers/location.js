const { sanitizeQuery } = require('express-validator/filter')

const Location = require('../models/Location')
const handleSingle = require('./_handleSingleQuery')

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
exports.getById = async ({ params: { id } }, res) => await handleSingle(Location, id, res)
