import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../services/api'
import { useCart } from '../hooks/useCart'
import { formatCOP } from '../utils/format'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart, getStock, getRemainingStock } = useCart()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
  }, [id])

  // El "loading" ya no se guarda: se calcula a partir de lo que ya sabemos
  const loading = !product && !error

  if (loading) return <p className="p-4">Cargando producto...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>
  if (!product) return null

  const priceFormatted = formatCOP(product.price)
  const remainingStock = getRemainingStock(product.id)
  const maxedOut = remainingStock === 0

  return (
    <div>
      <Link to="/" className="text-blue-600 hover:underline">
        ← Volver a productos
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mt-4 bg-white rounded-lg shadow p-6">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-80 object-cover rounded-lg"
        />

        <div className="flex flex-col">
          <span className="text-sm text-gray-500 uppercase">{product.category}</span>
          <h1 className="text-2xl font-bold mt-1">{product.title}</h1>
          <p className="text-gray-600 mt-3">{product.description}</p>

          <p className="text-3xl font-bold text-blue-600 mt-6">{priceFormatted}</p>
          <p className="text-sm text-gray-500 mt-1">
            {maxedOut
              ? 'Ya tienes todo el stock disponible en tu carrito 🛒'
              : `Stock disponible: ${remainingStock} de ${getStock(product.id)}`}
          </p>

         <button
  onClick={() => addToCart(product)}
  disabled={maxedOut}
  className="mt-6 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
>
  {maxedOut ? 'Sin más unidades disponibles' : 'Agregar al carrito'}
</button>
        </div>
      </div>
    </div>
  )
}