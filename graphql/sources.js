const { RESTDataSource } = require('apollo-datasource-rest')

const baseUrl = `http://localhost:${process.env.PORT || 8080}/api`

/**
 * Filter out query parameter with `null` values. Check [#103](https://github.com/afuh/rick-and-morty-api/issues/103) for more details.
 * @param {*} obj - query parameters.
 */
const pruneObject = (obj) => {
  // eslint-disable-next-line no-unused-vars
  return Object.fromEntries(Object.entries(obj).filter(([_, v = null]) => v !== null))
}

class Character extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `${baseUrl}/character`
  }

  async characters({ filter, page }) {
    return this.get('/', pruneObject({ ...filter, page }))
  }
  async charactersByIds({ ids }) {
    const data = await this.get('/' + ids)
    return Array.isArray(data) ? data : [data]
  }
  async character({ id }) {
    return this.get('/' + id)
  }
}

class Location extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `${baseUrl}/location`
  }

  async locations({ filter, page }) {
    return this.get('/', pruneObject({ ...filter, page }))
  }
  async locationsByIds({ ids }) {
    const data = await this.get('/' + ids)
    return Array.isArray(data) ? data : [data]
  }
  async location({ id }) {
    return this.get('/' + id)
  }
}

class Episode extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `${baseUrl}/episode`
  }

  async episodes({ filter, page }) {
    return this.get('/', pruneObject({ ...filter, page }))
  }
  async episodesByIds({ ids }) {
    const data = await this.get('/' + ids)
    return Array.isArray(data) ? data : [data]
  }
  async episode({ id }) {
    return this.get('/' + id)
  }
}

module.exports = { Character, Location, Episode }
