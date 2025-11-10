import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // سيتم ربط هذا بالخلفية لاحقاً
    const mockProducts = [
      { id: 1, name: 'UC PUBG 60', price: 10, game: 'pubg', category: 'coins' },
      { id: 2, name: 'تيك توك 100 عملة', price: 5, game: 'tiktok', category: 'coins' },
      { id: 3, name: 'ألماس فري فاير', price: 15, game: 'freefire', category: 'diamonds' }
    ];
    setProducts(mockProducts);
  }, []);

  return (
    <div className="products-page">
      <h1>منتجاتنا</h1>
      
      <div className="filters">
        <button onClick={() => setFilter('all')}>الكل</button>
        <button onClick={() => setFilter('coins')}>عملات</button>
        <button onClick={() => setFilter('subscriptions')">اشتراكات</button>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
