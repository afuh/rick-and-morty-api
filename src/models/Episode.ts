import { Schema, model, Model, Query, type InferSchemaType } from 'mongoose'
import { dbConfig, filterConfig } from '../config.js'
import { buildFindAndCountResponse } from './utils/buildFindAndCountResponse.js'
import { generateFilterOptions } from './utils/generateFilterOptions.js'

const episodeSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    episode: String,
    air_date: String,
    characters: [String],
    url: String,
    created: Date,
  },
  {
    toJSON: {
      transform(_doc, ret) {
        return {
          id: ret.id,
          name: ret.name,
          air_date: ret.air_date,
          episode: ret.episode,
          characters: ret.characters,
          url: ret.url,
          created: ret.created,
        }
      },
    },
  }
)

type EpisodeFilterFields = (typeof filterConfig.filters.episode)[number]

type EpisodeFilters = { [key in EpisodeFilterFields]?: string } & { page: number }

type EpisodeInterface = InferSchemaType<typeof episodeSchema>

function preQuery(this: Query<unknown, unknown>) {
  this.select(dbConfig.projection.exclude)
}

episodeSchema.pre(/^find/, preQuery)

episodeSchema.statics.findAndCount = async function (this: Model<EpisodeInterface>, params: EpisodeFilters) {
  const { skip, query } = generateFilterOptions({ fields: filterConfig.filters.episode }, params)

  const [results, count] = await Promise.all([
    this.find(query).sort({ id: 1 }).limit(dbConfig.pagination.limit).skip(skip),
    this.countDocuments(query),
  ])

  return buildFindAndCountResponse(results, count, skip, dbConfig.pagination.limit)
}

interface EpisodeModel extends Model<EpisodeInterface> {
  findAndCount(params: EpisodeFilters): Promise<ReturnType<typeof buildFindAndCountResponse>>
}

export default model<EpisodeInterface, EpisodeModel>('Episode', episodeSchema)
