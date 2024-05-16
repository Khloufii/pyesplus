// Newproducts.js
import './newproducts.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from './loading/loading';
import Topprodscrol from './topprodscrol';
import { selectExchangeRates, selectapi, selectnewprod, selectselectedCurrency, setloading } from './reducer';

const Newproducts = () => {
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const neworoduct =useSelector(selectnewprod);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const sellerRef = useRef(null);
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
  useEffect(() => {
    setLoading(true); 
    if(neworoduct){
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
 if (!Array.isArray(neworoduct) || neworoduct.length === 0) {
  return null;
}
  return (
    <div className='new-products-containerhovered'>
      <h2 className='h2new'>New Produits</h2>
      <section id="sellers" className="scroll-container">
        <div
          className={`seller-container ${isHovered ? 'paused' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onScroll={handleScroll}
          ref={sellerRef}
        >
          
          <div className="seller">
            {neworoduct.map((product, index) => (
              <div key={product.id} className="best-seller">
                <div className="top-p1">
                  <Link className="product-linknew" to={`/detailprod/${product.id}`}  onClick={hindlprod}>
                    <img className="product-imagenew" src={`${api}/images/${product.image}`} alt={product.image} />
                  </Link>
                  <span className='symbol-new'>New</span>
                </div>
              </div>
            ))}
           
          </div>
        </div>
      </section>
    </div>
  );
};

export default Newproducts;
