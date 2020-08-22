const { RESTDataSource } = require('apollo-datasource-rest')

const baseUrl = `http://localhost:${process.env.PORT || 8080}/api`

class Character extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `${baseUrl}/character`
  }

  async characters({ filter, page }) {
    const data = await this.get('/', { ...filter, page })
    return data
  }

  async charactersByIds({ ids }) {
    const data = await this.get('/' + ids)
    return Array.isArray(data) ? data : [data]
  }
  async character({ id }) {
    const data = await this.get('/' + id)
    return data
  }
}

class Location extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `${baseUrl}/location`
  }

  async locations({ filter, page }) {
    const data = await this.get('/', { ...filter, page })
    return data
  }
  async locationsByIds({ ids }) {
    const data = await this.get('/' + ids)
    return Array.isArray(data) ? data : [data]
  }
  async location({ id }) {
    const data = await this.get('/' + id)
    return data
  }
}

class Episode extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `${baseUrl}/episode`
  }

  async episodes({ filter, page }) {
    const data = await this.get('/', { ...filter, page })
    return data
  }
  async episodesByIds({ ids }) {
    const data = await this.get('/' + ids)
    return Array.isArray(data) ? data : [data]
  }
  async episode({ id }) {
    const data = await this.get('/' + id)
    return data
  }
}

module.exports = { Character, Location, Episode }
