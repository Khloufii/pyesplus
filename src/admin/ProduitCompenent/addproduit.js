import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './addproduct.css';
import Popup from '../../popupvalide';// Assurez-vous d'ajuster le chemin en fonction de votre structure de fichiers
import Popuperror from '../../popuperror';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authprovider';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategories, selectapi } from '../../reducer';
import LoadingSpinner from '../../loading/loading';


function AddProduct() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const [titre, settitre] = useState('');
  const [description, setdescription] = useState('');
  const [prix_achat, setprix_achat] = useState('');
  const [old_prix, setold_prix] = useState('');
  const [nv_prix, setnv_prix] = useState('');
  const [quantité, setquantité] = useState(1);
  const [promotion, setpromotion] = useState(0);
  const [etat_livraison, setetatlivraison] = useState(0);
  const [prix_livraison, setprixlivraison] = useState(0);
  const [état, setétat] = useState('DISPONIBLE');
  const [categories_id, setcategorie_id] = useState(1);
  const [id_vendeur, setid_vendeur] = useState();
  const [productImage, setProductImage] = useState(null);
  const [productImage1, setProductImage1] = useState(null);
  const [productImage2, setProductImage2] = useState(null);
  const [productImage3, setProductImage3] = useState(null);
  const [categories, setcategories] = useState([]);
  const [rep, setrep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showpopuperror,setshowpopuperror]= useState(false);
  const [loading,setLoading]= useState(true);
  const categori = useSelector(selectCategories);

  const navigate = useNavigate();
 
  if(auth.user && auth.user.type === 'vendeur'){
    navigate('/dashbord');
}
if(auth.user && auth.user.type === 'client' || !auth.user){
  navigate('/');
}
useEffect(() => {
  setcategories(categori);
  if(categori){
    setLoading(false);
  }
}, [categori]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
  };
  const handleImageChange1 = (e) => {
    const file = e.target.files[0];
    setProductImage1(file);
  };
  const handleImageChange2 = (e) => {
    const file = e.target.files[0];
    setProductImage2(file);
  };   const handleImageChange3 = (e) => {
    const file = e.target.files[0];
    setProductImage3(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('image', productImage);
    formData.append('image1', productImage1);
    formData.append('image2', productImage2);
    formData.append('image3', productImage3);
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('prix_achat', prix_achat);
    formData.append('old_prix', old_prix);
    formData.append('nv_prix', nv_prix);
    formData.append('quantité', quantité);
    formData.append('état', état);
    formData.append('promotion', promotion);
    formData.append('etat_livraison', etat_livraison);
    formData.append('prix_livraison', prix_livraison);
    formData.append('categories_id', categories_id);
    formData.append('id_vendeur', auth.user && auth.user.id);

    try {
      const response = await axios.post(`${api}/api/addproduits`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
    navigate('/listproduits');
  };
  const handlePopuperrorClose = () => {
    setshowpopuperror(false);
  };
  if(loading){
    return <LoadingSpinner/>
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className='profill'>
        {rep}<br />
        <label>Product Name:</label>
        <input type="text" value={titre} name="titre" onChange={(e) => settitre(e.target.value)} />
        <br/><br/>
      <label>Categorie:</label>
      <select name='categories_id' value={categories_id} onChange={(e)=>setcategorie_id(e.target.value)}>
   {categories.map((e,n)=>(
    <option key={n} value={e.id} >{e.titre}</option>
))}
</select>
<br/><br/>


      <label>Product Description:</label>
      <textarea value={description} name="description" onChange={(e) => setdescription(e.target.value)} />
      <br/><br/>
      <label>Product Prix Achat:</label>
      <input type="text" name="prix_achat" value={prix_achat} onChange={(e) => setprix_achat(e.target.value)} />
      <br/><br/>
      <label>Product old Price:</label>
      <input type="text" name="old_prix" value={old_prix} onChange={(e) => setold_prix(e.target.value)} />
      <br/><br/>
      <label>Product new Price:</label>
      <input type="text" name="nv_prix" value={nv_prix} onChange={(e) => setnv_prix(e.target.value)} />
      <br/><br/>
      <label>Quantité:</label>
      <input type="number" name="quantité" value={quantité} onChange={(e) => setquantité(e.target.value)} />
      <br/><br/>
      <label>promotion:</label>
      <select name='promotion' value={promotion} onChange={(e)=>setpromotion(e.target.value)}>
        <option value='0'>non</option>
        <option value='1'>oui</option>
      </select>
      <br/><br/>
      <label>Livraison:</label>
      <select name='etat_livraison' value={etat_livraison} onChange={(e)=>setetatlivraison(e.target.value)}>
        <option value='0'>Non Gratuit</option>
        <option value='1'>Gratuit</option>
      </select>
      <br/><br/>
     
      {etat_livraison == 0 ?<>
      <label>Prix Livraison:</label>
      <input type="number" name="prix_livraison" value={prix_livraison} onChange={(e) => setprixlivraison(e.target.value)} />
      <br/><br/>
      </>:''}
            <label>Product Image:</label>
      <input type="file" name="image" onChange={handleImageChange} />
      <br/>
      <label>Image Ou Video</label>
      <input type="file" name="image1" onChange={handleImageChange1} />
      <br/>
      <input type="file" name="image2" onChange={handleImageChange2} />
      <br/> 
      <input type="file" name="image3" onChange={handleImageChange3} />
      <br />
      <button type="submit">Add Product</button>
      </form>

      <Popup show={showPopup} onClose={handlePopupClose}>
        <p>Product added successfully!</p>
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
  );
}

export default AddProduct;
