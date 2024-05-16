import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../authprovider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../loading/loading';
import { useDispatch, useSelector } from 'react-redux';
import { selectapi, selectprofil, setprofil } from '../reducer';
const VendeurOrders = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const profil = useSelector(selectprofil);
  const [allcommande, setallcommande] = useState([]);
  const [comande, setcomande] = useState([]);
  const [produits, setproduits] = useState([]);
  const [client, setclient] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');  // Add this line
  const [statusFilter, setStatusFilter] = useState('');  
  const [idUser, setIdUser] = useState(auth.user?.id ?? null);
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`${api}/api/allcommande`);
        setcomande(response.data.all);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []); // Empty dependency array

  useEffect(() => {
    const apiUrl = `${api}/api/comptelistes`;

    axios
      .get(apiUrl)
      .then((response) => {
        setclient(response.data);
      })
      .catch((error) => {
      
      });
  }, []); // Empty dependency array

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch produits
        const produitsResponse = await axios.get(`${api}/api/allproduit`);
        setproduits(produitsResponse.data);
  
        // Fetch vendeur orders
        const currentVendeurId = auth.user && auth.user.id;
        if (currentVendeurId) {
          const ordersResponse = await axios.get(`${api}/api/produitcommande/${currentVendeurId}`);
  
          const filteredOrders = ordersResponse.data.commandes.filter((order) => {
            const cmd = comande.find((pr) => pr.id === order.commande_id);
            const cl = client.find((c) => c.id === cmd.client_id);
  
            const filterCondition =
              order.id.toString().includes(searchInput) ||
              order.commande_id.toString().includes(searchInput) ||
              order.status.toLowerCase().includes(searchInput.toLowerCase()) ||
              (cl && `${cl.name} ${cl.prenom}`.toLowerCase().includes(searchInput.toLowerCase())) &&
              (statusFilter === '' || order.status.toLowerCase().includes(statusFilter.toLowerCase()));
  
            return filterCondition;
          });
  
          setallcommande(filteredOrders);
        }
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [auth.user, searchInput, statusFilter]);
  
  
  // Dependencies on auth.user, searchInput, and statusFilter
   // Dependency on auth.user

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };
  const sortedCommandes = allcommande.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const getStatusColor = (status) => {
    switch (status) {
      case 'encour':
        return '#4CAF90'; // Bleu
      case 'Anuller_Par_Client':
        return '#FF0000'; // Rose
      case 'Reçu_Par_Client':
        return '#2196F3'; // Jaune
      case 'Confirmer_Par_Vendeur':
        return '#FFEB3B'; // Turquoise
      case 'Confirmer_Par_Admin':
        return '#FF9800'; // Bleu foncé
      case 'Anuller_Par_Vendeur':
        return '#FF0539'; // Violet
      case 'Anuller_Par_Admin':
        return '#757575'; // Violet foncé
      case 'Reçu_Par_Vendeur':
        return '#00FF00'; // Orange
      // Ajoutez d'autres cas pour d'autres statuts
      default:
        return '#FFFFFF'; // Couleur par défaut
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${api}/api/showuser/${idUser}`);
     
      setLoading(false);
      dispatch(setprofil(response.data.user));
    } catch (error) {
    
      setLoading(false);
    }
  };
  useEffect(() => {
    if (idUser) {
      fetchData();
    }
  }, [idUser]);
  if (profil.état !== 'autorisé') {
    return null;
  }
  return (
    <div className="user-orders-containerrs">
      <div className="search-filter-container">
  <input
    type="text"
    placeholder="Search by client, CMD ID, status..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    className="search_input"
  />


</div>

      <h2 className="orders-header">Touts Les Commandes</h2>
      {loading ? (
         <LoadingSpinner/>
      ) : allcommande.length === 0 ? (
        <p className="loading-messagee">
          
        <span className="loading-symbol">
          aucun commande
 </span> 
      </p>
      ) : (
        <table className="orders-listt">
          <thead>
            <tr className="table-header">
              <th>ID</th>
              <th id='menutel'>Client</th>
              <th id='menutel'>GSM</th>
              <th id='imgtel'>Titre</th>
              <th id='menutel'>CMD</th>
              <th id='menutel'>Quantité</th>
              <th id='imgtel'>Status</th>
              <th id='menutel'>Date Commande</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {sortedCommandes.map((order, index) => {
            const produit = produits.find((produit) => produit.id === order.produit_id);
            const cmd = comande.find((pr) => pr.id === order.commande_id);
            const cl = client.find((c) => c.id === cmd.client_id);
            return (
              <tr key={index} className="order-item" data-status={order.status}
              style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {produit && (
                  <>
                    <td className="order-info">{order.id}</td>
                    <td className="order-info" id='menutel'>{cl.name} {cl.prenom}</td>
                    <td className="order-info" id='menutel'>{cl.num_telephon}</td>
                    <td className="order-info" id='imgtel'>{produit.titre}</td>
                    <td className="order-info" id='menutel'>{order.commande_id}</td>
                    <td className="order-info" id='menutel'>{order.quantité}</td>
                    <td className="order-info" id='imgtel'>{order.status}</td>
                    <td className="order-info" id='menutel'>{formatDate(order.created_at)}</td>
                    <td>
                      <div className="btnn-container">
                        <Link to={`/detailcommandevendeur/${order.id}`} className="arrow-symbol">
                          Detail..
                        </Link>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
        </table>
      )}
    </div>
  );
};

export default VendeurOrders;