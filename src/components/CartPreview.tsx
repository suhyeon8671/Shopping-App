
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPreview.css';

const CartPreview: React.FC = () => {
  const { cartItems, totalPrice } = useCart();

  return (
    <div className="cart-preview">
      {cartItems.length > 0 ? (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="cart-preview-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <p>{item.name}</p>
                <p>${item.price.toFixed(2)} x {item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="cart-preview-total">
            <strong>Total:</strong> ${totalPrice.toFixed(2)}
          </div>
          <Link to="/cart" className="cart-preview-link">View Cart</Link>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPreview;
