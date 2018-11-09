const { message, collection } = require('../utils/helpers')

const handleSingle = async (Col, id) => {

  // Check if the param is an array
  if (Array.isArray(id)) {
    const data = await Col.find({
      id: { $in: id }
    }).select(collection.exclude)

    return { data: Col.structure(data) }
  }

  // Check if the param is a number
  if (Number.isNaN(parseInt(id))) {
    return { error: message.badParam, status: 500 }
  }

  const data = await Col.findOne({ id }).select(collection.exclude)

  if (!data) {
    return { error: message[`no${Col.modelName}`], status: 404 }
  }

  return { data: Col.structure(data) }
}

const handleMultiple = async (Col, req) => {
  const opt = Object.assign(req.query, { skip: req.payload.skip })

  const { results, count } = await Col.findAndCount(opt)

  return {
    count,
    results
  }
}

module.exports = {
  handleSingle,
  handleMultiple
}
