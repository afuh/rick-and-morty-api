const ExpressBrute = require('express-brute');
const MongooseStore = require('express-brute-mongoose');
const moment = require('moment')
const mongoose = require('mongoose');

const { log } = console

const bruteForceSchema = new mongoose.Schema({
  _id: String,
  data: {
    count: Number,
    lastRequest: Date,
    firstRequest: Date
  },
  expires: { type: Date, index: { expires: '1d' } }
}, { collection: 'bruteforce' });

const Limit = mongoose.model('Limit', bruteForceSchema);

const store = process.env.NODE_ENV === 'production' ? new MongooseStore(Limit) : new ExpressBrute.MemoryStore()

const failCallback = (req, res, next, nextValidRequestDate) => {
	res.status(429).json({ error: `Ohh yea, you gotta get schwifty!. You've reached the maximum request limit, please try again ${moment(nextValidRequestDate).fromNow()}` })
  return
};

const handleStoreError = error => log(error);

const bruteforce = new ExpressBrute(store, {
	freeRetries: 10000,
	attachResetToRequest: false,
	refreshTimeoutOnRequest: false,
	minWait: 13*60*60*1000,
	maxWait: 13*60*60*1000,
	lifetime: 12*60*60, 
	failCallback,
	handleStoreError
});


module.exports = bruteforce.prevent
