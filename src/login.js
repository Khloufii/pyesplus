// LoginComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './login.css';
import Popup from './popupvalide';
import Popuperror from './popuperror';
import { useAuth } from './authprovider';
import { Link } from 'react-router-dom';
import { CardBody } from 'react-bootstrap';
import LoadingSpinner from './loading/loading';
import Loading2 from './loading/loading2';
import Loading3 from './loading/loading3';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from './reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserClock, faUserLock } from '@fortawesome/free-solid-svg-icons';

const LoginComponent = () => {
  const { id } = useParams();
  const api = useSelector(selectapi);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const [loading, setLoading ] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.user && auth.user.type === 'client') {
    navigate('/');
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${api}/api/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setLoading(false);
      if (response.data.user.état === 'autorisé' && (response.data.user.type === 'admin' || response.data.user.type === 'vendeur')) {
        const { access_token, user } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        auth.login(access_token, user);
      
        
        navigate('/dashbord');
        window.location.reload();
      } else if (response.data.user.état === 'autorisé' && (response.data.user.type === 'client')) {
        const { access_token, user } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        auth.login(access_token, user);
       
        if(id != 'n'){
          navigate(`/detailprod/${id}`);
        }
        else{
          navigate('/');
        }
        
        window.location.reload();
      } else if(response.data.user.état === 'non confirmer' && (response.data.user.type === 'vendeur')){
        setNom(response.data.user.name);
        setPrenom(response.data.user.prenom);
        setRep(`${nom} ${prenom}: votre compte est non confirmer, veuillez contacter l'administrateur`);
        setShowPopupError(true);
      } else {
        setNom(response.data.user.name);
        setPrenom(response.data.user.prenom);
        setRep(`${nom} ${prenom}: votre compte est bloqué, veuillez contacter l'administrateur`);
        setShowPopupError(true);
      }
    } catch (error) {
      setLoading(false);
      setShowPopupError(false);
      setRep('login or password est invalid');
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };
  if(loading){
    return <LoadingSpinner/>;
  }
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
      <img className='logologin' src={`${process.env.PUBLIC_URL}/faviconn.ico`} alt='PYES-PLUS E-COM'/>  <span className='logintitre'>Login</span>
        <p className='eror'>{rep}</p><br/> 
        <div className="form-group">
          <input type="email" className="inputt" name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
        </div>
        <div className="form-group">
          <input type="password" className="inputt" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' required />
        </div>
        <button type="submit" className="button">Login</button>
        <Link to={`/inscription/${id}`} className="linkk">Inscription</Link>
      </form>
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
};

export default LoginComponent;
