import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import './App.css'

function App() {
  const { user, logout, loading, login } = useAuth()
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', quantity: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [showLogin, setShowLogin] = useState(true)

  // Handle Google OAuth callback token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      login(null, null, token) // Pass token as third argument
      // Clean URL
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const fetchProducts = () => {
    setProductsLoading(true)
    const token = localStorage.getItem("token")
    fetch("https://product-crud-backend-4xq6.onrender.com/api/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setProductsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setProductsLoading(false)
      })
  }

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({ name: '', description: '', quantity: '' })
    setImageFile(null)
    setImagePreview(null)
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({ name: product.name || '', description: product.description || '', quantity: product.quantity || '' })
    setImageFile(null)
    setImagePreview(product.image || null)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    const token = localStorage.getItem("token")

    // Create FormData for file upload
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('quantity', parseInt(formData.quantity) || 0)
    if (imageFile) {
      formDataToSend.append('image', imageFile)
    }

    try {
      const url = editingProduct
        ? `https://product-crud-backend-4xq6.onrender.com/api/products/${editingProduct._id}`
        : 'https://product-crud-backend-4xq6.onrender.com/api/products'

      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      })
      if (res.ok) {
        fetchProducts()
        setShowModal(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    setDeletingId(id)
    const token = localStorage.getItem("token")

    try {
      await fetch(`https://product-crud-backend-4xq6.onrender.com/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchProducts()
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="app">
      {!user ? (
        <div className="auth-wrapper">
          {showLogin ? <Login /> : <Register />}
          <p className="auth-switch">
            {showLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setShowLogin(!showLogin)} className="btn-link">
              {showLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      ) : (
        <>
          {/* Main Header */}
          <header className="main-header">
            <div className="logo">
              <div className="logo-icon">📦</div>
              <span>ProductHub</span>
            </div>
            <div className="header-right">
              <div className="user-info">
                <div className="user-avatar">
                  {getInitials(user.name)}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </div>
          </header>

          {/* App Content */}
          <div className="app-container">
            <header className="header">
              <div className="header-left">
                <h1 className="title">Products</h1>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  ({products.length} items)
                </span>
              </div>
              <button className="btn-primary" onClick={openCreateModal}>
                + Add Product
              </button>
            </header>

            <main className="main">
              {productsLoading ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="empty">
                  <p>No products found</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Click "Add Product" to create your first product
                  </p>
                </div>
              ) : (
                <div className="product-grid">
                  {products.map(product => (
                    <div key={product._id} className="product-card">
                      {product.image && (
                        <div className="product-image">
                          <img src={product.image} alt={product.name} />
                        </div>
                      )}
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <p className="product-quantity">
                          Quantity: <span>{product.quantity}</span>
                        </p>
                      </div>
                      <div className="product-actions">
                        <button className="btn-edit" onClick={() => openEditModal(product)} disabled={deletingId || submitLoading}>
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                        >
                          {deletingId === product._id ? (
                            <span className="btn-loading">
                              <span className="spinner"></span>
                              Deleting...
                            </span>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      required
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="form-group">
                    <label>Image</label>
                    <div className="image-input-wrapper">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input"
                      />
                      {(imagePreview || editingProduct?.image) && (
                        <div className="image-preview">
                          <img
                            src={imagePreview || editingProduct?.image}
                            alt="Preview"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={submitLoading}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit" disabled={submitLoading}>
                      {submitLoading ? (
                        <span className="btn-loading">
                          <span className="spinner"></span>
                          {editingProduct ? 'Updating...' : 'Creating...'}
                        </span>
                      ) : (
                        editingProduct ? 'Update' : 'Create'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App