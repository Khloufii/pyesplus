import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../reducer';
const DetailProduit = () => {
  const api = useSelector(selectapi);
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [donnees, setDonnees] = useState([]);
  const { id, total_prix } = useParams();

  useEffect(() => {
    axios
      .get(`${api}/api/allproduit`)
      .then((reponse) => {
        setDonnees(reponse.data);
        setChargement(false);
      })
      .catch((erreur) => {

        setChargement(false);
      });
  }, []);

 
    const obtenirDetailProduit = async () => {
      try {
        const reponse = await axios.get(`${api}/api/detailcommande/${id}`);
        setProduits(reponse.data.detaill);
      } catch (erreur) {
    
      } finally {
        setChargement(false);
      }
    };
    useEffect(() => {
    obtenirDetailProduit();
  }, [id]);

  const changerStatut = async (idCommande, nouveauStatut) => {
    setChargement(true);
    const messageConfirmation = `Es-tu sûr de vouloir changer le statut de la commande #${idCommande} à "${nouveauStatut}" ?`;
    if (window.confirm(messageConfirmation)) {
      try {
        await axios.put(`${api}/api/changerstatutcmd/${idCommande}`,{ newStatus: nouveauStatut });
        setChargement(false);
        alert('status bien changer');
        obtenirDetailProduit();
      } catch (erreur) {
       
      }
    }
  };
 

  return (
    <div className="conteneur-detail-produit">
      {chargement ? (
        <p className="message-chargement">
          <span className="symbole-chargement">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />Chargement...
          </span>
        </p>
      ) : (
        <ul className="liste-commandes">
          <p className="">ID COMMANDE : <b>{id}</b> </p>
          <p className="">PRIX TOTAL : <b>{total_prix} MAD</b></p>
          {Array.isArray(produits) ? (
            produits.map((element, index) => {
              const donneesProduit = donnees.find((e) => e.id === element.produit_id);

              return (
                <li key={index} className="element-commande" data-status={element.status}>
                  <p className={element.status}>Statut : {element.status}</p>
                  
                  {donneesProduit && (
                    <>
                      <h2 className="titre-produit">{donneesProduit.titre}</h2>
                      <Link className="" to={`/detailprod/${donneesProduit.id}`} >
                      <img
                        src={`${api}/images/${donneesProduit.image}`}
                        alt={donneesProduit.image}
                        className="image-produit"
                      />
                      </Link>
                      <h4 className="prix-original">Prix Original : {donneesProduit.nv_prix * element.quantité} MAD</h4>
                      <h5 className="prix-vendre">Prix Vendre : {element.total_prix} MAD</h5>
                    </>
                  )}
                  <p className="quantite-produit">Quantité : {element.quantité} | Coleur : {element.color} | Taill : {element.taill} </p>
                  {element.status === 'Confirmer Par Admin' ? '' : element.status === 'Confirmed Par Vendeur' ? '' : (
                  <button className="bouton-annuler" onClick={() => changerStatut(element.id, 'Anuller_Par_Client')}>
                    Annuler
                  </button>
                  )}
                  <button className="bouton-reception" onClick={() => changerStatut(element.id, 'Reçu_Par_Client')}>
                    Reçu
                  </button>
                </li>
              );
            })
          ) : (
            <p>Données du produit invalides reçues du serveur.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default DetailProduit;
