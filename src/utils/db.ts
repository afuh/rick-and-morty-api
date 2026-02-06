import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE || '')
    mongoose.connection.on('error', (err) => {
      console.error(`→ ${err.message}`)
    })
    console.log(`Database connected: ${mongoose.connection.host}/${mongoose.connection.name}`)
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

export default mongoose
