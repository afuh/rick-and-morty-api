import { characterSources, episodeSources, locationSources } from './sources.js'

const urlToId = (url: string | string[]) => {
  const getId = (str: string) => parseInt(str.match(/\d+$/))
  return Array.isArray(url) ? url.map((item) => getId(item)) : getId(url)
}

const checkArray = (res: unknown) => (Array.isArray(res) ? res : [res])

export const resolvers = {
  Query: {
    characters: async (_: unknown, { page, filter }: { page?: number; filter?: Record<string, string> }) => {
      return characterSources.characters({ page, filter })
    },

    charactersByIds: async (_: unknown, { ids }: { ids: number[] }) => {
      return characterSources.charactersByIds({ ids })
    },

    character: async (_: unknown, { id }: { id: number }) => {
      return characterSources.character({ id })
    },

    locations: async (_: unknown, { page, filter }: { page?: number; filter?: Record<string, string> }) => {
      return locationSources.locations({ page, filter })
    },

    locationsByIds: async (_: unknown, { ids }: { ids: number[] }) => {
      return locationSources.locationsByIds({ ids })
    },

    location: async (_: unknown, { id }: { id: number }) => {
      return locationSources.location({ id })
    },

    episodes: async (_: unknown, { page, filter }: { page?: number; filter?: Record<string, string> }) => {
      return episodeSources.episodes({ page, filter })
    },

    episodesByIds: async (_: unknown, { ids }: { ids: number[] }) => {
      return episodeSources.episodesByIds({ ids })
    },

    episode: async (_: unknown, { id }: { id: number }) => {
      return episodeSources.episode({ id })
    },
  },

  Character: {
    episode: async (parent: Record<string, unknown>) => {
      if (!parent.episode || (parent.episode as unknown[]).length === 0) return []
      const res = await episodeSources.episode({ id: urlToId(parent.episode as string[]) })
      return checkArray(res)
    },
    location: async (parent: Record<string, unknown>) => {
      if (!parent.location || (parent.location as Record<string, unknown>).name === 'unknown') return parent.location
      return locationSources.location({ id: urlToId((parent.location as Record<string, string>).url) })
    },
    origin: async (parent: Record<string, unknown>) => {
      if (!parent.origin || (parent.origin as Record<string, unknown>).name === 'unknown') return parent.origin
      return locationSources.location({ id: urlToId((parent.origin as Record<string, string>).url) })
    },
  },

  Location: {
    residents: async (parent: Record<string, unknown>) => {
      if (!parent.residents || (parent.residents as unknown[]).length === 0) return []
      const res = await characterSources.charactersByIds({ ids: urlToId(parent.residents as string[]) })
      return checkArray(res)
    },
  },

  Episode: {
    characters: async (parent: Record<string, unknown>) => {
      if (!parent.characters || (parent.characters as unknown[]).length === 0) return []
      const res = await characterSources.charactersByIds({ ids: urlToId(parent.characters as string[]) })
      return checkArray(res)
    },
  },
}
