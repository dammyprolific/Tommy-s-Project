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

    useEffect(() => {
        if (localStorage.getItem("cart_code") === null) {
            localStorage.setItem("cart_code", randomValue)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        api.get(`Products/?search=${search}&page=${page}`)
            .then(res => {
                // If your backend returns {results: [...], count: ..., next: ..., previous: ...}
                const data = res.data.results || res.data
                setProducts(data)
                setTotalPages(Math.ceil((res.data.count || data.length) / 10)) // Adjust page size if needed
                setLoading(false)
                setError('')
            })
            .catch(err => {
                setLoading(false)
                setError(err.message)
            })
    }, [search, page])

    // Sorting logic
    const sortedProducts = [...products].sort((a, b) => {
        if (!sortField) return 0;
        const valA = a[sortField]
        const valB = b[sortField]
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1
        return 0
    })

    // Filtering logic
    const filteredProducts = sortedProducts.filter(
        item =>
            (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
            (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
    )

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const handlePrev = () => {
        if (page > 1) setPage(page - 1)
    }

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1)
    }

    return (
        <>
            <Header />
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px 0' }}>
                <div
                    className="container"
                    style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        textAlign: 'center'
                    }}
                >
                    {/* Search Row */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}
                    >
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search products and brands..."
                            value={search}
                            onChange={handleSearch}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '16px'
                            }}
                        />
                        <button
                            onClick={handleSearch}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: '#6050DC',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Search
                        </button>
                    </div>

                    {/* Sorting and Pagination Row */}
                    <div
                        className="mb-3 d-flex justify-content-between align-items-center"
                        style={{ flexWrap: 'wrap', gap: '10px' }}
                    >
                        {/* Sort Order Dropdown */}
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="form-select"
                            style={{ width: '200px' }}
                        >
                            <option value="asc">Oldest - Newest</option>
                            <option value="desc">Newest - Oldest</option>
                        </select>

                        {/* Pagination Controls */}
                        <div>
                            <button
                                className="btn btn-outline-primary"
                                onClick={handlePrev}
                                disabled={page === 1}
                            >
                                Prev
                            </button>
                            <span className="mx-2">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="btn btn-outline-primary"
                                onClick={handleNext}
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
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