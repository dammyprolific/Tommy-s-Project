import React, { useState } from 'react';
import { BASE_URL } from '../../api';
import api from '../../api';
import { toast } from 'react-toastify';

const CartItem = ({ item, cartItems, setCartItems, setNumberCartItems }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);
  const product = item?.product || {};

  // ✅ Safely handle price even if it's a string, number, or missing
    const priceDisplay = product.formatted_price || (product.price != null ? Number(product.price).toLocaleString() : '0');
  // ✅ Handle both Cloudinary and local images
  const imageUrl = product?.image
    ? product.image.startsWith('http')
      ? product.image // Cloudinary full URL
      : `${BASE_URL}${product.image}` // local API image
    : '/img/placeholder.jpg'; // fallback placeholder

  const updateCartItem = () => {
    const itemData = {
      quantity: Number(quantity),
      item_id: item.id,
    };

    setLoading(true);
    api
      .patch('update_quantity/', itemData)
      .then((res) => {
        const updatedItem = res.data.data;
        toast.success('Cart Item Updated Successfully!');

        const updatedCartItems = cartItems.map((cartItem) =>
          cartItem.id === updatedItem.id ? updatedItem : cartItem
        );

        setNumberCartItems(
          updatedCartItems.reduce((acc, curr) => acc + curr.quantity, 0)
        );
        setCartItems(updatedCartItems);
      })
      .catch((err) => {
        console.error('Failed to update item:', err.message);
      })
      .finally(() => setLoading(false));
  };

  const deleteCartitem = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this cart item?'
    );
    if (!confirmDelete) return;

    setLoading(true);
    api
      .delete(`delete_cartitem/${item.id}/`)
      .then(() => {
        toast.success('Cart Item removed from cart.');
        const remainingItems = cartItems.filter(
          (cartItem) => cartItem.id !== item.id
        );
        setCartItems(remainingItems);
        setNumberCartItems(
          remainingItems.reduce((acc, curr) => acc + curr.quantity, 0)
        );
      })
      .catch((err) => {
        console.error('Failed to remove item:', err.message);
        toast.error('Failed to delete item.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="col-md-12">
      <div
        className="cart-item d-flex align-items-center mb-3 p-3"
        style={{ backgroundColor: 'white', borderRadius: '8px' }}
      >
        <img
          src={imageUrl}
          alt={product.name || 'Product'}
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '5px',
          }}
          onError={(e) => (e.target.src = '/img/placeholder.jpg')} // fallback if broken
        />

        <div className="ms-3 flex-grow-1">
          <h5 className="mb-1">{product.name || 'Unnamed Product'}</h5>
          <p className="mb-0 text-muted">₦{priceDisplay}</p>
        </div>

        <div className="d-flex align-items-center">
          <input
            type="number"
            min="1"
            className="form-control me-2"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: '70px' }}
          />
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={updateCartItem}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={deleteCartitem}
            disabled={loading}
          >
            {loading ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
