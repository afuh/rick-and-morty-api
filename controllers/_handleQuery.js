const { message, collection } = require('../utils/helpers')

exports.handleSingle = async (Col, id, res) => {

  // Check if the param is an array
  if (Array.isArray(id)) {
    const data = await Col.find({
      id: { $in: id }
    }).select(collection.exclude)

    return res.json(Col.structure(data))
  }

  // Check if the param is a number
  if (Number.isNaN(parseInt(id))) {
    return res.status(500).json({ error: message.badParam })
  }

  const data = await Col.findOne({ id }).select(collection.exclude)

  if (!data) {
    return res.status(404).json({ error: message[`no${Col.modelName}`] })
  }

  return res.json(Col.structure(data))
}

exports.handleMultiple = async (Col, req) => {
  const opt = Object.assign(req.query, { skip: req.payload.skip })

  const { results, count } = await Col.findAndCount(opt)

  return {
    count,
    results
  }
}
