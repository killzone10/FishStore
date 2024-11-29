import axios from 'axios';
import {Navigate, BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Home from './components/Home';
import AppNavBar from './components/Navbar';
import Register from './components/Register';   
import TopBanner from './components/TopBanner';
import SearchBar from './components/SearchBar';
import AdminDashboard from './components/AdminDashboard';
import Carousel from './components/Carousel';
import ProductPage from './components/ProductPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './App.css'
import { jwtDecode } from 'jwt-decode' 
import image1 from './assets/carousel/1.png';
import image2 from './assets/carousel/2.jpg';

// import image3 from './assets/carousel/3.jpg' // image works, but is ugly
import image4 from './assets/carousel/4.jpg';
import image5 from './assets/carousel/5.jpg';
import image6 from './assets/carousel/6.jpg';
import image7 from './assets/carousel/7.jpg';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';
import About from './components/About';
import UserInfoPage from './components/UserInfo';
import OrdersComponent from './components/OrdersComponent';
import OrderDetails from './components/OrderDetails';
import Footer from './components/Footer';

// carousel images are imported statiticly
const carouselSlides = [
    {url: image1, alt: "Image 1"},
    {url: image2, alt: "Image 2"},
    // {url: image3, alt: "Image 3"},
    {url: image4, alt: "Image 4"},
    {url: image5, alt: "Image 5"},
    {url: image6, alt: "Image 6"},
    {url: image7, alt: "Image 7"},

]

function App() {
    // we want to have token logic in the global scope
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [roles, setRoles] = useState<string[]>([]);
    // roles are fetched in the beggining - its a list of roles
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000; 
          if (decodedToken.exp && decodedToken.exp > currentTime){
              setIsLoggedIn(true); 
              axios.get('http://localhost:8080/api/auth/roles', {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              })
              .then(response => {
                  setRoles(response.data);
              })
              .catch(error => {
                  console.error("Error fetching roles:", error);
                  localStorage.removeItem('token');
                  setIsLoggedIn(false);
              });
          } else {
              localStorage.removeItem('token');
              setIsLoggedIn(false);
          }
      } else {
          setIsLoggedIn(false);
      }
  }, []); 

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        setIsLoggedIn(false); 
        setRoles([]); 
        window.location.href = '/login'; 
    };
    return (
        <Router>
          <TopBanner/>  
          <SearchBar isLoggedIn={isLoggedIn} onLogout={handleLogout} isAdmin = {roles.includes('admin')}/>
            <AppNavBar/>
            {/* carousel part - aspectRatio is important, and the pictures have to be in resolution similiar to aspect ratio */}
            <div style ={{maxWidth: "1800px", maxHeight: "350px", width:"100%", aspectRatio:"11/4", margin:"0 auto"}}>
    
              <Carousel images = {carouselSlides} autoSlide = {true}/>
            </div>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setRoles={setRoles} />} />
              <Route path="/register" element={<Register />} />

              <Route
                    path="/cart"
                    element={
                        isLoggedIn ? (
                            <Cart />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
              />
              <Route
                    path="/order-form"
                    element={
                        isLoggedIn ? (
                            <OrderForm />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
              <Route
                path="/user-info"
                element={
                    isLoggedIn ? (
                        <UserInfoPage />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
              />
              <Route
                path="/orders"
                element={
                    isLoggedIn ? (
                        <OrdersComponent />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
              />
              <Route 
                path="/order/:orderId/items" 
                element={
                    isLoggedIn ? (
                        <OrderDetails />
                    ) : (
                        <Navigate to="/login" />
                    )
                  }/>

              <Route path="/about" element={<About />} />
              <Route 
                path="/admin" 
                element={
                  (() => {
                      return roles.includes('admin') ? <AdminDashboard /> : <Navigate to="/" />;
                  })()
                }
                
              />
            {/* navbar routing */}
                <Route path="/products" element={<ProductList/>} />
                <Route path="/products/:id" element={<ProductPage isLoggedIn = {isLoggedIn}/>} />

                <Route path="/products/rods" element={<ProductList type="Rods"/>} />
                <Route path="/products/hooks" element={<ProductList type="Hooks"/>} />
                <Route path="/products/baits" element={<ProductList type="Baits"/>} />
                <Route path="/products/others" element={<ProductList type="Others"/>} />

            </Routes>
            {/* footer part */}

            <Footer/>
        </Router>
    );
}

export default App;
