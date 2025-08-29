
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector((state: RootState) => state.products);
  const [selectedCategory, setSelectedCategory] = useState<string>('모두');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProducts =
    selectedCategory === '모두'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const categories = [
    { name: '모두', value: '모두' },
    { name: '전자기기', value: 'electronics' },
    { name: '쥬얼리', value: 'jewelery' },
    { name: '남성의류', value: "men's clothing" },
    { name: '여성의류', value: "women's clothing" },
  ];

  return (
    <>
      <Header />
      <div className="container">
        <h2 className='products-title'>Products</h2>
        <div className="category-filters">
            {categories.map((category) => (
                <button
                key={category.name}
                onClick={() => handleCategoryClick(category.value)}
                className={`category-button ${
                    selectedCategory === category.value ? 'active' : ''
                }`}
                >
                {category.name}
                </button>
            ))}
        </div>
        <div className="product-list-container">
            <p className="item-count">Showing: {filteredProducts.length} items</p>
            {status === 'loading' && <p className="loading-text">Loading...</p>}
            {status === 'failed' && <p className="error-text">Error: {error}</p>}
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
