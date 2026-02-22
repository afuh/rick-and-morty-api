import { Schema, model, Model, Query, type InferSchemaType } from 'mongoose'
import { dbConfig, filterConfig } from '../config.js'
import { buildFindAndCountResponse } from './utils/buildFindAndCountResponse.js'
import { generateFilterOptions } from './utils/generateFilterOptions.js'

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

type CharacterFilterFields = (typeof filterConfig.filters.character)[number]

type CharacterFilters = { [key in CharacterFilterFields]?: string } & { page: number }

type CharacterInterface = InferSchemaType<typeof characterSchema>

type CharacterPopulated = Omit<CharacterInterface, 'location' | 'origin'> & {
  location: { name: string; url: string }
  origin: { name: string; url: string }
}

function preQuery(this: Query<unknown, unknown>) {
  this.populate({ path: 'location', select: 'name url -_id' })
  this.populate({ path: 'origin', select: 'name url -_id' })
  // Avoid querying these fields from MongoDB
  this.select(dbConfig.projection.exclude)
}

characterSchema.pre(/^find/, preQuery)

characterSchema.statics.findAndCount = async function (this: Model<CharacterPopulated>, params: CharacterFilters) {
  const { skip, query } = generateFilterOptions(
    { fields: filterConfig.filters.character, prefixMatchFields: ['gender'] },
    params
  )

  const [results, count] = await Promise.all([
    this.find(query).sort({ id: 1 }).limit(dbConfig.pagination.limit).skip(skip),
    this.countDocuments(query),
  ])

  return buildFindAndCountResponse(results, count, skip, dbConfig.pagination.limit)
}

interface CharacterModel extends Model<CharacterPopulated> {
  findAndCount(params: CharacterFilters): Promise<ReturnType<typeof buildFindAndCountResponse>>
}

export default model<CharacterPopulated, CharacterModel>('Character', characterSchema)
