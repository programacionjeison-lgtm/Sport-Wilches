import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 6

function normalizarEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

// POST /api/users/register → crear una cuenta nueva
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {}

    const errores = []

    if (typeof name !== 'string' || name.trim() === '') {
      errores.push('El nombre es obligatorio')
    }

    const emailNormalizado = normalizarEmail(email)
    if (!EMAIL_REGEX.test(emailNormalizado)) {
      errores.push('El correo electrónico no es válido')
    }

    if (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
      errores.push(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`)
    }

    if (errores.length > 0) {
      return res.status(400).json({ error: 'Datos de registro inválidos', detalles: errores })
    }

    if (!process.env.JWT_SECRET) {
      console.error('Falta la variable de entorno JWT_SECRET')
      return res.status(500).json({ error: 'Configuración del servidor incompleta' })
    }

    const existing = await User.findOne({ email: emailNormalizado })
    if (existing) {
      return res.status(400).json({ error: 'Ya existe una cuenta con ese correo.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name: name.trim(),
      email: emailNormalizado,
      password: hashedPassword,
    })
    await newUser.save()

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ya existe una cuenta con ese correo.' })
    }

    console.error('Error al registrar el usuario:', error)
    res.status(500).json({ error: 'Error al registrar el usuario' })
  }
})

// POST /api/users/login → iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}

    const emailNormalizado = normalizarEmail(email)
    if (!EMAIL_REGEX.test(emailNormalizado) || typeof password !== 'string' || password === '') {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' })
    }

    if (!process.env.JWT_SECRET) {
      console.error('Falta la variable de entorno JWT_SECRET')
      return res.status(500).json({ error: 'Configuración del servidor incompleta' })
    }

    const user = await User.findOne({ email: emailNormalizado }).select('+password')
    if (!user) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

export default router
