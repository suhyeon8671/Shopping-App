
import Header from '../components/Header';

interface CartItem {
    id: number;
    image: string;
    title: string;
    price: number;
    quantity: number;
}

const CartPage = () => {
  const cartItems: CartItem[] = []; // Placeholder for cart items

  return (
    <>
      <Header />
      <div className="container cart-container">
        <h1 className="cart-title">장바구니</h1>
        {cartItems.length === 0 ? (
          <div className="empty-cart-container">
            <div className="empty-cart-icon">🛒</div>
            <p className="empty-cart-main-text">Cart가 비어있습니다.</p>
            <p className="empty-cart-sub-text">Cart에 상품을 넣어주세요.</p>
            <a href="/" className="shopping-link">계속 쇼핑하기</a>
          </div>
        ) : (
          <div>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                  <div>
                    <p>{item.title}</p>
                    <p className="cart-item-price-details">${item.price} x {item.quantity} = ${item.price * item.quantity}</p>
                  </div>
                </div>
                <div className="cart-item-controls">
                  <button className="quantity-button">-</button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button className="quantity-button">+</button>
                  <button className="remove-item-button">🗑️</button>
                </div>
              </div>
            ))}
            <div className="cart-summary">
              <p className="total-price">합계: $109.95</p>
              <button className="checkout-button">계산하기</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
