import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)

const bicicleta = await Product.findById('6ad62f32e071d391a1fa5cdd')
if (!bicicleta) {
  console.log('❌ Producto no encontrado')
  process.exit(1)
}

console.log(`ANTES: ${bicicleta.title} — stock: ${bicicleta.stock}`)

bicicleta.stock = 10
await bicicleta.save()

console.log(`DESPUÉS: ${bicicleta.title} — stock: ${bicicleta.stock}`)

await mongoose.disconnect()
console.log('✅ Stock actualizado')
