import React from 'react';
import { FaFish, FaStar, FaPhone } from 'react-icons/fa';
import { FaCableCar } from 'react-icons/fa6';

const TopBanner: React.FC = () => {
    return (
        <div className="top-banner bg-primary text-white d-flex justify-content-around align-items-center py-2">
            <div className="d-flex align-items-center">
                <FaFish className="me-2" />
                <span>Najlepszy sklep rybny od 20 lat</span>
            </div>
            <div className="d-flex align-items-center">
                <FaStar className="me-2" />
                <span>Wędki lepsze od tych sąsiada</span>
            </div>
            <div className="d-flex align-items-center">
                <FaCableCar className="me-2" />
                <span>Ekspresowa wysyłka</span>
            </div>
            <div className="d-flex align-items-center">
                <FaPhone className="me-2" />
                <span>Kontakt: 123-456-789</span>
            </div>
        </div>
    );
};

export default TopBanner;
