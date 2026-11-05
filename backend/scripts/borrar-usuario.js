import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Order from '../models/Order.js'

dotenv.config()

const email = process.argv[2]

if (!email) {
  console.error('Uso: node scripts/borrar-usuario.js <correo@x.com>')
  process.exit(1)
}

await mongoose.connect(process.env.MONGO_URI)

const user = await User.findOne({ email })
if (!user) {
  console.log('• No existe — nada que hacer')
  process.exit(0)
}

// Seguridad: solo se borra si no tiene pedidos (evita dejar "pedidos huérfanos")
const pedidos = await Order.countDocuments({ user: user._id })
if (pedidos > 0) {
  console.error(`❌ La cuenta tiene ${pedidos} pedido(s). No se borra automáticamente.`)
  process.exit(1)
}

await user.deleteOne()
console.log(`✅ Usuario ${email} eliminado — puede registrarse de nuevo`)

await mongoose.disconnect()
