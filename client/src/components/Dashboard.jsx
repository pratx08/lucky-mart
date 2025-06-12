import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import Navbar from './Navbar';

import '../styles/Dashboard.css';

const getPriceForBox = (boxNumber) => {
  if (boxNumber >= 1 && boxNumber <= 4) return 30;
  if (boxNumber >= 5 && boxNumber <= 9) return 50;
  if (boxNumber >= 10 && boxNumber <= 13) return 20;
  if (boxNumber >= 14 && boxNumber <= 26) return 10;
  if (boxNumber >= 27 && boxNumber <= 39) return 5;
  if (boxNumber >= 40 && boxNumber <= 47) return 2;
  return 1;
};


const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [todayCounts, setTodayCounts] = useState({});
  const [yesterdayCounts] = useState(() => {
    const data = {};
    for (let i = 1; i <= 49; i++) {
      data[i] = Math.floor(Math.random() * 100); // fake yesterday data
    }
    return data;
  });
  const [totalSales, setTotalSales] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const inputRefs = useRef([]);

  const handleInputChange = (boxNumber, value) => {
    setTodayCounts((prev) => ({ ...prev, [boxNumber]: value }));
  };

  const handleSetLotteryNumbers = () => {
    localStorage.setItem('lotteryCounts', JSON.stringify(todayCounts));
    alert('Lottery numbers for today have been saved.');
  };

  const calculateTotalSales = () => {
    let total = 0;
    for (let i = 1; i <= 49; i++) {
      const yesterday = Number(yesterdayCounts[i]) || 0;
      const today = Number(todayCounts[i]) || 0;
      const sold = yesterday - today;
      const price = getPriceForBox(i);
      total += sold * price;
    }
    setTotalSales(total);
    setShowModal(true);
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-main">
        <div className="box-grid">
          {Array.from({ length: 49 }, (_, i) => {
            const boxNumber = i + 1;
            const price = getPriceForBox(boxNumber);
            return (
              <div className="lottery-box" key={boxNumber}>
                <div className="box-header">
                  <div className="box-circle">{boxNumber}</div>
                  <div className="price-circle">${price}</div>
                  <div className="yesterday-count">{yesterdayCounts[boxNumber]}</div>
                </div>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="box-input"
                  value={todayCounts[boxNumber] || ''}
                  onChange={(e) => handleInputChange(boxNumber, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const nextIndex = i + 1;
                      if (nextIndex < 49) {
                        inputRefs.current[nextIndex]?.focus();
                      } else {
                        calculateTotalSales();
                      }
                    }
                  }}
                  ref={(el) => (inputRefs.current[i] = el)}
                />
              </div>
            );
          })}
        </div>

        <div className="button-row">
          {user?.role === 'admin' ? (
            <button className="calculate-button" onClick={handleSetLotteryNumbers}>
              Set Lottery Numbers
            </button>
          ) : (
            <button className="calculate-button" onClick={calculateTotalSales}>
              Calculate Sales
            </button>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h1>Lucky Mart</h1>
              <p>{new Date().toLocaleString()}</p>
              <h4>Total Sales</h4>
              <p>${totalSales}</p>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
