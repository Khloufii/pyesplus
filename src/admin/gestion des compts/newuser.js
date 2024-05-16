import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../../popupvalide';
import Popuperror from '../../popuperror';
import { useAuth } from '../../authprovider';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../loading/loading';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../../reducer';

function Newuser() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [num_telephon, setNumTelephon] = useState('');
  const [type, setType] = useState('client');
  const [adress, setadress] = useState('');
  const [rep, setRep] = useState('');
  const [showPopupError, setShowPopupError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  if (!auth.user) {
    navigate('/dashbord');
  }
  useEffect(()=>{
    if(auth.user){
      setLoading(false);
    }
  },[auth.user])
  if (auth.user) {
    if (auth.user.type === 'vendeur') {
      navigate('/dashbord');
    } else if (auth.user.type === 'client') {
      navigate('/');
    }
  }
  const createUser = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${api}/api/newuser`, {
  name,
  prenom,
  email,
  password,
  num_telephon,
  type,
  adress,
});


setRep('User ajouter avec sucsé');
setLoading(false);
setShowPopup(true);


    } catch (error) {
      if (error.response) {
        setRep(error.response.data.message);
        setLoading(false);
        setShowPopupError(true);
      } else {
        console.error("Une erreur s'est produite :", error.message);
      }
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate(-1);
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };

  if(loading){
    return <LoadingSpinner/>
  }

  return (
    <div>
      <form onSubmit={createUser} className='profill'>
        <h1 className='h1newuserr'>Ajouter Un Utilisateur</h1>
        {rep}
        <br/><br/>
        <label>Nom :</label>
        <input type='text' name='name' value={name} onChange={(e) => setName(e.target.value)} />
        <br/><br/>

        <label>Prénom :</label>
        <input type='text' name='prenom' value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        <br/><br/>

        <label>Email :</label>
        <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <br/><br/>

        <label>Mot de passe :</label>
        <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <br/><br/>

        <label>Numéro de téléphone :</label>
        <input type='number' name='num_telephon' value={num_telephon} onChange={(e) => setNumTelephon(e.target.value)} />
        <br/><br/>
        <label>Adress :</label>
        <input type='text' name='adress' value={adress} onChange={(e) => setadress(e.target.value)} />
        <br/><br/>
        <label>Type :</label>
        <select value={type} name='type' onChange={(e) => setType(e.target.value)}>
          <option value='client'>Client</option>
          <option value='vendeur'>Vendeur</option>
          <option value='admin'>Admin</option>
        </select>
        <br/><br/>

        <button type="submit">Enregistré</button>
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

export default Newuser;
