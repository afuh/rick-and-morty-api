const ExpressBrute = require('express-brute')
const MongooseStore = require('express-brute-mongoose')
const mongoose = require('mongoose')

const { message } = require('../utils/helpers')

const bruteForceSchema = new mongoose.Schema({
  _id: String,
  data: {
    count: Number,
    lastRequest: Date,
    firstRequest: Date
  },
  expires: { type: Date, index: { expires: '1d' } }
}, { collection: 'bruteforce' })

const Limit = mongoose.model('Limit', bruteForceSchema)

const store = process.env.NODE_ENV === 'production' ? new MongooseStore(Limit) : new ExpressBrute.MemoryStore()

const failCallback = (req, res, next, nextValidRequestDate) => {
  res.status(429).json({ error: message.rateLimit(nextValidRequestDate) })
  return
}

const handleStoreError = error => console.log(error)

const bruteforce = new ExpressBrute(store, {
  freeRetries: 10000,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 13*60*60*1000,
  maxWait: 13*60*60*1000,
  lifetime: 24*60*60,
  failCallback,
  handleStoreError
})


module.exports = bruteforce.prevent
