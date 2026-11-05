import express from 'express'
import jwt from 'jsonwebtoken'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Product from '../models/Product.js'
import { createPaymentLink, findApprovedTransaction } from '../services/wompi.js'

const router = express.Router()

// Igual que en orders.js: valida el token y entrega al usuario dueño de la sesión
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

// POST /api/payments/link → pedir a Wompi el enlace de pago de MI pedido
router.post('/link', async (req, res) => {
  try {
    const user = await getUserFromToken(req)
    if (!user) {
      return res.status(401).json({ error: 'Debes iniciar sesión para pagar' })
    }

    const { numero } = req.body || {}
    if (numero === undefined || numero === null) {
      return res.status(400).json({ error: 'Falta el número del pedido' })
    }

    // Solo el dueño puede pagar su pedido, nunca un pedido ajeno
    const order = await Order.findOne({ numero, userEmail: user.email })
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    if (order.estado === 'Pagado') {
      return res.status(400).json({ error: 'Este pedido ya está pagado' })
    }

    const link = await createPaymentLink(order)

    // Guardamos el ID del enlace: la verificación del pago necesitará
    // comunicarse con él para conocer la reference que Wompi genera
    order.paymentLinkId = link.id
    await order.save()

    res.json({ paymentUrl: link.url })
  } catch (error) {
    console.error('Error al crear el enlace de pago:', error.message)
    res.status(500).json({ error: 'No se pudo conectar con la pasarela de pagos' })
  }
})

// GET /api/payments/verify/:numero → confirmar con Wompi si ese pedido ya pagó
router.get('/verify/:numero', async (req, res) => {
  try {
    const user = await getUserFromToken(req)
    if (!user) {
      return res.status(401).json({ error: 'Debes iniciar sesión para verificar un pago' })
    }

    const order = await Order.findOne({
      numero: Number(req.params.numero),
      userEmail: user.email,
    })
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    if (order.estado === 'Pagado') {
      return res.json({ estado: 'Pagado', message: 'Este pedido ya estaba pagado' })
    }

    // Preguntamos a Wompi (fuente de verdad de la pasarela, no el frontend)
    const transaction = await findApprovedTransaction(order)

    if (!transaction) {
      return res.json({
        estado: 'Pendiente de pago',
        message: 'Aún no registramos la transacción aprobada de este pedido',
      })
    }

    // ¡Pago confirmado por Wompi! Actualizamos el pedido...
    order.estado = 'Pagado'
    order.transactionId = transaction.id
    await order.save()

    // ...y AHORA SÍ descontamos el stock (los pagos pendientes no descuentan)
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      })
    }

    res.json({ estado: 'Pagado', message: 'Pago confirmado con la pasarela de pagos' })
  } catch (error) {
    console.error('Error al verificar el pago:', error.message)
    res.status(500).json({ error: 'No se pudo verificar el pago' })
  }
})

export default router
