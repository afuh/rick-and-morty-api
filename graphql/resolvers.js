const { get, urlToId, modelNames, checkArray } = require('./utils')

const names = modelNames()

const Query = names.reduce((acc, { resource, resources }) => ({
  ...acc,
  [resource]: async (_, { id }) => await get(resource, { id }),
  [resources]: async (_, { page, filter }) => await get(resource, { page, filter })
}), {})

const resolvers = {
  Query,
  Character: {
    episode: async ({ episode }) => {
      const res = await get('episode', { id: urlToId(episode) })
      return checkArray(res)
    },
    location: async ({ location }) => {
      if (location.name === 'unknown') return location
      const res = await get('location', { id: urlToId(location.url) })
      return res
    },
    origin: async ({ origin }) => {
      if (origin.name === 'unknown') return origin
      const res = await get('location', { id: urlToId(origin.url) })
      return res
    }
  },
  Location: {
    residents: async ({ residents }) => {
      if (!residents) return
      const res = await get('character', { id: urlToId(residents) })
      return checkArray(res)
    }
  },
  Episode: {
    characters: async ({ characters }) => {
      const res = await get('character', { id: urlToId(characters) })
      return checkArray(res)
    }
  }
}

module.exports = resolvers
