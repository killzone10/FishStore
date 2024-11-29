import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, getUserNickFromToken } from '../utils/utility';
interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  photo: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<string | null> (null); 
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    const userLogin = getUserNickFromToken();
    const token = localStorage.getItem('token');
    if (!userLogin) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/cart/${userLogin}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)
      setCartItems(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch cart items');
    }
  };

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    const updatedCart = [...cartItems];
    const item = updatedCart.find((i) => i.productId === productId);
    if (!item) return;

    item.quantity = newQuantity;

    try {
      const token = localStorage.getItem('token');
      const userLogin = getUserNickFromToken();

      const response = await axios.put(
        `http://localhost:8080/api/cart/${userLogin}/update/${productId}/${newQuantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let updatedItems = response.data;
      setCartItems((prevItems) =>
        prevItems.map((item) => {
          const updatedItem = updatedItems.find(
            (updated:any) => updated.productId === item.productId
          );
          return updatedItem || item; // replace with updated item or keep the existing one
        })
      );
      setNotification('Item quantity has been changed.');
      setTimeout(() => setNotification(null), 4000); 


    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    const token = localStorage.getItem('token');
    const userLogin = getUserNickFromToken();

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/cart/${userLogin}/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // TODO
      // think if this is 100% correct, because it would be better to get info from backend
      // yet the order of cart items often will change then. 
      // setCartItems(cartItems.filter((item) => item.productId !== productId));
      // let updatedItems = response.data;
      // setCartItems(updatedItems);

      setCartItems((prevItems) => {
        return prevItems.filter((item) => item.productId !== productId);
      });
      setNotification('Item has been deleted.');
      setTimeout(() => setNotification(null), 4000); 



    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const calculateTotal = () =>
    Array.isArray(cartItems)
      ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
      : 0;

  const handleMakeOrder =  async () => {
    navigate('/order-form', {  state: {
      cartItems,
      totalPrice: calculateTotal(),
    }, });
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="cart-page">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Cart</h2>
      {notification && (
        <div className="alert alert-success text-center" role="alert">
          {notification}
        </div>
      )}
      <div className="cart-container1">
        {/* left Box: items list */}
        <div className="cart-left">
          <h3>Items in Cart</h3>
          {cartItems.length > 0 ? (
            <ul>
              {cartItems.map((item) => (
                <li key={item.productId} className="cart-item">
                  <div className="cart-item-details">
                    <img
                      src={getImageUrl(item.photo)}
                      alt={item.productName}
                      className="cart-item-image"
                    />
                    <span className="cart-item-name">{item.productName}</span>
                    <span className="cart-item-price">${item.price.toFixed(2)}</span>
                    <div className="cart-item-quantity">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.productId, parseInt(e.target.value))
                        }
                        className="form-select"
                      >
                        {[...Array(100).keys()].map((n) => (
                          <option key={n + 1} value={n + 1}>
                            {n + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        <div className="cart-right">
          <h3>Order Summary</h3>
          <p>
            <strong>Total:</strong> ${calculateTotal().toFixed(2)}
          </p>
          <button onClick={handleMakeOrder} className="btn btn-primary btn-lg" disabled={cartItems.length === 0} // disable if cart is empty
          >
            Go to shipping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
