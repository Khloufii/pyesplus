import'../../profil.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../../popupvalide';
import Popuperror from '../../popuperror';
import { useAuth } from '../../authprovider';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../loading/loading';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../../reducer';
function UpdatePassword() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rep, setRep] = useState('');
  const [iduser, setiduser] = useState(auth.user && auth.user.id);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
  useEffect(() => {
setiduser(auth.user && auth.user.id);
   
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/showuser/${id}`);
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password === confirmPassword) {
      try {
        const response = await axios.put(`${api}/api/updateuserpass/${id}`, { password }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setRep(response.data.message);
        setShowPopup(true);
        setLoading(false);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            console.log(error.status);
          } else {
            setRep(error.response.data.message);
            setShowPopupError(true);
            setLoading(false);
          }
        } else {
          
        }
      }
    } else {
        setShowPopupError(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate(-1);
  };
  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };
  if (loading) {
    return <LoadingSpinner/>;
  }
  return (
    <div>
      
      <form onSubmit={updatePassword} method="POST" className='profill'>
        <p className='pp'>{`Mr(s): ${user.name} ${user.prenom}`}</p>
        <label>Nouveau mot de passe :</label>
        <input type="password" value={password} name="password" onChange={(e) => setPassword(e.target.value)} />
        <br /><br />

        <label>Confirmer le mot de passe :</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <br /><br />

        <button type="submit">Mettre à jour le mot de passe</button>
      </form>
        
      <Popup show={showPopup} onClose={handlePopupClose}>
        <p>Mot de passe utilisateur mis à jour avec succès !</p>
        <button className="close-btn" onClick={handlePopupClose}>
          Fermer
        </button>
      </Popup>
      <Popuperror show={showPopupError} onClose={handlePopupErrorClose}>
        <p>veuiller confirmer le mot de pass corectement</p>
        <button className="close-btn" onClick={handlePopupErrorClose}>
          Close
        </button>
      </Popuperror>
    </div>
  );
}

export default UpdatePassword;
