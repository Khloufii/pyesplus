import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../popupvalide'; // Assurez-vous d'ajuster le chemin en fonction de votre structure de fichiers
import Popuperror from '../popuperror';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authprovider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../loading/loading';
import Loading3 from '../loading/loading3';


function AddBonAchat() {
  const auth = useAuth();
  const [bonachat, setBonachat] = useState([]);
  const [titre, setTitre] = useState('');
  const [montant, setMontant] = useState('');
  const [quantité, setQuantite] = useState();
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false); // Nouvel état pour contrôler l'affichage du formulaire
  const [loading, setLoading] = useState(true); // Nouvel état pour contrôler l'affichage du formulaire
  const navigate = useNavigate();
  
  if (!auth.user) {
    navigate('/dashbord');
  }
  if (auth.user) {
    if (auth.user.type === 'vendeur') {
      navigate('/dashbord');
    } else if (auth.user.type === 'client') {
      navigate('/');
    }
  }
    const fetchdata =()=>{

   
    const apiUrl = 'https://pyesplus.store/public/api/bonachatlist';

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
    useEffect(() => {
  fetchdata();
  }, []);

  const filteredData = bonachat.filter((prod) => {
    const fullName = `${prod.titre}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('montant', montant);
    formData.append('quantité', quantité);
    formData.append('vendeur_id', auth.user.id);

    try {
      const response = await axios.post('https://pyesplus.store/public/api/addbonachat', formData);
      setRep(response.data);
      setLoading(false);
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
    setShowPopup(false);
    fetchdata();
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };
  
  return (
    <div className="user-orders-containerrs">

    <div className="container">
        <form className='form2' onSubmit={handleSubmit} >
          <label htmlFor="titre">Bon Achat Titre:</label>
          <input type="text" id="titre" value={titre} name="titre" onChange={(e) => setTitre(e.target.value)} />

          <label htmlFor="pourcentage">Montant:</label>
          <input type="text" id="pourcentage" name="montant" value={montant} onChange={(e) => setMontant(e.target.value)} />
          <label htmlFor="pourcentage">Quantité:</label>
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
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Montant</th>
            <th>Quantité</th>
            <th>Etat</th>
            <th>Action</th>
          </tr>
        </thead>
        <div className='lodingpromo'>{loading && <Loading3/>}</div>
        <tbody>
          {filteredData.map((e) => (
            <tr key={e.id} className={`etat-${e.état.toLowerCase()}`}>
              <td>{e.titre}</td>
              <td>{e.montant}</td>
              <td>{e.quantité}</td>
              <td>{e.état}</td>
              <td>
                <Link className="modifc" to={`/updatebonachat/${e.id}`}>
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

export default AddBonAchat;
