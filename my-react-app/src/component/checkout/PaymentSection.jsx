import styles from "./PaymentSection.module.css"
import { useState } from 'react'
import api from '../../api'

const PaymentSection = () => {
    const cart_code = localStorage.getItem("cart_code")
    const [loading, setLoading] = useState(false)

    function makePayment() {
        if (!cart_code) {
            alert("No cart code found. Please add items to your cart first.");
            return;
        }

        const token = localStorage.getItem('access');
        console.log("[PaymentSection] Token in localStorage:", token);

        setLoading(true);
        api.post("/initiate_payment/", { cart_code })
            .then(res => {
                setLoading(false);
                console.log("Payment response:", res.data);

                const paymentLink = res.data.payment_link;  // <-- Correct field

                if (paymentLink) {
                    window.location.href = paymentLink;
                } else {
                    alert("Payment link not found. Please try again.");
                }
            })
            .catch(err => {
                setLoading(false);
                console.error("Payment initiation error:", err);
                if (err.response && err.response.status === 401) {
                    alert("Unauthorized: Please log in to continue.");
                } else if (err.response && err.response.data && err.response.data.detail) {
                    alert("Error: " + err.response.data.detail);
                } else {
                    alert("An error occurred while initiating payment. Please try again later.");
                }
            });
    }

    function payPalPayment() {
        if (!cart_code) {
            alert("No cart code found. Please add items to your cart first.");
            return;
        }

        setLoading(true);
        api.post("/initiate_paypal_payment/", { cart_code })
            .then(res => {
                console.log("PayPal payment response:", res.data);
                setLoading(false);
                if (res.data.approval_url) {
                    window.location.href = res.data.approval_url;
                } else {
                    alert("Unexpected response from server. Please try again.");
                }
            })
            .catch(err => {
                console.error("PayPal payment initiation error:", err);
                setLoading(false);
                alert("An error occurred while initiating PayPal payment. Please try again later.");
            });
    }

    return (
        <div className='col-md-4'>
            <div className={`card ${styles.card}`}>
                <div className='card-header' style={{ backgroundColor:"#6050DC", color:'white'}}>
                    <h5>Payment Option</h5>
                </div>
                <div className='card-body'>
                    <button
                        className={`btn btn-primary w-100 mb-3 ${styles.paypalButton}`}
                        disabled={loading}
                        onClick={payPalPayment}
                        id='paypal-button'
                    >
                        <i className='bi bi-paypal'></i> Pay with PayPal
                    </button>

                    <button
                        className={`btn btn-warning w-100 ${styles.flutterwaveButton}`}
                        disabled={loading}
                        onClick={makePayment}
                        id='flutterwave-button'
                    >
                        <i className='bi bi-credit-card'></i> Pay with Flutterwave
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSection;
