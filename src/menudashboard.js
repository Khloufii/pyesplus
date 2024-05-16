// Menudashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from './authprovider'; // Import the useAuth hook
import './Menudashboard.css'; // Import the stylesheet
import DashbordMenu from './dashbordmenu';
import Null from './null';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faList, faShoppingCart, faTags, faGift, faPercent, faClipboardList, faAmbulance, faList12, faListAlt, faListSquares, faThList, faUserFriends, faUserGroup, faClipboardCheck, faHome, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from './reducer';
// ... (your existing imports and code)

function Menudashboard() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const [allcommandev, setAllCommandev] = useState(null);
  const [allcommande, setAllCommande] = useState(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      const horizontal_menu = document.querySelector('.horizontal_menu');

      if (currentScrollTop > lastScrollTop) {
        // L'utilisateur fait défiler vers le bas
        if (horizontal_menu) horizontal_menu.style.top = `-${horizontal_menu.offsetHeight}px`;
      } else {
        // L'utilisateur fait défiler vers le haut
        if (horizontal_menu) horizontal_menu.style.top = '0';
      }

      setLastScrollTop(currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const currentVendeurId = auth.user && auth.user.id;
        const ordersResponse = await axios.get(`${api}/api/nbcommande/${currentVendeurId}`);
        setAllCommandev(ordersResponse.data.nbcmd);
        setAllCommande(ordersResponse.data.allcmd);
      } catch (error) {
        
      }
    };

    if (auth.user && auth.user.id) {
      fetchProductDetail();
    }
  }, [auth.user]);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div>
      <nav className={`horizontal_menu`}>
        <ul className={`menu-list-ad ${showMenu ? 'show' : ''}`}>
          {auth.user && auth.user.type === 'admin' && (
            <>
              <li><Link to="/addcategories" className='menu2'><FontAwesomeIcon icon={faList} /><span id='menutel'> Categories</span></Link></li>
              <li><Link to="/listproduits" className='menu2'><FontAwesomeIcon icon={faList} /><span id='menutel'> Produits</span></Link></li>
              <li><Link to="/listeuser" className='menu2'><FontAwesomeIcon icon={faUserGroup} /><span id='menutel'> Users</span></Link></li>

              <li><Link to="/addcodepromo" className='menu2'><FontAwesomeIcon icon={faPercent} /><span id='menutel'> Code Promo</span></Link></li>
              <li><Link to="/commandeadmin" className='menu2'><FontAwesomeIcon icon={faClipboardCheck} /><span id='menutel'> Commande</span> <span className='nbcmdd'>{allcommande}</span></Link></li>
            </>
          )}

          {auth.user && auth.user.type === 'vendeur' && (
            <>
              <li><Link to="/produitvendeur" className='menu2'><FontAwesomeIcon icon={faList} /><span id='menutel'> Produits</span></Link></li>

              <li><Link to="/addcodepromov" className='menu2'><FontAwesomeIcon icon={faPercent} /><span id='menutel'> Code Promo</span></Link></li>
              <li><Link to="/commandevendeur" className='menu2'><FontAwesomeIcon icon={faClipboardCheck} /><span id='menutel'> Commande </span><span className='nbcmdd'>{allcommandev}</span></Link></li>
            </>
          )}
              {auth.user && (auth.user.type === 'admin' || auth.user.type === 'vendeur') ? (
          <>
         
          <li><Link to="/profil/n" className=""><FontAwesomeIcon icon={faUserCheck} /> 
      </Link>
    </li>
         </>
        ) : ''}
        </ul>
       
      </nav>
    </div>
  );
}

export default Menudashboard;

