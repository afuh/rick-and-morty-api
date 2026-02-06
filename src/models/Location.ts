import { Schema, model, Model, Query } from 'mongoose'
import { collection } from '../utils/helpers.js'
import { buildFindAndCountResponse } from './utils/helpers.js'

interface LocationInterface {
  id: number
  name: string
  type: string
  dimension: string
  residents: string[]
  url: string
  created: Date
}

interface LocationModel extends Model<LocationInterface> {
  findAndCount(params: {
    name?: string
    type?: string
    dimension?: string
    page: number
  }): Promise<ReturnType<typeof buildFindAndCountResponse>>
}

const locationSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    type: String,
    dimension: String,
    residents: [String],
    url: String,
    created: Date,
  },
  {
    toJSON: {
      transform(_doc, ret) {
        return {
          id: ret.id,
          name: ret.name,
          type: ret.type,
          dimension: ret.dimension,
          residents: ret.residents,
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

locationSchema.pre('find', preQuery)
locationSchema.pre('findOne', preQuery)

locationSchema.statics.findAndCount = async function (params: {
  name?: string
  type?: string
  dimension?: string
  page: number
}) {
  const { name, type, dimension, page } = params
  const skip = (page - 1) * collection.limit

  const q = (key?: string) => {
    if (!key) return /.*/
    return new RegExp(key.replace(/[^\w\s]/g, '\\$&'), 'i')
  }

  const query = {
    name: q(name),
    type: q(type),
    dimension: q(dimension),
  }

  const [results, count]: [LocationInterface[], number] = await Promise.all([
    this.find(query).sort({ id: 1 }).limit(collection.limit).skip(skip),
    this.find(query).countDocuments(),
  ])

  return buildFindAndCountResponse(results, count, skip)
}

export default model<LocationInterface, LocationModel>('Location', locationSchema)
