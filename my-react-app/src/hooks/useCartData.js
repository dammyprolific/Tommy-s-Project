import { useState, useEffect } from "react";
import api from "../api";


function useCartData(){
  const cartCode = localStorage.getItem('cart_code');
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0.0);
  const tax = 1500.00;
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  if (!cartCode) return; // early exit if no cartCode
  setLoading(true);

  api.get(`get_cart/?cart_code=${cartCode}`)
    .then(res => {
      const { items } = res.data || {};
      setCartItems(Array.isArray(items) ? items : []);
    })
    .catch(err => {
      console.error('Error fetching cart:', err.message);
    })
    .finally(() => {
      setLoading(false);
    });
}, [cartCode]);



//   Recalculate cart total when cartItems change
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.product?.price || 0);
      return acc + (price * (item.quantity || 1));
    }, 0);

    setCartTotal(total);
  }, [cartItems]);

 return { cartItems, setCartItems, cartTotal, setCartTotal, loading, tax };
}

export default useCartData

