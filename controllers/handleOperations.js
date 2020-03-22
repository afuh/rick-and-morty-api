const { queryById, queryByFilter } = require('./handleQuery')
const models = require('../models')

const name = req => req.path.split('/')[1]

const getAll = async (req, res, next) => {
  const Model = models[name(req)]

  const { count, results } = await queryByFilter(Model, req)

  req.payload = {
    ...req.payload,
    count,
    results
  }

  next()
}

const getById = async (req, res) => {
  const Model = models[name(req)]

  const { data, error, status } = await queryById(Model, req.params.id)

  if (error) {
    return res.status(status).json({ error })
  }

  return res.json(data)
}

module.exports = {
  getAll,
  getById
}
