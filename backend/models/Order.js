import mongoose from 'mongoose'

// Sub-esquema: cada línea de producto dentro de un pedido
// (guardamos una "foto" del producto comprado, no una referencia viva)
const itemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    thumbnail: { type: String, required: true, trim: true },
  },
  { _id: false }
)

// Sub-esquema: dirección de envío
const shippingSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    ciudad: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    // Número "comercial" (6 dígitos) que se le muestra al cliente
    numero: { type: Number, required: true },

    // Dueño del pedido — se llena con el usuario del token JWT,
    // nunca con lo que el frontend diga
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },

    items: { type: [itemSchema], validate: (v) => v.length > 0 },
    shipping: { type: shippingSchema, required: true },
    total: { type: Number, required: true, min: 0 },
    estado: {
      type: String,
      enum: ['En proceso', 'Enviado', 'Entregado', 'Cancelado'],
      default: 'En proceso',
    },
  },
  { timestamps: true } // crea createdAt (fecha del pedido) automáticamente
)

const Order = mongoose.model('Order', orderSchema)

export default Order
