import { beforeAll, afterAll } from 'vitest'
import { connectDB } from '../utils/db.js'
import mongoose from 'mongoose'

// TEMPORARY: Using actual database; consider using in-memory MongoDB for faster tests
beforeAll(async () => {
  await connectDB()
})

afterAll(async () => {
  await mongoose.connection.close()
})
