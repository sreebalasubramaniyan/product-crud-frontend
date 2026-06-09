import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext.jsx"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { login, authLoading } = useAuth()

  const handleGoogleLogin = () => {
    window.location.href = "https://product-crud-backend-4xq6.onrender.com/api/auth/google";
  };

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

      <div className="divider">
        <span>or</span>
      </div>

      <button
        type="button"
        className="btn-google"
        onClick={handleGoogleLogin}
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className="google-icon"
        />
        Sign in with Google
      </button>
    </div>
  )
}

export default Login