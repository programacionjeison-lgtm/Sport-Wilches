import nodemailer from 'nodemailer'

// Variables de entorno que tú agregarás al .env:
//   GMAIL_USER = el correo que envía (ej. sportwilches2026@gmail.com)
//   GMAIL_APP_PASSWORD = la contraseña de aplicación de 16 caracteres
let transportador = null

function getTransportador() {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return null // sin configuración, no hay cartero disponible
  }

  if (!transportador) {
    transportador = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        // Gmail muestra la contraseña con espacios; se los quitamos
        pass: String(GMAIL_APP_PASSWORD).replace(/\s+/g, ''),
      },
    })
  }

  return transportador
}

export async function sendWelcomeEmail(to, name) {
  const cartero = getTransportador()

  if (!cartero) {
    console.log('ℹ️ No hay SMTP configurado: no se envió el correo de bienvenida')
    return false
  }

  // "Brand" del correo: colores de la tienda (azul) y saludo personalizado
  const firstName = (name || '').trim().split(' ')[0] || 'deportista'

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #2563eb; color: #ffffff; padding: 24px; text-align: center;">
        <div style="font-size: 40px;">🏀</div>
        <h1 style="margin: 0; font-size: 22px;">Sport-Wilches</h1>
        <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Tu tienda de artículos deportivos</p>
      </div>

      <div style="padding: 24px; color: #1f2937;">
        <h2 style="margin: 0 0 8px; font-size: 18px;">¡Tu registro fue exitoso! 🎉</h2>
        <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.5;">
          Hola <strong>${firstName}</strong>, tu cuenta fue creada con el correo
          <strong>${to}</strong>. Ahora puedes:
        </p>
        <ul style="margin: 0 0 16px; padding-left: 20px; font-size: 14px; line-height: 1.7;">
          <li>Explorar el catálogo de productos ⚽</li>
          <li>Agregar artículos a tu carrito 🛒</li>
          <li>Realizar tus pedidos y ver el historial 📦</li>
        </ul>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">
          ¡Gracias por confiar en nosotros! Nos vemos en la cancha.
        </p>
      </div>

      <div style="padding: 16px 24px; background-color: #f9fafb; color: #6b7280; font-size: 12px; text-align: center;">
        Este es un correo automático de registro — no respondas a este mensaje.
      </div>
    </div>
  `

  const texto = `
¡Tu registro fue exitoso! 🎉
Hola ${firstName}, tu cuenta fue creada con el correo ${to}.
Explora el catálogo, arma tu carrito y realiza tus pedidos en Sport-Wilches.
Este es un correo automático; no respondas a este mensaje.
  `

  try {
    await cartero.sendMail({
      from: `"Sport-Wilches 🏀" <${process.env.SMTP_FROM || process.env.GMAIL_USER}>`,
      to,
      subject: '🏀 ¡Tu registro en Sport-Wilches fue exitoso!',
      text: texto,
      html: html,
    })
    console.log(`📧 Correo de bienvenida enviado a ${to}`)
    return true
  } catch (error) {
    // Importante: si el correo falla, el registro NO debe fallar.
    console.error('❌ Error al enviar el correo de bienvenida:', error.message)
    return false
  }
}
