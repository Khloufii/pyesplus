// TopProductsList.js
import './topprod.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCar, faStar } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectExchangeRates, selectapi, selectselectedCurrency, selecttopprod, setloading } from './reducer';
import LoadingSpinner from './loading/loading';
import Loading2 from './loading/loading2';

const TopProductsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const topProducts =useSelector(selecttopprod);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);

  useEffect(() => {
    setLoading(true); 
    if(topProducts){
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
  return <LoadingSpinner/>
 }
  return (
    
      
      <div className="collectionscontainer">
        {topProducts.map((product) => (
          <div className="content" key={product.id}>
            <Link className="product-link" to={`/detailprod/${product.id}`}  onClick={hindlprod}>
            <img src={`${api}/images/${product.image}`} alt={product.image} className='imgtop'/>
            
            <p className='titrecontent'>{product.titre}</p>
          
          
            <p className='nvprixtop'>
              {exchangeRates ? ((product.nv_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : product.nv_prix}
              <span className='currency'>{selectedCurrency}</span>
            </p>
          
            {product.nbetoil && Array.from({ length: product.nbetoil }).map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                className={index < product.nbetoil.nb_etoil ? 'star-filledd' : 'star-filledd'}
              />
            ))}
            
            <p className='typep'>Plus Vendus</p>
           
            </Link>

            </div>
        ))}
      </div>
   
  );
};

export default TopProductsList;
