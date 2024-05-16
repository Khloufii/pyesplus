import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from './popupvalide';
import { Link } from 'react-router-dom';
import Popuperror from './popuperror';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authprovider';
import './profil.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import UserMenu from './UserMenu';
import LoadingSpinner from './loading/loading';
import { useDispatch, useSelector } from 'react-redux';
import { selectapi, selectprofil, setprofil } from './reducer';
function Profil() {
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const auth = useAuth();
  const profil = useSelector(selectprofil);
  const [user, setUser] = useState({});
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    prenom: '',
    email: '',
    num_telephon: '',
    type: '',
    état: '',
    adress: '',
  });
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idUser, setIdUser] = useState(auth.user?.id ?? null);
  const [showMenu, setShowMenu] = React.useState(false);
  const navigate = useNavigate();

  if (!auth.user) {
    navigate('/dashbord');
  }

  useEffect(() => {
    setIdUser(auth.user && auth.user.id);
  }, [auth.user]);

  useEffect(() => {
    if (idUser) {
      fetchData();
    }
  }, [idUser]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${api}/api/showuser/${idUser}`);
      setUser(response.data);
      setFormData({
        name: response.data.user.name,
        prenom: response.data.user.prenom,
        email: response.data.user.email,
        num_telephon: response.data.user.num_telephon,
        type: response.data.user.type,
        état: response.data.user.état,
        adress: response.data.user.adress,
      });
      setLoading(false);
      dispatch(setprofil(response.data.user));
    } catch (error) {
    
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoading(false);
    auth.logout();
    
    navigate('/login/n');
    window.location.reload();
    
  };

  const updateuser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${api}/api/updateuser/${idUser}`,formData, {
        headers: {
          'Content-Type': 'application/json', // Utilisation de 'application/json' pour les données JSON
        },
      });

      setRep(response.data.message);
      setShowPopup(true);
      setLoading(false);
      fetchData();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          
        } else {
          setRep(error.response.data.message);
          setShowPopupError(true);
          setLoading(false);
        }
      } 
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if(id === 'comande'){
      navigate('/panier');
    }
    
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='profile-container'>
      <UserMenu username={auth.user.name} />
      <button className="logout-button" onClick={handleLogout}>
        Déconnexion
      </button>
      <form onSubmit={updateuser} method="POST" className='profill'>
        <Link className="linkprofil" to={`/userpassword`}>
          Modifier Password
        </Link>
        <label>User Name:</label>
        <input type="text" value={formData.name ?? ''} name="name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} className='inputuser' />
        <br /><br />

        <label>User Prenom:</label>
        <input type="text" name="prenom" value={formData.prenom ?? ''} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} className='inputuser' />
        <br /><br />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email ?? ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className='inputuser' />
        <br /><br />

        <label>Num Telephone:</label>
        <input type="number" name="num_telephon" value={formData.num_telephon ?? ''} onChange={(e) => setFormData({ ...formData, num_telephon: e.target.value })} className='inputuser' />
        <br /><br />
        <label>Adress:</label>
        <input type="text" name="adress" value={formData.adress ?? ''} onChange={(e) => setFormData({ ...formData, adress: e.target.value })} className='inputuser' />
        <br /><br />
        <label>Type:</label>
        <p className='pp'>{formData.type}</p>

        <label>Etat:</label>
        <p className='pp'>{formData.état}</p>

        <button type="submit">Update User</button>
      </form>

      <Popup show={showPopup} onClose={handlePopupClose}>
        <p>User updated successfully!</p>
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

export default Profil;
