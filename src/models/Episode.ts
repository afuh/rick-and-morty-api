import { Schema, model, Model, Query } from 'mongoose'
import { collection } from '../utils/helpers.js'
import { buildFindAndCountResponse } from './utils/helpers.js'

interface EpisodeInterface {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: Date
}

interface EpisodeModel extends Model<EpisodeInterface> {
  findAndCount(params: {
    name?: string
    episode?: string
    skip: number
  }): Promise<ReturnType<typeof buildFindAndCountResponse>>
}

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

function preQuery(this: Query<unknown, unknown>) {
  this.select(collection.exclude)
}

episodeSchema.pre('find', preQuery)
episodeSchema.pre('findOne', preQuery)

episodeSchema.statics.findAndCount = async function (params: { name?: string; episode?: string; skip: number }) {
  const { name, episode, skip } = params

  const q = (key?: string) => {
    if (!key) return /.*/
    return new RegExp(key.replace(/[^\w\s]/g, '\\$&'), 'i')
  }

  const query = {
    name: q(name),
    episode: q(episode),
  }

  const [results, count]: [EpisodeInterface[], number] = await Promise.all([
    this.find(query).sort({ id: 1 }).limit(collection.limit).skip(skip),
    this.find(query).countDocuments(),
  ])

  return buildFindAndCountResponse(results, count, skip)
}

export default model<EpisodeInterface, EpisodeModel>('Episode', episodeSchema)
