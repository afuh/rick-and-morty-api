import 'dotenv/config'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { graphqlServer } from '@hono/graphql-server'
import { connectDB } from './utils/db.js'
import { baseUrl, message } from './utils/helpers.js'
import characterRoutes from './routes/character.js'
import locationRoutes from './routes/location.js'
import episodeRoutes from './routes/episode.js'
import { schema } from './graphql/index.js'
import { depthLimit } from './graphql/utils/helpers.js'
import { seedDatabase } from './__tests__/seed.js'

const app = new Hono()
const rest = new Hono()

const PORT = process.env.PORT || 8080

app.use('*', cors({ origin: '*' }))

// API root - list all resources
rest.get('/', (c) => {
  return c.json({
    characters: `${baseUrl}/character`,
    locations: `${baseUrl}/location`,
    episodes: `${baseUrl}/episode`,
  })
})

// Static files for character avatars
rest.use(
  '/character/avatar/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/api\/character\/avatar/, '/images'),
  })
)

rest.get('/character/avatar', (c) => {
  return c.json({ error: message.noPage }, 404)
})

// Mount resource routes
rest.route('/character', characterRoutes)
rest.route('/location', locationRoutes)
rest.route('/episode', episodeRoutes)

// Mount API sub-app
app.route('/api', rest)

app.use('/graphql', graphqlServer({ schema, graphiql: true, validationRules: [depthLimit(5)] }))

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'There is nothing here.' }, 404)
})

if (process.env.NODE_ENV === 'local') {
  // use memory server for local development to avoid messing with production data
  const { MongoMemoryServer } = await import('mongodb-memory-server')
  const mongoServer = await MongoMemoryServer.create()
  process.env.DATABASE = mongoServer.getUri()
  await connectDB()
  await seedDatabase()
}

if (process.env.NODE_ENV !== 'test') {
  await connectDB()

  serve({ fetch: app.fetch, port: Number(PORT) }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })
}

export default app
