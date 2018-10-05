const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const { exclude } = require('../utils/helpers')

const locationSchema = new mongoose.Schema({
  id: {
    type: Number, unique: true
  },
  name: {
    type: String, trim: true, required: true
  },
  type: {
    type: String, trim: true, default: 'unknown'
  },
  dimension: {
    type: String, trim: true, default: 'unknown'
  },
  residents: Array,
  url: String,
  author: {
    type: mongoose.Schema.ObjectId, ref: 'User'
  },
  created: {
    type: Date, default: Date.now
  },
  edited: Date
})

locationSchema.statics.structure = ch => {
  const m = ({ id, name, type, dimension, residents, url, created }) => ({
    id,
    name,
    type,
    dimension,
    residents,
    url,
    created
  })
  return Array.isArray(ch) ? ch.map(ch => m(ch)) : m(ch)
}

locationSchema.statics.findAndCount = async function({ name, type, dimension, skip, limit }) {
  const q = key => new RegExp(key && key.replace(/[^\w\s]/g, "\\$&"), "i")

  const [loc, count] = await Promise.all([
    this.find({
      name: q(name),
      type: q(type),
      dimension: q(dimension)
    }).sort({ id: 1 }).select(exclude).skip(skip).limit(limit),

    this.find({
      name: q(name),
      type: q(type),
      dimension: q(dimension)
    }).countDocuments()
  ])

  const results = this.structure(loc)

  return { results, count }
}

locationSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Location', locationSchema)
