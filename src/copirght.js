import './contact.css';
import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Copiright = () => {
  return (
   
      <div className='copiright'>
      <p className='copiright'>&copy; {new Date().getFullYear()} PyesPlus. Tous Droits Réservés.</p>

    </div>
  );
};

export default Copiright;
