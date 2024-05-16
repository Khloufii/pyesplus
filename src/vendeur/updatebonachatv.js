import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../popupvalide';
import Popuperror from '../popuperror';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../authprovider';
import LoadingSpinner from '../loading/loading';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../reducer';
function Updatebonachatv() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const { id } = useParams();
  const [bonachat, setbonachat] = useState({});
  const [formData, setFormData] = useState({
    titre: '',
    montant: '',
    état: '', 
    quantité: '', 
  });
  const [loading, setLoading] = useState(true);
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const navigate = useNavigate();
  if (!auth.user) {
    navigate('/dashbord');
  }
if(auth.user && auth.user.type === 'client' || !auth.user){
  navigate('/');
}


  useEffect(() => {
    axios.get(`${api}/api/showbonachat/${id}`).then((response) => {
      setbonachat(response.data);
      setFormData({
        titre: response.data.titre,
        montant: response.data.montant,
        état: response.data.état,
        quantité: response.data.quantité,
      });
      setLoading(false);
    }).catch((error) => {
      
      setLoading(false);
    });
  }, [id]);

  

  
  const updatebonachat = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${api}/api/updatebonachat/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setRep(response.data.message);
   
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
    navigate('/addbonachatv');
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <div>
      <form onSubmit={updatebonachat} method="POST" className='profill'>
      
        <label>Bon Achat Name:</label>
        <input type="text" value={formData.titre} name="titre" onChange={(e) => setFormData({ ...formData, titre: e.target.value })} />
        <br /><br />
        
        <label>Montant:</label>
        <input type="text" value={formData.montant} name="montant" onChange={(e) => setFormData({ ...formData, montant: e.target.value })} />
        <br /><br />
        <label>Quantité:</label>
        <input type="number" value={formData.quantité} name="quantité" onChange={(e) => setFormData({ ...formData, quantité: e.target.value })} />
        <br /><br />        <label>Etat:</label>
        <select  name="état" value={formData.état} onChange={(e) => setFormData({ ...formData, état: e.target.value })} >
        <option value='disponible'>Disponible</option>
        <option value='indisponible'>Indisponible</option>
        </select>
        <br /><br />
        <button type="submit">Update Bon Achat</button>
      </form>

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

export default Updatebonachatv;
