const { handleSingle, handleMultiple } = require('./handleQuery')
const models = require('../models')

const getAll = async (req, res, next) => {
  const Model = models[req.path.replace(/\//g, '')]

  const { count, results } = await handleMultiple(Model, req)

  req.payload = {
    ...req.payload,
    count,
    results
  }

  next()
}

const getById = async (req, res) => {
  const Model = models[req.path.replace(/(\/|\d|\[|\]|,)/g, '')]

  await handleSingle(Model, req.params.id, res)
}

module.exports = {
  getAll,
  getById
}
