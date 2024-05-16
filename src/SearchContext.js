import './serch.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faEuroSign, faList, faMoneyBill, faSearch, faSearchLocation, faSearchPlus,faFemale,
  faMale,
  faClock,
  faRing,
  faLaptop,
  faShoePrints,
  faShoppingBag,
  faRunning,
  faSchool } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import {
  setCategories,
  setCurrencies,
  setcategorieselect,
  setSearchTerm,
  setSelectedCurrency as setReduxSelectedCurrency,
  setExchangeRates, // Add this import
  selectCategories,
  selectCurrencies,
  selectselectedCurrency,
  setSelectedCurrency,
  setlistprod,
  setavis,
  setnewprod,
  settopprod,
  setpromoprod,
  setnbpanier,
  setPanier,
  selectprofil,
  selectIp,
  selectapi,
} from './reducer';
import Menuclient from './dashbordmenu';

 export const Serche = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useSelector(selectapi);
  const categories = useSelector(selectCategories);
  const currencies = useSelector(selectCurrencies);
  const selectedCurrency = useSelector(selectselectedCurrency);
  const categorieselect = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const userr = useSelector(selectprofil);
  const [test,settest]=useState();
  const ip = useSelector(selectIp);
  const fetchData = async () => {
    try {
      if (userr.id) {
        const cartItemsResponse = await axios.get(`${api}/api/get-cart-items/${userr.id}`);
        dispatch(setnbpanier(cartItemsResponse.data.nbpanier));
        dispatch(setPanier(cartItemsResponse.data.res));
      }
      else {
        const cartItemsResponse = await axios.get(`${api}/api/get-cart-items/${ip}`);
        dispatch(setnbpanier(cartItemsResponse.data.nbpanier));
        dispatch(setPanier(cartItemsResponse.data.res));
      }
    } catch (error) {

    } finally {
      
    }
  };
  useEffect(() => {
  fetchData();
}, [userr.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/listproduit`);
        dispatch(setlistprod(response.data.prod));
        dispatch(setavis(response.data.avis));
        dispatch(setnewprod(response.data.newprod));
        dispatch(settopprod(response.data.topproduct));
        dispatch(setpromoprod(response.data.promoprod));
        settest(response.data.user);
       
      } catch (error) {
       
      }
    };
  
    fetchData();
  }, []);
  


  useEffect(() => {
    const fetchDefaultCurrency = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
    
        const currencyCode = response.data.currency;
        dispatch(setReduxSelectedCurrency(currencyCode));
      } catch (error) {
        
      }
    };
  
    fetchDefaultCurrency();
  }, [dispatch]);
  

// ...


// ...

  
  
  
  

  useEffect(() => {
    const apiUrl = `${api}/api/categorieslist`;
    
    axios
      .get(apiUrl)
      .then((response) => {
        dispatch(setCategories(response.data));
      })
      .catch((error) => {
    
      });
  }, []);

  // Add this script after rendering the category select element
  useEffect(() => {
    // Add this script after rendering the category select element
    const categorySelect = document.querySelector('.category-select');
    const selectDropdown = document.querySelector('.select-dropdown');
  
    if (categorySelect && selectDropdown) {
      categorySelect.addEventListener('mouseenter', function () {
        selectDropdown.style.display = 'block';
      });
  
      categorySelect.addEventListener('mouseleave', function () {
        selectDropdown.style.display = 'none';
      });
    }
  }, []);


  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://open.er-api.com/v6/latest');
        
        dispatch(setCurrencies(Object.keys(response.data.rates)));

      } catch (error) {
      
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${selectedCurrency}`);
        dispatch(setExchangeRates(response.data.rates));
      } catch (error) {
       
      }
    };

    fetchExchangeRates();
  }, [dispatch, selectedCurrency]);




  const handleCurrencyChange = (e) => {
    dispatch(setReduxSelectedCurrency(e.target.value)); // Utilisez la nouvelle action renommée
  };
  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'Vêtements femme':
        return faFemale;
      case 'Vêtements homme':
        return faMale;
      case 'Montre':
        return faClock;
      case 'Accéssoires et bijoux':
        return faRing;
      case 'Eléctroniques':
        return faLaptop;
      case 'Chaussures femme':
        return faShoePrints;
      case 'Chaussures homme':
        return faMale; // Vous pouvez changer cela en faShoePrints si nécessaire
      case 'Sac femme':
        return faShoppingBag;
      case 'Sport et plein air':
        return faRunning;
      case 'Scolaire et fournitures du bureau':
        return faSchool;
      default:
        return null;
    }
};
  

  return (
    <nav className="menuserch" id="detailProduitRef">
      
    
      <div className="category-container">
    {categories.map((category) => (
      <Link
        key={category.id}
        to={`/productsresrcher/${category.id}`}
        className="category-item"
      >
          <FontAwesomeIcon icon={getCategoryIcon(category.titre)} />
        {category.titre}
      </Link>
    ))}
  </div>
  
      
    
      <form className="formserch">
        <div className="search-box">
          <input
            type="text"
            className="input-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Serch ..."
          />
          <span className='serchsymbol'>
            <Link to={searchTerm ? `/productsresrcher/${searchTerm}` : '#'}>
              <button className="btn-search" type="submit">
                <i className="fa-search">
                  <FontAwesomeIcon icon={faSearch} className='fa-search' />
                </i>
              </button>
            </Link>
          </span>
        </div>
      </form>
      <Menuclient/>
    </nav>
  );
};
  

