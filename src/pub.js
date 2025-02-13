import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './loading/loading';
import { selectapi, selectnewprod } from './reducer';
import './pub.css';

const AdBar = () => {
  const navigate = useNavigate();
  const api = useSelector(selectapi);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const products = useSelector(selectnewprod);
  const [loading, setLoading] = useState(true);

  const latestProducts = products.slice(0, 8); // Limite à 8 produits

  useEffect(() => {
    setLoading(true);
    if (products) {
      setLoading(false);
    }
  }, [products]);

  // Changement automatique de produit toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % latestProducts.length);
    }, 5000);

    return () => clearInterval(interval); // Nettoyage du timer
  }, [latestProducts.length]);

  const handlePointClick = (index) => {
    setCurrentAdIndex(index); // Permet de changer manuellement
  };

  const handleProductClick = (id) => {
    navigate(`/detailprod/${id}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <div className="ad-bar-container">
      <div className="ad-bar">
        {latestProducts.map((ad, index) => (
          <div key={index} className={`ad-item ${index === currentAdIndex ? 'active' : ''}`}>
            <div className="info">
              <span className="infopub">{ad.titre}</span>
              <span className="infopub2">{ad.nv_prix} MAD</span>
              <button onClick={() => handleProductClick(ad.id)} className="shoppub">
                <FontAwesomeIcon icon={faShoppingCart} /> Profiter
              </button>
            </div>
            {ad.promotion ? (
                ad.pourcentagepromo ? (
                  <span className="sppourcentag">-{ad.pourcentagepromo}%</span>
                ) : ''
              ) : (
                <span className="sppourcentag">NEW</span>
              )}
            <img className="product-image-new" src={`${api}/images/${ad.image}`} alt={ad.image} />
          </div>
        ))}
        <div className="navigation-points">
  {latestProducts.map((ad, index) => (
    <span
      key={index}
      className={`navigation-point ${index === currentAdIndex ? 'active' : ''}`}
      onClick={() => handlePointClick(index)}
    />
  ))}
</div>

      </div>

      
    </div>
  );
};

export default AdBar;
