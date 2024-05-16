// Menuclient.js
import './dashbordmenu.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authprovider';
import { useSelector } from 'react-redux';
import { selectnbpanier } from './reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faCartShopping, faUserPlus, faUserLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';

function Menuclient() {
  const auth = useAuth();
  const navigate = useNavigate();
  const nbpanier = useSelector(selectnbpanier);
  
  return (
    <nav className="menulistcl">
      <ul className='menu-listcl'>
        {auth.user && auth.user.type === 'client' ? (
          <>
            <li><Link to="/commande" className="menu-linkk"><FontAwesomeIcon icon={faShoppingBag} /></Link></li>
            <li><Link to="/panier" className="menu-linkk"><FontAwesomeIcon icon={faCartShopping} />
               <span className='nbpanierr'>
                 {nbpanier}
               </span>
            </Link></li>
            <li><Link to="/profil/n" className="menu-linkk"><FontAwesomeIcon icon={faUserCheck} /></Link></li>
          </>
        ) : ''}
     
        {!auth.user && (
          <>
            <li><Link to="/panier" className="menu-linkk"><FontAwesomeIcon icon={faCartShopping} />
              <span className='nbpanierr'>
                {nbpanier}
              </span>
            </Link></li>
            <li><Link to="/inscription/n" className="menu-linkk"><FontAwesomeIcon icon={faUserPlus} /></Link></li>
            <li><Link to="/login/n" className="menu-linkk"><FontAwesomeIcon icon={faUserLock} /></Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Menuclient;
