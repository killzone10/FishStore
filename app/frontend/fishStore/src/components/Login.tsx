import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    setRoles:React.Dispatch<React.SetStateAction<string[]>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setRoles }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const loginFormRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); // set logged in state in the parent component
            navigate("/"); // redirect to home if already logged in
        }
    }, [navigate, setIsLoggedIn]);

    useEffect(() => {
        if (loginFormRef.current){
            window.scrollTo({
                top: loginFormRef.current.offsetTop, // scroll to the login form
                behavior: 'smooth',
            });
        }
    }, []);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            const token = response.data;
            localStorage.setItem('token', token);
            setIsLoggedIn(true); 
            const rolesResponse = await axios.get('http://localhost:8080/api/auth/roles', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(rolesResponse.data); 
            navigate('/'); 
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="container mt-5" ref={loginFormRef}>
            <h2>Login</h2>
            <form className="mt-4" onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                {error && <p className="text-danger mt-2">{error}</p>}
            </form>
        </div>
    );
}

export default Login;
