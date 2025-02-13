import { Card, Col, Row } from 'react-bootstrap';
import './accueil.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './authprovider';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faSearch, faSpinner, faStar } from '@fortawesome/free-solid-svg-icons';
import TopProductsList from './topprod';
import Contact from './contact';
import Newproducts from './newproduit';
import { useDispatch, useSelector } from 'react-redux';
import { selecavis, seleclistprod, selectExchangeRates, selectprofil, selectselectedCurrency, setlistprod, setnewprod, setpromoprod, settopprod } from './reducer';
import LoadingSpinner from './loading/loading';
import PromoProductsList from './productspromotion';
import Topprodscrol from './topprodscrol';
import NewProductsList from './productsnew';
import Allproduct from './allproduct';
import AdBar from './pub';
import Productsnetflex from './productnetflex';

const Accueil = () => {
  const dispatch = useDispatch();
  const profil = useSelector(selectprofil);
  const { user } = useAuth() || {};
  const selectedCurrency = useSelector(selectselectedCurrency);
  const data =useSelector(seleclistprod);
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [localUser, setLocalUser] = useState(null);
  const avis = useSelector(selecavis);
  const exchangeRates = useSelector(selectExchangeRates);
  const navigate = useNavigate();
  const auth = useAuth();
  
 
  
  

  

  
 
 

  if (auth.user && (auth.user.type === 'vendeur' || auth.user.type === 'admin')) {
    navigate('/dashbord'); // Corrected the typo in the route path
  }
 
  
  
  
  
  const hindlprod = () => {
    window.scrollTo(0, 0);
  };
  
 

  return (
    <>
   
    

<>
   
    
    <Newproducts/>
    <Topprodscrol />
    <PromoProductsList/>
    
    
    <AdBar back='linear-gradient(85deg, rgba(154, 166, 50, 0.5) 0%, rgba(154, 166, 50, 0.5) 14.286%,rgba(146, 152, 50, 0.5) 14.286%, rgba(146, 152, 50, 0.5) 28.572%,rgba(138, 137, 50, 0.5) 28.572%, rgba(138, 137, 50, 0.5) 42.858%,rgba(131, 123, 51, 0.5) 42.858%, rgba(131, 123, 51, 0.5) 57.144%,rgba(123, 109, 51, 0.5) 57.144%, rgba(123, 109, 51, 0.5) 71.43%,rgba(115, 94, 51, 0.5) 71.43%, rgba(115, 94, 51, 0.5) 85.716%,rgba(107, 80, 51, 0.5) 85.716%, rgba(107, 80, 51, 0.5) 100.002%),linear-gradient(323deg, rgb(219, 91, 15) 0%, rgb(219, 91, 15) 14.286%,rgb(224, 99, 19) 14.286%, rgb(224, 99, 19) 28.572%,rgb(228, 106, 23) 28.572%, rgb(228, 106, 23) 42.858%,rgb(233, 114, 28) 42.858%, rgb(233, 114, 28) 57.144%,rgb(238, 122, 32) 57.144%, rgb(238, 122, 32) 71.43%,rgb(242, 129, 36) 71.43%, rgb(242, 129, 36) 85.716%,rgb(247, 137, 40) 85.716%, rgb(247, 137, 40) 100.002%)'/>
    <Allproduct/>
    </>

     
    
    </>
  );
};

export default Accueil;
