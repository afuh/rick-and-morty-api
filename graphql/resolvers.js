const { get, urlToId, modelNames } = require('./utils')

const names = modelNames()

const Query = names.reduce((acc, { resource, allResources }) => ({
  ...acc,
  [resource]: async (_, { id }) => await get(resource, { id }),
  [allResources]: async (_, { page, filter }) => await get(resource, { page, filter })
}), {})

const resolvers = {
  Query,
  Character: {
    episode: async ({ episode }) => {
      const res = await get('episode', { id: urlToId(episode) })
      return res
    },
    location: async ({ location }) => {
      if (location.name === 'unknown') return location
      const [ res ] = await get('location', { id: urlToId(location.url) })
      return res
    },
    origin: async ({ origin }) => {
      if (origin.name === 'unknown') return origin
      const [ res ] = await get('location', { id: urlToId(origin.url) })
      return res
    }
  },
  Location: {
    residents: async ({ residents }) => {
      const res = await get('character', { id: urlToId(residents) })
      return res
    }
  },
  Episode: {
    characters: async ({ characters }) => {
      const res = await get('character', { id: urlToId(characters) })
      return res
    }
  }
}

module.exports = resolvers
