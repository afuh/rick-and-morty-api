import { beforeAll, afterAll } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connectDB } from '../utils/db.js'
import mongoose from 'mongoose'
import { seedDatabase } from './seed.js'

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
