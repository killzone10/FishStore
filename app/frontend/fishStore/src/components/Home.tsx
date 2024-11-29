import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/utility';

interface Brand {
  name: string;
}

interface Type {
  title: string;
  parent: Type | null;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  type: Type;
  brand: Brand;
  photo: string;
  quantity: number;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [dealbreaker, setDealbreaker] = useState<Product | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/type/all?page=0&size=5`
        );
        const products: Product[] = response.data.content;
        setProducts(products.slice(0, 1)); // Show only 1 product for recommended section
        if (products.length > 0) {
          const randomDealbreaker =
            products[Math.floor(Math.random() * products.length)];
          setDealbreaker(randomDealbreaker);
        }
      } catch (error: any) {
        setError('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="homepage">
      <div className="homepage-content">
        <div className="product-sections">
          <div className="dealbreaker-box">
            <h2>Dealbreaker</h2>
            {dealbreaker ? (
              <Link to={`/products/${dealbreaker.id}`} className="dealbreaker-link" style={{ textDecoration: 'none', color: 'black' }}>
                <div className="dealbreaker-product">
                  <img
                    src={getImageUrl(dealbreaker.photo)}
                    alt={dealbreaker.name}
                    className="dealbreaker-image"
                  />
                  <h3>{dealbreaker.name}</h3>
                  <p>Price: ${dealbreaker.price}</p>
                  <p
                    style={{
                      color: dealbreaker.quantity > 0 ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {dealbreaker.quantity > 0 ? 'Available' : 'Out of Stock'}
                  </p>
                </div>
              </Link>
            ) : (
              <p className="loading-message">Loading...</p>
            )}
          </div>

          <div className="recommended-box">
            <h2>Recommended Product</h2>
            <div className="recommended-list">
              {products.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id} className="recommended-link" style={{ textDecoration: 'none', color: 'black' }}>
                  <div className="recommended-product-box">
                    <img
                      src={getImageUrl(product.photo)}
                      alt={product.name}
                      className="recommended-image"
                    />
                    <h3>{product.name}</h3>
                    <p>Price: ${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
