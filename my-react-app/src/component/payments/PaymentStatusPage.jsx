import React, { use } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react';
import api from '../../api'

const PaymentStatusPage = ({setNumberCartItems}) => {

    const [statusMessage, setStatusMessage] = useState("")
    const [statusSubMessage, setStatusSubMessage] = useState("Waiting for payment confirmation...")
    const location = useLocation();


    useEffect(function() {
        const queryParams = new URLSearchParams(location.search);
        const paymentId = queryParams.get("paymentId");
        const payerId = queryParams.get("PayerID");
        const ref = queryParams.get("ref");
        if (paymentId && payerId && ref) {
            api.post(`paypal_payment_callback/?paymentId=${paymentId}&PayerID=${payerId}&ref=${ref}`)
            .then(res => {
                setStatusMessage(res.data.message);
                setStatusSubMessage(res.data.subMessage);
                localStorage.removeItem("cart_code"); // Clear cart code after payment
                setNumberCartItems(0); // Reset cart items count
            })
            .catch(err => {
                setStatusMessage("Error");
                setStatusSubMessage("Failed to verify payment.");
            });
        }
    }, [location]);


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get("status");
        const txRef = queryParams.get("tx_ref");
        const transactionId = queryParams.get("transaction_id");

        if (status && txRef && transactionId) {
            api.post(`payment_callback/?status=${status}&tx_ref=${txRef}&transaction_id=${transactionId}`)
            .then(res => {
                setStatusMessage(res.data.message);
                setStatusSubMessage(res.data.subMessage);
                localStorage.removeItem("cart_code"); // Clear cart code after payment
                setNumberCartItems(0); // Reset cart items count
            })
            .catch(err => {
                setStatusMessage("Error");
                setStatusSubMessage("Failed to verify payment.");
            });
        }
    }, [location]);

  return (
     <header className='py-5' style={{ backgroundColor: '#1c456dff' }}>
        <div className='container px-4 px-lg-5 my-5'>
            <div className='text-center text-white'>
                <h2 className='display-4 fw-bold'>{statusMessage}</h2>
                <p className='lead fw-normal text-white-75 mb-4'>{statusSubMessage}</p>
                <span>
                    <Link to="/profile" className='btn btn-light btn-lg px-4 py-2 mx-3'>View Order Details</Link>
                    <Link to="/" className='btn btn-light btn-lg px-4 py-2'>Continue Shopping</Link>
                </span>
            </div>
        </div>

     </header>
  )
}

export default PaymentStatusPage
