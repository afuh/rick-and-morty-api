exports.site = process.env.NODE_ENV === "production" ? 'https://rickandmortyapi.com/api' : `http://localhost:${process.env.PORT}/api`

exports.message = {
  noPage: 'There is nothing here',
  noCharacter: 'Character not found',
  noLocation: 'Location not found',
  noEpisode: 'Episode not found',
  badParam: 'Hey! that parameter is not allowed, try with a number instead ;)',
  badArray: 'Bad... bad array :/'
}

exports.exclude = '-_id -author -__v -edited'
