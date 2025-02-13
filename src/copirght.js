import './contact.css';
import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Copiright = () => {
  const year = new Date().getFullYear();
  return (
   
      <div className='copiright'>
      <p className='copiright'>&copy; {year} PyesPlus. Tous Droits Réservés.</p>

    </div>
  );
};

export default Copiright;
