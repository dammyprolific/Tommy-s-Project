import React from 'react'
import OrderSummary from './OrderSummary'
import PaymentSection from './PaymentSection'
import useCartData from '../../hooks/useCartData'

const CheckoutPage = () => {

    const { cartItems, setCartItems, cartTotal, setCartTotal, loading, tax } = useCartData()
    return (
        <div className='row'>
            <OrderSummary cartItems={cartItems} cartTotal={cartTotal} tax={tax} />
            <PaymentSection />
        </div>
    )
}

export default CheckoutPage
