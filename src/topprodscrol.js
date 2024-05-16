// Newproducts.js
import './newproducts.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faStar } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectExchangeRates, selectapi, selectselectedCurrency, selecttopprod, setloading } from './reducer';
import LoadingSpinner from './loading/loading';

const Topprodscrol = () => {
  const api = useSelector(selectapi);
  const topProducts = useSelector(selecttopprod);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const sellerRef = useRef(null);
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
 const dispatch = useDispatch();
 
  useEffect(() => {
    setLoading(true); 
    if(topProducts){
      setLoading(false); 
    }
    
    // Mettre le loading à true au début du chargement
    // Votre logique pour charger les données ici
    // Une fois les données chargées, mettez setLoading(false) pour cacher le spinner
}, []); 
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleScroll = () => {
    const container = sellerRef.current;

    if (container) {
      const scrollBottom = container.scrollHeight - container.scrollTop === container.clientHeight;

      if (scrollBottom) {
        // Charger plus de produits ici
      }
    }
  };

  const hindlprod = () => {
    dispatch(setloading(true));
    window.scrollTo(0, 0);
    dispatch(setloading(false));
  };

  if(loading){
    return <LoadingSpinner/>
  }
  if (!Array.isArray(topProducts) || topProducts.length === 0) {
    return null;
  }
  return (
    <div className='new-products-containerhovered'>
      <h2 className='h2new'>Top Produits</h2>
      <section id="sellers" className="scroll-container">
        <div
          className={`seller-container ${isHovered ? 'paused' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onScroll={handleScroll}
          ref={sellerRef}
        >
          
          <div ref={sellerRef} className="sellertop">
            {topProducts.map(product => (
              <div key={product.id} className="best-seller">
                <div className="top-p1">
                  <Link className="product-linknew" to={`/detailprod/${product.id}`}  onClick={hindlprod}>
                    <img className="product-imagenew" src={`${api}/images/${product.image}`} alt={product.image} />
                  </Link>
                  <span className='symbol-top'>Top</span>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Topprodscrol;
