import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { ErrorResponse, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const [firstName, setFirstName] = useState<string>('');
    const [secondName, setSecondName] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [houseNr, setHouseNr] = useState<number | ''>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [city, setCity] = useState<string>('');

    const [error, setError] = useState<string | ErrorResponse>('');
    const [passwordError, setPasswordError] = useState<string>('');  
    const [passwordMatchError, setPasswordMatchError] = useState<string>('');  

    const registerFormRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (registerFormRef.current) {
            window.scrollTo({
                top: registerFormRef.current.offsetTop,
                behavior: 'smooth',
            });
        }
    }, []);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // check password length and match before submitting
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        } else {
            setPasswordError('');
        }

        if (password !== confirmPassword) {
            setPasswordMatchError('Passwords do not match');
            return;
        } else {
            setPasswordMatchError('');
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/register',
                {
                    username,
                    password,
                    confirmPassword,
                    email,
                    phoneNumber,
                    firstName,
                    secondName,
                    street,
                    houseNr,
                    postalCode,
                    cityName: city,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            navigate('/login');
        } catch (err) {
            const axiosError = err as AxiosError;

            if (axiosError.response) {
                const errorResponse = axiosError.response.data as ErrorResponse;
                setError(errorResponse);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="container mt-5" ref={registerFormRef}>
            <h2>Register</h2>
            <form className="mt-4" onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password:
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && (
                        <div className="text-danger">{passwordError}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordMatchError && (
                        <div className="text-danger">{passwordMatchError}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email:
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                        Phone number:
                    </label>
                    <input
                        type="text" 
                        className="form-control"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { 
                                setPhoneNumber(value);
                                setError('');
                            } else {
                                setError('Phone number must consist of numbers only');
                            }
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                        First Name:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="secondName" className="form-label">
                        Second Name:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="secondName"
                        value={secondName}
                        onChange={(e) => setSecondName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="street" className="form-label">
                        Street:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="houseNr" className="form-label">
                        House Number:
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="houseNr"
                        value={houseNr}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value > -1) {
                                setHouseNr(value);
                                setError('');
                            } else {
                                setError('House number must be positive');
                            }
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="postalCode" className="form-label">
                        Postal Code:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="city" className="form-label">
                        City:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Register
                </button>
                {error && (
                    <p className="text-danger mt-2">
                        {typeof error === 'string' ? error : JSON.stringify(error)}
                    </p>
                )}
            </form>
        </div>
    );
};

export default Register;
