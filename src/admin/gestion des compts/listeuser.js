import './userlist.css';
import { FaSearch } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authprovider';
import Popup from '../../popupvalide';
import Popuperror from '../../popuperror';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../loading/loading';
import Loading3 from '../../loading/loading3';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../../reducer';

function Listesuser() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const [filterValue, setFilterValue] = useState('all');
  const [filtertype, setFiltertype] = useState('all');

  if (!auth.user) {
    navigate('/dashbord');
  }
  if (auth.user) {
    if (auth.user.type === 'vendeur') {
      navigate('/dashbord');
    } else if (auth.user.type === 'client') {
      navigate('/');
    }
  }
  const fetchdatauser = () => {
    const apiUrl = `${api}/api/comptelistes`;
    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        
        setLoading(false);
      });
    }
  useEffect(() => {
    fetchdatauser();
  }, []);

  const filteredData = data.filter((user) => {
    const fullName = `${user.name} ${user.prenom}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterValue === 'all' ||
      (filterValue === 'autorisé' && user.état === 'autorisé') ||
      (filterValue === 'non confirmer' && user.état === 'non confirmer')||
      (filterValue === 'non autorisé' && user.état === 'non autorisé');
    const typeserch =
      filtertype === 'all' ||
      (filtertype === 'admin' && user.type === 'admin') ||
      (filtertype === 'vendeur' && user.type === 'vendeur') ||
      (filtertype === 'client' && user.type === 'client');
    return matchesSearch && matchesFilter && typeserch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  const banéuser = async (id, et) => {
    setLoading(true);
    let nv_état = '';
    et === 'autorisé' ? (nv_état = 'non autorisé') : (nv_état = 'autorisé');
    try {
      const response = await axios.put(
        `${api}/api/baneuser/${id}`,
        { nv_état: nv_état },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setRep(response.data.message);
      setLoading(false);
      setShowPopup(true);
      fetchdatauser();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          
        } else {
          setRep(error.response.data.message);
          setLoading(false);
          setShowPopupError(true);
          fetchdatauser();
        }
      } else {
        
      }
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };

 

  return (
    <div className="user-orders-containerrs">
      <div className='filters'>
        <input
          className="search_input"
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          
          onChange={(e) => setSearchTerm(e.target.value)}
        /><FaSearch className="search-icon" /> 
        <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)} className="search_input" >
          <option value="all">All Users Etat</option>
          <option value="autorisé">Authorized Users</option>
          <option value="non autorisé">Non Authorized Users</option>
          <option value="non confirmer">Non confirmer Users</option>
        </select>
        <select value={filtertype} onChange={(e) => setFiltertype(e.target.value)} className="search_input"
          style={{ width: '11%' }} >
          <option value="all">All Type</option>
          <option value="admin">admin</option>
          <option value="vendeur">vendeur</option>
          <option value="client">client</option>
        </select>
      </div>
      <ul><li>
      <Link to={`/newuser`} className="ajouter">
        Ajouter un utilisateur
      </Link>
      </li></ul>
      
      <table border="1" className='orders-list'>

        <thead>
          <tr>
            <th>id</th>
            <th id='menutel'>nom</th>
            <th id='imgtel'>prenom</th>
            
            <th id='menutel'>GSM</th>
            <th>type</th>
            <th id='menutel'>État</th>
         
            <th id='menutel'>Date Creation</th>
           
            <th id='imgtel'>modifier</th>
            <th id='imgtel'>action</th>
          </tr>
        </thead>
        <div className='lodingpromo'>{loading && <Loading3/>}</div>
        <tbody>
          {filteredData.map((e) => (
            <tr key={e.id} className={e.état === 'autorisé' ? 'autorisé' : 'nonautorisé'}>
              <td>{e.id}</td>
              <td id='menutel'>{e.name}</td>
              <td id='imgtel'>{e.prenom}</td>
              
              <td id='menutel'>{e.num_telephon}</td>
              <td>{e.type}</td>
              <td id='menutel'>{e.état}</td>
             
              <td id='menutel'>{formatDate(e.created_at)}</td>
              
              <td id='imgtel'>
               
                <Link className="modiff" to={`/updateuser/${e.id}`}>
                  Modifier
                </Link>
              </td>
              <td id='imgtel'>
              {e.état === 'autorisé' ? (
                  <button className="action-btn" onClick={() => banéuser(e.id, e.état)}>
                    Ban❌
                  </button>
                ) : e.état === 'non autorisé' ? (
                  <button className="action-btn" onClick={() => banéuser(e.id, e.état)}>
                    Cancel
                  </button>
                ) : e.état === 'non confirmer' ? (
                  <button className="action-btn" onClick={() => banéuser(e.id, e.état)}>
                    Confirmer
                  </button>
                ):''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Popup show={showPopup} onClose={handlePopupClose}>
        <p>{rep}</p>
        <button className="close-btn" onClick={handlePopupClose}>
          Close
        </button>
      </Popup>

      <Popuperror show={showPopupError} onClose={handlePopupErrorClose}>
        <p>{rep}</p>
        <button className="close-btn" onClick={handlePopupErrorClose}>
          Close
        </button>
      </Popuperror>
    </div>
  );
}

export default Listesuser;

