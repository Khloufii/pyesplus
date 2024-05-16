import './inscription.css';
import React, { useState } from 'react';
import axios from 'axios';
import Popup from './popupvalide';
import Popuperror from './popuperror';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authprovider';
import { useDispatch, useSelector } from 'react-redux';
import { selectIp, selectapi, setPanier, setnbpanier } from './reducer';

function FormulairCmd() {
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [num_telephon, setNumTelephon] = useState('');
  const [adress, setadress] = useState('');
  const [rep, setRep] = useState('');
  const [showPopupError, setShowPopupError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showvalidation, setshowvalidation] = useState(false);
  const [etaterror, setetaterror] = useState('');
  const ip = useSelector(selectIp);
  const navigate = useNavigate();
  const auth = useAuth();
  const id = auth.user && auth.user.id;

  const createUserAndCommand = async (e) => {
    e.preventDefault();

    try {
      // Inscription de l'utilisateur
      const response = await axios.post(`${api}/api/register`, {
        name,
        prenom,
        email,
        password,
        num_telephon,
        type: 'client',
        adress,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      auth.login(token, user);
      setRep('Tu Peut Vraiment De Valider Votre Commande !');
      setShowPopupError(true);
      setshowvalidation(true);

      // Ajout de la commande
      await ajouterCommande();
    } catch (error) {
      if (error.response) {
        setetaterror('error');
        setRep(error.response.data.message);
        setShowPopupError(true);
      } else {
        // Gérer d'autres erreurs
      }
    }
  };

  const ajouterCommande = async () => {
    try {
      // Requête pour mettre à jour le panier
      await axios.put(`${api}/api/updatepanier/${ip}`, { id });
  
      // Ensuite, ajoutez la commande
      const reponse = await axios.post(
        `${api}/api/add-commande`,
        {
          status: 'en attente',
          client_id: auth.user ? auth.user.id : null,
          payment_method: 'à la livraison',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setRep('Commande ajoutée avec succès ! Vous paierez à la livraison.');
      setShowPopupError(false);
      setShowPopup(true);
     
    } catch (erreur) {
      // Gérer les erreurs
    }
  };
  
  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/commande');
    window.location.reload();
  };

  const handlePopupErrorClose = () => {
    if(etaterror == 'error'){
      setShowPopupError(false);
    }
    else{
      setShowPopupError(false);
    navigate('/panier');
    window.location.reload();
    }
    
  };

  return (
    <div className="inscription-container">
      <form onSubmit={createUserAndCommand} className='inscription-form'>
        <img className='logologin' src={`${process.env.PUBLIC_URL}/favicon.ico`} alt='PYES-PLUS E-COM'/>
        <span className='logintitre'>Pour Valider Votre Commande</span>
        {rep}
        <input type='text' className='input-field' name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Nom' />
        <br />

        <input type='text' className='input-field' name='prenom' value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder='Prénom' />
        <br />

        <input type='email' className='input-field' name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
        <br />

        <input type='password' className='input-field' name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Mot de passe' />
        <br />

        <input type='text' className='input-field' name='adress' value={adress} onChange={(e) => setadress(e.target.value)} placeholder='Votre Adresse Complète' required />
        <br />

        <input type='number' className='input-field' name='num_telephon' value={num_telephon} onChange={(e) => setNumTelephon(e.target.value)} placeholder='Numéro de téléphone' />
        <br />

        <button type="submit" className='submit-button'>Valider Votre Commande</button>
      </form>
      <Popup show={showPopup} onClose={handlePopupClose}>
        <p>{rep}</p>
        <button className="close-btn" onClick={handlePopupClose}>Fermer</button>
      </Popup>
      <Popuperror show={showPopupError} onClose={handlePopupErrorClose}>
        <p>{rep}</p>
        {showvalidation ?
          <>
            <button className="close-btn" onClick={ajouterCommande}>Oui</button>
            <button className="close-btn" onClick={handlePopupErrorClose}>Non</button>
          </>
          :
          <>
            <button className="close-btn" onClick={handlePopupErrorClose}>Fermer</button>
          </>
        }
      </Popuperror>
    </div>
  );
}

export default FormulairCmd;
