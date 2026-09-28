import React, { createContext, useContext, useEffect, useState } from 'react'
import { getSession, setSession, clearSession } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession())

  useEffect(() => {
    if (user) setSession(user)
  }, [user])

  const login = async (email, password, role) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || 'Login failed.')

    const loggedInUser = data.user
    setUser(loggedInUser)
    setSession(loggedInUser)
    return loggedInUser
  }

  const register = async (data) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.message || 'Registration failed.')

    const newUser = payload.user
    setUser(newUser)
    setSession(newUser)
    return newUser
  }

  const logout = () => {
    setUser(null)
    clearSession()
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
