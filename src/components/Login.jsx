import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext.jsx"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { login, authLoading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    try {
      await login(email, password)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
  }

  // Clear success message when switching to register
  useEffect(() => {
    setSuccess(false)
  }, [])

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      {success && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          Logged in successfully!
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              required
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
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  )
}

export default Login