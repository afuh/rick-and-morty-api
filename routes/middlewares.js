const { query } = require('express-validator')

const { getAll, getById } = require('../handlers/operations')
const { baseUrl, message, collection } = require('../utils/helpers')

const sanitizeQueryParams = (model) => query(collection.queries[model]).trim()

const generatePageUrls = (req, res, next) => {
  const { results, count, page } = req.payload
  const pages = Math.ceil(count / collection.limit)

  if (page > pages) {
    res.status(404).json({ error: message.noPage })
    return
  }

  const path = req.path.replace(/\//g, '')

  const qr = Object.keys(req.query).reduce((acc, key) => {
    // if the query isn't undefined and it's an allowed query for the path
    if (req.query[key] && collection.queries[path].includes(key)) {
      // add it to the url
      return acc + `&${key}=${req.query[key]}`
    }

    return acc
  }, '')

  req.payload = {
    info: {
      count,
      pages,
      next: page >= pages ? null : `${baseUrl}${req.path}?page=${parseInt(page) + 1}${qr}`,
      prev: page < 2 ? null : `${baseUrl}${req.path}?page=${parseInt(page) - 1}${qr}`,
    },
    results,
  }
  next()
}

const validateArrayParams = (req, res, next) => {
  const { id } = req.params

  if (/\[.+\]$/.test(id)) {
    try {
      req.params.id = JSON.parse(id)
      return next()
    } catch (e) {
      return res.status(500).json({ error: message.badArray })
    }
  }

  if (id.includes(',') && !/\[|\]/.test(id) && id.length > 1) {
    req.params.id = id.split(',').map(Number)
    return next()
  }

  if (/\[|\]/.test(id)) {
    return res.status(500).json({ error: message.badArray })
  }

  next()
}

const sendRes = (req, res) => {
  res.json(req.payload)
}

module.exports = (model) => ({
  find: [sanitizeQueryParams(model), getAll, generatePageUrls, sendRes],
  findById: [validateArrayParams, getById, sendRes],
})
