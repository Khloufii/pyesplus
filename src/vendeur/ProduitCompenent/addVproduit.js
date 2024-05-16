import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './addproduct.css';
import Popup from '../../popupvalide'; // Assurez-vous d'ajuster le chemin en fonction de votre structure de fichiers
import Popuperror from '../../popuperror';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authprovider';
import LoadingSpinner from '../../loading/loading';
import { useDispatch, useSelector } from 'react-redux';
import { selectapi, selectprofil } from '../../reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

function AddVProduct() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const api = useSelector(selectapi);
  const profil = useSelector(selectprofil);
  const [titre, settitre] = useState('');
  const [description, setdescription] = useState('');
  const [prix_achat, setprix_achat] = useState(0);
  const [old_prix, setold_prix] = useState();
  const [nv_prix, setnv_prix] = useState();
  const [quantité, setquantité] = useState(1);
  const [état, setétat] = useState('DISPONIBLE');
  const [promotion, setpromotion] = useState(0);
  const [etat_livraison, setetatlivraison] = useState(0);
  const [prix_livraison, setprixlivraison] = useState(0);
  const [categories_id, setcategorie_id] = useState(1);
  const [id_vendeur, setid_vendeur] = useState(auth.user && auth.user.id);
  const [productImage, setProductImage] = useState(null);
  const [productImage1, setProductImage1] = useState(null);
  const [productImage2, setProductImage2] = useState(null);
  const [productImage3, setProductImage3] = useState(null);
  const [categories, setcategories] = useState([]);
  const [rep, setrep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showpopuperror, setshowpopuperror] = useState(false);
  const [loading, setLoading] = useState(true);
  const [couleursSelectionnees, setCouleursSelectionnees] = useState([]);
  const [tailles, setTailles] = useState([]);

  const navigate = useNavigate();
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
    axios
      .get(apiUrl)
      .then((response) => {
        setcategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

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
  };
  const handleImageChange3 = (e) => {
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
    formData.append('id_vendeur', id_vendeur);
    formData.append('tailles', JSON.stringify(tailles));
    formData.append('Colors', JSON.stringify(couleursSelectionnees)); // Convertir en chaîne JSON avant de l'ajouter au formulaire

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
        if (error.response.status === 401) {
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
    navigate('/produitvendeur');
  };
  const handlePopuperrorClose = () => {
    setshowpopuperror(false);
  };
  const handleCouleurChange = (e, couleur) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setCouleursSelectionnees([...couleursSelectionnees, couleur]);
    } else {
      setCouleursSelectionnees(couleursSelectionnees.filter((c) => c !== couleur));
    }
  };

  const handleTailleChange = (e) => {
    const taille = e.target.value;
    if (tailles.includes(taille)) {
      // Si la taille est déjà sélectionnée, la retirer
      setTailles(tailles.filter((t) => t !== taille));
    } else {
      // Sinon, l'ajouter à la liste des tailles sélectionnées
      setTailles([...tailles, taille]);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (profil.état !== 'autorisé') {
    return null;
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className='profill'>
        {rep}
        <br />
        <label>Product Name:</label>
        <input type='text' value={titre} name='titre' onChange={(e) => settitre(e.target.value)} />
        <br />
        <br />
        <label>Categorie:</label>
        <select name='categories_id' value={categories_id} onChange={(e) => setcategorie_id(e.target.value)}>
          {categories.map((e, n) => (
            <option key={n} value={e.id}>
              {e.titre}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label>Product Description:</label>
        <textarea value={description} name='description' onChange={(e) => setdescription(e.target.value)} />
        <br />
        <br />

        <label>Couleurs:</label>
        <table>
          {couleursData.map((couleur, index) => (
            <tr key={index}>
              <td><input
                type='checkbox'
                value={couleur.nom}
                checked={couleursSelectionnees.includes(couleur.nom)}
                onChange={(e) => handleCouleurChange(e, couleur.nom)}
              />
              
              </td>
              <td>{couleur.nom} <FontAwesomeIcon icon={faSquare} style={{ color: couleur.code }} /></td> 
            </tr>
          ))}
        </table>

        <label>Tailles:</label>
<table>
  {['standard','S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size, index) => {
   
      return (
        <tr key={index}>
          <td><input type='checkbox' value={size} checked={tailles.includes(size)} onChange={handleTailleChange} /></td>
          <td>{size}</td>
         
        </tr>
      );
    } 
  )}
</table>


<table>
  {Array.from({ length: 47 - 31 + 1 }, (_, index) => {
    const numericSize = index + 31; // Tailles numériques à partir de 31
    return (
      <tr key={numericSize}>
        <td><input type='checkbox' value={numericSize} checked={tailles.includes(numericSize.toString())} onChange={handleTailleChange} /></td>
        <td>{numericSize}</td>
      </tr>
    );
  })}
</table>



        <label>Product Prix Achat:</label>
        <input type='text' name='prix_achat' value={prix_achat} onChange={(e) => setprix_achat(e.target.value)} />
        <br />
        <br />
        <label>Product old Price:</label>
        <input type='number' name='old_prix' value={old_prix} onChange={(e) => setold_prix(e.target.value)} />
        <br />
        <br />
        <label>Product new Price:</label>
        <input type='number' name='nv_prix' value={nv_prix} onChange={(e) => setnv_prix(e.target.value)} />
        <br />
        <br />
        <label>Quantité:</label>
        <input type='number' name='quantité' value={quantité} onChange={(e) => setquantité(e.target.value)} />
        <br />
        <br />
        <label>promotion:</label>
        <select name='promotion' value={promotion} onChange={(e) => setpromotion(e.target.value)}>
          <option value='0'>non</option>
          <option value='1'>oui</option>
        </select>
        <br />
        <br />

        <label>Livraison:</label>
        <select name='etat_livraison' value={etat_livraison} onChange={(e) => setetatlivraison(e.target.value)}>
          <option value='0'>Non Gratuit</option>
          <option value='1'>Gratuit</option>
        </select>
        <br />
        <br />

        {etat_livraison == 0 ? (
          <>
            <label>Prix Livraison:</label>
            <input type='number' name='prix_livraison' value={prix_livraison} onChange={(e) => setprixlivraison(e.target.value)} />
            <br />
            <br />
          </>
        ) : (
          ''
        )}
        <label>Product Image:</label>
        <input type='file' name='image' onChange={handleImageChange} />
        <br />
        <label>Image Ou Video</label>
        <input type='file' name='image1' onChange={handleImageChange1} />
        <br />
        <input type='file' name='image2' onChange={handleImageChange2} />
        <br />
        <input type='file' name='image3' onChange={handleImageChange3} />
        <br /> <br />
        <button type='submit'>Add Product</button>
      </form>

      <Popup show={showPopup} onClose={handlePopupClose}>
        <p>Product added successfully!</p>
        <button className='close-btn' onClick={handlePopupClose}>
          Close
        </button>
      </Popup>
      <Popuperror show={showpopuperror} onClose={handlePopuperrorClose}>
        <p>{rep}</p>
        <button className='close-btn' onClick={handlePopuperrorClose}>
          Close
        </button>
      </Popuperror>
    </div>
  );
}

export default AddVProduct;
