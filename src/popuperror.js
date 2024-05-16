// Popup.js

import React from 'react';
import './popup.css';

function Popuperror({ show, onClose, children }) {
  return (
    <div className={`popup ${show ? 'show' : ''}`}>
      <div className="popup-content">
        <span className="close-btn" onClick={onClose}>
        <img className='imgpopup' src={`${process.env.PUBLIC_URL}/error.jfif`} alt="popup" />
        </span>
        {children}

      </div>
    </div>
  );
}

export default Popuperror;
