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
import './App.css'

const App = () => {
  const [numberCartItems, setNumberCartItems] = useState(0)
  const cart_code = localStorage.getItem("cart_code")
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (cart_code) {
      api.get(`get_cart_stat?cart_code=${cart_code}`)
        .then(res => {
          setNumberCartItems(res.data.num_of_items || 0)
        })
        .catch(() => {
          setNumberCartItems(0)
        })
    } else {
      setNumberCartItems(0)
    }
  }, [cart_code])

  return (
    <div>
      <button onClick={toggleDarkMode} style={{
        position: 'fixed', top: 20, right: 20, zIndex: 1000, padding: '10px 20px',
        borderRadius: '9px', border: 'none', cursor: 'pointer'
      }}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<MainLayout numCartItems={numberCartItems} />}>
              <Route index element={<HomePage setNumberCartItems={setNumberCartItems} darkMode={darkMode} />} />
              <Route path="products/:slug" element={<ProductsPage setNumCartItems={setNumberCartItems} darkMode={darkMode} />} />
              <Route path="cart" element={<CartPage setNumberCartItems={setNumberCartItems} darkMode={darkMode} />} />
              <Route path='checkout' element={<ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>} />
              <Route path='login' element={<LoginPage />} />
              <Route path='profile' element={<UserProfilePage />} />
              <Route path='register' element={<RegisterPage />} />
              <Route path='*' element={<NotFoundPage />} />
              <Route path='payment-status' element={<PaymentStatusPage setNumberCartItems={setNumberCartItems} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App