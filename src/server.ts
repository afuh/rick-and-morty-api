import 'dotenv/config'
import { serve } from '@hono/node-server'
import { logger } from 'hono/logger'
import app from './app.js'
import { connectDB } from './db.js'

const PORT = process.env.PORT || 8080

app.use('*', logger())

await connectDB()

serve({ fetch: app.fetch, port: Number(PORT) })
