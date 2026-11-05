// Servicio de integración con Wompi (pasarela de pagos de Bancolombia).
// Documentación: https://docs.wompi.co
//
// Modo sandbox: las claves "test" permiten pagos de prueba sin mover dinero real.
//   WOMPI_PUBLIC_KEY  → va en el frontend (futuro widget). Aquí no la exigimos.
//   WOMPI_PRIVATE_KEY → solo backend, en variables de entorno. NUNCA en el código.
//   FRONTEND_URL      → adónde devolver al cliente cuando termine el pago.

const BASE_URL = process.env.WOMPI_API_URL || 'https://sandbox.wompi.co/v1'

async function callWompi(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    // Wompi envía errores con formato { error: { messages: [...] } }
    const mensaje = data?.error?.messages
      ? JSON.stringify(data.error.messages)
      : data?.error?.reason || `Error de Wompi (${response.status})`
    throw new Error(mensaje)
  }

  return data
}

function privateHeaders() {
  if (!process.env.WOMPI_PRIVATE_KEY) {
    throw new Error('Falta la variable de entorno WOMPI_PRIVATE_KEY')
  }
  return { Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}` }
}

// El enlace de pago que ve el cliente. La respuesta no siempre incluye
// "payment_url" (ocurre en sandbox) y el dominio del checkout es el mismo
// en ambos ambientes: https://checkout.wompi.co/l/<link_id>
function urlDePago(linkId) {
  return 'https://checkout.wompi.co/l/' + linkId
}

// Crea un "enlace de pago": la página donde el cliente paga su pedido.
// Los montos van en centavos (Wompi trabaja así para evitar decimales).
export async function createPaymentLink(order) {
  const body = {
    name: `Pedido #${order.numero} — Sport-Wilches`,
    description: `Compra de ${order.items.length} artículo(s) en Sport-Wilches 🏀`,
    currency: 'COP',
    amount_in_cents: Math.round(order.total * 100),
    reference: String(order.numero), // conecta la transacción con el pedido
    single_use: true,               // el enlace se apaga tras usarse
    collect_shipping: false,        // el envío ya lo capturó nuestra tienda
  }

  // Devolvemos al cliente a la tienda cuando termina el pago en la pasarela
  if (process.env.FRONTEND_URL) {
    body.redirect_url = `${process.env.FRONTEND_URL}/pago/resultado?order=${order.numero}`
  }

  const data = await callWompi('/payment_links', {
    method: 'POST',
    headers: privateHeaders(),
    body: JSON.stringify(body),
  })

  return {
    id: data.data.id,
    url: data.data.payment_url || urlDePago(data.data.id),
  }
}

// Pregunta a Wompi si ya existe una transacción APROBADA para este pedido.
//
// Nota importante aprendida con pruebas: cuando el pago pasa por un ENLACE,
// Wompi regenera la reference del enlace en cada apertura, así que NO es
// confiable filtrar por ella. La estrategia robusta es consultar las
// transacciones en la ventana [fecha del pedido → ahora] y filtrar por
// payment_link_id + estado APPROVED + monto exacto del pedido.
export async function findApprovedTransaction(order) {
  const totalEnCentavos = Math.round(order.total * 100)

  if (order.paymentLinkId) {
    const desde = encodeURIComponent(new Date(order.createdAt || Date.now()).toISOString())
    const hasta = encodeURIComponent(new Date().toISOString())
    const query = `from_date=${desde}&until_date=${hasta}&page=1&page_size=100`

    const data = await callWompi(`/transactions?${query}`, {
      headers: privateHeaders(),
    })

    const transaccion = (data.data || []).find(
      (t) =>
        t.payment_link_id === order.paymentLinkId &&
        t.status === 'APPROVED' &&
        t.amount_in_cents === totalEnCentavos
    )
    if (transaccion) return transaccion
  }

  // Respaldo: pago con referencia directa (p. ej. widget, sin enlace)
  const data = await callWompi(`/transactions?reference=${order.numero}`, {
    headers: privateHeaders(),
  })

  return (data.data || []).find(
    (t) => t.status === 'APPROVED' && t.amount_in_cents === totalEnCentavos
  )
}
