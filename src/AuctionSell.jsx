import React, { useState } from 'react';
import axios from 'axios';
import './AuctionSell.css';

const AuctionSell = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    basePrice: '',
    seller: localStorage.getItem('username') || '',
    contactNo: '',
    auctionDate: '',
    startTime: '',
    endTime: '',
    district: '',
    state: '',
    pincode: '',
    productSpecifications: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auctions', formData);
      alert('Auction submitted successfully');
      setFormData({
        name: '',
        image: '',
        basePrice: '',
        seller: localStorage.getItem('username') || '',
        contactNo: '',
        auctionDate: '',
        startTime: '',
        endTime: '',
        district: '',
        state: '',
        pincode: '',
        productSpecifications: ''
      });
    } catch (error) {
      console.error('Error submitting auction', error);
    }
  };

  return (
    <div className="auction-sell-container">
      <h1>Create Auction</h1>
      <form className="auction-sell-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input className="auction-sell-input" name="name" placeholder="Product Name" onChange={handleChange} value={formData.name} required />
          <input className="auction-sell-input" name="image" placeholder="Image URL" onChange={handleChange} value={formData.image} required />
        </div>
        <div className="form-row">
          <input className="auction-sell-input" name="basePrice" placeholder="Base Price" type="number" onChange={handleChange} value={formData.basePrice} required />
          <input className="auction-sell-input" name="contactNo" placeholder="Contact No" onChange={handleChange} value={formData.contactNo} required />
        </div>
        <div className="form-row">
          <input className="auction-sell-input" name="auctionDate" type="date" onChange={handleChange} value={formData.auctionDate} required />
          <input className="auction-sell-input" name="startTime" type="time" onChange={handleChange} value={formData.startTime} required />
        </div>
        <div className="form-row">
          <input className="auction-sell-input" name="endTime" type="time" onChange={handleChange} value={formData.endTime} required />
          <input className="auction-sell-input" name="district" placeholder="District" onChange={handleChange} value={formData.district} required />
        </div>
        <div className="form-row">
          <input className="auction-sell-input" name="state" placeholder="State" onChange={handleChange} value={formData.state} required />
          <input className="auction-sell-input" name="pincode" placeholder="Pincode" type="number" onChange={handleChange} value={formData.pincode} required />
        </div>
        <textarea className="auction-sell-textarea" name="productSpecifications" placeholder="Product Specifications" onChange={handleChange} value={formData.productSpecifications} required></textarea>
        <button className="auction-sell-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AuctionSell;
