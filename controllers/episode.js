const { sanitizeQuery } = require('express-validator/filter')

const { collection } = require('../utils/helpers')

const Episode = require('../models/Episode')
const { handleSingle, handleMultiple } = require('./_handleQuery')

exports.sanitize = sanitizeQuery(collection.queries.episode).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { count, results } = await handleMultiple(Episode, req)

  req.payload = {
    ...req.payload,
    count,
    results
  }

  next()
}

// ================ GET BY ID ================ //
exports.getById = async ({ params: { id } }, res) => await handleSingle(Episode, id, res)
