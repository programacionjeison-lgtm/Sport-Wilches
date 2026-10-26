import { useState } from 'react'
import { AuthContext } from '../hooks/useAuth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser')
    return saved ? JSON.parse(saved) : null
  })

  function getUsers() {
    const saved = localStorage.getItem('users')
    return saved ? JSON.parse(saved) : []
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users))
  }

  function register({ name, email, password }) {
    const users = getUsers()
    const exists = users.some((u) => u.email === email)
    if (exists) {
      throw new Error('Ya existe una cuenta con ese correo.')
    }
    const newUser = { name, email, password }
    saveUsers([...users, newUser])

    const publicUser = { name, email }
    setUser(publicUser)
    localStorage.setItem('currentUser', JSON.stringify(publicUser))
  }

  function login({ email, password }) {
    const users = getUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) {
      throw new Error('Correo o contraseña incorrectos.')
    }
    const publicUser = { name: found.name, email: found.email }
    setUser(publicUser)
    localStorage.setItem('currentUser', JSON.stringify(publicUser))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}