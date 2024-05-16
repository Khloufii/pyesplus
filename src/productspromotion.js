// TopProductsList.js
import './productspromo.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCar, faStar } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectExchangeRates, selectapi, selectpromoprod, selectselectedCurrency, setloading } from './reducer';
import LoadingSpinner from './loading/loading';

const PromoProductsList = () => {
  const api = useSelector(selectapi);
  const navigate = useNavigate();
  const PromoProducts = useSelector(selectpromoprod);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
 const dispatch = useDispatch();
 
  useEffect(() => {
    setLoading(true); 
    if(PromoProducts){
      setLoading(false); 
    }
    
    // Mettre le loading à true au début du chargement
    // Votre logique pour charger les données ici
    // Une fois les données chargées, mettez setLoading(false) pour cacher le spinner
}, []);
  

  const hindlprod = (id) => {
    navigate(`/detailprod/${id}`);  // Replace with your actual route
    dispatch(setloading(true));
    window.scrollTo(0, 0);
    dispatch(setloading(false));
  };
  if(loading){
    return <LoadingSpinner/>;
  }
  if (!Array.isArray(PromoProducts) || PromoProducts.length === 0) {
    return null;
  }
  return (
 <>
      
     <h1 className='promotionh1'>PROMOTION</h1>
      <div className="collectionspromo containerr">
        
        {PromoProducts.map((product) => (
           <div className="contentpromo" key={product.id}>
          <Link className="product-link" to={`/detailprod/${product.id}`}  onClick={hindlprod} >
         
            <span className='promo'>-{product.pourcentagepromo}%</span>
            
            <img src={`${api}/images/${product.image}`} alt={product.image} className='imgpromo'/>
            
            <p className='titrecontentpromo'>{product.titre}</p>
            
            <p className='oldprixpromo'>
              {exchangeRates ? ((product.old_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : product.old_prix}
               <span className='currencypromo'>{selectedCurrency}</span>
            </p>
            <p className='nvprixpromo'>
              {exchangeRates ? ((product.nv_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : product.nv_prix}
              <span className='currencypromo'>{selectedCurrency}</span>
            </p>
            <p>
            {product.nbetoil && Array.from({ length: product.nbetoil }).map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                className={index < product.nbetoil.nb_etoil ? 'star-filled' : ''}
                style={{ color: 'orange' }}
              />
            ))}</p>
            
           
               </Link> 
            </div>
          
        ))}
      </div>
      </>
  );
};

export default PromoProductsList;
