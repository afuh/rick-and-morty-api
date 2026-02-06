import CharacterModel from '../models/Character.js'
import LocationModel from '../models/Location.js'
import EpisodeModel from '../models/Episode.js'
import { urlToId } from './utils/helpers.js'

export const resolvers = {
  Query: {
    characters: async (_: unknown, { page = 1, filter }: { page: number; filter?: Record<string, string> }) => {
      return CharacterModel.findAndCount({ page, ...filter })
    },

    charactersByIds: async (_: unknown, { ids }: { ids: number[] }) => {
      return CharacterModel.find({ id: { $in: ids } })
    },

    character: async (_: unknown, { id }: { id: number }) => {
      return CharacterModel.findOne({ id })
    },

    locations: async (_: unknown, { page = 1, filter }: { page: number; filter?: Record<string, string> }) => {
      return LocationModel.findAndCount({ page, ...filter })
    },

    locationsByIds: async (_: unknown, { ids }: { ids: number[] }) => {
      return LocationModel.find({ id: { $in: ids } })
    },

    location: async (_: unknown, { id }: { id: number }) => {
      return LocationModel.findOne({ id })
    },

    episodes: async (_: unknown, { page = 1, filter }: { page: number; filter?: Record<string, string> }) => {
      return EpisodeModel.findAndCount({ page, ...filter })
    },

    episodesByIds: async (_: unknown, { ids }: { ids: number[] }) => {
      return EpisodeModel.find({ id: { $in: ids } })
    },

    episode: async (_: unknown, { id }: { id: number }) => {
      return EpisodeModel.findOne({ id })
    },
  },

  Character: {
    episode: async ({ episode }: { episode: string[] }) => {
      const ids = urlToId(episode)
      return EpisodeModel.find({ id: { $in: ids } })
    },
    location: async ({ location }: { location: { name: string; url: string } }) => {
      if (location?.name === 'unknown') return location
      return LocationModel.findOne({ id: urlToId(location.url) })
    },
    origin: async ({ origin }: { origin: { name: string; url: string } }) => {
      if (origin?.name === 'unknown') return origin
      return LocationModel.findOne({ id: urlToId(origin.url) })
    },
  },

  Location: {
    residents: async ({ residents }: { residents: string[] }) => {
      if (!residents || !residents.length) return []
      const ids = urlToId(residents)
      return CharacterModel.find({ id: { $in: ids } })
    },
  },

  Episode: {
    characters: async ({ characters }: { characters: string[] }) => {
      const ids = urlToId(characters)
      return CharacterModel.find({ id: { $in: ids } })
    },
  },
}
