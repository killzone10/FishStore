import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {getUserNickFromToken } from '../utils/utility';

// User info page has 3 functionalities
// 1) changing the typical user data
// 2) changing the adress data
// 3) changing the password

const UserInfoPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    secondName: '',
    postalCode: '',
    city: '',
    street: '',
    houseNr: '',
    phone: '',
    email: '',
  });

  const [addressInfo, setAddressInfo] = useState({
    postalCode: '',
    city: '',
    street: '',
    houseNr: '',
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [error, setError] = useState('');
  const [activeForm, setActiveForm] = useState<'user' | 'address' | 'password'>('user');

  // fetch user info and address info from backend
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    const userLogin = getUserNickFromToken();
    
    if (!token || !userLogin) {
      setError('You must be logged in to fetch user information.');
      return;
    }

    try {
      const userResponse = await axios.get(`http://localhost:8080/api/auth/${userLogin}/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = userResponse.data;
      setUserInfo({
        firstName: userData.firstName || '',
        secondName: userData.lastName || '',
        postalCode: userData.postalCode || '',
        city: userData.city || '',
        street: userData.street || '',
        houseNr: userData.houseNr || '',
        phone: userData.phoneNumber || '',
        email: userData.email || '',
      });

      setAddressInfo({
        postalCode: userData.postalCode || '',
        city: userData.city || '',
        street: userData.street || '',
        houseNr: userData.houseNr || '',
      });

    } catch (err) {
      console.error('Error fetching user or address information:', err);
      setError('Failed to fetch information.');
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, form: 'user' | 'address' | 'password') => {
    const { name, value } = e.target;
    if (form === 'user') {
      setUserInfo((prevState) => ({ ...prevState, [name]: value }));
    } else if (form === 'address') {
      setAddressInfo((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setPasswordInfo((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleTabChange = (form: 'user' | 'address' | 'password') => {
    setActiveForm(form);
    setResponseMessage(''); 
    setError(''); 
    setFormErrors({});
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) { // only numeric input allowed
      setUserInfo((prevState) => ({ ...prevState, phone: value }));
    }
  };

  const handleSaveUserInfo = async () => {
    const token = localStorage.getItem('token');
    const userLogin = getUserNickFromToken();

    if (!token || !userLogin) {
      setError('You must be logged in to save user information.');
      return;
    }

    setFormErrors({});
    const errors: any = {};

    if (!userInfo.email) errors.email = 'Email is required';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/auth/${userLogin}/changeBaseInfo`,
        userInfo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResponseMessage('User information updated successfully!');
      setError('')
    } catch (error:any) {
      console.error('Error updating user information:', error);
      const validationErrors = error.response.data.map((err: any) => err.defaultMessage);
      setError(validationErrors || 'Failed to update user information.');
      setResponseMessage('')
    }
  };


  const handleSaveAddressInfo = async () => {
    const token = localStorage.getItem('token');
    const userLogin = getUserNickFromToken();

    if (!token || !userLogin) {
      setError('You must be logged in to save address information.');
      return;
    }

    setFormErrors({});
    try {
      await axios.put(
        `http://localhost:8080/api/auth/${userLogin}/changeAdressInfo`,
        addressInfo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResponseMessage('Address information updated successfully!');
      setError('')

    } catch (error:any) {
      console.error('Error updating address information:', error);
      const validationErrors = error.response.data.map((err: any) => err.defaultMessage);
      setError(validationErrors || 'Failed to update adress information.');
      setResponseMessage('');

    }
  };

  const handleSavePasswordInfo = async () => {
    const token = localStorage.getItem('token');
    const userLogin = getUserNickFromToken();

    if (!token || !userLogin) {
      setError('You must be logged in to change your password.');
      return;
    }

    setFormErrors({});
    const errors: any = {};

    if (!passwordInfo.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordInfo.newPassword) errors.newPassword = 'New password is required';
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/auth/${userLogin}/changePassword`,
        passwordInfo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResponseMessage('Password updated successfully!');
      setError('')
    } catch (error:any) {
      console.error('Error updating password:', error);
      let validationErrors: string[] = [];
      let runtimeError = 'Failed to update password.';
    
      if (error.response) {
        const responseData = error.response.data;
    
        // there is a problme, becuase backend sends 2 types of errors
        // one is runtime error and another one is from the library validation and is
        // in the default message

        // case with default message
        if (Array.isArray(responseData)) {
          validationErrors = responseData.map((err: any) => err.defaultMessage || '');
        } 
        // different cases
        else if (typeof responseData === 'object' && responseData.message) {
          runtimeError = responseData.message;
        } 
        else if (typeof responseData === 'string') {
          runtimeError = responseData;
        }
      }
      setError(validationErrors.length > 0 ? validationErrors.join(', ') : runtimeError);
      setResponseMessage('');

    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header text-center">
              <h2>User Information</h2>
            </div>
            <div className="card-body">
              <div className="form-nav">
                <button onClick={() => handleTabChange('user')} className="btn btn-link btn-lg text-primary hover-shadow">User Info</button>
                <button onClick={() => handleTabChange('address')} className="btn btn-link btn-lg text-primary hover-shadow">Address Info</button>
                <button onClick={() => handleTabChange('password')} className="btn btn-link btn-lg text-primary hover-shadow">Password Info</button>
              </div>

              {activeForm === 'user' && (
                <form>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name:</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userInfo.firstName}
                      onChange={(e) => handleChange(e, 'user')}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="secondName" className="form-label">Last Name:</label>
                    <input
                      type="text"
                      id="secondName"
                      name="secondName"
                      value={userInfo.secondName}
                      onChange={(e) => handleChange(e, 'user')}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userInfo.email}
                      onChange={(e) => handleChange(e, 'user')}
                      className="form-control"
                      autoComplete="email"

                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone:</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handlePhoneChange}
                      className="form-control"
                      autoComplete="tel"

                    />
                  </div>

                  {formErrors.email && <div className="alert alert-danger">{formErrors.email}</div>}
                  {responseMessage && <div className="alert alert-success">{responseMessage}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}
                  <button type="button" onClick={handleSaveUserInfo} className="btn btn-primary">Save User Info</button>
                </form>
              )}

              {activeForm === 'address' && (
                <form>
                  <div className="mb-3">
                    <label htmlFor="postalCode" className="form-label">Postal Code:</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={addressInfo.postalCode}
                      onChange={(e) => handleChange(e, 'address')}
                      className="form-control"
                      autoComplete="postal-code"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">City:</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={addressInfo.city}
                      onChange={(e) => handleChange(e, 'address')}
                      className="form-control"
                      autoComplete="address-level2" 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="street" className="form-label">Street:</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={addressInfo.street}
                      onChange={(e) => handleChange(e, 'address')}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="houseNr" className="form-label">House Number:</label>
                    <input
                      type="text"
                      id="houseNr"
                      name="houseNr"
                      value={addressInfo.houseNr}
                      onChange={(e) => handleChange(e, 'address')}
                      className="form-control"
                    />
                  </div>

                  {responseMessage && <div className="alert alert-success">{responseMessage}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}

                  <button type="button" onClick={handleSaveAddressInfo} className="btn btn-primary">Save Address Info</button>
                </form>
              )}

              {activeForm === 'password' && (
                <form>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password:</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordInfo.currentPassword}
                      onChange={(e) => handleChange(e, 'password')}
                      className="form-control"
                       autoComplete="current-password"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password:</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordInfo.newPassword}
                      onChange={(e) => handleChange(e, 'password')}
                      className="form-control"
                       autoComplete="new-password"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordInfo.confirmPassword}
                      onChange={(e) => handleChange(e, 'password')}
                      className="form-control"
                      autoComplete="new-password"

                    />
                  </div>

                  {formErrors.currentPassword && <div className="alert alert-danger">{formErrors.currentPassword}</div>}
                  {formErrors.newPassword && <div className="alert alert-danger">{formErrors.newPassword}</div>}
                  {formErrors.confirmPassword && <div className="alert alert-danger">{formErrors.confirmPassword}</div>}

                  {responseMessage && <div className="alert alert-success">{responseMessage}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}

                  <button type="button" onClick={handleSavePasswordInfo} className="btn btn-primary">Save Password Info</button>
                </form>
              )}


            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserInfoPage;
