
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Header from '../components/Header';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const products = useSelector((state: RootState) => state.products.products);
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="page-wrapper">
      <Header />
      <main className="content-wrapper">
        <div className="container product-detail-container">
          <div className="product-detail-grid">
            <div className="product-detail-image-container">
              <img src={product.image} alt={product.title} className="product-detail-image" />
            </div>
            <div className="product-detail-info">
              <h2 className="product-detail-category">{product.category}</h2>
              <h1 className="product-detail-title">{product.title}</h1>
              <p className="product-detail-price">${product.price}</p>
              <p className="product-detail-description">{product.description}</p>
              <div className="product-detail-buttons">
                <button className="add-to-cart-button-detail">장바구니에 담기</button>
                <button className="go-to-cart-button">장바구니로 이동</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
