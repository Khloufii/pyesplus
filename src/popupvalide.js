// Popup.js

import React from 'react';
import './popup.css';

function Popup({ show, onClose, children }) {
  return (
    <div className={`popup ${show ? 'show' : ''}`}>
      <div className="popup-content">
       
        <img className='imgpopup' src={`${process.env.PUBLIC_URL}/popup2.jpg`} alt="popup" />
        
        {children}

      </div>
    </div>
  );
}

export default Popup;
