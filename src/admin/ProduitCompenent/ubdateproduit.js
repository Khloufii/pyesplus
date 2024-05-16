import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../../popupvalide';
import Popuperror from '../../popuperror';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../authprovider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../loading/loading';
import { useDispatch,useSelector } from 'react-redux';
import { selectapi } from '../../reducer';

function Updateproduit() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const { id } = useParams();
  const [produit, setproduit] = useState({});
  const [formData, setFormData] = useState({
    image: null,
    titre: '',
    description: '',
    prix_achat: '',
    old_prix: '',
    nv_prix: '',
    quantité: 1,
    promotion: '',
    etat_livraison: 0,
    prix_livraison: 0,
    categories_id: '',
    id_vendeur: 1,
    
  });
  const [categories, setcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rep, setRep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const navigate = useNavigate();
  if(auth.user && auth.user.type === 'vendeur'){
    navigate('/dashbord');
}
if(auth.user && auth.user.type === 'client' || !auth.user){
  navigate('/');
}
  useEffect(() => {
    const apiUrl = `${api}/api/categorieslist`;
    axios.get(apiUrl)
      .then((response) => {
        setcategories(response.data);
      })
      .catch((error) => {
        
      });
  }, []);

  useEffect(() => {
    axios.get(`${api}/api/showproduit/${id}`).then((response) => {
      setproduit(response.data.prod);
      setFormData({
        titre: response.data.prod.titre,
        description: response.data.prod.description,
        prix_achat: response.data.prod.prix_achat,
        old_prix: response.data.prod.old_prix,
        nv_prix: response.data.prod.nv_prix,
        quantité: response.data.prod.quantité,
        promotion: response.data.prod.promotion,
        etat_livraison: response.data.prod.etat_livraison,
        prix_livraison: response.data.prod.prix_livraison,
        pourcentagepromo: response.data.prod.pourcentagepromo,
        categories_id: response.data.prod.categories_id,
        id_vendeur: response.data.prod.id_vendeur,
      });
      setLoading(false);
    }).catch((error) => {

      setLoading(false);
    });
  }, [id]);

  

  
  const updateproduit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`${api}/api/updateproduct/${id}`, formData, {
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
      } else {
       
        setLoading(false);

      }
    }
  };
  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/listproduits');
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <div>
     
      <form onSubmit={updateproduit} method="POST" className='profill'>
      <Link className="b" to={`/updateimg/${produit.id}/image`}>
        <img src={`${api}/images/${produit.image}`} alt={produit.image}
          style={{ width: '100px', height: '100px' }} /></Link>
           <Link className="b" to={`/updateimg/${produit.id}/image1`}>
           {produit.image1 && (
    produit.image1.includes('.mp4') ? (
      <div className="video-container" >
  <video controls style={{ width: '100px', height: '100px' }}>
    <source src={`${api}/images/${produit.image1}`} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

    ) : (  <img
      src={`${api}/images/${produit.image1}`}
      alt={produit.image1}
      style={{ width: '100px', height: '100px' }}
      
    />)
  )}
</Link>
          <Link className="b" to={`/updateimg/${produit.id}/image2`}>
              <img src={`${api}/images/${produit.image2}`} alt={produit.image2}
          style={{ width: '100px', height: '100px' }} /></Link>
          <Link className="b" to={`/updateimg/${produit.id}/image3`}>
              <img src={`${api}/images/${produit.image3}`} alt={produit.image3}
          style={{ width: '100px', height: '100px' }} /></Link>
        <label>Product Name:</label>
        <input type="text" value={formData.titre} name="titre" onChange={(e) => setFormData({ ...formData, titre: e.target.value })} />
        <br /><br />
        <label>Categorie:</label>
        <select name='categories_id' value={formData.categories_id} onChange={(e) => setFormData({ ...formData, categories_id: e.target.value })}>
          {categories.map((e, n) => (
            <option key={n} value={e.id}>{e.titre}</option>
          ))}
        </select>
        <br /><br />
        <label>Product Description:</label>
        <textarea value={formData.description} name="description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <br /><br />
        <label>Product Prix Achat:</label>
        <input type="text" name="prix_achat" value={formData.prix_achat} onChange={(e) => setFormData({ ...formData, prix_achat: e.target.value })} />
        <br /><br />
        <label>Product old Price:</label>
        <input type="text" name="old_prix" value={formData.old_prix} onChange={(e) => setFormData({ ...formData, old_prix: e.target.value })} />
        <br /><br />
       
        <label>Product new Price:</label>
        <input type="text" name="nv_prix" value={formData.nv_prix} onChange={(e) => setFormData({ ...formData, nv_prix: e.target.value })} />
        <br /><br />
        <label>Quantité:</label>
        <input type="number" name="quantité" value={formData.quantité} onChange={(e) => setFormData({ ...formData, quantité: e.target.value })} />
        <br /><br />
        <label>Promotion:</label>
        <select name='promotion' value={formData.promotion} onChange={(e)=>setFormData({...formData,promotion:e.target.value})}>
          <option value='0'>Non</option>
          <option value='1'>Oui</option>
        </select>
        <label>Etat Livraison:</label>
        <select name='etat_livraison' value={formData.etat_livraison} onChange={(e)=>setFormData({...formData,etat_livraison:e.target.value})}>
          <option value='1'>Livraison Gratuit</option>
          <option value='0'>Non Gratuit</option>
        </select>
        <br /><br />
        {formData.etat_livraison == 0 ?<>
        <label>Prix Livraison:</label>
        <input type="number" name="prix_livraison" value={formData.prix_livraison} onChange={(e) => setFormData({ ...formData, prix_livraison: e.target.value })} />
        <br /><br /></>:''}
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

export default Updateproduit;
