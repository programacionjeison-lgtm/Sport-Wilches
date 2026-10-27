import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'

dotenv.config()

const products = [
  {
    title: "Balón de fútbol profesional",
    price: 150000,
    category: "Fútbol",
    thumbnail: "/images/balon-futbol.jpg",
    description: "Balón oficial talla 5, ideal para cancha de grama natural o sintética.",
    stock: 25,
  },
  {
    title: "Guantes de boxeo 12oz",
    price: 220000,
    category: "Boxeo",
    thumbnail: "/images/guantes-boxeo.jpg",
    description: "Guantes de espuma de alta densidad, ideales para entrenamiento y sparring.",
    stock: 15,
  },
  {
    title: "Raqueta de tenis grafito",
    price: 380000,
    category: "Tenis",
    thumbnail: "/images/raqueta-tenis.jpg",
    description: "Raqueta liviana de grafito, buen control y potencia para jugadores intermedios.",
    stock: 10,
  },
  {
    title: "Bicicleta de montaña rin 29",
    price: 2500000,
    category: "Ciclismo",
    thumbnail: "/images/bicicleta-mtb.jpg",
    description: "Bicicleta todoterreno con suspensión delantera y cambios Shimano.",
    stock: 5,
  },
  {
    title: "Balón de baloncesto",
    price: 130000,
    category: "Baloncesto",
    thumbnail: "/images/balon-basketball.jpg",
    description: "Balón oficial talla 7, superficie de cuero sintético con buen agarre.",
    stock: 20,
  },
  {
    title: "Set de pesas ajustables 20kg",
    price: 450000,
    category: "Gimnasio",
    thumbnail: "/images/pesas.jpg",
    description: "Mancuernas ajustables con discos intercambiables, ideales para casa.",
    stock: 8,
  },
  {
    title: "Tenis para running",
    price: 320000,
    category: "Running",
    thumbnail: "/images/tenis-running.jpg",
    description: "Zapatillas con amortiguación de espuma para correr largas distancias.",
    stock: 18,
  },
  {
    title: "Colchoneta de yoga antideslizante",
    price: 85000,
    category: "Yoga",
    thumbnail: "/images/colchoneta-yoga.jpg",
    description: "Colchoneta de 6mm de grosor, ideal para yoga, pilates y estiramientos.",
    stock: 30,
  },
]

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Conectado a MongoDB Atlas')

    await Product.deleteMany({})
    console.log('🗑️  Productos anteriores eliminados')

    await Product.insertMany(products)
    console.log(`✅ Se insertaron ${products.length} productos correctamente`)

    await mongoose.disconnect()
    console.log('👋 Desconectado de MongoDB')
  } catch (error) {
    console.error('❌ Error al cargar los productos:', error.message)
    process.exit(1)
  }
}

seedDatabase()