import { Schema, model, Model, Query, type InferSchemaType } from 'mongoose'
import { dbConfig, filterConfig } from '../config.js'
import { buildFindAndCountResponse } from './utils/buildFindAndCountResponse.js'
import { generateFilterOptions } from './utils/generateFilterOptions.js'

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

type LocationFilterFields = (typeof filterConfig.filters.location)[number]

type LocationFilters = { [key in LocationFilterFields]?: string } & { page: number }

type LocationInterface = InferSchemaType<typeof locationSchema>

function preQuery(this: Query<unknown, unknown>) {
  this.select(dbConfig.projection.exclude)
}

locationSchema.pre(/^find/, preQuery)

locationSchema.statics.findAndCount = async function (this: Model<LocationInterface>, params: LocationFilters) {
  const { skip, query } = generateFilterOptions({ fields: filterConfig.filters.location }, params)

  const [results, count] = await Promise.all([
    this.find(query).sort({ id: 1 }).limit(dbConfig.pagination.limit).skip(skip),
    this.find(query).countDocuments(),
  ])

  return buildFindAndCountResponse(results, count, skip, dbConfig.pagination.limit)
}

interface LocationModel extends Model<LocationInterface> {
  findAndCount(params: LocationFilters): Promise<ReturnType<typeof buildFindAndCountResponse>>
}

export default model<LocationInterface, LocationModel>('Location', locationSchema)
