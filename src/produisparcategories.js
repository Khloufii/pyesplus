// TopProductsList.js
import './productscateg.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCar, faStar } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectExchangeRates, selectapi, selectcatecorie_id, selectselectedCurrency, setloading } from './reducer';
import LoadingSpinner from './loading/loading';

const Productscategorie = (props) => {
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [avis, setAvis] = useState([]);
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
  const categori_id = useSelector(selectcatecorie_id);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/productscategories/${categori_id}`);
        setProducts(response.data.prod);
        setAvis(response.data.avis);
        setLoading(false);
      } catch (error) {
       
      }
    };
    useEffect(() => {
    fetchData();
  }, [categori_id]);
  const hindlprod = () => {
    dispatch(setloading(true));
    window.scrollTo(0, 0);
    dispatch(setloading(false));
  };
  if (loading) {
    return <LoadingSpinner/>; // You can customize the loading indicator
  }
  return (
    <section id="collectionns">
      <h1 className='mmhh1'>MEME CATEGORIE</h1>
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
    </section>
  );
};

export default Productscategorie;
