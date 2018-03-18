const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Query {
    character(id: Int!): Character
    characters(page: Int): [Character]
    episode(id: Int!): Episode
    episodes(page: Int): [Episode]
    location(id: Int!): Location
    locations(page: Int): [Location]
  }

  type Character {
    id: Int,
    name: String,
    species: String,
    type: String,
    status: String,
    location: Location,
    origin: Location,
    gender: String,
    episodes: [Episode],
    image: String,
  }

  type Episode {
    id: Int,
    name: String,
    episode: String,
    air_date: String,
    characters: [Character],
  }

  type Location {
    id: Int,
    name: String,
    type: String,
    dimension: String,
    residents: [Character],
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
