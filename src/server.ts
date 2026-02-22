import 'dotenv/config'
import { serve } from '@hono/node-server'
import app from './app.js'
import { connectDB } from './db.js'

const PORT = process.env.PORT || 8080

await connectDB()

serve({ fetch: app.fetch, port: Number(PORT) })
