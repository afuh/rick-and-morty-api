const checkArray = (res) => (Array.isArray(res) ? res : [res])

const urlToId = (url) => {
  const getId = (str) => parseInt(str.match(/\d+$/))
  return Array.isArray(url) ? url.map((item) => getId(item)) : getId(url)
}

const handleInfo = ({ stats }) => {
  const getPage = (url) => {
    const params = new URL(url)
    return parseInt(params.searchParams.get('page'))
  }

  return {
    ...stats,
    next: () => (stats && stats.next ? getPage(stats.next) : null),
    prev: () => (stats && stats.prev ? getPage(stats.prev) : null),
  }
}

/**
 * @param {"ID" | "IDs" | "FILTER"} type
 */
const catch404 = (type, error) => {
  if (error.extensions.response.status === 404) {
    if (type === 'FILTER') {
      return { results: [] }
    } else if (type === 'IDs') {
      return []
    }
    return null
  }

  throw error
}

const resolvers = {
  Query: {
    characters: async (_, { page, filter }, { dataSources }) => {
      const { results, info: stats } = await dataSources.character
        .characters({ page, filter })
        .catch((error) => catch404('FILTER', error))

      const info = handleInfo({ stats })
      return { results, info }
    },
    charactersByIds: async (_, { ids }, { dataSources }) => {
      return dataSources.character.charactersByIds({ ids }).catch((error) => catch404('IDs', error))
    },
    character: async (_, { id }, { dataSources }) => {
      return dataSources.character.character({ id }).catch((error) => catch404('ID', error))
    },
    locations: async (_, { page, filter }, { dataSources }) => {
      const { results, info: stats } = await dataSources.location
        .locations({ page, filter })
        .catch((error) => catch404('FILTER', error))

      const info = handleInfo({ stats })
      return { results, info }
    },
    locationsByIds: async (_, { ids }, { dataSources }) => {
      return dataSources.location.locationsByIds({ ids }).catch((error) => catch404('IDs', error))
    },
    location: async (_, { id }, { dataSources }) => {
      return dataSources.location.location({ id }).catch((error) => catch404('ID', error))
    },
    episodes: async (_, { page, filter }, { dataSources }) => {
      const { results, info: stats } = await dataSources.episode
        .episodes({ page, filter })
        .catch((error) => catch404('FILTER', error))
      const info = handleInfo({ stats })
      return { results, info }
    },
    episodesByIds: async (_, { ids }, { dataSources }) => {
      return dataSources.episode.episodesByIds({ ids }).catch((error) => catch404('IDs', error))
    },
    episode: async (_, { id }, { dataSources }) => {
      return dataSources.episode.episode({ id }).catch((error) => catch404('ID', error))
    },
  },
  Character: {
    episode: async ({ episode }, _, { dataSources }) => {
      const res = await dataSources.episode.episode({ id: urlToId(episode) })
      return checkArray(res)
    },
    location: async ({ location }, _, { dataSources }) => {
      if (location.name === 'unknown') return location
      const res = await dataSources.location.location({ id: urlToId(location.url) })
      return res
    },
    origin: async ({ origin }, _, { dataSources }) => {
      if (origin.name === 'unknown') return origin
      const res = await dataSources.location.location({ id: urlToId(origin.url) })
      return res
    },
  },
  Location: {
    residents: async ({ residents }, _, { dataSources }) => {
      if (!residents || (residents && !residents.length)) return []
      const res = await dataSources.character.character({ id: urlToId(residents) })
      return checkArray(res)
    },
  },
  Episode: {
    characters: async ({ characters }, _, { dataSources }) => {
      const res = await dataSources.character.character({ id: urlToId(characters) })
      return checkArray(res)
    },
  },
}

module.exports = resolvers
