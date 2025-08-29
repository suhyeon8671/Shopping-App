
import { ShoppingCart, User, LogIn } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="shop-title">Shop</h1>
        <div className="header-icons">
          <button className="icon-button">
            <ShoppingCart className="icon" />
          </button>
          <button className="icon-button">
            <User className="icon" />
          </button>
          <button className="icon-button">
            <LogIn className="icon" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
