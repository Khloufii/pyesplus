import './newproducts.css';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectExchangeRates, selectapi, selectnewprod, selectselectedCurrency, setloading } from './reducer';
import LoadingSpinner from './loading/loading';

const Newproducts = () => {
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const newProducts = useSelector(selectnewprod);
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
  const sellerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (newProducts) {
      setLoading(false);
      // Défilement automatique inversé
      if (sellerRef.current) {
        sellerRef.current.scrollLeft = sellerRef.current.scrollWidth;
      }
    }
  }, [newProducts]);

  const handleScroll = (event) => {
    event.preventDefault();
    sellerRef.current.scrollLeft -= event.deltaY; // Défilement inversé (gauche)
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!Array.isArray(newProducts) || newProducts.length === 0) {
    return null;
  }

  return (
    <div className='new-products-container'>
      <h2 className='h2new'>New Products</h2>
      <section id="sellers" className="scroll-container" onWheel={handleScroll}>
        <div ref={sellerRef} className="seller-container">
          {newProducts.map(product => (
            <div key={product.id} className="best-seller">
              <a className="product-linknew" href={`/detailprod/${product.id}`}>
                <img className="product-imagenew" src={`${api}/images/${product.image}`} alt={product.image} />
                <p className='titretop'>{product.titre}</p>
                <p className='prixtop'>
                  {exchangeRates ? ((product.nv_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : product.nv_prix}
                  <span className='currency'>{selectedCurrency}</span>
                </p>
              </a>
              <span className='symbol-new'>New</span>
            </div>
          ))}
        </div>
      </section>
      <a className="voirplus" href={`/newproduct`}>Voir Plus --</a>
    </div>
  );
};

export default Newproducts;
