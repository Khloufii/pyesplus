import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../popupvalide';// Assurez-vous d'ajuster le chemin en fonction de votre structure de fichiers
import Popuperror from '../popuperror';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authprovider';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../loading/loading';
import Loading2 from '../loading/loading2';
import Loading3 from '../loading/loading3';
import Loading4 from '../loading/loading4';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../reducer';

function Addcodepromo() {
    const auth = useAuth();
    const api = useSelector(selectapi);
  const [codepromo, setcodepromo] = useState([]);
  const [titre, settitre] = useState('');
  const [pourcentage, setpourcentage] = useState('');
  const [quantité, setQuantite] = useState();
  const [rep, setrep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showpopuperror,setshowpopuperror]= useState(false);
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
    const apiUrl = `${api}/api/codepromolist`;

    axios
      .get(apiUrl)
      .then((response) => {
        setcodepromo(response.data.list);
        setLoading(false);
      })
      .catch((error) => {
     
        setLoading(true);
      });
    }
    useEffect(() => {
  fetchdata();
  }, []);

  const filteredData = codepromo.filter((prod) => {
    const fullName = `${prod.titre}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('pourcentage', pourcentage);
    formData.append('quantité', quantité);
    formData.append('vendeur_id', auth.user.id);


    try {
      const response = await axios.post(`${api}/api/addcodepromo`, formData);
      setrep(response.data);
      setLoading(false);
      setShowPopup(true); 
    } catch (error) {
      if (error.response) {
        if (error.response.status=== 401) {
         
        } else {
          setrep(error.response.data.message);
          setLoading(false);
          setshowpopuperror(true);
        }
      } 
    }
    
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    fetchdata();
  };
  const handlePopuperrorClose = () => {
    setshowpopuperror(false);
  };
  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

 
 
  return (
    <div className="user-orders-containerrs">
    <div className="container">
      

        <form className='form2' onSubmit={handleSubmit}>
          <label htmlFor="titre">Code Pomo Titre:</label>
          <input type="text" id="titre" value={titre} name="titre" onChange={(e) => settitre(e.target.value)} />

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

      <table>
      
        <thead>
          <tr>
            <th>Titre</th>
            <th>pourcentage</th>
            <th id='menutel'>Quantité</th>
            <th>Etat</th>
            <th>Action</th>
          </tr>
        </thead>
        <div className='lodingpromo'>{loading && <Loading3/>}</div>
        <tbody>
        
          {filteredData.map((e) => (
            <tr key={e.id} className={`etat-${e.état.toLowerCase()}`}>
              <td>{e.titre}</td>
              <td>{e.pourcentage}</td>
              <td id='menutel'>{e.quantité}</td>
              <td id='imgtel'>{e.état}</td>
              <td>
                <Link className="modifc" to={`/updatecodepromo/${e.id}`}>
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
      <Popuperror show={showpopuperror} onClose={handlePopuperrorClose}>
        <p>{rep}</p>
        <button className="close-btn" onClick={handlePopuperrorClose}>
          Close
        </button>
      </Popuperror>
    </div>
    </div>
  );
}

export default Addcodepromo;
