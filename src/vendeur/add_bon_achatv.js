import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../popupvalide'; // Assurez-vous d'ajuster le chemin en fonction de votre structure de fichiers
import Popuperror from '../popuperror';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authprovider';
import './Addcodepromov.css';
import LoadingSpinner from '../loading/loading';
import { useDispatch, useSelector } from 'react-redux';
import { selectapi, selectprofil } from '../reducer';

function AddBonAchatv() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const profil = useSelector(selectprofil);
  const [bonachat, setBonachat] = useState([]);
  const [titre, setTitre] = useState('');
  const [montant, setMontant] = useState();
  const [quantité, setQuantite] = useState();
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [idVendeur, setIdVendeur] = useState(auth.user?.id ?? null);
  const [showForm, setShowForm] = useState(false); // Nouvel état pour contrôler l'affichage du formulaire
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
    const apiUrl = `${api}/api/bonachaVtlist/${idVendeur}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setBonachat(response.data.list);
        setLoading(false);
      })
      .catch((error) => {
      
        setLoading(true);

      });
  }
 }
  useEffect(() => {
  fetchdata();
  }, [idVendeur]);

  const filteredData = bonachat.filter((prod) => {
    const fullName = `${prod.titre}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
   setLoading(true);
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('montant', montant);
    formData.append('quantité', quantité);
    formData.append('vendeur_id', auth.user.id);

    try {
      const response = await axios.post(`${api}/api/addbonachat`, formData);
      setRep(response.data);
      setLoading(false);
      setShowPopup(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
         
        } else {
          setRep(error.response.data.message);
          setLoading(false);
          fetchdata();
          setShowPopupError(true);
        }
      }
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setShowForm(!showForm);
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
          <label>Bon Achat Titre:</label>
          <input type="text" id="titre" value={titre} name="titre" onChange={(e) => setTitre(e.target.value)} />

          <label>Montant:</label>
          <input type="text" id="pourcentage" name="montant" value={montant} onChange={(e) => setMontant(e.target.value)} />
          <label>Quantité:</label>
          <input type="number" id="quantité" name="quantité" value={quantité} onChange={(e) => setQuantite(e.target.value)} />

          <button type="submit">Add Bon Achat &#9777;</button>
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
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Montant</th>
            <th id='menutel'>Quantité</th>
            <th id='menutel'>Etat</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((e) => (
            <tr key={e.id} className={`etat-${e.état.toLowerCase()}`}>
              <td>{e.titre}</td>
              <td>{e.montant}</td>
              <td id='menutel'>{e.quantité}</td>
              <td id='menutel'>{e.état}</td>
              <td>
                <Link className="modifc" to={`/updatebonachatv/${e.id}`}>
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

export default AddBonAchatv;
