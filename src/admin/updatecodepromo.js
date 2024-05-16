import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../popupvalide';
import Popuperror from '../popuperror';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authprovider';
import LoadingSpinner from '../loading/loading';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../reducer';
function Updatecodepromo() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const { id } = useParams();
  const [codepromo, setcodepromo] = useState({});
  const [formData, setFormData] = useState({
    titre: '',
    pourcentage: '',
    quantité: '', 
    état: '', 
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
    axios.get(`${api}/api/showcodepromo/${id}`).then((response) => {
      setcodepromo(response.data);
      setFormData({
        titre: response.data.titre,
        pourcentage: response.data.pourcentage,
        quantité: response.data.quantité,
        état: response.data.état,
      });
      setLoading(false);
    }).catch((error) => {
    
      setLoading(false);
    });
  }, [id]);

  

  
  const updatecodepromo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`${api}/api/updatecodepromo/${id}`, formData, {
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
      
          setShowPopupError(true);
          setLoading(false);
        }
      } 
    }
  };
  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/addcodepromo');
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <div>
      <form onSubmit={updatecodepromo} method="POST" className='profill'>
      
        <label>Code Promo Name:</label>
        <input type="text" value={formData.titre} name="titre" onChange={(e) => setFormData({ ...formData, titre: e.target.value })} />
        <br /><br />
        <label>Pourcentage:</label>
        <input type="text" value={formData.pourcentage} name="montant" onChange={(e) => setFormData({ ...formData, pourcentage: e.target.value })} />
        <br /><br />
        <label>Quantité:</label>
        <input type="number" value={formData.quantité} name="quantité" onChange={(e) => setFormData({ ...formData, quantité: e.target.value })} />
        <br /><br />
        <label>Etat:</label>
        <select  name="état" value={formData.état} onChange={(e) => setFormData({ ...formData, état: e.target.value })} >
        <option value='disponible'>Disponible</option>
        <option value='indisponible'>Indisponible</option>
        </select>
        <br /><br />
        <button type="submit">Update Product</button>
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

export default Updatecodepromo;
