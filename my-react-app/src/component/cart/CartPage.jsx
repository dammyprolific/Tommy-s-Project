import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import api from '../../api';
import Spinner from '../uis/Spinner';
import useCartData from '../../hooks/useCartData';

const CartPage = ({setNumberCartItems}) => {
  
   const {cartItems, setCartItems, cartTotal, setCartTotal, loading, tax} = useCartData()

     if (loading){
    return<Spinner loading={loading}/>
  }

  if (cartItems.length === 0) {
    return (
      <div className="alert alert-primary my-5" role="alert">
        You haven't added any item to your cart
      </div>
    );
  }

  return (
    <div className="container my-3 py-3" style={{ height: '80vh', overflow: 'auto' }}>
      <h5 className="mb-4">Shopping Cart</h5>

      <div className="row">
        <div className="col-md-8">
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              cartItems={cartItems}
              setNumberCartItems={setNumberCartItems}
              setCartItems={setCartItems}
            />
          ))}
        </div>

        <CartSummary cartTotal={cartTotal} tax={tax} />
      </div>
    </div>
  );
};

export default CartPage;
