import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Product from '../models/Product.js'

const router = express.Router()

// Middleware pequeño: lee el token "Bearer xxx" del encabezado Authorization
// y devuelve el usuario que firmó el token (o null si no es válido).
async function getUserFromToken(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token || !process.env.JWT_SECRET) {
    return null
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    return await User.findById(payload.id)
  } catch {
    return null
  }
}

// POST /api/orders → guardar el pedido del usuario autenticado
router.post('/', async (req, res) => {
  try {
    const user = await getUserFromToken(req)
    if (!user) {
      return res.status(401).json({ error: 'Debes iniciar sesión para hacer un pedido' })
    }

    const { items, shipping } = req.body || {}

    // Validaciones básicas
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El pedido no tiene productos' })
    }

    if (
      !shipping ||
      ['nombre', 'direccion', 'ciudad', 'telefono'].some(
        (campo) => typeof shipping[campo] !== 'string' || shipping[campo].trim() === ''
      )
    ) {
      return res.status(400).json({ error: 'Faltan los datos de envío' })
    }

    // Seguridad: los precios NO vienen del frontend.
    // Buscamos cada producto en MongoDB y usamos su precio real,
    // de paso verificamos que haya stock suficiente.
    const lineas = []

    for (const item of items) {
      if (!mongoose.isValidObjectId(item.id)) {
        return res.status(400).json({ error: `El producto "${item.id}" no es válido` })
      }

      const product = await Product.findById(item.id)
      if (!product) {
        return res.status(400).json({ error: `El producto "${item.title}" ya no existe` })
      }

      const quantity = Number(item.quantity)
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
        return res.status(400).json({
          error: `Stock insuficiente para "${product.title}" (disponible: ${product.stock})`,
        })
      }

      lineas.push({
        product: product._id,
        title: product.title,
        price: product.price, // precio real de la base de datos
        quantity,
        thumbnail: product.thumbnail,
      })
    }

    // El total lo calcula el servidor, no el cliente
    const total = lineas.reduce((sum, i) => sum + i.price * i.quantity, 0)

    const order = new Order({
      numero: Math.floor(100000 + Math.random() * 900000),
      user: user._id,
      userEmail: user.email,
      items: lineas,
      shipping,
      total,
    })

    const saved = await order.save()

    // Descontamos el stock de cada producto comprado
    for (const linea of lineas) {
      await Product.findByIdAndUpdate(linea.product, {
        $inc: { stock: -linea.quantity },
      })
    }

    // Respuesta en el "formato del frontend" (id en vez de _id)
    res.status(201).json({
      id: saved._id,
      numero: saved.numero,
      items: saved.items.map((i) => ({ id: i.product, ...i.toObject() })),
      shipping: saved.shipping,
      total: saved.total,
      estado: saved.estado,
      fecha: saved.createdAt,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Pedido inválido' })
    }

    console.error('Error al crear el pedido:', error)
    res.status(500).json({ error: 'Error al guardar el pedido' })
  }
})

// GET /api/orders → los pedidos SOLO del usuario autenticado
router.get('/', async (req, res) => {
  try {
    const user = await getUserFromToken(req)
    if (!user) {
      return res.status(401).json({ error: 'Debes iniciar sesión para ver tus pedidos' })
    }

    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 })

    res.json(
      orders.map((order) => ({
        id: order._id,
        numero: order.numero,
        items: order.items.map((i) => ({ id: i.product, ...i.toObject() })),
        shipping: order.shipping,
        total: order.total,
        estado: order.estado,
        fecha: order.createdAt,
      }))
    )
  } catch (error) {
    console.error('Error al listar los pedidos:', error)
    res.status(500).json({ error: 'Error al obtener los pedidos' })
  }
})

export default router
