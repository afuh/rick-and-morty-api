import mongoose from 'mongoose'
import { beforeAll, afterAll } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connectDB } from '../db.js'
import { seedDatabase } from '../../seed/seed.js'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  process.env.NODE_ENV = 'test'
  mongoServer = await MongoMemoryServer.create()
  process.env.DATABASE = mongoServer.getUri()

  await connectDB()
  await seedDatabase()
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()

  await mongoServer.stop()
})
