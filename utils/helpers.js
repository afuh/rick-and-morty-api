const moment = require('moment')

exports.site = 'https://rickandmortyapi.com/api'

exports.message = {
  noPage: 'There is nothing here',
  noCharacter: 'Character not found',
  noLocation: 'Location not found',
  noEpisode: 'Episode not found',
  badParam: 'Hey! you must provide an id',
  badArray: 'Bad... bad array :/',
  rateLimit: time => `Ohh yea, you gotta get schwifty!. You've reached the maximum request limit, please try again ${moment(time).fromNow()}`
}

exports.collection = {
  exclude: '-_id -author -__v -edited',
  limit: 20,
  queries: {
    character: ['name', 'status', 'species', 'type', 'gender'],
    episode: ['name', 'episode'],
    location: ['name', 'dimension', 'type']
  }
}
