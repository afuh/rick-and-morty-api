const { sanitizeQuery } = require('express-validator/filter')

const { collection } = require('../utils/helpers')

const Character = require('../models/Character')
const { handleSingle, handleMultiple } = require('./_handleQuery')

exports.sanitize = sanitizeQuery(collection.queries.episode).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { count, results } = await handleMultiple(Character, req)

  req.payload = {
    ...req.payload,
    count,
    results
  }

  next()
}

// ================ GET BY ID ================ //
exports.getById = async ({ params: { id } }, res) => await handleSingle(Character, id, res)
