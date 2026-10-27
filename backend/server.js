import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoutes from './routes/products.js'
import userRoutes from './routes/users.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Sport-Wilches funcionando 🏀' })
})

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Manejador global de errores (incluye JSON mal formado)
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' })
  }

  console.error('Error no controlado:', error)
  res.status(500).json({ error: 'Error interno del servidor' })
})

async function iniciarServidor() {
  if (!process.env.MONGO_URI) {
    console.error('❌ Falta la variable de entorno MONGO_URI')
    process.exit(1)
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Conectado a MongoDB Atlas')

    const server = app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })

    const cerrar = async (motivo) => {
      console.log(`\n${motivo}, cerrando servidor...`)
      server.close(async () => {
        await mongoose.disconnect()
        console.log('👋 Servidor y conexión a MongoDB cerrados')
        process.exit(0)
      })
    }

    process.on('SIGINT', () => cerrar('SIGINT recibido'))
    process.on('SIGTERM', () => cerrar('SIGTERM recibido'))
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message)
    process.exit(1)
  }
}

iniciarServidor()
