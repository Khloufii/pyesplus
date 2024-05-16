import './newproducts.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from './loading/loading';
import { selecavis, seleclistprod, selectExchangeRates, selectapi, selectselectedCurrency, setloading } from './reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faMotorcycle, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const Allproduct = () => {
    const dispatch = useDispatch();
    const api = useSelector(selectapi);
    const data = useSelector(seleclistprod);
    const avis = useSelector(selecavis);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const selectedCurrency = useSelector(selectselectedCurrency);
    const exchangeRates = useSelector(selectExchangeRates);
    const filteredData = useSelector(seleclistprod);

    useEffect(() => {
        setLoading(true); 
        if(filteredData){
          setLoading(false); 
        }
        
        // Mettre le loading à true au début du chargement
        // Votre logique pour charger les données ici
        // Une fois les données chargées, mettez setLoading(false) pour cacher le spinner
    }, []); // Assurez-vous de mettre les dépendances appropriées
    const hindlprod = () => {
        window.scrollTo(0, 0);
        setLoading(true);
        // Simuler un chargement pendant 1 seconde
        setTimeout(() => {
          setLoading(false);
        }, 1000);
       
    
      };
      if (!Array.isArray(filteredData) || filteredData.length === 0) {
        return null;
      }
    return (
        <>
            <h1 className="main-title">Nouveautés et Offres Spéciales</h1>
            {loading ? ( // Afficher le spinner si loading est true
                <LoadingSpinner />
            ) : (
                <div className="produits-container" id="produitsContainerRef">
                    {filteredData.map((product) => {
                        const nbetoil = avis.find((et) => et.id === product.id);
                        return (
                            <div key={product.id} className='produit-card'>
                               
                               <Link className="product-link" to={`/detailprod/${product.id}`}  onClick={hindlprod} >

                                    <img className="product-image" src={`${api}/images/${product.image}`} alt={product.image} />
                                    <h5 className="product-title">{product.titre}</h5>
                                    <p className='productpricenew'>{exchangeRates ? ((product.nv_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : product.nv_prix}<span className='devise'>{selectedCurrency}</span> <span style={{ color: 'red',fontSize:'7px' }}>{product.quantité === 0 ? 'Qte : 0' : ''}</span></p>
                                    <p className='star-filled'>
                                        {nbetoil && Array.from({ length: nbetoil.nbetoile }).map((_, index) => (
                                            <FontAwesomeIcon
                                                key={index}
                                                icon={faStar}
                                                className={index < nbetoil.nb_etoil ? 'star-filled' : 'star-filled'}
                                                style={{ color: 'orange' }}
                                            />
                                        ))}
                                    </p>
                                    <p className='livraison'><FontAwesomeIcon
                                                
                                                icon={faCar}
                                                className=''
                                               
                                            />{product.etat_livraison === 1 ? 'Livraison Gratuit' : `Livraison ${product.prix_livraison} MAD`}
                                            </p>
                                </Link>
                             
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    );
};

export default Allproduct;
