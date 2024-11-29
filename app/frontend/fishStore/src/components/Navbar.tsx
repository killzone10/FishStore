import React from 'react';
import { Link } from 'react-router-dom';


const AppNavBar: React.FC = () => {
    return (
        // <nav className="navbar navbar-expand-lg navbar-primary bg-primary">
        <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container-fluid">
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id ="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link ms-5" to="/products/">All Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link ms-5" to="/products/rods">Rods</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link ms-5" to="/products/hooks">Hooks</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link ms-5" to="/products/baits">Baits</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link ms-5" to="/products/others">Other</Link>
                        </li>
        
                    </ul>
             
                </div>
            </div>
        </nav>
    );
};

export default AppNavBar;
