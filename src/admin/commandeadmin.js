import './commande.css';
import { FaSearch } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../authprovider';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../loading/loading';
import Loading3 from '../loading/loading3';
import Loading4 from '../loading/loading4';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../reducer';

const AdminOrders = () => {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const navigate = useNavigate();
  const [allcommande, setAllCommande] = useState([]);
  const [loading, setLoading] = useState(true);
  const [client_id, setClient_id] = useState(auth.user && auth.user.id);
  const [clientInfo, setClientInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  if(auth.user && auth.user.type === 'vendeur' || !auth.user){
    navigate('/');
  }
  useEffect(() => {
    setClient_id(auth.user && auth.user.id);
  }, [auth.user]);

    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`${api}/api/allcommande`);
        setAllCommande(response.data.all);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    fetchUserOrders();
  }, [client_id]);

  useEffect(() => {
    const apiUrl = `${api}/api/comptelistes`;

    axios
      .get(apiUrl)
      .then((response) => {
        setClientInfo(response.data || []);
        setLoading(false);
      })
      .catch((error) => {
        
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

 

// Filter orders based on search term and status
const filteredOrders = allcommande.filter((order) => {
  const client = clientInfo.find((e) => e && e.id === order.client_id);

  const matchesSearch =
    order.client_id.toString().includes(searchTerm) ||
    order.id.toString().includes(searchTerm) ||
    (client && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client && client.prenom.toLowerCase().includes(searchTerm.toLowerCase()));

  const matchesStatus = statusFilter === '' || order.status.toLowerCase() === statusFilter.toLowerCase();

  return matchesSearch && matchesStatus;
});

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffcc00'; // Yellow
      case 'Confirmed':
        return '#00cc66'; // Green
      case 'Anuller':
        return '#FF5000'; // Blue
      // Add more cases for other statuses
      default:
        return '#ffffff'; // Default color
    }
  };

  

  return (
    <div className="user-orders-containerrs">
      <h2 className="orders-header">All Orders</h2>
      <div className="filters">
        <input
          className="search_input"
          type="text"
          placeholder="Search by client name, ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />        <FaSearch className="search-icon" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="search_input">
          <option value="">Filter by Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Anuller">Anuller</option>
          <option value="Received">Received</option>
        </select>
      </div>
     
        <table className="orders-list">
          <thead>
            <tr className="">
              <th> ID</th>
              <th id='menutel'>Nom</th>
              <th>Prenom</th>
              <th id='menutel'>Total Price</th>
              <th id='imgtel'>Status</th>
              <th id='menutel'>Payment Method</th>
              <th id='imgtel'>Date Commande</th>
              <th id='imgtel'>Action</th>
            </tr>
          </thead>
          <div className='lodingpromo'>{loading && <Loading3/>}</div>
          <tbody>
            {filteredOrders.map((order) => {
              const client = clientInfo.find((e) => e && e.id === order.client_id);
              if (!client) {
                // If clientInfo is null or the client is not found, handle accordingly
                return null;
              }

              return (
                <tr key={order.id} className="" data-status={order.status} 
                style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  <td className="">{order.id}</td>
                  <td className="" id='menutel'>{client.name || ''}</td>
                  <td className="">{client.prenom || ''}</td>
                  <td className="" id='menutel'>{order.total_prix} MAD</td>
                  <td className="" id='imgtel'>{order.status}</td>
                  <td className="" id='menutel'>{order.payment_method}</td>
                  <td className="" id='imgtel'>{formatDate(order.created_at)}</td>
                  <td id='imgtel'>
                    <div className="btnn-containerr">
                     
                      <Link to={`/detailcommandeadmin/${order.id}/${order.client_id}`} className="arrow-symboll">
                        ...
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      
    </div>
  );
};

export default AdminOrders;
