import { Hono } from 'hono'
import Character from '../models/Character.js'
import { message, filterConfig } from '../config.js'
import { createGetAllHandler } from './factories/createGetAllHandler.js'
import { createGetByIdHandler } from './factories/createGetByIdHandler.js'

const app = new Hono()

// GET /character - Get all characters with filters and pagination
app.get('/', ...createGetAllHandler(Character, 'character', filterConfig.filters.character))

// GET /character/:id - Get character by id (or multiple ids)
app.get('/:id', ...createGetByIdHandler(Character, message.noCharacter))

// Proxy route for character avatars
app.get('/avatar/:file', async (c) => {
  const file = c.req.param('file')

  if (!/^\d+\.jpeg$/.test(file)) {
    return c.json({ error: message.noPage }, 404)
  }

  const res = await fetch(`${process.env.AVATARS_ENDPOINT}/${file}`)

  if (!res.ok) {
    return c.json({ error: message.noPage }, 404)
  }

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year caching
    },
  })
})

export default app
