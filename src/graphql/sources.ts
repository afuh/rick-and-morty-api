import CharacterModel from '../models/Character.js'
import LocationModel from '../models/Location.js'
import EpisodeModel from '../models/Episode.js'
import { collection } from '../utils/helpers.js'

const handleInfo = (count: number, page: number) => {
  const pages = Math.ceil(count / collection.limit)

  return {
    count,
    pages,
    next: page < pages ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
  }
}

type Resource = {
  page: number
  filter: Record<string, unknown>
}

export const characterSources = {
  // TODO: pruneObject ? review
  async characters({ page = 1, filter }: Resource) {
    const skip = (page - 1) * collection.limit
    const { results, count } = await CharacterModel.findAndCount({ skip, ...filter })

    if (Array.isArray(results) && results.length === 0 && page > 1) {
      return { results: [], info: { count: null, pages: null, next: null, prev: null } }
    }

    const info = handleInfo(count, page)
    return { results, info }
  },

  async charactersByIds({ ids }: { ids: number[] }) {
    const data = await CharacterModel.find({ id: { $in: ids } })
    return Array.isArray(data) ? data : [data]
  },

  async character({ id }: { id: number }) {
    const result = await CharacterModel.findOne({ id })
    return result
  },
}

export const locationSources = {
  // TODO: review
  async locations({ page = 1, filter }: Resource) {
    const skip = (page - 1) * collection.limit
    const { results, count } = await LocationModel.findAndCount({ skip, ...filter })
    const info = handleInfo(count, page)
    return { results, info }
  },

  async locationsByIds({ ids }: { ids: number[] }) {
    const data = await LocationModel.find({ id: { $in: ids } })
    return Array.isArray(data) ? data : [data]
  },

  async location({ id }: { id: number }) {
    const result = await LocationModel.findOne({ id })
    return result
  },
}

export const episodeSources = {
  // TODO: review
  async episodes({ page = 1, filter }: Resource) {
    const skip = (page - 1) * collection.limit
    const { results, count } = await EpisodeModel.findAndCount({ skip, ...filter })
    const info = handleInfo(count, page)
    return { results, info }
  },

  async episodesByIds({ ids }: { ids: number[] }) {
    const data = await EpisodeModel.find({ id: { $in: ids } })
    return Array.isArray(data) ? data : [data]
  },

  async episode({ id }: { id: number }) {
    const result = await EpisodeModel.findOne({ id })
    return result
  },
}
