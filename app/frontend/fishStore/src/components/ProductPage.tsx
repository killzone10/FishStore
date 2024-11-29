import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
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

interface ProductPageProps {
  isLoggedIn: boolean;
}

const ProductPage: React.FC<ProductPageProps> = ({ isLoggedIn }) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); 
  const [quantity, setQuantity] = useState(1); 

  const getUserNickFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    try {
      let userNickname = decodedToken.sub;
      return userNickname;
    } catch (e: any) {
      setError(e);
      return null;
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        setProduct(response.data);
        // initialize quantity to 1 when the product is fetched
        setQuantity(1);
      } catch (error: any) {
        setError('Product not found');
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    let userLogin = getUserNickFromToken();    
    try {
      if (product) {
        await axios.post(
          `http://localhost:8080/api/cart/${userLogin}/add/${product.id}/${quantity}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage('Product added to cart successfully!');
      }
    } catch (error: any) {
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Product not found'}`);
      } else {
        setError('Product not found');
      }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newQuantity = Math.min(parseInt(e.target.value), product?.quantity || 1);
    newQuantity = Math.max(newQuantity, 1); // ensure quantity is at least 1
    setQuantity(newQuantity);
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-page">
      {product ? (
        <div className="product-container">
          {/* left img*/}
          <div className="product-image-container">
            <img
              src={getImageUrl(product.photo)}
              alt={product.name}
              className="product-image"
            />
          </div>

          <div className="product-details">
            <h2 className="product-title">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-type">
              <strong>Type:</strong> {product.type?.title}
            </p>
            <p className="product-brand">
              <strong>Brand:</strong> {product.brand?.name}
            </p>
            {/* description below brand */}
            <p className="product-extra-description">
            <strong>Description:</strong> {product.description}
            </p>
          </div>

          {/* rigt  */}
          <div className="cart-container">
            <div className="price-box">
              <p className="product-price">
                <strong>Price:</strong> ${product.price}
              </p>
              <div className="quantity-section">
                <label htmlFor="quantity "className="form-label">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  min="1"
                  max={product.quantity} 
                  onChange={handleQuantityChange}
                  className="form-control w-50"
                  disabled={product.quantity === 0} // disable if out of stock
                />
              </div>

              {isLoggedIn && (
                <button
                  onClick={handleAddToCart}
                  className="add-to-cart-button"
                  disabled={product.quantity === 0} 
                >
                  Add to Cart
                </button>
              )}

              {message && <p className="success-message">{message}</p>}

              <div className="product-availability">
                <p
                  className="availability-status"
                  style={{
                    color: product.quantity > 0 ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {product.quantity > 0 ? 'Available' : 'Out of Stock'}
                </p>
              </div>

              <div className="product-info">
                <p><strong>Free Shipping</strong></p>
                <p>Shipping in 2 days</p>
                <p>Available in the shop</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="loading-message">Loading...</p>
      )}
    </div>
  );
};

export default ProductPage;
