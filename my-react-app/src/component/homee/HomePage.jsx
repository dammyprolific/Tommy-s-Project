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

    useEffect(function(){
        if(localStorage.getItem("cart_code") === null){
            localStorage.setItem("cart_code", randomValue)
        }
},[])

    useEffect(function () {
    setLoading(true)
    api.get("Products")
        .then(res => {
            console.log(res.data)
            setProducts(res.data)
            setLoading(false)
            setError('')
        })
        .catch(err => {
            console.log(err.message)
            setLoading(false)
            setError(err.message)
        })

    }, [])

    return (
        <>
            <Header />
            {error && <Error error={error}/>}
            {loading && <PlaceholderContainer /> }
            {loading || error!="" || <CardContainer product={products}/>}
           
        </>
    )
}

export default HomePage
