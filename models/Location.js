const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const { collection } = require('../utils/helpers')

const { Schema } = mongoose

const locationSchema = new Schema({
  id: Number,
  name: String,
  type: String,
  dimension: String,
  residents: [String],
  url: String,
  created: Date,
})

locationSchema.statics.structure = (res) => {
  const sortSchema = ({ id, name, type, dimension, residents, url, created }) => ({
    id,
    name,
    type,
    dimension,
    residents,
    url,
    created,
  })

  return Array.isArray(res) ? res.map(sortSchema) : sortSchema(res)
}

locationSchema.statics.findAndCount = async function ({ name, type, dimension, skip }) {
  const q = (key) => new RegExp(key && key.replace(/[^\w\s]/g, '\\$&'), 'i')

  const query = {
    name: q(name),
    type: q(type),
    dimension: q(dimension),
  }

  const [data, count] = await Promise.all([
    this.find(query).sort({ id: 1 }).select(collection.exclude).limit(collection.limit).skip(skip),
    this.find(query).countDocuments(),
  ])

  const results = this.structure(data)

  return { results, count }
}

locationSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Location', locationSchema)
