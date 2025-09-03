
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, DocumentSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { Product, CartItem } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
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
    if (currentUser) {
      const cartRef = doc(db, 'carts', currentUser.uid);
      const unsubscribe = onSnapshot(cartRef, (docSnap: DocumentSnapshot) => {
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
  }, [currentUser, product.id]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

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
          await updateDoc(cartRef, {
            items: arrayUnion({ ...product, quantity: 1 })
          });
        }
      } else {
        await setDoc(cartRef, {
          items: [{ ...product, quantity: 1 }]
        });
      }
    } catch (error) {
      console.error("Error adding to cart: ", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card">
        <Link to={`/product/${product.id}`} className="product-image-link">
            <img src={product.image} alt={product.title} className="product-image" />
        </Link>
        <div className="product-info">
            <p className="product-name">{product.title}</p>
            <div className="product-actions">
                <button 
                    onClick={handleAddToCart}
                    className={isProductInCart ? "in-cart-btn" : "add-to-cart-btn"}
                    disabled={isProductInCart || isAdding}
                >
                    {isProductInCart ? '장바구니에 담긴 제품' : (isAdding ? '추가 중...' : '장바구니에 담기')}
                </button>
                <span className="product-price">${product.price.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;
