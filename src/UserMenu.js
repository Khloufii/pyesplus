// UserMenu.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './authmenu.css';
import { useAuth } from './authprovider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faList, faShoppingCart, faTags, faGift, faPercent, faClipboardList, faAmbulance, faList12, faListAlt, faListSquares, faThList, faUserFriends, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectprofil } from './reducer';
const UserMenu = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const profil = useSelector(selectprofil);
  

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="user-menu">
      
        <h5 className='username'><FontAwesomeIcon icon={faUser} /> {profil.name} {profil.prenom} </h5>
    
           
          
     
    </div>
  );
};

export default UserMenu;
