const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const { collection } = require('../utils/helpers')

const { Schema } = mongoose

const characterSchema = new Schema({
  id: Number,
  name: String,
  species: String,
  type: String,
  status: String,
  location: { type: Schema.ObjectId, ref: 'Location' },
  origin: { type: Schema.ObjectId, ref: 'Location' },
  gender: String,
  episode: [String],
  image: String,
  url: String,
  created: Date,
})

function autopopulate(next) {
  this.populate({ path: 'location', select: 'name url -_id' })
  this.populate({ path: 'origin', select: 'name url -_id' })
  next()
}

characterSchema.pre('find', autopopulate)
characterSchema.pre('findOne', autopopulate)

characterSchema.statics.structure = (res) => {
  const sortSchema = ({ id, name, status, species, type, gender, origin, location, image, episode, url, created }) => ({
    id,
    name,
    status,
    species,
    type,
    gender,
    origin,
    location,
    image,
    episode,
    url,
    created,
  })

  return Array.isArray(res) ? res.map(sortSchema) : sortSchema(res)
}

characterSchema.statics.findAndCount = async function ({ name, type, status, species, gender, skip }) {
  const q = (key) => new RegExp(key && (/^male/i.test(key) ? `^${key}` : key.replace(/[^\w\s]/g, '\\$&')), 'i')

  const query = {
    name: q(name),
    status: q(status),
    species: q(species),
    type: q(type),
    gender: q(gender),
  }

  const [data, count] = await Promise.all([
    this.find(query).sort({ id: 1 }).select(collection.exclude).limit(collection.limit).skip(skip),
    this.find(query).countDocuments(),
  ])

  const results = this.structure(data)

  return { results, count }
}

characterSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Character', characterSchema)
