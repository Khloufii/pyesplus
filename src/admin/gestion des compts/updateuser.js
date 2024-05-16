import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Popup from '../../popupvalide';
import Popuperror from '../../popuperror';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authprovider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../loading/loading';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../../reducer';
function UpdateUser() {
const auth = useAuth();
const api = useSelector(selectapi);
  const [user, setUser] = useState({});
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    prenom: '',
    email: '',
    num_telephon: '',
    type: 'client',
    état: 'autorisé',
    adress: '',
    });
  const [rep, setRep] = useState('');
  const [idd, setidd] = useState(user.id);
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
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/showuser/${id}`);
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
        setidd(response.data.user.id);
        setLoading(false);
      } catch (error) {
       
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateuser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${api}/api/updateuser/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json', // Utilisation de 'application/json' pour les données JSON
        },
      });

      setRep(response.data.message);
      setShowPopup(true);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
         
        } else {
          setRep(error.response.data.message);
          setShowPopupError(true);
          setLoading(false);
        }
      } else {
        console.log("An error occurred:", error.message);
      }
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/listeuser');
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };
  if (loading) {
    return <LoadingSpinner/>;
  }
  return (
    <div>
      
      <form onSubmit={updateuser} method="POST" className='profill'>
     
              <Link className="bn" to={`/updatemotdepass/${idd}`}>
                Modifier Password
              </Link>
           
        <label>User Name:</label>
        <input type="text" value={formData.name} name="name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <br /><br />

        <label>User Prenom:</label>
        <input type="text" name="prenom" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
        <br /><br />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <br /><br />

        <label>Num Telephone:</label>
        <input type="number" name="num_telephon" value={formData.num_telephon} onChange={(e) => setFormData({ ...formData, num_telephon: e.target.value })} />
        <br /><br />


        <label>Etat:</label>
        <select value={formData.état} name='type' onChange={(e) => setFormData({ ...formData, état: e.target.value })}>
          <option value='autorisé'>Autorisé l'accés</option>
          <option value='non autorisé'>Non autorisé</option>
        
        </select>
        <br /><br />
        <label>Adress:</label>
        <input type="text" name="adress" value={formData.adress} onChange={(e) => setFormData({ ...formData, adress: e.target.value })} />
        <br /><br />
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

export default UpdateUser;
