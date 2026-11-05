import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useOrders } from '../hooks/useOrders'
import { useAuth } from '../hooks/useAuth'
import { createPaymentLink } from '../services/api'
import { formatCOP } from '../utils/format'

export default function Checkout() {
  const { items, totalPrice, clearCart, refreshCatalog } = useCart()
  const { addOrder } = useOrders()
  const { token } = useAuth()

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: '',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState(null)
  const [paymentUrl, setPaymentUrl] = useState(null)
  const [payError, setPayError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // El pedido se envía al backend: allí se verifica el stock de MongoDB
  // y se guarda con estado "Pendiente de pago". Después de crearlo,
  // pedimos a Wompi el enlace de pago para completar la transacción.
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    setPayError(null)
    setPaymentUrl(null)
    try {
      const order = await addOrder({ items, shipping: form })
      setOrderNumber(order.numero)
      setOrderPlaced(true)
      clearCart()

      // El stock NO se descontó aún: se descuenta cuando Wompi confirma.
      refreshCatalog()

      try {
        const pay = await createPaymentLink(token, order.numero)
        setPaymentUrl(pay.paymentUrl)
      } catch (payErr) {
        // El pedido ya existe: el cliente puede reintentar el pago desde "Mis pedidos"
        setPayError(payErr.message)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Si el carrito está vacío y no se acaba de confirmar un pedido, no debería estar aquí
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-2">No hay productos para pagar</h1>
        <p className="text-gray-500 mb-6">Agrega productos a tu carrito primero.</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  // Pantalla de confirmación: el pedido quedó "Pendiente de pago"
  if (orderPlaced) {
    return (
      <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow p-8">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-2">¡Pedido creado!</h1>
        <p className="text-gray-600 mb-1">
          Número de pedido: <span className="font-semibold">#{orderNumber}</span>
        </p>
        <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-6">
          Estado: <strong>Pendiente de pago</strong> — el stock se confirma cuando completes el pago
        </p>

        {payError && (
          <p className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            No pudimos abrir la pasarela: {payError}
          </p>
        )}

        {paymentUrl ? (
          <a
            href={paymentUrl}
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            💳 Ir a pagar en la pasarela
          </a>
        ) : (
          <p className="text-sm text-gray-500 mb-4">
            Puedes reintentar el pago desde "Mis pedidos".
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <Link to="/pedidos" className="text-blue-600 hover:underline text-sm">
            Ver mis pedidos
          </Link>
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  // Formulario de checkout
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Datos de envío</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              required
              value={form.direccion}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              required
              value={form.ciudad}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              required
              value={form.telefono}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {error && (
            <p className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? 'Confirmando pedido...' : 'Confirmar pedido'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6 h-fit">
        <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
        <div className="flex flex-col gap-3 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.title} x{item.quantity}</span>
              <span className="font-semibold">{formatCOP(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex justify-between items-center">
          <span className="text-gray-500">Total</span>
          <span className="text-2xl font-bold text-blue-600">{formatCOP(totalPrice)}</span>
        </div>
      </div>
    </div>
  )
}