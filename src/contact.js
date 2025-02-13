import './contact.css';
import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Contact = () => {
  return (
    <div id='imprim' className="contact-container">
      <h2 className='h2contact'>Contactez-nous</h2>
      <div className="contact-info">
        <div className="info-item">
          <FaEnvelope className="icon" />
          <p className='pcontact'>Email: Pyesplus.shop@gmail.com</p>
        </div>
        <div className="info-item">
          <FaPhone className="icon" />
          <p className='pcontact'>Phone: (+212) 6 94 24 84 90</p>
        </div>
        <div className="info-item">
          
          <Link to="https://www.instagram.com/pyesplus?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="link">
          <FaInstagram className="icon" /> <span className='ttc'>PYESPLUS</span>
          </Link>
        </div>
        <div className="info-item">
          
          <Link to="https://web.facebook.com/profile.php?id=61558124973313" className="link">
         <FaFacebook className="icon" /> <span className='ttc'>PYESPLUS</span>
          </Link>
        </div>
      </div>
      <div className="contact-image">
        <Link to="/" className="logo-link">
          <img className='logo' src={`${process.env.PUBLIC_URL}/logo9.png`} alt='PYES-PLUS E-COM'/>       
        </Link>
      </div>
     

    </div>
  );
};

export default Contact;
