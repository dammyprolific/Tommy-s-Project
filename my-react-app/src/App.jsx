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

const App = () => {

  const [numberCartItems, setNumberCartItems] = useState(0)
  const cart_code = localStorage.getItem("cart_code")

  useEffect(function(){
    if(cart_code){
      api.get(`get_cart_stat?cart_code=${cart_code}`)
      .then(res => {
        console.log(res.data)
        setNumberCartItems(res.data.num_of_items)
      })
      .catch(err =>{
        console.log(err.message)
      })
    }
  },[cart_code])

  return (
    <AuthProvider>


    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout numCartItems ={numberCartItems} />}>
          <Route index element={<HomePage />} />
          <Route path="products/:slug" element={<ProductsPage  setNumCartItems={setNumberCartItems}/>} />
          <Route path="Cart" element={<CartPage setNumberCartItems={setNumberCartItems} />} />
          <Route path='checkout' element={ <ProtectedRoute>
            <CheckoutPage />
             </ProtectedRoute>} />
          <Route path='login' element={<LoginPage/>} />
          <Route path='profile' element={<UserProfilePage />} />
          <Route path='register' element={<RegisterPage />} />
          <Route path='*' element={<NotFoundPage />} />
          <Route path='payment-status' element={<PaymentStatusPage setNumberCartItems={setNumberCartItems} />} />

        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App

