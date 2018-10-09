const { sanitizeQuery } = require('express-validator/filter')

const { collection } = require('../utils/helpers')

const Location = require('../models/Location')
const { handleSingle, handleMultiple } = require('./_handleQuery')

exports.sanitize = sanitizeQuery(collection.queries.episode).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { count, results } = await handleMultiple(Location, req)

  req.payload = {
    ...req.payload,
    count,
    results
  }

  next()
}

// ================ GET BY ID ================ //
exports.getById = async ({ params: { id } }, res) => await handleSingle(Location, id, res)
