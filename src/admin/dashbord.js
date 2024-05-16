// Import necessary stylesheets and libraries
import './dashbord.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faDollarSign, faUsers, faUser, faChartBar, faCheckCircle, faCubes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../authprovider';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import CountUp from 'react-countup';
import LoadingSpinner from '../loading/loading';
import { useDispatch, useSelector } from 'react-redux';
import { selectapi, selecttotalvisit, setprofil } from '../reducer';


const Dashboard = () => {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [client, setClient] = useState();
  const [vendeur, setVendeur] = useState();
  const [allcommande, setAllCommande] = useState();
  const [newcommande, setnewCommande] = useState();
  const [allrevenuconfirmed, setAllRevenuConfirmed] = useState();
  const [allrevenu, setAllRevenu] = useState();
  const [rvvendeur, setRvvendeur] = useState();
  const [allproduit, setAllProduit] = useState();
  const [allproduitvendeur, setAllProduitVendeur] = useState();
  const [commande_vendeur, setCommandeVendeur] = useState();
  const [rvvendeurconfirm, setRvvendeurConfirm] = useState();
  const [nbcommandev, setnbcommandev] = useState();
  const [idUser, setIdUser] = useState(auth.user?.id ?? null);
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState([]);


  if (!auth.user) {
    navigate('/');
  }
  if(auth.user && auth.user.type === 'client'){
    navigate('/');
  }
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const currentVendeurId = auth.user && auth.user.id;
        const ordersResponse = await axios.get(`${api}/api/info_e-com/${currentVendeurId}`);
        setClient(ordersResponse.data.client);
        setVendeur(ordersResponse.data.vendeur);
        setAllCommande(ordersResponse.data.allcommande);
        setnewCommande(ordersResponse.data.newcommande);
        setAllRevenuConfirmed(ordersResponse.data.allrevenuconfirmed);
        setAllRevenu(ordersResponse.data.allrevenu);
        setRvvendeur(ordersResponse.data.rvvendeur);
        setAllProduit(ordersResponse.data.allproduit);
        setAllProduitVendeur(ordersResponse.data.allproduitvendeur);
        setCommandeVendeur(ordersResponse.data.commande_vendeur);
        setRvvendeurConfirm(ordersResponse.data.rvvendeurconfirm);
        setnbcommandev(ordersResponse.data.nbcomande_v);
        setLoading(false);
      } catch (error) {
        
        setLoading(false);
      }
    };

    if (auth.user && auth.user.id) {
      fetchProductDetail();
    }
  }, [auth.user]);
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await axios.get(`${api}/api/getvisiteur`);
        setVisitors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching visitors:', error);
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${api}/api/showuser/${idUser}`);
     
      setLoading(false);
      dispatch(setprofil(response.data.user));
    } catch (error) {
    
      setLoading(false);
    }
  };
  useEffect(() => {
    if (idUser) {
      fetchData();
    }
  }, [idUser]);
  const animatedProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });
  const handleLogoutAllUsers = () => {
    // Appeler la fonction clearLocalStorage du contexte d'authentification
    auth.clearLocalStorage();
    
    // Rediriger vers la page d'accueil ou toute autre page appropriée après la déconnexion de tous les utilisateurs
    navigate('/');
  };
  if(loading){
    return <LoadingSpinner/>;
  }
  return (
    <>
   
      <animated.div className={`dashboard-container animated`} style={animatedProps}>
      
        <header>
          <h1 className='dashbordh1' > <span>
          <img className='logodashbord' src={`${process.env.PUBLIC_URL}/logo111.png`} alt='logo1.png' style={{width:'20%'}}/>       
</span> Dashboard</h1>
        </header>
        <section className="stats-section" >
          <div className="stat-boxrv" id='imgtel'>
            <h2 className='dashbordh2'  id='imgtel'>Revenu Confirmer</h2>
            <p className='pe'>
              <FontAwesomeIcon icon={faCheckCircle} />{' '}
              <CountUp start={0} end={auth.user && auth.user.type === 'admin' ? allrevenuconfirmed : rvvendeurconfirm} duration={2} separator="," /> MAD
            </p>
          </div>
          
          <div className="stat-boxrv" id='imgtel'>
            <h2 className='dashbordh2' id='imgtel' >Revenue</h2>
            <p className='pe'>
              <FontAwesomeIcon icon={faDollarSign} />{' '}
              <CountUp start={0} end={auth.user && auth.user.type === 'admin' ? allrevenu : rvvendeur} duration={2} separator="," /> MAD
            </p>
          </div>
          
        </section>
        <section className="stats-section">
          {auth.user && auth.user.type === 'admin' ? (
            <div className="stat-box" id='imgtel'>
               <Link to={auth.user && auth.user.type === 'vendeur' ?"/":"/listeuser"} 
          style={{ textDecoration:'none' }} >
              <h2 className='dashbordh2' id='imgtel'>Users Vendeur</h2>
              <p className='pe'>
               
              <FontAwesomeIcon icon={faUser} />  
              <CountUp start={0} end={vendeur} duration={2} separator="," />
                
              </p>
              </Link>
            </div>
          ) : ''}
          <div className="stat-box" id='imgtel'>
          <Link to={auth.user && auth.user.type === 'vendeur' ?"/commandevendeur":"/commandeadmin"} 
          style={{ textDecoration:'none' }} >
            <h2 className='dashbordh2' id='imgtel'>All Orders</h2>
            <p className='pe'>
            <FontAwesomeIcon icon={faShoppingCart} />  <CountUp start={0} end={auth.user && auth.user.type === 'admin' ? allcommande : commande_vendeur} duration={2} separator="," />

            </p>
            </Link>
          </div>
          <div className="stat-box" id='imgtel'>
          <Link to={auth.user && auth.user.type === 'vendeur' ?"/commandevendeur":"/commandeadmin"} 
          style={{ textDecoration:'none' }} >
            <h2 className='dashbordh2' id='imgtel'>New Orders </h2>
            <p className='pe'>
            <FontAwesomeIcon icon={faShoppingCart} />   <CountUp start={0} end={auth.user && auth.user.type === 'admin' ? newcommande : nbcommandev} duration={2} separator="," />

            </p>
            </Link>
          </div>
          <div className="stat-box" id='imgtel'>
          <Link to={auth.user && auth.user.type === 'vendeur' ?"/produitvendeur":"/listproduits"} 
          style={{ textDecoration:'none' }} >
            <h2 className='dashbordh2' id='imgtel'>All Product</h2>
            <p className='pe'>
            <FontAwesomeIcon icon={faCubes} />   <CountUp start={0} end={auth.user && auth.user.type === 'admin' ? allproduit : allproduitvendeur} duration={2} separator="," />
            </p>
            </Link>
          </div>
          {auth.user && auth.user.type === 'admin' ? (
            <div className="stat-box" id='imgtel'>
              <Link to={auth.user && auth.user.type === 'vendeur' ?"/":"/listeuser"} 
          style={{ textDecoration:'none' }} >
              <h2 className='dashbordh2' id='imgtel'>Users Client</h2>
              <p className='pe'>
              <FontAwesomeIcon icon={faUsers} />    <CountUp start={0} end={client} duration={2} separator="," />

              </p>
              </Link>
            </div>
          ) : ''}
           {auth.user && auth.user.type === 'admin' ? (
            <div className="stat-box" id='imgtel'>
               <Link to={auth.user && auth.user.type === 'admin' ?"/visiteur":"/"} 
          style={{ textDecoration:'none' }} >
              <h2 className='dashbordh2' id='imgtel'>Total Visite </h2>
         <p className='pe'><FontAwesomeIcon icon={faUsers} />{visitors.total_visitors}</p>
         </Link>
            </div>
             ) : ''}
        </section>
        {auth.user && auth.user.type === 'admin' && (
        <button onClick={handleLogoutAllUsers}>Déconnecter tous les utilisateurs</button>
      )}
        </animated.div>
    </>
  );
};

export default Dashboard;
