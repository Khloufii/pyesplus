import './detailcommande.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSpinner, faThumbsUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../loading/loading';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../reducer';
const DetailCommande = () => {
  const api = useSelector(selectapi);
  const { id , client_id} = useParams();
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [donnees, setDonnees] = useState([]);
  const [client, setClient] = useState({});
  const [infoCommande, setInfoCommande] = useState({});

  useEffect(() => {
    const fetchDataClient = async () => {
      try {
        const response = await axios.get(`${api}/api/showuser/${client_id}`);
        setClient(response.data.user);
        setChargement(false);
      } catch (erreur) {
       
        setChargement(false);
      }
    };

    fetchDataClient();
  }, [id]);

  const fetchProduits = () => {
    axios
    .get(`${api}/api/allproduit`)
    .then((response) => {
      setDonnees(response.data);
      setChargement(false);
    })
    .catch((erreur) => {
     
      setChargement(false);
    });
  }

  useEffect(() => {
   fetchProduits();
  }, []);

  const fetchDetailCommande = () => {
    axios
    .get(`${api}/api/detailcommande/${id}`)
    .then((response) => {
      setProduits(response.data.detaill);
      setInfoCommande(response.data.commande);
      setChargement(false);
    })
    .catch((erreur) => {
 
      setChargement(false);
    });
  }

  useEffect(() => {
    fetchDetailCommande();
  }, [id]);

  const changerStatut = async (idCommande, nouveauStatut) => {
    setChargement(true);
    const messageConfirmation = `Es-tu sûr de vouloir changer le statut de la commande #${idCommande} à "${nouveauStatut}" ?`;
    if (window.confirm(messageConfirmation)) {
      try {
        await axios.put(`${api}/api/changerstatutcmd/${idCommande}`,{ newStatus: nouveauStatut });
        setChargement(false);
        alert('status bien changer');
        fetchDetailCommande();
      } catch (erreur) {
        
      }
    }
  };
  const changerStatutcmd = async (orderId, newStatus) => {
    setChargement(true);
    const confirmationMessage = `Tu es sûr de vouloir changer le statut de la commande #${orderId} à "${newStatus}"?`;
    if (window.confirm(confirmationMessage)) {
      try {
        await axios.put(`${api}/api/changerstatut/${orderId}`, { newStatus });
        fetchDetailCommande();
        setChargement(false);
        alert('status bien changer');
      } catch (error) {
        
      }
    }
  };
 
  if(chargement){
    return <LoadingSpinner/>;
  }

  return (
    <div className="conteneur-detail-commande">
        <button id='imprim' className='bouton-imprimer' onClick={()=> {window.print();}}>Imprimer</button>
        <button id='imprim' className="bttnn" onClick={() => changerStatutcmd(infoCommande.id, 'Confirmed')}>
                        <FontAwesomeIcon icon={faCheck} />Confirmer
                      </button>
                      <button id='imprim' className="bttnn-cancel" onClick={() => changerStatutcmd(infoCommande.id, 'Anuller')}>
                        <FontAwesomeIcon icon={faTimes} />Annuler
                      </button>
                      <button id='imprim' className="bttnn-received" onClick={() => changerStatutcmd(infoCommande.id, 'Received')}>
                        <FontAwesomeIcon icon={faThumbsUp} />Reçu
                      </button>
        <ul className="liste-commandes">
          <p> ID COMMANDE :<b> {id} </b><span>Status : {infoCommande.status}</span></p>
          <p> CLIENT :<b> {client.name} {client.prenom}</b></p>
          <p> GSM : <b>{client.num_telephon}</b> </p>
          <p> ADRESSE :<b> {client.adress}</b> </p>
          <p> DATE COMMANDE :<b> {infoCommande.created_at}</b> </p>
          <p className='prix-total'> PRIX TOTAL :<b> {infoCommande.total_prix} MAD</b> </p>
          {Array.isArray(produits) ? (
            produits.map((item, index) => {
              const donneesProduit = donnees.find((e) => e.id === item.produit_id);

              return (
                <li key={index} className="element-commande" data-status={item.status}>
                  <h4>ID : {item.id}</h4> 
                  <p className={item.status}>Statut: {item.status}</p>
                  {donneesProduit && (
                    <>
                      <h2 className="titre-produit">{donneesProduit.titre}</h2>
                      <img
                        src={`${api}/images/${donneesProduit.image}`}
                        alt={donneesProduit.image}
                        className="image-produit"
                      />
                      <p className="quantite-produit">Quantité: {item.quantité}</p>
                      <p className="prix-produit">{donneesProduit.nv_prix} MAD</p>
                      <h4 className="prix-total">{item.total_prix} MAD</h4>
                    </>
                  )}
                  
                  <button id='imprim' className="bouton-confirmer" onClick={() => changerStatut(item.id, 'Confirmer_Par_Admin')}>
                        Confirmer
                      </button>
                  <button id='imprim' className="bouton-annuler" onClick={() => changerStatut(item.id, 'Anuller_Par_Admin')}>
                    Annuler
                  </button>
                  <button id='imprim' className="bouton-reception" onClick={() => changerStatut(item.id, 'Reçu_Par_Admin')}>
                    Reçu
                  </button>
                  <p>______________________________________________</p>
                </li>
                
              );
            })
          ) : (
            <p>Données de produit invalides reçues du serveur.</p>
          )}
        </ul>
      
    </div>
  );
};

export default DetailCommande;
