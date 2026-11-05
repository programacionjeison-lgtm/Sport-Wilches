import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

dotenv.config()

const CORREOS_DE_PRUEBA = ['verificacion.pagos@test.com']

await mongoose.connect(process.env.MONGO_URI)
console.log('✅ Conectado a MongoDB')

for (const email of CORREOS_DE_PRUEBA) {
  const user = await User.findOne({ email })
  if (!user) {
    console.log(`• ${email}: no existe, nada que hacer`)
    continue
  }

  const orders = await Order.find({ user: user._id })
  console.log(`• ${email}: ${orders.length} pedido(s) a eliminar`)

  for (const order of orders) {
    // "Pagado" de prueba → devolvemos el stock que su pago descuenta
    if (order.estado === 'Pagado') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        })
      }
    }
  }

  const borrados = await Order.deleteMany({ user: user._id })
  await user.deleteOne()
  console.log(`  → ${borrados.deletedCount} pedido(s) borrado(s), stock devuelto, usuario eliminado`)
}

await mongoose.disconnect()
console.log('👋 Limpieza terminada')
