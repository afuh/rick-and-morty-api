const _req = require('request')
const models = require('../models')
const { URL } = require('url') // Remove this in Node 10 

// Returns the query names
const modelNames = () => {
  const resources = Object.keys(models)

  return resources.reduce((acc, resource) => {
    const allResources = `all${resource.charAt(0).toUpperCase() + resource.slice(1)}s`

    return [...acc, { resource, allResources } ]
  }, [])
}

// Takes an URL with and ID
// Returns the ID
const getId = url => parseInt(url.match(/\d+$/))

// Takes an Array of URls with IDs
// Returns an array of IDs
const urlToId = url => Array.isArray(url) ? url.map(item => getId(item)) : getId(url)

// Takes an URL with a page query
// Return the page number
const getPage = url => {
  const params = new URL(url)
  return parseInt(params.searchParams.get('page'))
}

// Use native promises with "request"
const request = (endpoint, qs) => new Promise((resolve, reject) => {
  _req.get({
    baseUrl: `http://localhost:${process.env.PORT || 8080}/api/`,
    url: endpoint,
    qs
  })
    .on('response', res => {
      const body = []

      res.on('data', chunk => body.push(chunk))
      res.on('end', () => resolve(JSON.parse(body.join(''))))
    })
    .on('error', err => reject(err))
})

// Takes an endpoint name (i.e. "characters") and optional args (filter, page, id)
// fetch the DB
// returns the response
const get = async (col, args) => {
  if (args.id) {
    const res = await request(`${col}/${args.id}`)
    return Array.isArray(res) ? res : [ res ]
  }

  const { results, info: stats } = await request(`${col}/`, { ...args.filter, page: args.page })

  const info = {
    ...stats,
    next: () => stats && stats.next ? getPage(stats.next) : null,
    prev: () => stats && stats.prev ? getPage(stats.prev) : null
  }

  return { results, info }
}

module.exports = {
  get, urlToId, modelNames
}
