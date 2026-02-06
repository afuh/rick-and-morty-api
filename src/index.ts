import 'dotenv/config'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { graphqlServer } from '@hono/graphql-server'
import { connectDB } from './utils/db.js'
import mongoose from './utils/db.js'
import { baseUrl, message } from './utils/helpers.js'
import characterRoutes from './routes/character.js'
import locationRoutes from './routes/location.js'
import episodeRoutes from './routes/episode.js'
import { schema } from './graphql/index.js'

const app = new Hono()
const rest = new Hono()

const PORT = process.env.PORT || 8080

// Health check
rest.get('/health', (c) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'

  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
    },
  })
})

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

app.use(
  '/graphql',
  graphqlServer({
    schema,
    graphiql: true,
  })
)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'There is nothing here.' }, 404)
})

// Connect to database and start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  await connectDB()

  serve({ fetch: app.fetch, port: Number(PORT) }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })
}

export default app
