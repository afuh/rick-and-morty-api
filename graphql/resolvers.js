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

const resolvers = {
  Query: {
    characters: async (_, { page, filter }, { dataSources }) => {
      const { results, info: stats } = await dataSources.character.characters({ page, filter })
      const info = handleInfo({ stats })
      return { results, info }
    },
    charactersByIds: async (_, { ids }, { dataSources }) => {
      return dataSources.character.charactersByIds({ ids })
    },
    character: async (_, { id }, { dataSources }) => {
      return dataSources.character.character({ id })
    },
    locations: async (_, { page, filter }, { dataSources }) => {
      const { results, info: stats } = await dataSources.location.locations({ page, filter })
      const info = handleInfo({ stats })
      return { results, info }
    },
    locationsByIds: async (_, { ids }, { dataSources }) => {
      return dataSources.location.locationsByIds({ ids })
    },
    location: async (_, { id }, { dataSources }) => {
      return dataSources.location.location({ id })
    },
    episodes: async (_, { page, filter }, { dataSources }) => {
      const { results, info: stats } = await dataSources.episode.episodes({ page, filter })
      const info = handleInfo({ stats })
      return { results, info }
    },
    episodesByIds: async (_, { ids }, { dataSources }) => {
      return dataSources.episode.episodesByIds({ ids })
    },
    episode: async (_, { id }, { dataSources }) => {
      return dataSources.episode.episode({ id })
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
      if (!residents) return
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
