import React , {useEffect,useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authprovider';
import axios from 'axios';
import UserMenu from './UserMenu';
import './menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faCarAlt, faCarBurst, faCarCrash, faCarTunnel, faCartArrowDown, faCartShopping, faCashRegister, faContactBook, faContactCard, faDashboard, faDatabase, faHome, faListCheck, faMotorcycle, faRegistered, faShoppingBag, faUserAltSlash, faUserCheck, faUserClock, faUserEdit, faUserLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FaProductHunt } from 'react-icons/fa';
import Contact from './contact';
import Null from './null';
import { Serche } from './SearchContext';
import Menudashboard from './menudashboard';
import DashbordMenu from './dashbordmenu';
import { useDispatch, useSelector } from 'react-redux';
import { selectIp, selectapi, selectnbpanier, selectprofil, setIp, setPanier, setavis, setlistprod, setnbpanier, setnewprod, setprofil, setpromoprod, settopprod, settotalvisit } from './reducer';
import Menuclient from './dashbordmenu';
import { v4 as uuidv4 } from 'uuid';
import { useCookies } from 'react-cookie';


function Navigation() {
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const auth = useAuth();
  const user = useSelector(selectprofil);
  const id = auth.user && auth.user.id
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['sessionId']);
  const [showMenu, setShowMenu] = React.useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [nbpanier1, setnbpanier1] = useState();
  const [userr, setUser] = useState({});
  const nbpanier = useSelector(selectnbpanier);
  const profil = useSelector(selectprofil);
  const [totalVisits, setTotalVisits] = useState(0);
  const [loading, setloading] = useState(false);
  const ip = useSelector(selectIp);
  useEffect(() => {
    let uniqueId = localStorage.getItem('uniqueId'); // Récupérer l'identifiant unique depuis le local storage
    if (!uniqueId) {
      uniqueId = generateUniqueId(); // Générer un nouvel identifiant unique s'il n'existe pas dans le local storage
      localStorage.setItem('uniqueId', uniqueId); // Stocker le nouvel identifiant unique dans le local storage
    }
  }, []);

  const generateUniqueId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
 useEffect(() => {
    if (!user.état === 'autorisé') {
      handleLogout(); // Déconnecter l'utilisateur si l'état n'est pas autorisé
    }
  }, [user]);
  const handleLogout = () => {
    auth.logout();
    navigate('/login');
    window.location.reload();
    console.log('User is logged out');
  };
 
  

 
  useEffect(() => {
    const handleUnload = () => {
      // Supprimer la clé visitorAdded du stockage local
      localStorage.removeItem('visitorAdded');
    };
  
    const addVisitor = async () => {
      try {
        // Vérifier d'abord si l'utilisateur a déjà été ajouté
        const visitorAdded = localStorage.getItem('visitorAdded');
        if (!visitorAdded) {
          // Ajouter le visiteur si la clé visitorAdded n'existe pas
          if (auth.user && auth.user.type !== 'admin') {
            await axios.post(
              `${api}/api/addvisiteur`,
              {
                id: auth.user.name + ' ' + auth.user.prenom,
                date: new Date().toISOString(),
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
          } else if (!auth.user) {
            await axios.post(
              `${api}/api/addvisiteur`,
              {
                id: ip,
                date: new Date().toISOString(),
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
          }
  
          // Marquer que le visiteur a été ajouté lors de cette session
          localStorage.setItem('visitorAdded', true);
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout du visiteur :', error);
      }
    };
  
    addVisitor();
  
    // Ajouter un écouteur d'événement beforeunload
    window.addEventListener('beforeunload', handleUnload);
  
    // Retirer l'écouteur d'événement beforeunload lors du démontage du composant
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [auth.user, ip]);
  
  
  
  
  
  
  
    
   // Utilisez une dépendance vide pour que cet effet ne se déclenche qu'une seule fois au chargement initial de la page
  
  

  const handleVisit = () => {
    const newTotalVisits = totalVisits + 1;
    localStorage.setItem('totalVisits', newTotalVisits.toString());
    setTotalVisits(newTotalVisits);
    dispatch(settotalvisit(newTotalVisits));
  };

  useEffect(() => {
    handleVisit();
  }, []);
  useEffect(() => {
    if (auth.user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${api}/api/showuser/${id}`);
          setUser(response.data.user);
          dispatch(setprofil(response.data.user));
          setnbpanier(response.data.panier);
        } catch (error) {
          
        }
      };
      fetchUserData();
    }
  }, [id]);
 
  useEffect(() => {
    if (userr.access_token && userr.user) {
      localStorage.setItem('token', userr.access_token);
      localStorage.setItem('user', JSON.stringify(userr.user));
      auth.login(userr.access_token, userr.user);
    }
  }, [userr, auth]);
  
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      const navbar = document.querySelector('.navbar');

      if (currentScrollTop > lastScrollTop) {
        // L'utilisateur fait défiler vers le bas
        if (navbar) navbar.style.top = `-${navbar.offsetHeight}px`;
      } else {
        // L'utilisateur fait défiler vers le haut
        if (navbar) navbar.style.top = '0';
      }

      setLastScrollTop(currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  useEffect(() => {
    // Vérifiez si l'utilisateur est de type admin ou vendeur
    if (auth.user && (auth.user.type === 'admin' || auth.user.type === 'vendeur')) {
      document.body.classList.add('admin-vendeur-background');
    } else {
      document.body.classList.remove('admin-vendeur-background');
    }
  }, [auth.user]);

 

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <nav className={`navbar`}>
      <div className="logo-container">
      <Link id='imprim' to={auth.user && (auth.user.type === 'admin' || auth.user.type === 'vendeur') ? '/dashbord' : "/"} className="logo-link">
        <img className='logo' src={`${process.env.PUBLIC_URL}/logo9.png`} alt='PYES-PLUS E-COM'/>       
         </Link>
      </div>
     
      <Menuclient></Menuclient>
    <nav id='imprim' className='menudashbord'>
        {auth.user && (auth.user.type === 'admin' || auth.user.type === 'vendeur') ? <Menudashboard/> : <Serche />}
      </nav>
    </nav>
   
    </>
  );
}

export default Navigation;
