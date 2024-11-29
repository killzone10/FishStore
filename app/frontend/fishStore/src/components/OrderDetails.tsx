import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getImageUrl } from "../utils/utility";

interface Product {
  productId: number;
  name: string;
  price: number;
  photo: string;
  quantity: number; 
}

const OrderDetails: React.FC = () => {
  const location = useLocation();
  const { orderId } = location.state as { orderId: number };
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<Product[]>(
          `http://localhost:8080/api/orders/${orderId}/product`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch product details.");
      }
    };

    fetchProducts();
  }, [orderId]);

  if (error) return <div className="alert alert-danger">{error}</div>;

  const calculateTotal = () =>
    products.reduce((total, product) => total + product.price * product.quantity, 0);

  return (
    <div className="container mt-5">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Order Details</h2>
      <div className="cart-container1">
        <div className="cart-left">
          <h3>Ordered Items</h3>
          {products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li key={product.productId} className="cart-item">
                  <div className="cart-item-details">
                    <img
                      src={getImageUrl(product.photo)}
                      alt={product.name}
                      className="cart-item-image"
                    />
                    <span className="cart-item-name">{product.name}</span>
                    <span className="cart-item-price">${product.price.toFixed(2)}</span>
                    <span className="cart-item-quantity">
                      Quantity: {product.quantity || 0}
                    </span>
                    <span className="order-item-total">
                      Total: ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No items in the order.</p>
          )}
        </div>

        <div className="cart-right">
          <h3 className="order-summary-title">Order Summary</h3>
          <p className="total-price">
            <strong>Total:</strong> ${calculateTotal().toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
