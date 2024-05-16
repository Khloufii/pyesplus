// Import necessary libraries and components
import './home.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './authprovider';
import { useNavigate } from 'react-router-dom';
import Accueil from './accueil';
import AdBar from './pub';
import { useSelector } from 'react-redux';
import { selectloading, selectprofil } from './reducer';
import Loading2 from './loading/loading2';
import LoadingSpinner from './loading/loading';


const Home = () => {
  const auth = useAuth();
  const profil = useSelector(selectprofil);
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [ads, setAds] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [logoVisible, setLogoVisible] = useState(true);
  const loading = useSelector(selectloading);
  
if(loading){
  return <LoadingSpinner/>
}

  return (
    <div className={`home-container ${Loading ? 'loading' : ''}`}>
        <>
          <AdBar />
          <Accueil />
        </>
    </div>
  );
};

export default Home;
