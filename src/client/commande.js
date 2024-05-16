import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../authprovider';
import { Link } from 'react-router-dom';
import './commandee.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Loading2 from '../loading/loading2';
import Loading3 from '../loading/loading3';
import { useDispatch, useSelector } from 'react-redux';
import { selectapi, selectprofil } from '../reducer';

const CommandesUtilisateur = () => {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const profil = useSelector(selectprofil);
  const navigate = useNavigate();
  const [commandesUtilisateur, setCommandesUtilisateur] = useState([]);
 
  const [chargement, setChargement] = useState(true);
  const [client_id, setclient_id] = useState(auth.user && auth.user.id);

  useEffect(() => {
    if (!auth.user) {
      navigate('/');
    } else {
      setclient_id(auth.user.id);
    }
  }, [auth.user, navigate]);

  useEffect(() => {
    const obtenirCommandesUtilisateur = async () => {
      try {
        setChargement(true);
        const reponse = await axios.get(`${api}/api/user-orders/${client_id}`);
        setCommandesUtilisateur(reponse.data.orders);
      } catch (erreur) {
      } finally {
        setChargement(false);
      }
    };

    if (client_id) {
      obtenirCommandesUtilisateur();
    }
  }, [client_id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
  };
  if (profil.état !== 'autorisé') {
    return null;
  }
  return (
    <div className="user-orders-container">
      <h2 className="orders-headerr">Vos Commandes</h2>
      {chargement ? (
        <Loading3 />
      ) : commandesUtilisateur.length === 0 ? (
        <p>Aucune commande trouvée</p>
      ) : (
        <div className="orders-list">
 {commandesUtilisateur.map((commande) => (
  <div key={commande.id} className="order-card">
    <Link to={`/detailcommande/${commande.id}/${commande.total_prix}`} className="detail-link">
    <div className='divcmd'>

    <div className="order-info">
        {commande.details.map((detail) => (
          <div key={detail.id} className="product-infodet">
            <img
              src={`${api}/images/${detail.produit.image}`}
              alt={detail.produit.image}
              className="image-produitdet"
            />
            {/* Afficher d'autres informations sur le produit si nécessaire */}
          </div>
        ))}
      </div>
      <div className="order-info">
        <div>
          <strong>ID Commande :</strong> {commande.id}
        </div>
        <div>
          <strong>Prix Total :</strong> {commande.total_prix} MAD
        </div>
        <div>
          <strong>Statut :</strong> {commande.status}
        </div>
       
        <div>
          <strong>Date Commande :</strong> {formatDate(commande.created_at)}
        </div>
      </div>
      </div>
    </Link>
    <div className="order-action"></div>
  </div>
))}



        </div>
      )}
    </div>
  );
};

export default CommandesUtilisateur;
