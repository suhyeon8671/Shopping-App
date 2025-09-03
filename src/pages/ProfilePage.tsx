
import React, { useState, useEffect } from 'react';
import { auth, getOrders } from '../firebase';
import { Order, OrderItem } from '../types';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUserEmail(user.email);
          const userOrders = await getOrders(user.uid);
          setOrders(userOrders);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="loading-indicator">정보를 불러오는 중...</div>;
  }

  return (
    <div className="profile-page">
      {userEmail && <p className="user-email"><strong>계정:</strong> {userEmail}</p>}
      <h1 className="order-history-title">주문 내역</h1>
      {orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <span><strong>주문 번호:</strong> {order.id}</span>
                <span><strong>주문 날짜:</strong> {order.createdAt.toDate().toLocaleDateString()} {order.createdAt.toDate().toLocaleTimeString()}</span>
                <span><strong>총 결제 금액:</strong> ${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="order-products">
                {order.items.map((item: OrderItem) => (
                  <div key={item.id} className="product-item">
                    <img src={item.image} alt={item.name} />
                    <div className="product-details">
                      <p className="product-name">{item.name}</p>
                      <p>수량: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
