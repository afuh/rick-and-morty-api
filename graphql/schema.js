const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Query {
    character(id: Int!): Character
    characters(page: Int): Characters
    episode(id: Int!): Episode
    episodes(page: Int): Episodes
    location(id: Int!): Location
    locations(page: Int): Locations
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

  type Characters {
    count: Int,
    pages: Int,
    nextPage: Int,
    prevPage: Int,
    results: [Character]
  }

  type Episode {
    id: Int,
    name: String,
    episode: String,
    air_date: String,
    characters: [Character],
  }

  type Episodes {
    count: Int,
    pages: Int,
    nextPage: Int,
    prevPage: Int,
    results: [Episode]
  }

  type Location {
    id: Int,
    name: String,
    type: String,
    dimension: String,
    residents: [Character],
  }

  type Locations {
    count: Int,
    pages: Int,
    nextPage: Int,
    prevPage: Int,
    results: [Location]
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
