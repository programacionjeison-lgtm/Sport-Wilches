import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)

const users = await User.find({}, 'email createdAt').sort({ createdAt: -1 })
console.log('Usuarios en la base de datos:', users.length)
for (const u of users) {
  console.log(`• ${u.email} — registrada ${u.createdAt.toISOString()}`)
}

await mongoose.disconnect()
