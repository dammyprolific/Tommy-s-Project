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
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' or 'desc'
  const [sortField, setSortField] = useState('id') // Default sort field
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('cart_code') === null) {
      localStorage.setItem('cart_code', randomValue)
    }
  }, [])

  // fetch page from backend using axios params (prevents manual url-building bugs)
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    api.get('Products/', { params: { search: search || undefined, page } })
      .then(res => {
        if (cancelled) return
        // Support DRF pagination response { results, count, next, previous }
        const data = res.data.results || res.data
        setProducts(data)
        const count = res.data.count
        const pageSize = Array.isArray(res.data.results) ? res.data.results.length || 10 : (data.length || 10)
        if (typeof count === 'number') {
          setTotalPages(Math.max(1, Math.ceil(count / pageSize)))
        } else {
          // fallback when backend returns unpaginated list
          setTotalPages(Math.max(1, Math.ceil(data.length / pageSize)))
        }
        setHasNext(Boolean(res.data.next))
        setHasPrevious(Boolean(res.data.previous))
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setLoading(false)
        setError(err.response?.data?.detail || err.message || 'Failed to load products')
      })

    return () => { cancelled = true }
  }, [search, page])

  // Sorting + filtering operate on the current page's products
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0
    const valA = a[sortField]
    const valB = b[sortField]
    if (valA == null && valB == null) return 0
    if (valA == null) return sortOrder === 'asc' ? -1 : 1
    if (valB == null) return sortOrder === 'asc' ? 1 : -1
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const filteredProducts = sortedProducts.filter(item =>
    (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
  )

  const handleSearchInput = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handlePrev = () => {
    // prefer backend previous indicator; fallback to page > 1
    if (hasPrevious) setPage(prev => Math.max(1, prev - 1))
    else if (page > 1) setPage(page - 1)
  }

  const handleNext = () => {
    // prefer backend next indicator; fallback to page < totalPages
    if (hasNext) setPage(prev => prev + 1)
    else if (page < totalPages) setPage(page + 1)
  }

  return (
    <>
      <Header />
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px 0' }}>
        <div className="container" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search products and brands..."
              value={search}
              onChange={handleSearchInput}
              style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
            />
          </div>

          <div className="mb-3 d-flex justify-content-between align-items-center" 
          style={{ flexWrap: 'wrap', gap: '10px' }}>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="form-select" 
            style={{ width: '200px',background:'purple',color:'white'}}> 
              <option value="asc">Oldest - Newest</option>
              <option value="desc">Newest - Oldest</option>
            </select>

            <div>
              <button className="btn btn-outline-primary" 
              onClick={handlePrev} 
              disabled={!hasPrevious && page === 1} 
              style={{background:'purple'}}>Prev</button>
              <span className="mx-2">Page {page} of {totalPages}</span>
              <button className="btn btn-outline-primary" 
              onClick={handleNext}
               disabled={!hasNext && page === totalPages} 
               style={{background:'red'}}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {error && <Error error={error} />}
      {loading && <PlaceholderContainer />}
      {(!loading && !error) && <CardContainer product={filteredProducts} />}
    </>
  )
}

export default HomePage