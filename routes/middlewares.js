const { site, message } = require('../helpers')

const pagination = (req, res, next) => {
  req.body.limit = 20
  req.body.page = req.query.page > 0 && req.query.page || 1
  req.body.skip = (req.body.page * req.body.limit) - req.body.limit
  next();
}

const showData = (req, res) => {
  const { results, count, page, pages } = req.body
  const path = req.path.replace(/\//g, '')

  // Allowed queries for each path
  const pass = {
    character: ['name', 'status', 'species', 'type', 'gender'],
    episode: ['name', 'episode'],
    location: ['name', 'dimension', 'type']
  }

  let qr = ''
  for (const key in req.query) {
    // if the query isn't undefined and it's an allowed query for the path
    if (req.query[key] && pass[path].includes(key)) {
      // add it to the url
      qr+= `&${key}=${req.query[key]}`
    }
  }

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

module.exports = {
  pagination,
  showData,
}
