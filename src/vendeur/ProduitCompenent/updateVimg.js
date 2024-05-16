import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../../popupvalide';
import Popuperror from '../../popuperror';
import { useAuth } from '../../authprovider';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../loading/loading';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../../reducer';
function UpdateVimg() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const { id , img } = useParams();
  const [produit, setProduit] = useState({});
  const [productImage, setProductImage] = useState(null);
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgg, setimg] = useState(img);
  const navigate = useNavigate();
  if(auth.user && auth.user.type === 'admin'){
    navigate('/dashbord');
}
if(auth.user && auth.user.type === 'client' || !auth.user){
  navigate('/');
}
  useEffect(() => {
    axios.get(`${api}/api/showproduit/${id}`)
      .then((response) => {
        setProduit(response.data.prod);
        setLoading(false);
      })
      .catch((error) => {
        
        setLoading(false);
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
  };

  const updateImg = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', productImage);

      const response = await axios.post(`${api}/api/updateimg/${id}/${img}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRep(response.data.message);
      setLoading(false);
      setShowPopup(true);
    } catch (error) {

      setRep(error.response?.data?.message || 'An error occurred');
      setLoading(false);
      setShowPopupError(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate(-1);
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };

  if(loading){
    return <LoadingSpinner/>;
  }

  return (
    <div>
      <form onSubmit={updateImg} encType="multipart/form-data" className='profill'>
      {produit[img] && (
    produit[img].includes('.mp4') ? (
      <div className="video-container" >
  <video controls style={{ width: '100px', height: '100px' }}>
    <source src={`${api}/images/${produit[img]}`} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

    ) : (  <img
      src={`${api}/images/${produit[img]}`}
      alt={produit[imgg]}
      style={{ width: '100px', height: '100px' }}
      
    />)
  )}
        
        <br />
        <input type="file" name="image" onChange={handleImageChange} />
        <br />
        <button type="submit">Mettre à jour l'image</button>
      </form>

      <Popup show={showPopup} onClose={handlePopupClose}>
        <p>{rep}</p>
        <button className="close-btn" onClick={handlePopupClose}>
          Fermer
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

export default UpdateVimg;
