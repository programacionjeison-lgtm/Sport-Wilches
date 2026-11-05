import dotenv from 'dotenv'
import { sendWelcomeEmail } from '../services/mailer.js'

dotenv.config()

// Prueba puntual del servicio del correo: misma plantilla que
// recibe un usuario recién registrado, sin crear cuentas nuevas.
const correo = process.argv[2]

if (!correo) {
  console.error('Uso: node scripts/test-email.js <correo@destino.com>')
  process.exit(1)
}

const enviado = await sendWelcomeEmail(correo, 'Jeison Rodriguez')

if (enviado) {
  console.log('✅ Prueba enviada — revisa tu bandeja de entrada')
} else {
  console.log('❌ El envío falló — revisa los logs de arriba')
}
