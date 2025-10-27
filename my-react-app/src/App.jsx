import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layoutss/MainLayout'
import HomePage from './component/homee/HomePage'
import NotFoundPage from './component/uis/NotFoundPage'
import ProductsPage from './component/product/ProductPage'
import CartPage from './component/cart/CartPage'
import api from './api'
import CheckoutPage from './component/checkout/CheckoutPage'
import LoginPage from './component/user/LoginPage'
import ProtectedRoute from './component/uis/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import UserProfilePage from './component/user/UserProfilePage'
import PaymentStatusPage from './component/payments/PaymentStatusPage'
import RegisterPage from './component/user/RegisterPage'
import VerifyOtp from './component/user/VerifyOtp'
import About from './component/uis/About'
import './App.css'

const App = () => {
  const [numberCartItems, setNumberCartItems] = useState(0)

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : false
  })

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  // ensure cart_code exists
  useEffect(() => {
    if (!localStorage.getItem('cart_code')) {
      const newCode = Math.random().toString(36).substring(2, 11).toUpperCase()
      localStorage.setItem('cart_code', newCode)
    }
  }, [])

  // fetch cart stat and keep in sync with localStorage changes
  useEffect(() => {
    const fetchCartStat = () => {
      const cart_code = localStorage.getItem('cart_code')
      if (!cart_code) {
        setNumberCartItems(0)
        return
      }

      api.get('/get_cart_stat/', { params: { cart_code } })
        .then(res => setNumberCartItems(res.data?.num_of_items || 0))
        .catch(() => setNumberCartItems(0))
    }

    // initial fetch
    fetchCartStat()

    // expose globally for other components to call
    window.refreshCart = fetchCartStat

    // cleanup
    return () => { delete window.refreshCart }
  }, [])

  return (
    <div>
      <button
        onClick={toggleDarkMode}
        style={{
          position: 'fixed',
          top: 80,
          right: 20,
          zIndex: 1000,
          padding: '10px 20px',
          borderRadius: '9px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<MainLayout numCartItems={numberCartItems} />}>
              <Route index element={<HomePage setNumberCartItems={setNumberCartItems} darkMode={darkMode} />} />
              <Route path='products/:slug' element={<ProductsPage setNumCartItems={setNumberCartItems} darkMode={darkMode} />} />
              <Route path='cart' element={<CartPage setNumberCartItems={setNumberCartItems} darkMode={darkMode} />} />
              <Route path='checkout' element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path='about' element={<About />} />
              <Route path='login' element={<LoginPage />} />
              <Route path='profile' element={<UserProfilePage />} />
              <Route path='register' element={<RegisterPage />} />
              <Route path='verify-otp' element={<VerifyOtp />} />
              <Route path='payment-status' element={<PaymentStatusPage setNumberCartItems={setNumberCartItems} />} />
              <Route path='*' element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App
