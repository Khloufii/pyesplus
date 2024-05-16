import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../popupvalide';
import Popuperror from '../popuperror';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authprovider';
import './Addcodepromov.css';
import LoadingSpinner from '../loading/loading';
import { useDispatch, useSelector } from 'react-redux';
import { selectapi, selectprofil } from '../reducer';
function Addcodepromov() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const profil = useSelector(selectprofil);
  const [codepromo, setcodepromo] = useState([]);
  const [titre, setTitre] = useState('');
  const [pourcentage, setpourcentage] = useState('');
  const [quantité, setQuantite] = useState();
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [idVendeur, setIdVendeur] = useState(auth.user?.id ?? null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  if (!auth.user) {
    navigate('/dashbord');
  }

  useEffect(() => {
    setIdVendeur(auth.user && auth.user.id);
  }, [auth.user]);

    const fetchdata =()=>{

    
    if (idVendeur) {
      const apiUrl = `${api}/api/codepromolistV/${idVendeur}`;
      axios
        .get(apiUrl)
        .then((response) => {
          setcodepromo(response.data.list);
          setLoading(false);

        })
        .catch((error) => {
        
          setLoading(true);

        });
    }}
    useEffect(() => {
 fetchdata();
  }, [idVendeur]);

  const filteredData = codepromo.filter((prod) => {
    const fullName = `${prod.titre}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('pourcentage', pourcentage);
    formData.append('quantité', quantité);
    formData.append('vendeur_id', auth.user.id);

    try {
      const response = await axios.post(`${api}/api/addcodepromo`, formData);
      setRep(response.data);
      setLoading(false);
      fetchdata();
      setShowPopup(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
         
        } else {
          setRep(error.response.data.message);
          setLoading(false);
          setShowPopupError(true);
        }
      } 
    }
  };

  const handlePopupClose = () => {
    setShowForm(!showForm);
    setShowPopup(false);
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };
  if (profil.état !== 'autorisé') {
    return null;
  }
  return (
    <div className="user-orders-containerrs">
    <div className="container">
      

        <form className='form2' onSubmit={handleSubmit}>
          <label htmlFor="titre">Code Promo Titre:</label>
          <input type="text" id="titre" value={titre} name="titre" onChange={(e) => setTitre(e.target.value)} />
          <label htmlFor="pourcentage">Montant:</label>
          <input type="text" id="pourcentage" name="pourcentage" value={pourcentage} onChange={(e) => setpourcentage(e.target.value)} />
          <label htmlFor="pourcentage">Quantité:</label>
          <input type="number" id="quantité" name="quantité" value={quantité} onChange={(e) => setQuantite(e.target.value)} />

          <button type="submit">Add Code Promo &#9777;</button>
        </form>
      

      <div>
        <input
          type="text"
          className="search_input"
          placeholder="Search by name or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <span className='loading1'>
      {loading && <LoadingSpinner/>}
      </span>

      <table className='tablecode'>
        <thead className='tcode'>
          <tr className='ttr'>
            <th className='tth'>Titre</th>
            <th className='tth'>pourcentage</th>
            <th className='tth' id='menutel'>Quantité</th>
            <th className='tth' id='menutel'>Etat</th>
            <th className='tth'>Action</th>
          </tr>
        </thead>
        <tbody className='tbodycode'>
          {filteredData.map((e) => (
            <tr key={e.id} className={`etat-${e.état.toLowerCase()}`}>
              <td className='tdcode'>{e.titre}</td>
              <td className='tdcode'>{e.pourcentage}</td>
              <td className='tdcode' id='menutel'>{e.quantité}</td>
              <td className='tdcode' id='menutel'>{e.état}</td>
              <td className='tdcode'>
                <Link className="modifc" to={`/updatecodepromov/${e.id}`}>
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
}

export default Addcodepromov;
