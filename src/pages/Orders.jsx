import { Link } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { formatCOP } from '../utils/format'

export default function Orders() {
  const { userOrders } = useOrders()

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
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {order.estado}
                  </span>
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
