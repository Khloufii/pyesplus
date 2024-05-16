import { FaSearch } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../../popupvalide';
import Popuperror from '../../popuperror';
import { Link } from 'react-router-dom';
import { useAuth } from '../../authprovider';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../loading/loading';
import Loading3 from '../../loading/loading3';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../../reducer';

function Listproduit() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const [data, setDada] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [Users, setUser] = useState([]);
  const navigate = useNavigate();
 
  if(auth.user && auth.user.type === 'client' || !auth.user){
    navigate('/');
  }
  if(auth.user && auth.user.type === 'vendeur'){
    navigate('/produitvendeur');
  }

  useEffect(() => {
    const apiUrl = `${api}/api/comptelistes`;

    axios
      .get(apiUrl)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        
        setLoading(false);
      });
  }, []);

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

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${api}/api/allproduit`);
      setDada(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchProducts(); 
  }, []);
  const filteredData = data.filter((prod) => {
    const vendeur = Users.find((user) => user.id === prod.id_vendeur);
  
    if (vendeur) {
      const fullName = `${prod.id} ${vendeur.name} ${vendeur.prenom} ${prod.titre} ${prod.description}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    } else {
      return false; // Ou, selon votre logique, vous pouvez choisir de ne pas inclure cet élément dans les données filtrées.
    }
  });
  const banéproduct = async (id, et) =>{
    setLoading(true);
    let nv_état = et === 'DISPONIBLE' ? 'INDISPONIBLE' : 'DISPONIBLE';
    try {
      const response = await axios.put(`${api}/api/baneproduct/${id}`, { nv_état: nv_état });
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

  const blockprod = async (id, et) =>{
    setLoading(true);
    let nv_état = et === 'BLOKED' ? 'DISPONIBLE' : 'BLOKED';
    try {
      const response = await axios.put(`${api}/api/baneproduct/${id}`, { nv_état: nv_état });
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

  const handlePopupClose = () => {
    setShowPopup(false);
    fetchProducts();
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
    fetchProducts();
  };

  if (error) {
    return <p>{error}</p>;
  }

  if(loading){
    return <LoadingSpinner/>
  }
 
  return (
    <div className="list-produit-container">
      <div className='search-bar'>
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher par nom ou description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>
      <p><Link to={`/addproduit`} className="ajouter-produit">Ajouter un produit</Link></p>
      
      <table border="1" className="product-list">
        <thead>
          <tr>
            <th>Id</th>
            <th id='imgtel'>Image</th>
            <th id='imgtel'>Vendeur</th>
            <th id='imgtel'>Titre</th>
            <th id='menutel'>Description</th>
            <th id='menutel'>Prix</th>
            <th id='menutel'>Quantité</th>
           
           
          
            <th id='imgtel'>Actions</th>
            <th id='menutel'>Ban</th>
            <th id='imgtel'>Bloquer</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((e) => (
            <tr key={e.id} className={`product-row ${e.état} ${e.état === 'DISPONIBLE' ? 'available' : e.état === 'INDISPONIBLE' ? 'unavailable' : 'blocked'}`}>
              <td>{e.id}</td>
              <td className='product-image' id='imgtel'>
                <img src={`${api}/images/${e.image}`} alt={e.image} id='imgtel'/>
              </td>
              <td id='imgtel'><b>{Users.find((user) => user.id === e.id_vendeur)?.name || ''} {Users.find((user) => user.id === e.id_vendeur)?.prenom || ''}</b></td>
              <td id='imgtel'><b>{e.titre}</b></td>
              <td id='menutel'><b>{e.description}</b></td>
              <td id='menutel'><b>{e.nv_prix}</b></td>
              <td id='menutel'><b>{e.quantité}</b></td>
            
             
              <td id='imgtel'>
                <Link className="modifier-produit" to={`/updateproduit/${e.id}`}>
                  Modifier
                </Link>
              </td>
              <td id='menutel'>
                {e.état === 'DISPONIBLE' && <button className="ban" onClick={() => banéproduct(e.id, e.état)}>Ban</button>}
                {e.état === 'INDISPONIBLE' && <button className="anul" onClick={() => banéproduct(e.id, e.état)}>Annuler</button>}
              </td>
              <td id='imgtel'>
                {e.état === 'BLOKED' && <button className="deblok" onClick={() => blockprod(e.id, e.état)}>Débloquer</button>}
                {e.état !== 'BLOKED' && <button className="blok" onClick={() => blockprod(e.id, e.état)}>Bloquer</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Popup show={showPopup} onClose={handlePopupClose}>
        <p>{rep}</p>
        <button className="close-button" onClick={handlePopupClose}>
          Fermer
        </button>
      </Popup>

      <Popuperror show={showPopupError} onClose={handlePopupErrorClose}>
        <p>{rep}</p>
        <button className="close-button" onClick={handlePopupErrorClose}>
          Fermer
        </button>
      </Popuperror>
    </div>
  );
}

export default Listproduit;
