// LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container" role="alert" aria-busy="true">
      <div className="loading-ring" aria-label="Chargement en cours"></div>
    </div>
  );
};

export default LoadingSpinner;