import './topprod.css';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectExchangeRates, selectapi, selectselectedCurrency, selecttopprod, setloading } from './reducer';
import LoadingSpinner from './loading/loading';

const Topprodscrol = () => {
  const api = useSelector(selectapi);
  const topProducts = useSelector(selecttopprod);
  const [loading, setLoading] = useState(true);
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
  const dispatch = useDispatch();
  const sellerRef = useRef(null);

  useEffect(() => {
    if (topProducts) {
      setLoading(false);
    }
  }, [topProducts]);

  const handleScroll = (event) => {
    event.preventDefault();
    sellerRef.current.scrollLeft += event.deltaY;
  };

  const hindlprod = () => {
    dispatch(setloading(true));
    window.scrollTo(0, 0);
    dispatch(setloading(false));
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!Array.isArray(topProducts) || topProducts.length === 0) {
    return null;
  }

  return (
    <div className='new-products-container'>
      <h2 className='h2new'>best-seller</h2>
      <section id="sellers" className="scroll-container" onWheel={handleScroll}>
        <div ref={sellerRef} className="seller-container">
          {topProducts.map(product => (
            <div key={product.id} className="best-seller">
              <a className="product-linknew" href={`/detailprod/${product.id}`}>
                <img className="product-imagenew" src={`${api}/images/${product.image}`} alt={product.image} />
                <p className='titretop'>{product.titre}</p>
                <p className='prixtop'>
                  {exchangeRates ? ((product.nv_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : product.nv_prix}
                  <span className='currency'>{selectedCurrency}</span>
                </p>
              </a>
              <span className='symbol-top'>Top</span>
            </div>
          ))}
        </div>
      </section>
      <a className="voirplus" href={`/plusvendu`}>Voir Plus --</a>
    </div>
  );
};

export default Topprodscrol;
