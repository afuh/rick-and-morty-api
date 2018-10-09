const { sanitizeQuery } = require('express-validator/filter')

const { collection } = require('../utils/helpers')

const Character = require('../models/Character')
const handleSingle = require('./_handleSingleQuery')

exports.sanitize = sanitizeQuery(collection.queries.character).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, status, species, gender, type } = req.query
  const { skip, limit, page } = req.body

  const { results, count } = await Character.findAndCount({
    name, type, status, species, gender, skip, limit
  })

  req.payload = {
    count, limit, page, results
  }

  next()
}

// ================ GET BY ID ================ //
exports.getById = async ({ params: { id } }, res) => await handleSingle(Character, id, res)
