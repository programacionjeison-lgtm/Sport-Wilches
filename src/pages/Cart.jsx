import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-6">Agrega productos desde el catálogo.</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tu carrito</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-blue-600 font-bold">{formatCOP(item.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 border rounded hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 border rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <p className="w-28 text-right font-semibold">
              {formatCOP(item.price * item.quantity)}
            </p>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:underline text-sm ml-2"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 bg-white rounded-lg shadow p-4">
        <button onClick={clearCart} className="text-red-600 hover:underline text-sm">
          Vaciar carrito
        </button>

        <div className="text-right">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-blue-600">{formatCOP(totalPrice)}</p>
        </div>
      </div>

      <div className="text-right mt-4">
        <Link
          to="/checkout"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Ir a pagar
        </Link>
      </div>
    </div>
  )
}