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
import { useDispatch, useSelector } from 'react-redux';
import { selectapi, selectprofil } from '../../reducer';

import { faSquare } from '@fortawesome/free-solid-svg-icons';
function UpdateVproduit() {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const profil = useSelector(selectprofil);
  const { id } = useParams();
  const [produit, setproduit] = useState({});
  const [formData, setFormData] = useState({
    image: null,
    titre: '',
    description: '',
    prix_achat: 0,
    old_prix: '',
    nv_prix: '',
    quantité: 1,
    promotion: 1,
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
  const [couleursprod, setCouleursprod] = useState([]);
  const [taillprod, settaillprod] = useState([]);
  const [couleursSelectionnees, setCouleursSelectionnees] = useState([]);
  const [tailles, setTailles] = useState([]);
  const couleursData = [
    { nom: 'Blanc', code: '#FFFFFF' },
    { nom: 'Noir', code: '#000000' },
    { nom: 'Gris', code: '#808080' },
    { nom: 'Rouge', code: '#FF0000' },
    { nom: 'Vert', code: '#00FF00' },
    { nom: 'Bleu', code: '#0000FF' },
    { nom: 'Jaune', code: '#FFFF00' },
    { nom: 'Orange', code: '#FFA500' },
    { nom: 'Violet', code: '#800080' },
    { nom: 'Rose', code: '#FFC0CB' },
    { nom: 'Marron', code: '#A52A2A' },
    { nom: 'Cyan', code: '#00FFFF' },
    { nom: 'Magenta', code: '#FF00FF' },
    { nom: 'Argent', code: '#C0C0C0' },
    { nom: 'Or', code: '#FFD700' },
    { nom: 'Turquoise', code: '#40E0D0' },
    { nom: 'Sable', code: '#F4A460' },
    { nom: 'Lavande', code: '#E6E6FA' },
    { nom: 'Teal', code: '#008080' },
    { nom: 'Bourgogne', code: '#800000' },
    { nom: 'Sarcelle', code: '#008080' },
    { nom: 'Indigo', code: '#4B0082' },
    { nom: 'Aqua', code: '#00FFFF' },
    { nom: 'Vert lime', code: '#00FF00' },
    { nom: 'Olive', code: '#808000' },
    { nom: 'Gris foncé', code: '#A9A9A9' },
    { nom: 'Beige', code: '#F5F5DC' },
    { nom: 'Bleu ciel', code: '#87CEEB' },
    { nom: 'Citron vert', code: '#32CD32' },
    { nom: 'Orchidée', code: '#DA70D6' },
    { nom: 'Bleu royal', code: '#4169E1' },
    { nom: 'Aigue-marine', code: '#7FFFD4' },
    { nom: 'Bleu marine', code: '#000080' },
    { nom: 'Saphir', code: '#0F52BA' },
    { nom: 'Chartreuse', code: '#7FFF00' },
    { nom: 'Bleu clair', code: '#ADD8E6' },
    { nom: 'Bleu turquoise', code: '#00CED1' },
    { nom: 'Fuchsia', code: '#FF02FF' },
    { nom: 'Rouge indien', code: '#CD5C5C' },
    { nom: 'Lime', code: '#00FF00' },
    { nom: 'Bleu poudre', code: '#B0E0E6' },
    { nom: 'Brun sable', code: '#F4A460' },
    { nom: 'Or rose', code: '#FFC0CB' },
  ];

  const navigate = useNavigate();
  if (!auth.user) {
    navigate('/dashbord');
  }
  if (auth.user) {
    if (auth.user.type === 'admin') {
      navigate('/dashbord');
    } else if (auth.user.type === 'client') {
      navigate('/');
    }
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
        categories_id: response.data.prod.categories_id,
        id_vendeur: response.data.prod.id_vendeur,
      });
     

      setCouleursprod(response.data.couleurs);
      settaillprod(response.data.tailles);
      setLoading(false);
    }).catch((error) => {
    
      setLoading(false);
    });
  }, [id]);

  

  
  const updateproduit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedFormData = {
      ...formData,
      couleursprod: couleursprod, // Inclure les couleurs liées au produit dans l'objet formData
      taillprod: taillprod // Inclure les tailles liées au produit dans l'objet formData
    };
    try {
      const response = await axios.put(`${api}/api/updateproduct/${id}`, updatedFormData, {
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
    navigate('/produitvendeur');
  };

  const handlePopupErrorClose = () => {
    setShowPopupError(false);
  };

  const handleCouleurChange = (e, couleur) => {
  const isChecked = e.target.checked;
  let updatedCouleursProd = [...couleursprod]; // Faites une copie de l'array des couleurs liées au produit
  
  if (isChecked) {
    updatedCouleursProd.push(couleur); // Ajoutez la couleur si elle est cochée
  } else {
    updatedCouleursProd = updatedCouleursProd.filter((c) => c !== couleur); // Retirez la couleur si elle est décochée
  }

  setCouleursprod(updatedCouleursProd); // Mettez à jour l'état des couleurs liées au produit
};

const handleTailleChange = (e) => {
  const taille = e.target.value;
  let updatedTaillProd = [...taillprod]; // Faites une copie de l'array des tailles liées au produit
  
  if (updatedTaillProd.includes(taille)) {
    updatedTaillProd = updatedTaillProd.filter((t) => t !== taille); // Retirez la taille si elle est déjà sélectionnée
  } else {
    updatedTaillProd.push(taille); // Ajoutez la taille si elle n'est pas encore sélectionnée
  }

  settaillprod(updatedTaillProd); // Mettez à jour l'état des tailles liées au produit
};

  

  if (loading) {
    return <LoadingSpinner/>;
  }
  if (profil.état !== 'autorisé') {
    return null;
  }
  return (
    <div>
      <form onSubmit={updateproduit} method="POST" className='profill'>
      <Link className="b" to={`/updateVimg/${produit.id}/image`}>
        <img src={`${api}/images/${produit.image}`} alt={produit.image}
          style={{ width: '100px', height: '100px' }} /></Link>
           <Link className="b" to={`/updateVimg/${produit.id}/image1`}>
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
      
          <Link className="b" to={`/updateVimg/${produit.id}/image2`}>
              <img src={`${api}/images/${produit.image2}`} alt={produit.image2}
          style={{ width: '100px', height: '100px' }} /></Link>
          <Link className="b" to={`/updateVimg/${produit.id}/image3`}>
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

        <label>Couleurs:</label>
<table>
  {couleursData.map((couleur, index) => (
    <tr key={index}>
      <td>
        <input
          type='checkbox'
          value={couleur.nom}
          checked={couleursprod.includes(couleur.nom)} // Vérifiez si la couleur est déjà liée au produit
          onChange={(e) => handleCouleurChange(e, couleur.nom)}
        />
      </td>
      <td>{couleur.nom} <FontAwesomeIcon icon={faSquare} style={{ color: couleur.code }} /></td>
    </tr>
  ))}
</table>




<label>Tailles:</label>
<table>
  {['standard','S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((taille, index) => (
    <tr key={index}>
      <td><input type='checkbox' value={taille} checked={taillprod.includes(taille)} onChange={handleTailleChange} /></td>
      <td>{taille}</td>
    </tr>
  ))}
</table>
<table>
  {Array.from({ length: 47 - 31 + 1 }, (_, index) => {
    const numericSize = index + 31; // Tailles numériques à partir de 31
    return (
      <tr key={numericSize}>
        <td><input type='checkbox' value={numericSize} checked={taillprod.includes(numericSize.toString())} onChange={handleTailleChange} /></td>
        <td>{numericSize}</td>
      </tr>
    );
  })}
</table>

        <label>Product prix achat:</label>
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

export default UpdateVproduit;
