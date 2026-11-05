import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { useAuth } from '../hooks/useAuth'
import { verifyPayment } from '../services/api'
import { formatCOP } from '../utils/format'

// Cada estado del pedido tiene su "color semántico":
const COLORES_ESTADO = {
  'Pendiente de pago': 'bg-amber-100 text-amber-700',
  'Pagado': 'bg-green-100 text-green-700',
  'En proceso': 'bg-blue-100 text-blue-700',
  'Enviado': 'bg-indigo-100 text-indigo-700',
  'Entregado': 'bg-emerald-100 text-emerald-700',
  'Cancelado': 'bg-red-100 text-red-700',
}

export default function Orders() {
  const { userOrders, error, reload } = useOrders()
  const { token } = useAuth()
  const [verificando, setVerificando] = useState(null) // número que se está verificando
  const [aviso, setAviso] = useState(null)

  // Pregunta al backend (que a su vez pregunta a Wompi) si el pedido ya
  // tiene una transacción aprobada; si sí, el pedido pasa a "Pagado".
  async function confirmarPago(numero) {
    setVerificando(numero)
    setAviso(null)
    try {
      const result = await verifyPayment(token, numero)
      setAviso(`Pedido #${numero}: ${result.message}`)
      reload() // la lista se re-descarga con el estado actualizado
    } catch (err) {
      setAviso(`Pedido #${numero}: ${err.message}`)
    } finally {
      setVerificando(null)
    }
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-2">No pudimos cargar tus pedidos</h1>
        <p className="text-red-600 mb-6">{error}</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (userOrders.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-2">No tienes pedidos todavía</h1>
        <p className="text-gray-500 mb-6">
          Cuando completes una compra, tus pedidos aparecerán aquí.
        </p>
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
      <h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>

      {aviso && (
        <p className="bg-blue-50 text-blue-800 text-sm rounded-lg px-3 py-2 mb-4">
          {aviso}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {userOrders.map((order) => {
          const date = new Date(order.fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <div key={order.numero} className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap justify-between gap-2 items-center border-b pb-3 mb-3">
                <div>
                  <p className="font-bold">
                    Pedido #{order.numero}
                  </p>
                  <p className="text-sm text-gray-500">{date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Estado</p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${COLORES_ESTADO[order.estado] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {order.estado}
                  </span>
                  {order.estado === 'Pendiente de pago' && (
                    <button
                      onClick={() => confirmarPago(order.numero)}
                      disabled={verificando === order.numero}
                      className="block mt-2 text-xs text-blue-600 hover:underline disabled:text-gray-400"
                    >
                      {verificando === order.numero
                        ? 'Confirmando con la pasarela...'
                        : '💳 Ya pagué — confirmar pago'}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-10 h-10 object-contain rounded"
                    />
                    <span className="flex-1">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatCOP(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Enviado a: {order.shipping.direccion}, {order.shipping.ciudad}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  Total: {formatCOP(order.total)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
