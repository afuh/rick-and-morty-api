const { site, message, collection } = require('../utils/helpers')

const pagination = (req, res, next) => {
  req.body.limit = 20
  req.body.page = req.query.page > 0 && req.query.page || 1
  req.body.skip = (req.body.page * req.body.limit) - req.body.limit
  next()
}

const checkData = (req, res, next) => {
  const { count, limit, page, results } = req.payload
  const pages = Math.ceil(count / limit)

  if (page > pages) {
    res.status(404).json({ error: message.noPage })
    return
  }
  req.body.results = results
  req.body.count = count
  req.body.pages = pages

  next()
}

const showData = (req, res) => {
  const { results, count, page, pages } = req.body
  const path = req.path.replace(/\//g, '')

  const qr = Object.keys(req.query).reduce((acc, key) => {
    // if the query isn't undefined and it's an allowed query for the path
    if (req.query[key] && collection.queries[path].includes(key)) {
      // add it to the url
      acc+= `&${key}=${req.query[key]}`
    }
    return acc
  }, '')

  // Show data
  res.json({
    info: {
      count,
      pages,
      next: `${page >= pages ? '' : `${site}${req.path}?page=${parseInt(page) + 1 }${qr}` }`,
      prev: `${page < 2 ? '' : `${site}${req.path}?page=${parseInt(page) - 1 }${qr}` }`
    },
    results
  })
}

const checkArray = (req, res, next) => {
  const { id } = req.params

  if (/\[.+\]$/.test(id)) {
    try {
      req.params.id = JSON.parse(id)
      return next()
    }
    catch (e) {
      return res.status(500).json({ error: message.badArray })
    }
  }

  if ( id.includes(',') && !/\[|\]/.test(id) && id.length > 1 ) {
    req.params.id = id.split(",").map(Number)
    return next()
  }

  if (/\[|\]/.test(id)) {
    return res.status(500).json({ error: message.badArray })
  }

  next()
}

module.exports = {
  pagination,
  showData,
  checkData,
  checkArray
}
