const models = require('../models')
const { catchErrors } = require('./errors')
const { message, collection } = require('../utils/helpers')

const buildResponse = ({ data, status, message }) => {
  if (data) {
    return {
      data,
      error: null
    }
  }

  return {
    data: null,
    error: {
      message,
      status
    }
  }
}

const queryById = async (Model, id) => {
  // If the param is an array
  if (Array.isArray(id)) {
    const data = await Model.find({
      id: { $in: id }
    }).select(collection.exclude)

    return buildResponse({ data: Model.structure(data) })
  }

  // If the param is a number
  if (Number.isNaN(parseInt(id))) {
    return buildResponse({ status: 500, message: message.badParam })
  }

  const data = await Model.findOne({ id }).select(collection.exclude)

  if (!data) {
    return buildResponse({ status: 404, message: message[`no${Model.modelName}`] })
  }

  return buildResponse({ data: Model.structure(data) })
}

const getAll = async (req, res, next) => {
  const [, name] = req.path.split('/')
  const Model = models[name]
  const opt = Object.assign(req.query, { skip: req.payload.skip })

  const { results, count } = await Model.findAndCount(opt)

  req.payload = {
    ...req.payload,
    count,
    results
  }

  next()
}

const getById = async (req, res) => {
  const [, name] = req.path.split('/')
  const Model = models[name]
  const { data, error } = await queryById(Model, req.params.id)

  if (error) {
    return res.status(error.status).json({ error: error.message })
  }

  return res.json(data)
}

module.exports = {
  getAll: catchErrors(getAll),
  getById: catchErrors(getById)
}
