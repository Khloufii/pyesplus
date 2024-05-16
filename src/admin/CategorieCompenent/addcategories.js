import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../../popupvalide';
import Popuperror from '../../popuperror';
import { useAuth } from '../../authprovider';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../../loading/loading';
import Loading3 from '../../loading/loading3';
import { selectapi } from '../../reducer';


function Addcategories() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const navigate = useNavigate();
  const [titre, settitre] = useState('');
  const [rep, setRep] = useState('');
  const [Categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  const [showPopup, setShowPopup] = useState(false);
  const [showpopuperror, setshowpopuperror] = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (!auth.user) {
    navigate('/dashbord');
  }
  if (auth.user && auth.user.type === 'client' || !auth.user) {
    navigate('/');
  }
  if (auth.user && auth.user.type === 'vendeur') {
    navigate('/dashbord');
  }

    const fetchdata =()=>{

    const apiUrl = `${api}/api/categoriesall`;

    axios
      .get(apiUrl)
      .then((response) => {
        setCategories(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
       
        setLoading(false); // Set loading to false on error
      });
    }
    useEffect(() => {
   fetchdata();
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await axios.post(`${api}/api/addcategories`,{ titre });
      setRep(response.data);
      settitre('');
      setLoading(false);
      setShowPopup(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setRep('ok');
          setLoading(false);
        } else {
          setLoading(false);
          setRep(error.response.data.message);
          setshowpopuperror(true);
        }
      } else {
        console.log("An error occurred:", error.message);
      }
    }
  };

  const banéproduct = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${api}/api/banecategorie/${id}`,
        { nv_état: 'indisponible' },
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
          setLoading(false);
          setshowpopuperror(true);
        }
      } else {
        console.log("An error occurred:", error.message);
      }
    }
  };

  const cancelbanproduct = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${api}/api/cancelbanecategorie/${id}`,
        { nv_état: 'disponible' },
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
          console.log(error.status);
        } else {
          setRep(error.response.data.message);
          setLoading(false);
          setshowpopuperror(true);
        }
      } else {
        console.log("An error occurred:", error.message);
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
      
        <form onSubmit={handleSubmit} className='form2'>
          <label>Categorie Name:</label>
          <input type="text" value={titre} onChange={(e) => settitre(e.target.value)} />
          <button type="submit">Add Categories</button>
        </form>
        
       <div className="user-orders-containerrs">
          <table border="1" className="orders-list">
            <thead>
              <tr>
                <th>titre</th>
                <th>état</th>
                <th>action</th>
              </tr>
            </thead>
            <div className='lodingpromo'>{loading && <Loading3/>}</div>
            <tbody>
              {Categories.map((e) => (
                <tr key={e.id} className={e.état === 'indisponible' ? 'indisponible' : 'disponible'}>
                  <td>{e.titre}</td>
                  <td>{e.état}</td>
                  <td>
                    {e.état === 'disponible' ? (
                      <button className="action-btn" onClick={() => banéproduct(e.id)}>
                        Ban
                      </button>
                    ) : (
                      <button className="action-btn" onClick={() => cancelbanproduct(e.id)}>
                        Cancel ban
                      </button>
                    )}
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
    </div>

  );
}

export default Addcategories;
