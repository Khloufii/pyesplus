import './detailcommade.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../authprovider';
import LoadingSpinner from '../loading/loading';
import { useDispatch, useSelector } from 'react-redux';
import { selectapi, selectprofil } from '../reducer';
const DetailCommandeVendeur = () => {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const profil = useSelector(selectprofil);
  const [produit, setProduit] = useState({});
  const [chargement, setChargement] = useState(true);
  const [commande, setCommande] = useState({});
  const [client, setClient] = useState({});
  const { id } = useParams();
  
  const prix = produit.nv_prix * commande.quantité;

  const fetchDetailCommande = async () => {
    try {
      const response = await axios.get(`${api}/api/detailcmdvendeur/${id}`);
      setProduit(response.data.produit);
      setCommande(response.data.commandes);
      setClient(response.data.client);
      setChargement(false);
    } catch (erreur) {
      
    }
  };

  useEffect(() => {
    fetchDetailCommande();
  }, [id]);

  const changerStatut = async (idCommande, nouveauStatut) => {
    setChargement(true);
    const messageConfirmation = `Es-tu sûr de vouloir changer le statut de la commande #${idCommande} à "${nouveauStatut}" ?`;
    if (window.confirm(messageConfirmation)) {
      try {
        await axios.put(`${api}/api/changerstatutcmd/${idCommande}`, { newStatus: nouveauStatut });
        setChargement(false);
        fetchDetailCommande();
      } catch (erreur) {
       
      }
    }
  };
  if (profil.état !== 'autorisé') {
    return null;
  }
  return (
    <div className="conteneur-detail-commande-vendeur">
       
        <ul className="liste-commandes">
          
          {chargement && <LoadingSpinner/>}
          <li  className="lidetaill" data-status={commande.status}>
          <button id='imprim' className='bouton-imprimer' onClick={()=> {window.print();}}>Imprimer</button>
            <p className={commande.status}>Statut: {commande.status}</p>
            <p className=''>Date Commande: {commande.created_at}</p>
            <p>CLIENT : <b className='client-cmd'>{client.name} {client.prenom}</b></p>
            <p>GSM :  <b className='client-cmd'>{client.num_telephon}</b> </p>
            <p>ADRESSE :  <b className='client-cmd'>{client.adress}</b> </p>
            <h5>ID Prod : {produit.id} <br/> ID Commande : {commande.id}</h5>
            <h2 className="titre-produit">{produit.titre} <span>{produit.description}</span></h2>
            <img
              src={`${api}/images/${produit.image}`}
              alt={produit.image}
              className="image-produit"
            />
            <p className="quantite-produit">Quantité: {commande.quantité} | Coleur : {commande.color} | Taill : {commande.taill}</p>
            <h4 className="prix-total">{prix} MAD</h4>
            <h6 className='prix-produitt'>{produit.nv_prix} MAD  par /1</h6>
            <p>Prix Vendre <span >{commande.total_prix} MAD</span></p>
            
            <button id='imprim' className="bouton-confirmer" onClick={() => changerStatut(commande.id, 'Confirmer_Par_Vendeur')}>Confirmer</button>
            <button id='imprim' className="bouton-annuler" onClick={() => changerStatut(commande.id, 'Anuller_Par_Vendeur')}>Annuler</button>
            <button id='imprim' className="bouton-reception" onClick={() => changerStatut(commande.id, 'Reçu_Par_Vendeur')}>Reçu</button>
          </li>
        </ul>
    </div>
  );
};

export default DetailCommandeVendeur;
