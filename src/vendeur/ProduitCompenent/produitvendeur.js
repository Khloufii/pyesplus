import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../../popupvalide';
import Popuperror from '../../popuperror';
import { Link } from 'react-router-dom';
import './listeproduit.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authprovider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faSpinner } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../loading/loading';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectapi, selectprofil, setprofil } from '../../reducer';
function ListVproduit() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const profil = useSelector(selectprofil);
  const [id_vendeur, setid_vendeur] = useState(auth.user?.id ?? null);

  const [data, setDada] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nv_état, setnv_état] = useState(true);
  const [error, setError] = useState(null);
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [idUser, setIdUser] = useState(auth.user?.id ?? null);
  const navigate = useNavigate();
  if (!auth.user) {
    navigate('/');
  }
  const idv = auth.user && auth.user.id;
  if (auth.user) {
    if (auth.user.type === 'admin') {
      navigate('/dashbord');
    } else if (auth.user.type === 'client' ) {
      navigate('/');
    }
  }

  useEffect(() => {
    const apiUrl = `${api}/api/categorieslist`;

    axios
      .get(apiUrl)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
     
        setError('Error fetching categories');
      });
  }, []);

  useEffect(() => {
    setid_vendeur(auth.user && auth.user.id);
  }, [auth.user]);
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${api}/api/produitvendeur/${idv}`);
      setDada(response.data);
      setLoading(false);
    } catch (error) {
      
      setError('Error fetching data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idv) {
      fetchProducts();
    }
  }, [idv]);

  const filteredData = data.filter((prod) => {
    const fullName = `${prod.id} ${prod.titre} ${prod.description}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const banéproduct = async (id, et) => {
    setLoading(true);
    let nv_état = et === 'DISPONIBLE' ? 'INDISPONIBLE' : 'DISPONIBLE';
    try {
      const response = await axios.put(
        `${api}/api/baneproduct/${id}`,
        { nv_état: nv_état },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setRep(response.data.message);
     
      setLoading(false);
      setShowPopup(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
         
        } else {
          setRep(error.response.data.message);
          setShowPopupError(true);
        }
      } 
    }
  };
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
  const handlePopupClose = () => {
    fetchProducts();
    setShowPopup(false);
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };
  if (profil.état !== 'autorisé') {
    return null;
  }
  return (
    <div className="list-produit-container">
     
     <div className='search-bar'>
          <input
            className="search-input"
            type="text"
            placeholder="Search by name or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
      
      <p><Link to={`/addVproduit`} className="ajouter-produit">
        Ajouter un produit
      </Link></p>
      {loading ? <LoadingSpinner/>:<>

      <table border="1" className="product-list">
        <thead>
          <tr>
            <th>Id</th>
            <th id='imgtel'>Image</th>
            <th id='imgtel'>Titre</th>
            <th id='menutel'>Description</th>
            
            <th id='menutel'>New Prix</th>
            <th id='menutel'>Quantité</th>
            <th id='menutel'>État</th>
         
            <th id='menutel'>Categorie</th>
            <th id='imgtel'>Action</th>
            <th>Ban</th>
          </tr>
        </thead>

        <tbody>

          {filteredData.map((e) => (
            <tr
              key={e.id}
              className={
                e.état === 'INDISPONIBLE'
                  ? 'INDISPONIBLE'
                  : e.état === 'DISPONIBLE'
                  ? 'DISPONIBLE'
                  : 'BLOKED'
              }
            >
              <td>{e.id}</td>
              <td className='product-image' id='imgtel'>
                <img
                  src={`${api}/images/${e.image}`}
                  alt={e.image}
                  className='imgprod'
                  id='imgtel'
                />
              </td>
              <td id='imgtel'>{e.titre}</td>
              <td id='menutel'>{e.description}</td>
            
              <td id='menutel'>{e.nv_prix} </td>
              <td id='menutel'>{e.quantité}</td>
              <td className="etat" id='menutel'>
                <b>{e.état}</b>
              </td>
             
              <td id='menutel'>
                {categories.find((categorie) => categorie.id === e.categories_id)?.titre || ''}
              </td>
              <td id='imgtel'>
                <Link className="modiff" to={`/updateVproduit/${e.id}`}>
                  Modifier
                </Link>
              </td>
              <td>
                {e.état === 'DISPONIBLE' ? (
                  <button className="ban"  onClick={() => banéproduct(e.id, e.état)}>
                    Ban
                  </button>
                ) : e.état === 'INDISPONIBLE' ? (
                  <button className="anul" onClick={() => banéproduct(e.id, e.état)}>
                    Annuler
                  </button>
                ) : (
                  ''
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>}
      <Popup show={showPopup} onClose={handlePopupClose}>
        <p>{rep}</p>
        <button className="close-btn" onClick={handlePopupClose}>
          Close
        </button>
      </Popup>

      <Popuperror show={showPopupError} onClose={handlePopupErrorClose}>
        <p>{rep}</p>
        <button className="close-btn" onClick={handlePopupErrorClose}>
          Close
        </button>
      </Popuperror>
    </div>
  );
}

export default ListVproduit;
