const Char = require('../models/Character')
const { sanitizeQuery } = require('express-validator/filter');

const { message, exclude } = require('../helpers')

exports.sanitize = sanitizeQuery(['name', 'status', 'species', 'gender', 'type']).trim()

// ================ GET ALL ================ //
exports.getAll = async (req, res, next) => {
  const { name, status, species, gender, type } = req.query
  const { skip, limit, page } = req.body

  const { results, count } = await Char.findAndCount({
    name, type, status, species, gender, skip, limit
  })

  const pages = Math.ceil(count / limit);

  if (page > pages) {
    res.status(404).json({ error: message.noPage })
    return
  }
  req.body.results = results
  req.body.count = count
  req.body.pages = pages

  next()
}

// ================ GET SINGLE ================ //
exports.getById = async ({ params: { id } }, res) => {

  // Check if the param is an array
  if (Array.isArray(id)) {
    const chars = await Char.find({
      id: { $in: id }
    }).select(exclude)

    return res.json(Char.structure(chars))
  }

  // Check if the param is a number
  if (Number.isNaN(parseInt(id))) {
    return res.status(500).json({ error: message.badParam })
  }

  const char = await Char.findOne({ id }).select(exclude)
  if (!char) return res.status(404).json({ error: message.noCharacter })

  res.json(Char.structure(char))
}
