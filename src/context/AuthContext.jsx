import { useState } from 'react'
import { AuthContext } from '../hooks/useAuth'
import { registerUser, loginUser } from '../services/api'

// La sesión se recuerda en el navegador: { token, user }
// El token es el "boleto" que presentamos al backend en cada petición,
// y la contraseña nunca se guarda aquí (solo en la base de datos, ya encriptada).
function loadSession() {
  const saved = localStorage.getItem('auth')
  return saved ? JSON.parse(saved) : null
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession)

  function saveSession(newSession) {
    setSession(newSession)
    if (newSession) {
      localStorage.setItem('auth', JSON.stringify(newSession))
    } else {
      localStorage.removeItem('auth')
    }
  }

  // Ambas funciones ahora son asíncronas: aquí el backend valida
  // y responde con { token, user } que guardamos como sesión.
  async function register(formData) {
    const { token, user } = await registerUser(formData)
    saveSession({ token, user })
  }

  async function login(formData) {
    const { token, user } = await loginUser(formData)
    saveSession({ token, user })
  }

  function logout() {
    saveSession(null)
  }

  const user = session?.user || null
  const token = session?.token || null

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
