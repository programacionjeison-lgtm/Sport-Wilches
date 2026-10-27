import express from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

const router = express.Router()

const CAMPOS_REQUERIDOS = ['title', 'price', 'category', 'thumbnail', 'description']

function validarProducto(body) {
  const errores = []

  for (const campo of CAMPOS_REQUERIDOS) {
    if (body[campo] === undefined || body[campo] === null || body[campo] === '') {
      errores.push(`El campo "${campo}" es obligatorio`)
    }
  }

  if (body.price !== undefined && (isNaN(Number(body.price)) || Number(body.price) < 0)) {
    errores.push('El campo "price" debe ser un número mayor o igual a 0')
  }

  if (body.stock !== undefined) {
    const stock = Number(body.stock)
    if (isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
      errores.push('El campo "stock" debe ser un entero mayor o igual a 0')
    }
  }

  return errores
}

// GET /api/products → obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    console.error('Error al obtener los productos:', error)
    res.status(500).json({ error: 'Error al obtener los productos' })
  }
})

// GET /api/products/:id → obtener un producto por su id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID de producto inválido' })
    }

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(product)
  } catch (error) {
    console.error('Error al obtener el producto:', error)
    res.status(500).json({ error: 'Error al obtener el producto' })
  }
})

// POST /api/products → crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const errores = validarProducto(req.body || {})
    if (errores.length > 0) {
      return res.status(400).json({ error: 'Datos del producto inválidos', detalles: errores })
    }

    const newProduct = new Product(req.body)
    const saved = await newProduct.save()
    res.status(201).json(saved)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const detalles = Object.values(error.errors).map((e) => e.message)
      return res.status(400).json({ error: 'Datos del producto inválidos', detalles })
    }

    console.error('Error al crear el producto:', error)
    res.status(500).json({ error: 'Error al crear el producto' })
  }
})

export default router
