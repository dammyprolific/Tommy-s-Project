import React, { useEffect, useState } from 'react'
import Header from './Header'
import CardContainer from './CardContainer'
import api from '../../api'
import PlaceholderContainer from '../uis/PlaceholderContainer'
import Error from '../uis/Error'
import { randomValue } from '../../GenerateCartCode'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Generate cart code if not already present
  useEffect(() => {
    if (!localStorage.getItem("cart_code")) {
      localStorage.setItem("cart_code", randomValue())
    }
  }, [])

  // Fetch products from backend
  useEffect(() => {
    setLoading(true)
    api.get("Products/")  // ✅ ensure the endpoint matches Django
      .then(res => {
        setProducts(res.data)
        setError('')
      })
      .catch(err => {
        console.error("Product fetch error:", err.message)
        setError("Failed to load products. Please try again.")
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Header />
      {error && <Error error={error} />}
      {loading && <PlaceholderContainer />}
      {!loading && !error && products.length > 0 && (
        <CardContainer product={products} />
      )}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-muted my-4">No products available.</p>
      )}
    </>
  )
}

export default HomePage
