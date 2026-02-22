export const BASE_URL = 'https://rickandmortyapi.com/api'

export const message = {
  noPage: 'There is nothing here',
  noCharacter: 'Character not found',
  noLocation: 'Location not found',
  noEpisode: 'Episode not found',
  badParam: 'Hey! you must provide an id',
  badArray: 'Bad... bad array :/',
} as const

export const dbConfig = {
  pagination: {
    limit: 20,
  },
  projection: {
    exclude: '-_id -author -__v -edited',
  },
} as const

export const filterConfig = {
  filters: {
    character: ['name', 'status', 'species', 'type', 'gender'],
    episode: ['name', 'episode'],
    location: ['name', 'dimension', 'type'],
  },
} as const
