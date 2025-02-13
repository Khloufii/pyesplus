import './dashbordmenu.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './authprovider';
import { useSelector } from 'react-redux';
import { selectnbpanier } from './reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faCartShopping, faUserPlus, faUserLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';

function Menuclient() {
  const auth = useAuth();
  const nbpanier = useSelector(selectnbpanier);


  return (
    <nav className="menulistcl">
      <ul className="menu-listcl">
        {auth.user && auth.user.type === 'client' ? (
          <>
            <li className="menu-item">
              <Link to="/commande" className="menu-linkk">
                <FontAwesomeIcon icon={faShoppingBag} />
                <span className="menu-label">Commandes</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/panier" className="menu-linkk">
                <FontAwesomeIcon icon={faCartShopping} />
                <span className="nbpanierr">{nbpanier}</span>
                <span className="menu-label">Panier</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/profil/n" className="menu-linkk">
                <FontAwesomeIcon icon={faUserCheck} />
                <span className="menu-label">Profil</span>
              </Link>
            </li>
          </>
        ) : null}
        


        {!auth.user && (
          <>
            <li className="menu-item">
              <Link to="/panier" className="menu-linkk">
                <FontAwesomeIcon icon={faCartShopping} />
                <span className="nbpanierr">{nbpanier}</span>
                <span className="menu-label">Panier</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/inscription/n" className="menu-linkk">
                <FontAwesomeIcon icon={faUserPlus} />
                <span className="menu-label">Inscription</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/login/n" className="menu-linkk">
                <FontAwesomeIcon icon={faUserLock} />
                <span className="menu-label">Connexion</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Menuclient;
