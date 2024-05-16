import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from './popupvalide';
import Popuperror from './popuperror';
import { useAuth } from './authprovider';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from './loading/loading';
import { selectapi } from './reducer';


// ... (previous imports)

function UpdateUserPassword() {
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
  const [idUser, setIdUser] = useState(auth.user?.id ?? null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIdUser(auth.user && auth.user.id);
    setiduser(auth.user && auth.user.id);
  }, [auth.user]);

  useEffect(() => {
    if (iduser) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${api}/api/showuser/${iduser}`);
          setUser(response.data.user);
          setLoading(false);
        } catch (error) {
          
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [iduser]);

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password === confirmPassword) {
      try {
        const response = await axios.put(
          `${api}/api/updateuserpass/${iduser}`,
          { password },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        setRep(response.data.message);
        setLoading(false);
        setShowPopup(true);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
         
          } else {
            setRep(error.response.data.message);
            setLoading(false);
            setShowPopupError(true);
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
        <p>veuillez confirmer le mot de passe correctement</p>
        <button className="close-btn" onClick={handlePopupErrorClose}>
          Close
        </button>
      </Popuperror>
    </div>
  );
}

export default UpdateUserPassword;

