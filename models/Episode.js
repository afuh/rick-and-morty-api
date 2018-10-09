const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const { collection } = require('../utils/helpers')

const episodeSchema = new mongoose.Schema({
  id: {
    type: Number, unique: true
  },
  name: {
    type: String, trim: true, required: true
  },
  episode: {
    type: String, trim: true
  },
  air_date: String,
  characters: Array,
  url: String,
  author: {
    type: mongoose.Schema.ObjectId, ref: 'User'
  },
  created: {
    type: Date, default: Date.now
  },
  edited: Date
})

episodeSchema.statics.structure = ch => {
  const m = ({ id, name, air_date, episode, characters, url, created }) => ({
    id,
    name,
    air_date,
    episode,
    characters,
    url,
    created
  })

  return Array.isArray(ch) ? ch.map(ch => m(ch)) : m(ch)
}

episodeSchema.statics.findAndCount = async function({ name, episode, skip }) {
  const q = key => new RegExp(key && key.replace(/[^\w\s]/g, "\\$&"), "i")

  const query = {
    name: q(name),
    episode: q(episode)
  }

  const [data, count] = await Promise.all([
    this.find(query).sort({ id: 1 }).select(collection.exclude).limit(collection.limit).skip(skip),
    this.find(query).countDocuments()
  ])

  const results = this.structure(data)

  return { results, count }
}

episodeSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Episode', episodeSchema)
