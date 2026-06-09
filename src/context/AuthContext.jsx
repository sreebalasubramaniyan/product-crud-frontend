import { createContext, useState, useEffect, useContext } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  // Check if user is logged in on app load
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch("https://product-crud-backend-4xq6.onrender.com/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      } else {
        localStorage.removeItem("token")
      }
    } catch (error) {
      console.error(error)
      localStorage.removeItem("token")
    }
    setLoading(false)
  }

  const login = async (email, password, token) => {
    setAuthLoading(true)

    // If token is passed directly (from Google OAuth), use it
    if (token) {
      localStorage.setItem("token", token)
      try {
        const res = await fetch("https://product-crud-backend-4xq6.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
          setAuthLoading(false)
          return userData
        }
      } catch (error) {
        console.error(error)
      }
      setAuthLoading(false)
      return
    }

    // Otherwise, do regular email/password login
    const res = await fetch("https://product-crud-backend-4xq6.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setAuthLoading(false)
      throw new Error(data.message)
    }

    localStorage.setItem("token", data.token)
    setUser(data)
    setAuthLoading(false)
    return data
  }

  const register = async (name, email, password) => {
    setAuthLoading(true)
    const res = await fetch("https://product-crud-backend-4xq6.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setAuthLoading(false)
      throw new Error(data.message)
    }

    localStorage.setItem("token", data.token)
    setUser(data)
    setAuthLoading(false)
    return data
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, authLoading }}>
      {children}
    </AuthContext.Provider>
  )
}