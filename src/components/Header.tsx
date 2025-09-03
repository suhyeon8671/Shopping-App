
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FiShoppingCart, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import { CartItem } from '../types';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (user) {
            const cartRef = doc(db, 'carts', user.uid);
            const unsubscribeCart = onSnapshot(cartRef, (cartSnap) => {
                if (cartSnap.exists()) {
                    const cartData = cartSnap.data();
                    const count = cartData.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
                    setCartItemCount(count);
                } else {
                    setCartItemCount(0);
                }
            });

            return () => unsubscribeCart();
        } else {
            setCartItemCount(0);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/'); // Redirect to homepage after logout
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="shop-title">Shop</Link>
            </div>
            <div className="header-right">
                <Link to="/cart" className="icon-link">
                    <FiShoppingCart />
                    {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                </Link>
                {user ? (
                    <>
                        <Link to="/profile" className="icon-link">
                            <FiUser />
                        </Link>
                        <button onClick={handleLogout} className="icon-button">
                            <FiLogOut />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="icon-link">
                        <FiLogIn />
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
