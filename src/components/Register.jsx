import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext.jsx"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { register, authLoading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    try {
      await register(name, email, password)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
  }

  // Clear success message when switching to login
  useEffect(() => {
    setSuccess(false)
  }, [])

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      {success && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          Account created successfully!
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            disabled={authLoading}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={authLoading}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
              disabled={authLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>
        <button type="submit" className="btn-submit" disabled={authLoading}>
          {authLoading ? (
            <span className="btn-loading">
              <span className="spinner"></span>
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  )
}

export default Register