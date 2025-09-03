
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Product, CartItem } from '../types'; // 통합 타입 사용
import './ProductDetailPage.css';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(response.data);
      } catch {
        setError('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (currentUser && product) {
      const cartRef = doc(db, 'carts', currentUser.uid);
      const unsubscribe = onSnapshot(cartRef, (docSnap) => {
        if (docSnap.exists()) {
          const cartItems = docSnap.data().items || [];
          const isInCart = cartItems.some((item: CartItem) => item.id === product.id);
          setIsProductInCart(isInCart);
        } else {
          setIsProductInCart(false);
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser, product]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!product) return;

    setIsAdding(true);
    const cartRef = doc(db, 'carts', currentUser.uid);

    try {
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const itemIndex = cartData.items.findIndex((item: CartItem) => item.id === product.id);

        if (itemIndex > -1) {
          const updatedItems = [...cartData.items];
          updatedItems[itemIndex].quantity += 1;
          await updateDoc(cartRef, { items: updatedItems });
        } else {
          await updateDoc(cartRef, { items: arrayUnion({ ...product, quantity: 1 }) });
        }
      } else {
        await setDoc(cartRef, { items: [{ ...product, quantity: 1 }] });
      }
    } catch (error) {
      console.error("Error adding to cart: ", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return <div className="loading-indicator">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="not-found">Product not found.</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image-section">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="product-info-section">
          <p className="product-category">{product.category}</p>
          <h1 className="product-title">{product.title}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>
          <div className="product-actions">
            <button 
                className={isProductInCart ? "in-cart-btn" : "add-to-cart-btn"}
                onClick={handleAddToCart}
                disabled={isProductInCart || isAdding}
            >
              {isProductInCart ? '장바구니에 담긴 제품' : (isAdding ? '추가 중...' : '장바구니에 담기')}
            </button>
            <button className="go-to-cart-btn" onClick={() => navigate('/cart')}>
              장바구니로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
