import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Product {
  asin: string;
  image: string;
  title: string;
  price: string;
  rating: string;
  availability: string;
  description?: string;
  features?: string[];
  images?: string[];
}

const AffiliateProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('http://localhost:3001/api/products/fetch');
        setProducts(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load products. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  const toggleReadMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const description = button.closest('.product-description');
    const truncated = description?.querySelector('.truncated') as HTMLElement;
    const fullText = description?.querySelector('.full-text') as HTMLElement;

    if (truncated?.style.display === 'none') {
      truncated.style.display = '-webkit-box';
      fullText.style.display = 'none';
      button.textContent = 'Read More';
    } else {
      truncated.style.display = 'none';
      fullText.style.display = 'block';
      button.textContent = 'Read Less';
    }
  };

  const generateAffiliateLink = (asin: string): string => {
    return `https://www.amazon.in/dp/${asin}?tag=chella09-21&linkCode=ll1`;
  };

  return (
    <div className="affiliate-products">
      <header>
        <div className="header-container">
          <h1 className="header-title">Top Products for You</h1>
        </div>
      </header>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div className="container">
        {products.map((product, index) => (
          <div className="product" key={index}>
            <div className="product-title">
              <h2>{product.title}</h2>
            </div>

            <div className="product-image">
              <img src={product.image} alt={product.title} />
            </div>

            {/* {product.images && product.images.length > 1 && (
              <div className="product-gallery">
                {product.images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt={`Additional image ${i + 1}`} style={{ width: '100px', margin: '5px' }} />
                ))}
              </div>
            )} */}

            <div className="product-description">
              {/* <p className="truncated">{product.description || 'No description available.'}</p>
              <p className="full-text" style={{ display: 'none' }}>{product.description}</p>
              <button className="read-more" onClick={toggleReadMore}>Read More</button> */}
              <div className="product-meta">
                <p style={{ fontSize: '1.2rem', color: '#2e8b57', fontWeight: 'bold' }}>{product.price || '₹--'}</p>
                <p style={{ fontSize: '1rem', color: '#444' }}>{product.rating || 'No ratings yet'}</p>
                <p style={{ fontSize: '0.95rem', color: '#888' }}>{product.availability || 'Checking availability...'}</p>
              </div>

              {/* {product.features && (
                <ul className="product-features">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              )} */}
            </div>

            <div className="product-button">
              <button>
                <a
                  href={generateAffiliateLink(product.asin)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy Now on Amazon
                </a>
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer>
        <p>&copy; 2024 My Affiliate Site. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AffiliateProducts;
