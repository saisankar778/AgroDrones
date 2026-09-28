'use client';

import React from 'react';

import Link from 'next/link';
import './page.css';

const OrderSuccessPage = () => {
 

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        
        <h1>Thank You for Your Order!</h1>
        <p className="success-message">
          Your order has been received and is being processed.
        </p>
        
        <p className="email-notification">
          A confirmation email has been sent to your email address.
        </p>
        
        <div className="action-buttons">
          <Link href="/products" className="primary-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
