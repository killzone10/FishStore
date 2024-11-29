import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { getImageUrl, getUserNickFromToken } from '../utils/utility';

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  photo: string;
}

const OrderForm: React.FC = () => {
  const location = useLocation();
  const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 };

  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    postalCode: '',
    city: '',
    street: '',
    houseNr: '',
    phone: '',
    email: '',
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [responseMessage, setResponseMessage] = useState<string>('');
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    const userLogin = getUserNickFromToken();

    if (!token || !userLogin) {
      setError('You must be logged in to fetch user information.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/auth/${userLogin}/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      console.log(data);

      setUserInfo({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        postalCode: data.postalCode || '',
        city: data.city || '',
        street: data.street || '',
        houseNr: data.houseNr || '',
        phone: data.phoneNumber || '',
        email: data.email || '',
      });
    } catch (err: any) {
      console.error('Error fetching user information:', err);
      setError('Failed to fetch user information.');
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) { // only numeric input allowed
      setUserInfo((prevState) => ({
        ...prevState,
        phone: value,
      }));
    }
  };

  const handleMakeOrder = async () => {
    const token = localStorage.getItem('token');
    const userLogin = getUserNickFromToken();

    if (!token || !userLogin) {
      setError('You must be logged in to place an order.');
      return;
    }

    setFormErrors({});

    const errors: any = {};

    if (!userInfo.houseNr) errors.houseNr = 'House number is required';
    if (!userInfo.email) errors.email = 'Email is required';
    if (!userInfo.city) errors.city = 'City is required'
    if (!userInfo.postalCode) errors.postalCode = 'Postal code is required';
    // if (!userInfo.street) errors.street = 'Street is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const orderPayload = {
      userLogin,
      email: userInfo.email,
      street: userInfo.street,
      houseNr: userInfo.houseNr,
      city: userInfo.city,
      postalCode: userInfo.postalCode,
      totalPrice:totalPrice.toFixed(2), 
      items: cartItems.map((item: CartItem) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    try {
      const response = await axios.post(
        `http://localhost:8080/api/orders/create`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setResponseMessage(response.data); 
// HERE 
      setTimeout(() => {
        navigate("/orders");

      }, 1000);


    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.response?.data || 'Failed to place order.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header text-center">
              <h2>Order Summary</h2>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h3>Items:</h3>
                <ul className="list-group">
                  {cartItems.map((item: CartItem) => (
                    <li key={item.productId} className="list-group-item d-flex align-items-center">
                      <img
                        src={getImageUrl(item.photo)}
                        alt={item.productName}
                        className="img-thumbnail"
                        style={{ width: '60px', height: '60px', marginRight: '15px' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{item.productName}</h6>
                        <small>
                          Quantity: {item.quantity} | Total: ${(item.price * item.quantity).toFixed(2)}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4 text-center">
                <strong>Total Price:</strong> <span>${totalPrice.toFixed(2)}</span>
              </div>
              <h3>Your Information</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={userInfo.firstName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={userInfo.lastName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="postalCode" className="form-label">
                    Postal Code: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={userInfo.postalCode}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your postal code"
                    required
                  />
                  {formErrors.postalCode && <p className="text-danger">{formErrors.postalCode}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="city" className="form-label">
                    City: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={userInfo.city}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your city"
                    required
                  />
                  {formErrors.city && <p className="text-danger">{formErrors.city}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="street" className="form-label">Street:</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={userInfo.street}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your street"
                  />
                  {formErrors.street && <p className="text-danger">{formErrors.street}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="houseNr" className="form-label">
                    House Number: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="houseNr"
                    name="houseNr"
                    value={userInfo.houseNr}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your house number"
                    required
                  />
                  {formErrors.houseNr && <p className="text-danger">{formErrors.houseNr}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone:</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handlePhoneChange}
                    className="form-control"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                  {formErrors.email && <p className="text-danger">{formErrors.email}</p>}
                </div>
                {error && <p className="text-danger">{error}</p>}
                {responseMessage && <p className="text-success">{responseMessage}</p>}
                <div className="text-center">
                  <button type="button" className="btn btn-primary" onClick={handleMakeOrder}   disabled={cartItems.length === 0}
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
