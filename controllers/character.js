const { sanitizeQuery } = require('express-validator/filter')

const Character = require('../models/Character')
const handleSingle = require('./_handleSingleQuery')

exports.sanitize = sanitizeQuery(['name', 'status', 'species', 'gender', 'type']).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, status, species, gender, type } = req.query
  const { skip, limit, page } = req.body

  const { results, count } = await Character.findAndCount({
    name, type, status, species, gender, skip, limit
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
exports.getById = async ({ params: { id } }, res) => handleSingle(Character, id, res)
