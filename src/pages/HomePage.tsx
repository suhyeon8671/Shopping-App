
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Product } from '../types'; // 통합 타입 사용

import './HomePage.css';

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('모두');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setStatus('loading');
                const response = await axios.get('https://fakestoreapi.com/products');
                setProducts(response.data);
                setStatus('succeeded');
            } catch {
                setError('Failed to fetch products');
                setStatus('failed');
            }
        };

        fetchProducts();
    }, []);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    const filteredProducts = selectedCategory === '모두'
        ? products
        : products.filter(product => product.category === selectedCategory);

    const categories = [
        { name: '모두', value: '모두' },
        { name: '전자기기', value: 'electronics' },
        { name: '쥬얼리', value: 'jewelery' },
        { name: '남성의류', value: "men's clothing" },
        { name: '여성의류', value: "women's clothing" },
      ];

      return (
        <div className="homepage">
            <h2 className="products-title">Products</h2>
            <div className="category-filters">
                {categories.map((category) => (
                <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.value)}
                    className={`category-button ${selectedCategory === category.value ? 'active' : ''}`}>{category.name}
                </button>
                ))}
            </div>
            <p className="item-count">Showing: {filteredProducts.length} items</p>
            {status === 'loading' && <div className="loading-indicator">Loading...</div>}
            {status === 'failed' && <div className="error-message">Error: {error}</div>}
            {status === 'succeeded' && (
              <div className="product-grid">
                  {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            )}
        </div>
      );
    };

    export default HomePage;
