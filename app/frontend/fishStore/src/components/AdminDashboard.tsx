import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Brand {
    name: string;
}

interface Type {
    title:string;
}

const AdminDashboard = () => {
    // set the initial states
    const [activeTab, setActiveTab] = useState('product');

    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState<number>(0);  
    const [quantity, setQuantity] = useState<number>(0); 
    const [photo, setPhoto] = useState<File | null >(null);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [availableBrands, setAvailableBrands] = useState<Brand[]>([]);
    const [brandName, setBrandName] = useState('');  
    const [avaibleTypes, setAvaibleTypes] = useState<Type[]>([]); 
    const [typeName, setTypeName] = useState('');  
    const [error, setError] = useState<string | null>(null); // Error state


    const fetchBrands = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/brand/get', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAvailableBrands(response.data); 
        } catch (error) {
            setError("Error fetching brands");
        }
    };


    const fetchTypes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/types/get', {

            });
            setAvaibleTypes(response.data);
        } catch (error) {
            setError("Error fetching types");
        }
    }


    useEffect(() => {
        setError(null);
        if (activeTab === 'product'){
            fetchBrands();
            fetchTypes();
        }


    }, [activeTab]);


    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("name", productName);
        formData.append("price", price.toString());
        formData.append("quantity", quantity.toString());
        formData.append("brandName", selectedBrand || "");
        formData.append("typeName", typeName || "");

        if (photo) {
            formData.append("photo", photo);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/product/create', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProductName('');
            setPrice(0);
            setQuantity(0);
            setPhoto(null);
            setSelectedBrand('');
            setTypeName('');
            alert('Product added successfully!');

        } catch (error:any) {
            setError(error.response?.data || "Product already exist");
        }
    };


    const handleAddBrand = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/brand/create', {
                name: brandName,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBrandName('');
            alert('Brand added successfully!');
        } catch (error:any) {
            setError(error.response?.data || "Brand already exist");
        }
    };

    
    const handleAddType = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/types/create', {
                title: typeName,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTypeName('');
            alert('Type added successfully!');
        } catch (error:any) {
            setError(error.response?.data || "Type already exist");
        }
    };

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin area.</p>

            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'product' ? 'active' : ''}`} onClick={() => setActiveTab('product')}>Product</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'brand' ? 'active' : ''}`} onClick={() => setActiveTab('brand')}>Brand</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'type' ? 'active' : ''}`} onClick={() => setActiveTab('type')}>Type</button>
                </li>
            </ul>

            <div className="mt-4">
            {error && <div className="alert alert-danger">{error}</div>} 
                {/* product tab */}
                {activeTab === 'product' && (
                    <form onSubmit={handleAddProduct}>
                        <div className="form-group">
                        <label  className="form-label">Product name:</label>

                            <input
                                type="text"
                                className="form-control"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Product Name"
                                required
                            />
                        </div>
                        <div className="form-group">
                        <label  className="form-label">Price:</label>

                            <input
                                type="number"
                                className="form-control"
                                value={price}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    if (!isNaN(value) && value >= 0) {
                                        setPrice(value);
                                    } else if (e.target.value === "") {
                                        setPrice(0); 
                                    }
                                }}                                
                                placeholder="Price"
                                required
                            />
                        </div>
                        <div className="form-group">
                        <label  className="form-label">Quantity:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={quantity}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    if (!isNaN(value) && value >= 0) {
                                        setQuantity(value);
                                    } else if (e.target.value === "") {
                                        setQuantity(0); 
                                    }
                                }}        

                                placeholder="Quantity"
                                required
                            />
                        </div>

                        <div className="form-group">
                        <label  className="form-label">Brand:</label>

                            <select
                                className="form-control"
                                value={selectedBrand}
                                onChange={(e) => {
                                    setSelectedBrand(e.target.value)
                                    }}
                            >
                                <option value="">Select Brand (Optional)</option>
                                {availableBrands.map((brand) => (
                                    <option key={brand.name} value={brand.name}>{brand.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                        <label  className="form-label">Type:</label>
                            <select
                                className="form-control"
                                value={typeName}
                                onChange={(e) => {
                                    setTypeName(e.target.value)
                                    }}
                            >
                                <option value="">Select Type (Optional)</option>
                                {avaibleTypes.map((type) => (
                                    <option key={type.title} value={type.title}>{type.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                        <label  className="form-label">Photo:</label>
                        <input
                                type="file"
                                className='form-control'
                                accept ="image/*"
                                onChange={(e) => setPhoto(e.target.files && e.target.files[0] ? e.target.files[0]:null)}
                                placeholder="Photo Name"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">Add Product</button>
                    </form>
                )}
               {activeTab === 'brand' && (
                    <form onSubmit={handleAddBrand}>
                        <div className="form-group">
                            <input type="text" className="form-control" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Brand Name" required />
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">Add Brand</button>
                    </form>
                )}

                {activeTab === 'type' && (
                    <form onSubmit={handleAddType}>
                        <div className="form-group">
                            <input type="text" className="form-control" value={typeName} onChange={(e) => setTypeName(e.target.value)} placeholder="Type Name" required />
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">Add type</button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
