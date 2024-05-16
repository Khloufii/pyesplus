// TopProductsList.js
import './productscateg.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCar, faStar } from '@fortawesome/free-solid-svg-icons';
import Accueil from './accueil';
import { useDispatch, useSelector } from 'react-redux';
import { selectExchangeRates, selectapi, selectselectedCurrency, setcategorieselect } from './reducer';
import LoadingSpinner from './loading/loading';


const Productsrechercher = () => {
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [avis, setAvis] = useState([]);
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/productssercher/${id}`);
        setProducts(response.data.prod);
        setAvis(response.data.avis);
        setLoading(false);
      } catch (error) {
        
      }
    };
    
    fetchData();
    dispatch(setcategorieselect(0));
  }, [id]);
  const hindlprod = () => {
   // Replace with your actual route
  
    window.scrollTo(0, 0);
  
  };
  if (loading) {
    return <LoadingSpinner/>; // You can customize the loading indicator
  }
  
  return (
    <>
    
      <h1 className='mmhh1'>Products Rechercher</h1>
      <div className="collections container-categ">
        {products == [] && <p>aucun resultat</p>}
        {products.map((product) => {
          const nbetoil = avis.find((et) => et.id === product.id);

          return (
            <div className="content-categ" key={product.id}>
               <Link className="product-link" to={`/detailprod/${product.id}`}  onClick={hindlprod}>
              <img src={`${api}/images/${product.image}`} alt={product.image} className='imgcateg'/>
              
            
              <h1 className='titrecontentcateg'>{product.titre}</h1>
              
               
              
                <p className='prixnew'>
                {exchangeRates ? ((product.nv_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : product.nv_prix} {selectedCurrency} 
</p>

          
             
              </Link>
            </div>
          );
        })}
      </div>
   
    <Accueil/>
    </>
  );
};

export default Productsrechercher;
