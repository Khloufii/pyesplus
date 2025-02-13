// TopProductsList.js
import './productsnew.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCar, faStar } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectExchangeRates, selectapi, selectnewprod, selectselectedCurrency, setloading } from './reducer';
import LoadingSpinner from './loading/loading';
import Allproduct from './allproduct';
import Accueil from './accueil';

const NewProductsList = () => {
  const navigate = useNavigate();
  const api = useSelector(selectapi);
  const neworoduct =useSelector(selectnewprod);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true); 
    if(neworoduct){
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
  if (!Array.isArray(neworoduct) || neworoduct.length === 0) {
    return null;
  }
  return (
    <>
   
    <div className="collectionspromo containerrnew">
      
      {loading && <LoadingSpinner/>}
   
        {neworoduct.map((product) => (
          <div className="contentpromo" key={product.id}>
             <a className="product-link" href={`/detailprod/${product.id}`}  >
            {product.promotion?(<span className='promo'>-{product.pourcentagepromo}%</span>):''}
            <img src={`${api}/images/${product.image}`} alt={product.image} className='imgnew'/>
            <h1 className='titrecontentpromo'>{product.titre}</h1>
            <p className='oldprixpromo'>
              {exchangeRates ? ((product.old_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : product.old_prix}
               <span className='currencynew'>{selectedCurrency}</span>
            </p>
            <p className='nvprixpromo'>
              {exchangeRates ? ((product.nv_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : product.nv_prix}
              <span className='currencynew'>{selectedCurrency}</span>
            </p>
          
            
            </a>
            

            </div>
        ))}
       
      </div>
      <Accueil/>
      </>
  );
};

export default NewProductsList;
