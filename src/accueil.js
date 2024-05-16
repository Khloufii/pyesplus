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
   
    <TopProductsList/>
    <Newproducts/>
    <Topprodscrol />
    <PromoProductsList/>
    
    <NewProductsList/>
    <AdBar />
    <Allproduct/>
    </>

     
    
    </>
  );
};

export default Accueil;
