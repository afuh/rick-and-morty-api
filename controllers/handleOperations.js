const { handleSingle, handleMultiple } = require('./handleQuery')
const models = require('../models')

const name = req => req.path.split("/")[1]

const getAll = async (req, res, next) => {
  const Model = models[name(req)]

  const { count, results } = await handleMultiple(Model, req)

  req.payload = {
    ...req.payload,
    count,
    results
  }

  next()
}

const getById = async (req, res) => {
  const Model = models[name(req)]

  await handleSingle(Model, req.params.id, res)
}

module.exports = {
  getAll,
  getById
}
