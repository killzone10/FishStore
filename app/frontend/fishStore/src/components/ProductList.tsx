import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/utility';

interface Brand {
  name: string;
}

interface Type {
  title: string;
  parent?: { title: string } | null; 
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  type: Type;
  brand: Brand;
  photo: string;
}

interface ProductListProps {
    type?:string;
}


const ProductList: React.FC<ProductListProps> = ({type}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState('');

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const productsPerPage = 20;
    

    useEffect (() => {
        const fetchProducts = async () => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/type/${type || 'all'}?page=${currentPage}&size=${productsPerPage}`
              );
              setProducts(response.data.content);
              setTotalPages(response.data.totalPages); 
            }
            catch (error:any){
                setError(error);
                setProducts([]);
                setTotalPages(1);
            }
        };
        fetchProducts();
    }, [type, currentPage]);

    const handlePageChange  = (page:number) => {
      setCurrentPage(page); 

    }

  return (
    <div className="product-list-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {type ? `${type} Products` : 'All Products'}
      </h2>
      
      <div className="product-grid">
        {products.map((product, index) => (
          <Link 
          key = {product.id}
          to={`/products/${product.id}`}
          style={{ textDecoration: 'none', color:"black"}}
          >
            <div key={index} className="product-card">
              <img
                src={getImageUrl(product.photo)}
                alt={product.name}
                className ="product-image"
              />
              <div>
                <h4>{product.name}</h4>
                <p className="description">
                  {product.description && product.description.length > 60
                    ? `${product.description.substring(0, 60)}...`
                    : product.description}
                </p>
              </div>
              <div className="details">
                <p>
                  <strong>Price:</strong> ${product.price.toFixed(2)}
                </p>
                {product.type && (
                  <p>
                    <strong>Type:</strong> {product.type.title}
                  </p>
                )}
                {product.brand && (
                  <p>
                    <strong>Brand:</strong> {product.brand.name}
                  </p>
                )}

              </div>
            </div>
          </Link>

        ))}
      </div>

      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={`pagination-button ${currentPage === index ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProductList;