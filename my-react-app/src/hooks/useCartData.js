// src/hooks/useCartData.js
import { useState, useEffect, useCallback } from "react";
import api from "../api";

/**
 * useCartData manages cart state globally
 * @param {function} setNumberCartItems - optional setter for updating the cart icon
 */
function useCartData(setNumberCartItems) {
  const cartCode = localStorage.getItem("cart_code");
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const tax = 1500;

  /** 🔁 Fetch cart data from backend */
  const fetchCart = useCallback(async () => {
    if (!cartCode) return;

    try {
      setLoading(true);
      const res = await api.get(`get_cart/?cart_code=${cartCode}`);
      const data = res.data?.data || res.data;
      const items = Array.isArray(data?.items) ? data.items : [];
      setCartItems(items);
      const total = parseFloat(data?.sum_total || 0);
      setCartTotal(total);

      // ✅ update cart icon count
      if (setNumberCartItems) {
        setNumberCartItems(data?.num_of_items || 0);
      }
    } catch (err) {
      console.error("Error fetching cart:", err.message);
    } finally {
      setLoading(false);
    }
  }, [cartCode, setNumberCartItems]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /** 🧮 Recalculate total whenever items change (fallback client-side calc) */
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = parseFloat(item?.product?.price || 0);
      return acc + price * (item?.quantity || 1);
    }, 0);
    setCartTotal(total);

    if (setNumberCartItems) {
      const count = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
      setNumberCartItems(count);
    }
  }, [cartItems, setNumberCartItems]);

  /** ✅ Expose function for external refresh (after add/update/delete) */
  const refreshCart = () => fetchCart();

  return {
    cartItems,
    setCartItems,
    cartTotal,
    setCartTotal,
    loading,
    tax,
    refreshCart,
  };
}

export default useCartData;
