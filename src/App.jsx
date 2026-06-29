import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api, setAuthToken } from './utils/api'
import WelcomeScreen from './pages/WelcomeScreen'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminAddProduct from './pages/admin/AdminAddProduct'
import AdminEditProduct from './pages/admin/AdminEditProduct'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      setAuthToken(token)
      setUser(JSON.parse(userData))
    }

    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setAuthToken(token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthToken(null)
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <WelcomeScreen />} />

        <Route path="/login" element={
          user ? <Navigate to="/home" /> : <Login onLogin={login} />
        } />

        <Route path="/register" element={
          user ? <Navigate to="/home" /> : <Register onLogin={login} />
        } />

        <Route path="/home" element={
          user && !user.isAdmin ? <Home user={user} onLogout={logout} /> : <Navigate to="/" />
        } />

        <Route path="/product/:id" element={
          user && !user.isAdmin ? <ProductDetail user={user} onLogout={logout} /> : <Navigate to="/" />
        } />

        <Route path="/cart" element={
          user && !user.isAdmin ? <Cart user={user} onLogout={logout} /> : <Navigate to="/" />
        } />

        <Route path="/admin/login" element={
          user?.isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={login} />
        } />

        <Route path="/admin/dashboard" element={
          user?.isAdmin ? <AdminDashboard user={user} onLogout={logout} /> : <Navigate to="/admin/login" />
        } />

        <Route path="/admin/products" element={
          user?.isAdmin ? <AdminProducts user={user} onLogout={logout} /> : <Navigate to="/admin/login" />
        } />

        <Route path="/admin/products/add" element={
          user?.isAdmin ? <AdminAddProduct user={user} onLogout={logout} /> : <Navigate to="/admin/login" />
        } />

        <Route path="/admin/products/edit/:id" element={
          user?.isAdmin ? <AdminEditProduct user={user} onLogout={logout} /> : <Navigate to="/admin/login" />
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
