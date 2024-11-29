import React from 'react';
import { Container, Form, FormControl, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from "../assets/ryba.png";
import { FaCartPlus, FaUserAlt, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaCog, FaBuilding, FaBox } from 'react-icons/fa';

interface SearchBarProps {
    isLoggedIn: boolean;
    onLogout: () => void;
    isAdmin: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isLoggedIn, onLogout, isAdmin }) => {
    return (
        <div className="search-bar bg-light py-3">
            <Container>
                <Row className="align-items-center justify-content-between">
                    {/* fish icon - shop icon*/}
                    <Col xs="auto" className="flex-shrink-0">
                        <Link to="/">
                            <img src={logo} alt="Logo" className="fish" />
                        </Link>
                    </Col>

                    {/* centered search bar */}
                    <Col className="d-flex justify-content-center">
                        <Form className="d-flex w-100" style={{ maxWidth: '500px' }}>
                            <FormControl
                                type="search"
                                placeholder="Wyszukaj produkty..."
                                aria-label="Search"
                                className="me-2"
                            />
                            <button className="btn btn-outline-primary" type="submit">
                                Szukaj
                            </button>
                        </Form>
                    </Col>

                    {/* icons */}
                    <Col xs="auto" className="text-center text-sm-end">
                        <Nav>
                            {isAdmin && (
                                <Nav.Item>
                                    <Link to="/admin" className="nav-link">
                                        <FaCog style={{ color: 'red' }} size={22} />
                                    </Link>
                                </Nav.Item>
                            )}
                            <Nav.Item>
                                <Link to="/about" className="nav-link">
                                    <FaBuilding size={22} />
                                </Link>
                            </Nav.Item>

                            {isLoggedIn ? (
                                <>
                                    <Nav.Item>
                                        <Link to="/cart" className="nav-link">
                                            <FaCartPlus size={22} />
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Link to="/user-info" className="nav-link">
                                            <FaUserAlt size={22} />
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Link to="/orders" className="nav-link">
                                            <FaBox size={22} />
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <button className="btn btn-outline-danger" onClick={onLogout}>
                                            <FaSignOutAlt size={20} />
                                        </button>
                                    </Nav.Item>
                                </>
                            ) : (
                                <>
                                    <Nav.Item>
                                        <Link to="/login" className="btn btn-outline-primary me-2">
                                            <FaSignInAlt size={20} /> Login
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Link to="/register" className="btn btn-outline-secondary">
                                            <FaUserPlus size={20} /> Register
                                        </Link>
                                    </Nav.Item>
                                </>
                            )}
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SearchBar;
