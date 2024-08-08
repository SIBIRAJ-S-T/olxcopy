import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auction.css';

const Auction = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auctions');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const handleSellClick = () => {
    navigate('/auction-sell');
  };

  const handleImageClick = (productId) => {
    navigate(`/auction-details/${productId}`);
  };

  return (
    <div className="auction-container">
      <h1>Products in Auction</h1>
      <button className="auction-button" onClick={handleSellClick}>Sell</button>
      <div className="auction-products">
        {products.map(product => (
          <div className="auction-product" key={product.id} onClick={() => handleImageClick(product.id)}>
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <p>{product.auctionDate} {product.startTime}</p>
            <p>Base Price: {product.basePrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Auction;
