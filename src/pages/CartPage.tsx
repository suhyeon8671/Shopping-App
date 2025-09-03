
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { CartItem } from '../types';
import './CartPage.css';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const cartRef = doc(db, 'carts', user.uid);
          const cartSnap = await getDoc(cartRef);
          if (cartSnap.exists()) {
            const data = cartSnap.data();
            setCartItems(Array.isArray(data.items) ? data.items : []);
          } else {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    const user = auth.currentUser;
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      await updateDoc(cartRef, { items: updatedItems });
    }
  };

  const handleRemoveItem = async (id: number) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);

    const user = auth.currentUser;
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      await updateDoc(cartRef, { items: updatedItems });
    }
  };
  
  const handleCheckout = async () => {
    const user = auth.currentUser;
    if (user && cartItems.length > 0) {
        try {
            const orderItems = cartItems.map(item => ({
                id: item.id.toString(),
                name: item.title,
                quantity: item.quantity,
                price: item.price, // Ensure price is included
                image: item.image,
            }));

            await addDoc(collection(db, "orders"), {
                userId: user.uid,
                items: orderItems,
                totalPrice: total,
                createdAt: serverTimestamp(),
            });

            const cartRef = doc(db, 'carts', user.uid);
            await updateDoc(cartRef, { items: [] });
            setCartItems([]);

            navigate('/profile');
        } catch (error) {
            console.error("Error during checkout: ", error);
            alert("주문 처리 중 오류가 발생했습니다.");
        }
    }
  };
  
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">장바구니</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <i className="fas fa-shopping-cart"></i>
          <h2>Cart가 비어있습니다.</h2>
          <p>Cart에 상품을 넣어주세요.</p>
          <Link to="/" className="keep-shopping-link">계속 쇼핑하기</Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="item-image" />
                <div className="item-details">
                  <p className="item-category">{item.category}</p>
                  <p className="item-title">{item.title}</p>
                  <p className="item-price">
                    ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="item-controls">
                    <div className="quantity-control">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} className="delete-button">
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <div className="summary-total">
              <span>합계:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-button">계산하기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
