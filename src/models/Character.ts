import { Schema, model, Model, Query } from 'mongoose'
import { collection } from '../utils/helpers.js'
import { buildFindAndCountResponse } from './utils/helpers.js'

interface CharacterInterface {
  id: number
  name: string
  species: string
  type: string
  status: string
  location: {
    name: string
    url: string
  }
  origin: {
    name: string
    url: string
  }
  gender: string
  episode: string[]
  image: string
  url: string
  created: Date
}

interface CharacterModel extends Model<CharacterInterface> {
  findAndCount(params: {
    name?: CharacterInterface['name']
    type?: CharacterInterface['type']
    status?: CharacterInterface['status']
    species?: CharacterInterface['species']
    gender?: CharacterInterface['gender']
    skip: number
  }): Promise<ReturnType<typeof buildFindAndCountResponse>>
}

const characterSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    species: String,
    type: String,
    status: String,
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    origin: { type: Schema.Types.ObjectId, ref: 'Location' },
    gender: String,
    episode: [String],
    image: String,
    url: String,
    created: Date,
  },
  {
    toJSON: {
      transform(_doc, ret) {
        // Only return the fields specified in the API docs
        return {
          id: ret.id,
          name: ret.name,
          status: ret.status,
          species: ret.species,
          type: ret.type,
          gender: ret.gender,
          origin: ret.origin,
          location: ret.location,
          image: ret.image,
          episode: ret.episode,
          url: ret.url,
          created: ret.created,
        }
      },
    },
  }
)

function preQuery(this: Query<unknown, unknown>) {
  this.populate({ path: 'location', select: 'name url -_id' })
  this.populate({ path: 'origin', select: 'name url -_id' })
  // Avoid querying these fields from Mongo
  this.select(collection.exclude)
}

characterSchema.pre('find', preQuery)
characterSchema.pre('findOne', preQuery)

characterSchema.statics.findAndCount = async function (params: {
  name?: string
  type?: string
  status?: string
  species?: string
  gender?: string
  skip: number
}) {
  const { name, type, status, species, gender, skip } = params

  const q = (key?: string) => {
    if (!key) return /.*/
    return new RegExp(/^male/i.test(key) ? `^${key}` : key.replace(/[^\w\s]/g, '\\$&'), 'i')
  }

  const query = {
    name: q(name),
    status: q(status),
    species: q(species),
    type: q(type),
    gender: q(gender),
  }

  const [results, count]: [CharacterInterface[], number] = await Promise.all([
    this.find(query).sort({ id: 1 }).limit(collection.limit).skip(skip),
    this.find(query).countDocuments(),
  ])

  return buildFindAndCountResponse(results, count, skip)
}

export default model<CharacterInterface, CharacterModel>('Character', characterSchema)
