// Importer les dépendances et composants nécessaires
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './pub.css'; // Importer le fichier CSS
import { useDispatch,useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './loading/loading';
import { selectapi, selectnewprod } from './reducer';
import Loading2 from './loading/loading2';
// Nouveau composant AdBar
const AdBar = () => {
  const navigate = useNavigate();
  const api = useSelector(selectapi);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const products = useSelector(selectnewprod);
  const [loading, setLoading] = useState(true);
  const [aficher, setaficher] = useState(false);
  const latestProducts = products.slice(0, 8);

  useEffect(() => {
    setLoading(true); 
    if(products){
      setLoading(false); 
    }
    
    // Mettre le loading à true au début du chargement
    // Votre logique pour charger les données ici
    // Une fois les données chargées, mettez setLoading(false) pour cacher le spinner
}, []); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % latestProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [latestProducts.length]);

  const handlePointClick = (index) => {
    setCurrentAdIndex(index);
  };
  const hindlprod = (id) => {
    navigate(`/detailprod/${id}`);  // Replace with your actual route
    window.scrollTo(0, 0);
  };
  const handlePrev = () => {
    setCurrentAdIndex((prevIndex) =>
      prevIndex === 0 ? latestProducts.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentAdIndex((prevIndex) =>
      prevIndex === latestProducts.length - 1 ? 0 : prevIndex + 1
    );
  };
  if(loading){
    return <LoadingSpinner/>
  }
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }
  return (
    <div className="ad-bar-container">
    
     <img className='imgpub' src={`${process.env.PUBLIC_URL}/imgpub1.png`} alt='PYES-PLUS E-COM'/> 
      <button className="arrow left-arrow" onClick={handlePrev}>
  &#10094;
</button>
<button className="arrow right-arrow" onClick={handleNext}>
  &#10095;
</button>

      <div className="ad-bar" style={{ '--currentAdIndex': currentAdIndex }}>
       
        
        {latestProducts.map((ad, index) => (
          <div
            key={index}
            className={`ad-item ${index === currentAdIndex ? 'active' : ''}`}
          >
            <div className="info">
              <span className="infopub">{ad.titre}</span>
              <span className="infopub2">{ad.nv_prix} MAD</span>
              <button onClick={() => hindlprod(ad.id)} className='shoppub'>
  <FontAwesomeIcon icon={faShoppingCart} /> Profiter
</button>


            </div>
            <div>
            {ad.promotion?(
            ad.pourcentagepromo?(
              <span className='sppourcentag'>-{ad.pourcentagepromo}%</span>
            ):'')     
          :(<span className='sppourcentag'>NEW</span>)}
            <img
              className="product-image-new"
              src={`${api}/images/${ad.image}`}
              alt={ad.image}
            />
            </div>
          </div>
        ))}
      </div>
     
      
      <div className="navigation-points">
        {latestProducts.map((ad, index) => (
          <span
            key={index}
            className={`navigation-point ${
              index === currentAdIndex ? 'active' : ''
            }`}
            onClick={() => handlePointClick(index)}
          />
        ))}
      </div>
      <div className='pupliv'>
      <p className='pay1'>Livraison Par Touts Au Maroc</p>
     <p className='pay2'>Payement A La Livraison</p>
     </div>
    
    </div>
  );
};

export default AdBar;
