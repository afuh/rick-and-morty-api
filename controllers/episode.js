const { sanitizeQuery } = require('express-validator/filter')

const { collection } = require('../utils/helpers')

const Episode = require('../models/Episode')
const handleSingle = require('./_handleSingleQuery')

exports.sanitize = sanitizeQuery(collection.queries.episode).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, episode } = req.query
  const { skip } = req.payload

  const { results, count } = await Episode.findAndCount({
    name, episode, skip
  })

  req.payload = {
    ...req.payload,
    count,
    results
  }

  next()
}

// ================ GET BY ID ================ //
exports.getById = async ({ params: { id } }, res) => await handleSingle(Episode, id, res)
