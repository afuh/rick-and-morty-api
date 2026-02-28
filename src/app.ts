import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { graphqlServer } from '@hono/graphql-server'

import { schema } from './graphql/index.js'
import characterRoutes from './routes/character.js'
import locationRoutes from './routes/location.js'
import episodeRoutes from './routes/episode.js'
import { BASE_URL, message } from './config.js'
import { depthLimit } from './graphql/validation/depthLimit.js'

const app = new Hono()
const rest = new Hono()

app.use('*', cors({ origin: '*' }))

rest.get('/', (c) => {
  return c.json({
    characters: `${BASE_URL}/character`,
    locations: `${BASE_URL}/location`,
    episodes: `${BASE_URL}/episode`,
  })
})

rest.route('/character', characterRoutes)
rest.route('/location', locationRoutes)
rest.route('/episode', episodeRoutes)

app.route('/api', rest)

app.use('/graphql', graphqlServer({ schema, validationRules: [depthLimit(5)] }))

app.notFound((c) => {
  return c.json({ error: message.noPage }, 404)
})

export default app
