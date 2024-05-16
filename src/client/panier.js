import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './panier.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../authprovider';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Accueil from '../accueil';
import { useDispatch, useSelector } from 'react-redux';
import { seleclistprod, selectPanier, selectprofil, setPanier, setnbpanier, setprofil } from '../reducer';
import LoadingSpinner from '../loading/loading';
import Popup from '../popupvalide';
import Profil from '../profil';
import Loading2 from '../loading/loading2';
import Loading3 from '../loading/loading3';
import Loading4 from '../loading/loading4';
import Cart from './carts';
const Panier = () => {
 
 
  return (
    <>
    <Cart/>
    <Accueil/>
    </>
  );
};

export default Panier;

