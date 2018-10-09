const { sanitizeQuery } = require('express-validator/filter')

const { collection } = require('../utils/helpers')

const Location = require('../models/Location')
const handleSingle = require('./_handleSingleQuery')

exports.sanitize = sanitizeQuery(collection.queries.episode).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, type, dimension } = req.query
  const { skip } = req.payload

  const { results, count } = await Location.findAndCount({
    name, type, dimension, skip
  })

  req.payload = {
    ...req.payload,
    count,
    results
  }

  next()
}

// ================ GET BY ID ================ //
exports.getById = async ({ params: { id } }, res) => await handleSingle(Location, id, res)
