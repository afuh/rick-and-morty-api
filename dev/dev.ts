import 'dotenv/config'
import { serve } from '@hono/node-server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../src/app.js'
import { connectDB } from '../src/db.js'
import { seedDatabase } from '../seed/seed.js'

const PORT = process.env.PORT || 8080

const mongoServer = await MongoMemoryServer.create()
process.env.DATABASE = mongoServer.getUri()

await connectDB()
await seedDatabase()

serve({ fetch: app.fetch, port: Number(PORT) }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
