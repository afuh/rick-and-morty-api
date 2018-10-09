const { sanitizeQuery } = require('express-validator/filter')

const { collection } = require('../utils/helpers')

const Location = require('../models/Location')
const handleSingle = require('./_handleSingleQuery')

exports.sanitize = sanitizeQuery(collection.queries.episode).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, type, dimension } = req.query
  const { skip, limit, page } = req.body

  const { results, count } = await Location.findAndCount({
    name, type, dimension, skip, limit
  })

  req.payload = {
    count, limit, page, results
  }

  next()
}

// ================ GET BY ID ================ //
exports.getById = async ({ params: { id } }, res) => await handleSingle(Location, id, res)
