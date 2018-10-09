const { sanitizeQuery } = require('express-validator/filter')

const { collection } = require('../utils/helpers')

const Character = require('../models/Character')
const handleSingle = require('./_handleSingleQuery')

exports.sanitize = sanitizeQuery(collection.queries.character).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, status, species, gender, type } = req.query
  const { skip } = req.payload

  const { results, count } = await Character.findAndCount({
    name, type, status, species, gender, skip
  })

  req.payload = {
    ...req.payload,
    count,
    results
  }

  next()
}

// ================ GET BY ID ================ //
exports.getById = async ({ params: { id } }, res) => await handleSingle(Character, id, res)
