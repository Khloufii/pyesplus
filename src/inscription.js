import './inscription.css';
import React, { useEffect,useState } from 'react';
import axios from 'axios';
import Popup from './popupvalide';
import Popuperror from './popuperror';
import { useNavigate,useParams } from 'react-router-dom';
import { useAuth } from './authprovider';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from './reducer';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Inscription() {
  const { id } = useParams();
  const api = useSelector(selectapi);
  const [data, setDada] = useState();
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [num_telephon, setNumTelephon] = useState(null);
  
  const [type, setType] = useState('');
  const [adress, setadress] = useState(null);
  const [rep, setRep] = useState('');
  const [showPopupError, setShowPopupError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();
  if(auth.user && auth.user.type === 'client'){
    navigate('/');
  }
  useEffect(() => {
    const apiUrl = `${api}/api/nbcompt`;
    axios
      .get(apiUrl)
      .then((response) => {
        setDada(response.data);
        
        if(response.data > 0){
          setType('client');
        }
        else{
          setType('admin');
        }
        
      })
      .catch((error) => {
      
      });
  }, []);
  if (auth.user) {
    // Redirect to another page (e.g., home page) if already authenticated
    navigate('/');
    return null; // Render nothing if redirecting
  };
 
  const createUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${api}/api/register`, {
  name,
  prenom,
  email,
  password,
  num_telephon,
  type,
  adress,
});
if(type === 'client' || type === 'admin'){


const { token, user } = response.data; // Updated from 'access_token' to 'token'
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
auth.login(token, user);

alert('Inscription réussie');
if(id != 'n'){
  navigate(`/detailprod/${id}`);
}
else{
  navigate('/');
}

window.location.reload();
}
else{
  alert('veuillez attendre l`activation de votre compte par l`administrateur');
  navigate('/login');
}
    } catch (error) {
      if (error.response) {
        setRep(error.response.data.message);
        setShowPopupError(true);
       
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
    <div className="inscription-container">
      <form onSubmit={createUser} className='inscription-form'>
      <img className='logologin' src={`${process.env.PUBLIC_URL}/faviconn.ico`} alt='PYES-PLUS E-COM'/> <span className='logintitre'>Inscription</span>
        {rep}
        <input type='text' className='input-field' name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Nom' />
        <br />

        <input type='text' className='input-field' name='prenom' value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder='Prénom' />
        <br />

        <input type='email' className='input-field' name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
        <br />

        <input type='password' className='input-field' name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Mot de passe' />
        <br />

        <input type='number' className='input-field' name='num_telephon' value={num_telephon} onChange={(e) => setNumTelephon(e.target.value)} placeholder='Numéro de téléphone' />
        <br />
       
        <select className='select-field' value={type} name='type' onChange={(e) => setType(e.target.value)}>
          {data === 0 ? (
            <option value='admin' >Admin</option>
          ) : (
            <>
              <option value='client' >Client</option>
              <option value='vendeur' >Vendeur</option>
            </>
          )}
        </select>
        <br />

        <button type="submit" className='submit-button'>S'inscrire</button>
      </form>
      <Popup show={showPopup} onClose={handlePopupClose}>
        <p>{rep}</p>
        <button className="close-btn" onClick={handlePopupClose}>
          Fermer
        </button>
      </Popup>
      <Popuperror show={showPopupError} onClose={handlePopupErrorClose}>
        <p>{rep}</p>
        <button className="close-btn" onClick={handlePopupErrorClose}>
          Fermer
        </button>
      </Popuperror>
    </div>
  );
}

export default Inscription;
