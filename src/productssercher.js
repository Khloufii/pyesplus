// TopProductsList.js
import './productscateg.css';
import React, { useState, useEffect,useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCar, faStar } from '@fortawesome/free-solid-svg-icons';
import Accueil from './accueil';
import { useDispatch, useSelector } from 'react-redux';
import { selectExchangeRates, selectapi, selectselectedCurrency, setcategorieselect } from './reducer';
import LoadingSpinner from './loading/loading';
import AdBar from './pub';


const Productsrechercher = () => {
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
    const { type,id } = useParams();
    const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [avis, setAvis] = useState([]);
  const topRef = useRef(null);
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
  useEffect(() => {
   window.scroll(0,0);
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/productssercher/${type}/${id}`);
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
      {products.length === 0 && <p className='aucun'>aucun resultat</p>}
   <AdBar back='linear-gradient(112deg, rgba(177, 133, 231, 0.46) 0%, rgba(177, 133, 231, 0.46) 14.286%,rgba(183, 112, 233, 0.46) 14.286%, rgba(183, 112, 233, 0.46) 28.572%,rgba(188, 90, 234, 0.46) 28.572%, rgba(188, 90, 234, 0.46) 42.858%,rgba(194, 69, 236, 0.46) 42.858%, rgba(194, 69, 236, 0.46) 57.144%,rgba(199, 48, 238, 0.46) 57.144%, rgba(199, 48, 238, 0.46) 71.43%,rgba(205, 26, 239, 0.46) 71.43%, rgba(205, 26, 239, 0.46) 85.716%,rgba(210, 5, 241, 0.46) 85.716%, rgba(210, 5, 241, 0.46) 100.002%),linear-gradient(157deg, rgb(73, 186, 245) 0%, rgb(73, 186, 245) 14.286%,rgb(64, 170, 226) 14.286%, rgb(64, 170, 226) 28.572%,rgb(55, 154, 206) 28.572%, rgb(55, 154, 206) 42.858%,rgb(46, 138, 187) 42.858%, rgb(46, 138, 187) 57.144%,rgb(37, 121, 168) 57.144%, rgb(37, 121, 168) 71.43%,rgb(28, 105, 148) 71.43%, rgb(28, 105, 148) 85.716%,rgb(19, 89, 129) 85.716%, rgb(19, 89, 129) 100.002%)'/>
    <Accueil/>
    </>
  );
};

export default Productsrechercher;
 