import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './panier.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../authprovider';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { seleclistprod, selectCurrencies, selectExchangeRates, selectIp, selectPanier, selectapi, selectprofil, selectselectedCurrency, setPanier, setnbpanier } from '../reducer';
import Loading4 from '../loading/loading4';
import Popup from '../popupvalide';
import Loading2 from '../loading/loading2';
import LoadingSpinner from '../loading/loading';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Panier = () => {
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const profil = useSelector(selectprofil);
  const auth = useAuth();
  const navigate = useNavigate();
  const exchangeRates = useSelector(selectExchangeRates);
  const selectedCurrency = useSelector(selectselectedCurrency);
 
  const produitsPanier = useSelector(selectPanier);
  const produits = useSelector(seleclistprod);
  const utilisateur = useSelector(selectprofil);
  const [chargement, setChargement] = useState(true);
  const [chargementsup, setChargementsup] = useState(0);
  const [afficherPopup, setAfficherPopup] = useState(false);
  const [reponse, setReponse] = useState('');
  const [etat, setEtat] = useState(false);
  const ip = useSelector(selectIp);
 
  useEffect(()=>{
    window.scrollTo(0, 0);
  
  },[])
  const obtenirProduitsPanier = async () => {
    try {
      setChargement(true);
      const id_utilisateur = utilisateur.id ? auth.user.id : ip;
      if(!id_utilisateur){
        setChargement(true);
      }
      else{
        const reponseProduitsPanier = await axios.get(`${api}/api/get-cart-items/${id_utilisateur}`);
        dispatch(setnbpanier(reponseProduitsPanier.data.nbpanier));
        dispatch(setPanier(reponseProduitsPanier.data.res));
      }
    } catch (erreur) {
    
    } finally {
      setChargement(false);
    }
  };
  useEffect(() => {
    obtenirProduitsPanier();
  }, []);

  const supprimerProduitDuPanier = async (idProduit) => {
    setChargementsup(idProduit);
    try {
      await axios.delete(`${api}/api/remove-item/${idProduit}`);
      const nouveauxProduitsPanier = produitsPanier.filter((produit) => produit.id !== idProduit);
      dispatch(setPanier(nouveauxProduitsPanier));
      obtenirProduitsPanier();
      setChargementsup(0);
    } catch (erreur) {
      
    }
  };

  const convertirDevise = (montant, tauxMAD, tauxDevise) => {
    if (!tauxMAD || !tauxDevise) {
      console.warn("Taux de change manquant :", { tauxMAD, tauxDevise });
      return montant; // Retourne le montant initial si les taux ne sont pas disponibles
    }
    return ((montant / tauxMAD) * tauxDevise).toFixed(2);
  };
  
  const calculerPrixTotal = () => {
    if (!Array.isArray(produitsPanier)) return 0;
    return produitsPanier.reduce((total, produit) => {
      const prixConverti = convertirDevise(produit.prix_total, exchangeRates?.MAD, exchangeRates?.[selectedCurrency]);
      return total + parseFloat(prixConverti);
    }, 0);
  };
  

  const confirmation = () => {
    if(!auth.user){
      navigate('/formulair_cmd');
    }
    else{
       setAfficherPopup(true);
    }
   
  };

  const fermerPopup = () => {
    dispatch(setnbpanier(0));
    setAfficherPopup(false);
    navigate('/commande');
  };

  const ajouterCommande = async (methodePaiement) => {
    try {
      const reponse = await axios.post(
        `${api}/api/add-commande`,
        {
          total_prix: calculerPrixTotal(),
          status: 'en attente',
          client_id: auth.user ? auth.user.id : null,
          payment_method: methodePaiement,
          articles_panier: produitsPanier,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (reponse.data) {
        supprimerTousLesProduitsDuPanier(); // Supprimer tous les articles du panier
        dispatch(setnbpanier(0));
        setEtat(true);
        setReponse('Commande ajoutée avec succès ! Vous paierez à la livraison.');
      }
    } catch (erreur) {
    }
  };

  const supprimerTousLesProduitsDuPanier = async () => {
    setChargement(true);
    try {
      await axios.delete(`${api}/api/remove-all-item/${utilisateur.id}`);
      dispatch(setPanier([]));
      setChargement(false);
    } catch (erreur) {
      
    }
  };

  const modifier = () => {
    navigate('/profil');
  };
 
  return (
    <>
      <div className="cart-container">
        <h2>Panier</h2>
        {chargement ? (
          <LoadingSpinner/>
        ) : !Array.isArray(produitsPanier) || produitsPanier.length === 0 ? (
          <p>Votre panier est vide</p>
        ) : (
          <>
            <ul>
              {produitsPanier.map((produit) => {
                const produitDetail = produits.find((prod) => prod.id === produit.produit_id);
                if (produitDetail && produitDetail.quantité >= 1) {
                  return (
                    <li key={produit.id} className="cart-item">
                      <div className="cart-item-details">
                        <h3>{produitDetail.titre}</h3>
                        <Link className="product-link" to={`/detailprod/${produitDetail.id}`}>
                          <img src={`${api}/images/${produitDetail.image}`} alt={produitDetail.image} />
                        </Link>
                      </div>
                      <div className="cart-item-info">
                        <p>Quantité : {produit.quantité} | Coleur : {produit.color} | Taill : {produit.taill}</p>
                        
                        <p className='prixorig'>
  Prix d'origine :{' '}
  {convertirDevise(produitDetail.nv_prix * produit.quantité, exchangeRates?.MAD, exchangeRates?.[selectedCurrency])}{' '}
  {selectedCurrency}
  + Prix Livraison{' '}
  {convertirDevise(produitDetail.prix_livraison, exchangeRates?.MAD, exchangeRates?.[selectedCurrency])}{' '}
  {selectedCurrency}
</p>
<h5 className='prixred'>
  Prix réduit :{' '}
  {convertirDevise(produit.prix_total, exchangeRates?.MAD, exchangeRates?.[selectedCurrency])}{' '}
  {selectedCurrency}
</h5>


                        <button onClick={() => supprimerProduitDuPanier(produit.id)}>{chargementsup == produit.id ? <><FontAwesomeIcon icon={faSpinner} spin /> chargement...</> : 'Supprimer'}</button>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
            <div className="cart-total">
              <p>Prix total de tous les articles : {calculerPrixTotal()} {selectedCurrency}</p>
              <button onClick={() => confirmation()}>Passer la commande</button>
            </div>
          </>
        )}
        <Popup show={afficherPopup} onClose={fermerPopup}>
          <p>{reponse}</p>
          {etat ? (
            <button className="close-btn" onClick={fermerPopup}>Fermer</button>
          ) : (
            <>
              <p>Votre numéro de téléphone : {utilisateur.num_telephon} ?</p>
              <p>Votre adresse : {utilisateur.adress} ?</p>
              <Link className="product-linknew" to={`/profil/commande`}>
                <button className="close-btn">Modifier</button>
              </Link>
              <button onClick={() => ajouterCommande('à la livraison')}>Valider</button>
            </>
          )}
        </Popup>
      </div>
    </>
  );
};

export default Panier;
