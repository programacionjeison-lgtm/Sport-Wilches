import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { verifyPayment } from '../services/api'

// Esta es la pantalla a la que Wompi devuelve al cliente después de pagar.
// El enlace llega así: /pago/resultado?order=<numero del pedido>
export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const numero = searchParams.get('order')
  const { reload } = useOrders()
  const { refreshCatalog } = useCart()
  const { token } = useAuth()

  const [loading, setLoading] = useState(Boolean(numero))
  const [estado, setEstado] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  // Esto se "calcula" del render, no del efecto: si no viene ?order=...
  // directamente mostramos el aviso, sin guardar estados extra
  const faltaNumero = !numero

  useEffect(() => {
    if (faltaNumero) return

    let activo = true

    // Preguntamos al backend, y él le pregunta a Wompi (nada se confía
    // de lo que la pasarela muestre en pantalla: se confirma por API).
    verifyPayment(token, numero)
      .then((result) => {
        if (!activo) return
        setEstado(result.estado)
        setMensaje(result.message)
        reload()          // "Mis pedidos" ya trae el estado actualizado
        refreshCatalog()  // el stock cambió: refrescamos el catálogo
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
      .finally(() => {
        if (activo) setLoading(false)
      })

    return () => {
      activo = false
    }
    // reload y refreshCatalog se declaran en el render sin useMemo:
    // incluirlas haría el efecto re-ejecutarse en bucle; por eso se
    // excluyen explícitamente y solo dependemos del numero y token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faltaNumero, numero, token])

  if (faltaNumero || error) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🤔</div>
        <h1 className="text-2xl font-bold mb-2">No pudimos verificar el pago</h1>
        <p className="text-gray-600 mb-6">{error || 'Falta el número del pedido en la URL'}</p>
        <div className="flex flex-col items-center gap-2">
          <Link to="/pedidos" className="text-blue-600 hover:underline text-sm">
            Ir a mis pedidos
          </Link>
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">Verificando el pago con la pasarela...</p>
      </div>
    )
  }

  const pagado = estado === 'Pagado'

  return (
    <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow p-8">
      <div className="text-5xl mb-4">{pagado ? '✅' : '⏳'}</div>
      <h1 className="text-2xl font-bold mb-2">
        {pagado ? '¡Pago confirmado!' : 'El pago aún está pendiente'}
      </h1>
      <p className="text-gray-600 mb-1">
        Pedido: <span className="font-semibold">#{numero}</span>
      </p>
      <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-6">
        {mensaje}
      </p>
      <div className="flex flex-col gap-2">
        <Link
          to="/pedidos"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Ver mis pedidos
        </Link>
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          Volver al catálogo
        </Link>
      </div>
    </div>
  )
}
