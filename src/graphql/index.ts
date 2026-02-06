import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers.js'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
