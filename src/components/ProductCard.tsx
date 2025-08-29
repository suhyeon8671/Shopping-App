
import { useNavigate } from 'react-router-dom';
import type { ProductType } from '../types';

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleProductClick}>
        <img src={product.image} alt={product.title} className="product-image" />
        <h3 className="product-title">{product.title}</h3>
      <div className="product-footer">
        <button className="add-to-cart-button">장바구니에 담기</button>
        <p className="product-price">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
