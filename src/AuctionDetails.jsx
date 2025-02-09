import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AuctionDetails.css'; // Import the CSS file

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([]);
  const [highestBid, setHighestBid] = useState(null);
  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);

  useEffect(() => {
    fetchAuctionDetails();
    fetchBids();
  }, []);

  useEffect(() => {
    if (auction) {
      const interval = setInterval(() => {
        const startTime = new Date(`${auction.auctionDate}T${auction.startTime}`);
        const endTime = new Date(`${auction.auctionDate}T${auction.endTime}`);
        const now = new Date();
        
        if (now < startTime) {
          setTimer(`Auction starts in: ${formatTimeLeft(startTime - now)}`);
        } else if (now >= startTime && now < endTime) {
          setAuctionStarted(true);
          setTimer(`Auction ends in: ${formatTimeLeft(endTime - now)}`);
        } else {
          setAuctionEnded(true);
          setTimer('Auction ended');
          clearInterval(interval);
          determineWinner();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [auction]);

  // New useEffect to refresh bids every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBids();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auctions/${id}`);
      setAuction(response.data);
    } catch (error) {
      console.error('Error fetching auction details', error);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auctions/${id}/bids`);
      const fetchedBids = response.data.reverse(); // Reverse to show latest bids on top
      setBids(fetchedBids);
      setHighestBid(fetchedBids.length ? fetchedBids[0] : null);
    } catch (error) {
      console.error('Error fetching bids', error);
      setError('Error fetching bids');
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const startTime = new Date(`${auction.auctionDate}T${auction.startTime}`);
    const endTime = new Date(`${auction.auctionDate}T${auction.endTime}`);

    if (now < startTime) {
      setError('Bidding cannot start before the auction start time.');
      return;
    }

    if (now > endTime) {
      setError('Bidding has ended.');
      return;
    }

    if (bidAmount <= auction.basePrice) {
      setError('Bid amount must be greater than the base price.');
      return;
    }

    if (highestBid && bidAmount <= highestBid.amount) {
      setError('Bid amount must be greater than the previous highest bid.');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/auctions/${id}/bid`, {
        amount: bidAmount,
        username: localStorage.getItem('username'),
      });
      setSuccess('Bid submitted successfully');
      fetchBids(); // Fetch updated bids
      setError('');
      setBidAmount('');
    } catch (error) {
      console.error('Error submitting bid', error);
      setError('Failed to submit bid.');
    }
  };

  const determineWinner = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auctions/${id}/winner`);
      setWinner(response.data);
    } catch (error) {
      console.error('Error determining winner', error);
    }
  };

  const formatTimeLeft = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    auction && (
      <div className="auction-details-container">
        <div className="auction-details">
          <div className="auction-details-left">
            <div className="auction-image">
              <img src={auction.image} alt={auction.name} />
            </div>
            <div className="product-details">
              <h1>{auction.name}</h1>
              <div className="detail-item"><strong>Base Price:</strong> {auction.basePrice}</div>
              <div className="detail-item"><strong>Seller:</strong> {auction.seller}</div>
              <div className="detail-item"><strong>Auction Date:</strong> {auction.auctionDate}</div>
              <div className="detail-item"><strong>Start Time:</strong> {auction.startTime}</div>
              <div className="detail-item"><strong>End Time:</strong> {auction.endTime}</div>
              <div className="detail-item"><strong>Address:</strong> {auction.district}, {auction.state}, {auction.pincode}</div>
            </div>
          </div>
          <div className="auction-details-right">
            <div className="timer">
              <p>{timer}</p>
            </div>
            {auctionStarted && !auctionEnded && (
              <div className="auction-details-form">
                <form onSubmit={handleBidSubmit}>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid"
                    required
                  />
                  <button type="submit">Submit Bid</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
              </div>
            )}
            {winner && <p className="winner">Winner: {winner}</p>}
            <div className="bids-list">
              <h2>Bids:</h2>
              {bids.map((bid, index) => (
                <div key={index} className={`bid-item ${index === 0 ? 'latest-bid' : ''}`}>
                  <p>{bid.username}: {bid.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AuctionDetails;
