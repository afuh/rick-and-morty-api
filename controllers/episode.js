const { sanitizeQuery } = require('express-validator/filter')

const { collection } = require('../utils/helpers')

const Episode = require('../models/Episode')
const handleSingle = require('./_handleSingleQuery')

exports.sanitize = sanitizeQuery(collection.queries.episode).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, episode } = req.query
  const { skip, limit, page } = req.body

  const { results, count } = await Episode.findAndCount({
    name, episode, skip, limit
  })

  req.payload = {
    count, limit, page, results
  }

  next()
}

// ================ GET BY ID ================ //
exports.getById = async ({ params: { id } }, res) => await handleSingle(Episode, id, res)
