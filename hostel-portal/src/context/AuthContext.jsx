import React, { createContext, useContext, useEffect, useState } from 'react'
import { getSession, setSession, clearSession, findUserByEmail, registerStudent } from '../utils/storage'

const AuthContext = createContext(null)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function withoutPassword(user) {
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession())

  useEffect(() => {
    if (user) setSession(user)
  }, [user])

  const login = async (email, password, role) => {
    let loggedInUser

    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Login failed.')
      loggedInUser = data.user
    } else {
      const foundUser = findUserByEmail(email)
      if (!foundUser || foundUser.password !== password) throw new Error('Incorrect email or password.')
      if (foundUser.role !== role) throw new Error(`This account is not registered as ${role}.`)
      loggedInUser = withoutPassword(foundUser)
    }

    setUser(loggedInUser)
    setSession(loggedInUser)
    return loggedInUser
  }

  const register = async (data) => {
    let newUser

    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.message || 'Registration failed.')
      newUser = payload.user
    } else {
      newUser = withoutPassword(registerStudent(data))
    }

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
