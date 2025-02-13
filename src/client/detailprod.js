import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './DetailProduit.css';
import { Link } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import Popup from '../popupvalide';// Assurez-vous d'ajuster le chemin en fonction de votre structure de fichiers
import Popuperror from '../popuperror';
import { useAuth } from '../authprovider';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCar, faCartPlus, faClose, faEnvelope, faPlus, faShop, faShopLock, faShoppingBag, faSpinner, faStar, faStore, faStoreAlt, faStoreAltSlash, faTruckLoading } from '@fortawesome/free-solid-svg-icons';
import Accueil from '../accueil';
import { FaProductHunt } from 'react-icons/fa';
import Productscategorie from '../produisparcategories';
import { useDispatch, useSelector } from 'react-redux';
import { selectExchangeRates, selectIp, selectPanier, selectapi, selectloading, selectprofil, selectselectedCurrency, setIp, setcategorie_id } from '../reducer';
import LoadingSpinner from '../loading/loading';
import Loading2 from '../loading/loading2';
import Loading4 from '../loading/loading4';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import Loading3 from '../loading/loading3';
const DetailProduit = () => {
  const auth = useAuth();
  const api = useSelector(selectapi);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(selectPanier);
  const detailProduitRef = useRef(null);
  const [produit, setProduit] = useState({});
  var prixlivraizon = produit.prix_livraison;
  if(produit.etat_livraison === 1){
   prixlivraizon = 0; 
  }
  const topRef = useRef(null);
  const [quantité, setQuantite] = useState(1);
  const [code_promo, setCodePromo] = useState('');
  const [bon_achat, setBonAchat] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const { id } = useParams();
  const [reponse, setReponse] = useState('');
  const [errqte, seterrqte] = useState('');
  const prix_total = (produit.nv_prix * quantité) + prixlivraizon;
  const [rep, setrep] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showpopuperror,setshowpopuperror]= useState(false);
  const [typeReduction,setReduction]= useState('null');
  const [Id_Reduction,setId_Reduction]= useState(0);
  const [comments, setComments] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [commantaire, setcommataire] = useState('*');
  const [nbetoile, setnbetoil] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingcart, setLoadingcart] = useState(false);
  const [imgpr, setimgpr] = useState();
  const [imgpr1, setimgpr1] = useState();
  const [imgpr2, setimgpr2] = useState();
  const [imgpr3, setimgpr3] = useState();
  const [showcode, setshowcode] = useState(false);
  const [user, setUser] = useState({});
  const [clientcommantairee, setclientcommantaire] = useState([]);
  const selectedCurrency = useSelector(selectselectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
  const lodin = useSelector(selectloading);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);
const [showExpandedImage, setShowExpandedImage] = useState(false);

const [showAllComments, setShowAllComments] = useState(false);
const displayedComments = showAllComments ? comments : comments.slice(-3);
const profil = useSelector(selectprofil);
const ip = useSelector(selectIp);
const [couleursprod, setCouleursprod] = useState([]);
  const [taillprod, settaillprod] = useState([]);
 // You might want to consider using [auth.user, auth.user.id] if the effect depends on both
 const [selectedSize, setSelectedSize] = useState('**');
  const [selectedColor, setSelectedColor] = useState('**');
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


  const [isMobile, setIsMobile] = useState(window.innerWidth <= 733);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 733);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

 
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/showproduit/${id}`);
        setProduit(response.data.prod);
        setnbetoil(response.data.etoile);
        setimgpr(response.data.prod.image);
        setimgpr1(response.data.prod.image1);
        setimgpr2(response.data.prod.image2);
        setimgpr3(response.data.prod.image3);
        if(response.data.prod.image1.includes('.mp4')){
          setimgpr(response.data.prod.image1);
          setimgpr1(response.data.prod.image);
        }
        dispatch(setcategorie_id(response.data.prod.categories_id));
        setCouleursprod(response.data.couleurs);
      settaillprod(response.data.tailles);
      dispatch(setIp(localStorage.getItem('uniqueId')));
        setLoading(false);
      } catch (error) {
        
      }
    };
    useEffect(() => {
    fetchData();
  }, [id]);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/showuser/${produit.id_vendeur}`);
        setUser(response.data.user);
        
        
        setLoading(false);
      } catch (error) {
       
        setLoading(false);
      }
    };

    fetchData();
  }, [produit.id_vendeur]);




  const addToCart = async () => {
    setLoadingcart(true);
   
    const prcart = cart.filter((e)=> e.produit_id === produit.id);
    const nbqte = prcart.reduce((total,e)=> total + e.quantité,0);

    if(prcart){
      if(Number(nbqte) + Number(quantité) > Number(produit.quantité)){
        seterrqte('Quantité indisponible !!');
        setrep('Quantité indisponible !!');
        setLoadingcart(false);
        setshowpopuperror(true);
        return;
      }

    }
   if (!quantité) {
      seterrqte('Quantité indisponible !!');
      setrep('Quantité indisponible !!');
      setLoadingcart(false);
      setshowpopuperror(true);
      return;
    }
     if (quantité <= 0) {
      seterrqte('Quantité indisponible !!');
      setrep('Quantité indisponible !!');
      setLoadingcart(false);
      setshowpopuperror(true);
      return;
    }
    if (produit.quantité < quantité) {
      seterrqte('Quantité indisponible !!');
      setrep('Quantité indisponible !!');
      setLoadingcart(false);
      setshowpopuperror(true);
      return;
    }
    
   
  
  
    const apiUrlCodePromo = `${api}/api/codepromolist`;
    const apiUrlBonAchat = `${api}/api/bonachatlist`;
  
    try {
      const [codePromoResponse] = await Promise.all([
        axios.get(apiUrlCodePromo),
     
      ]);
  
      const codePromoList = codePromoResponse.data.list;
     
  
      const selectedCodePromo = codePromoList.find((e) => e.titre === code_promo);
  

      if (code_promo.trim() !== '' && !selectedCodePromo) {
        setReponse('Code promo incorrect');
        setrep('Code promo incorrect');
        setLoadingcart(false);
        setshowpopuperror(true);
        return;
      }
        
     
      var prix = prix_total;
      var reduction = 'aucun';
      var idreduction = 0;
      if(selectedCodePromo){
        const prixReduction = (prix_total * (selectedCodePromo?.pourcentage || 0)) / 100;
        var prix = prix_total - prixReduction;
        var reduction = 'code_promo';
        var idreduction = selectedCodePromo.id;
      }

      const Client_id = auth.user ? auth.user.id : ip;
      try {
       
          await axios.post(`${api}/api/ajouter-au-panier`, {
            quantité,
            prix,
            reduction : reduction,
            idreduction : idreduction,
            color : selectedColor,
            taill : selectedSize,
            produit_id: produit.id,
            client_id: Client_id,
          });
        
     
      
        setrep('Produit bien ajouté');
        setLoadingcart(false);
        setShowPopup(true);
      } catch (error) {
        
      }
    } catch (error) {
    
    }
  };
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${api}/api/comments/${id}`);
      setclientcommantaire(response.data.clients);
      setComments(response.data.comments);
      setLoading(false);
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchComments(); // Utilisation de fetchComments ici
  }, [id]);

  const submitComment = async () => {
    if(!auth.user){
      navigate(`/login/${produit.id}`);
    }
    try {
      // Assuming you have an API endpoint for adding comments and ratings
      await axios.post(`${api}/api/add-comment`, {
        productId: id,
        userId: auth.user.id,
        comment: commantaire,
        rating: userRating,
      });
      fetchComments();
      fetchData();
      setLoading(false);      // Utilisation de fetchComments ici
      setUserRating(0);
      setcommataire('');
      // Refresh comments after submission
    } catch (error) {
     
    }
  };
  const handleCommentInputClick = (e) => {
    // Stop the click event from reaching parent elements
    e.stopPropagation();
  };

  const handleStarClick = (e,index) => {
    // Stop the click event from reaching parent elements
    e.stopPropagation();
    setUserRating(index + 1);
  };
  // ... rest of the component code


const handleImageExpand = (imageUrl) => {
  setExpandedImage(imageUrl);
  setShowExpandedImage(true);
};
  

  

  

  
  
  const handlePopupClose = () => {
    setShowPopup(false);
    setReduction(null);
    setId_Reduction(null)
    navigate('/panier');
  };
  const handlePopuperrorClose = () => {
    setshowpopuperror(false);
  };
  const changeimg = (img) => {
    if (img.includes('.mp4')) {
      // Si c'est une vidéo, mettez à jour imgpr pour contenir le lien vidéo
      setimgpr(img);
    } else {
      // Sinon, c'est une image, donc mettez simplement à jour imgpr
      setimgpr(img);
    }
  };

 const codepromo = () => {
  setshowcode(!showcode);
 }

 
const toggleShowAllComments = () => {
  setShowAllComments(!showAllComments);
};

const handleSizeChange = (size) => {
  setSelectedSize(size);
};

const handleColorChange = (color) => {
  setSelectedColor(color);
};


if(loading){
  return <LoadingSpinner/>
}

  return (
    <>

      <div className="detail-produit-container" id="detailSection">
        {produit.promotion ?<span className='sppourcentage'>- {produit.pourcentagepromo} %</span>:''}
        <div className="img-container">
        
        
       {showExpandedImage && (
  <div className="expanded-image-overlay" onClick={() => setShowExpandedImage(false)}>
    { imgpr.includes('.mp4') ? (<video controls className="videodet">
        <source src={expandedImage} type="video/mp4" 
        alt="Expanded" className="expanded-image"/>
        Your browser does not support the video tag.
      </video>):(<><FontAwesomeIcon
              
              icon={faClose}
             className='faclose'
              
            />
    <img src={expandedImage} alt="Expanded" className="expanded-image" /></> 
  )}
  </div>
)}
{imgpr && (
    imgpr.includes('.mp4') ? (
      <video controls className="videodet">
        <source src={`${api}/images/${imgpr}`} type="video/mp4" 
         onClick={() => handleImageExpand(`${api}/images/${imgpr}`)}/>
        Your browser does not support the video tag.
      </video>
    ) : ( 
      <img
  src={`${api}/images/${imgpr}`}
  alt={produit.image}
  className="imgdetail"
  onClick={() => handleImageExpand(`${api}/images/${imgpr}`)}
/>
    )
  )}
 




  {produit.image1 && (
    imgpr.includes('.mp4') ? (
      <img
      src={`${api}/images/${imgpr1}`}
      alt={produit.image1}
      className="imgdetail1"
      onClick={() => handleImageExpand(`${api}/images/${imgpr1}`)}
    />
      
    ) : imgpr1.includes('.mp4') ?(
      <div className="video-container" onClick={() => handleImageExpand(`${api}/images/${imgpr1}`)}>
  <video controls className="imgdetail1">
    <source src={`${api}/images/${imgpr1}`} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

    ) : (  <img
      src={`${api}/images/${imgpr1}`}
      alt={produit.image1}
      className="imgdetail1"
      onClick={() => handleImageExpand(`${api}/images/${imgpr1}`)}
    />)
  )}


   {produit.image1 && (
    imgpr.includes('.mp4') ? (
      <img
      src={`${api}/images/${imgpr2}`}
      alt={produit.image2}
      className="imgdetail1"
      onClick={() => handleImageExpand(`${api}/images/${imgpr2}`)}
    />
      
    ) : imgpr2.includes('.mp4') ?(
      <video controls className="imgdetail1" >
      <source src={`${api}/images/${imgpr2}`} type="video/mp4"  onClick={() => handleImageExpand(`${api}/images/${imgpr2}`)}/>
      Your browser does not support the video tag.
    </video>
    ) : (  <img
      src={`${api}/images/${imgpr2}`}
      alt={produit.image2}
      className="imgdetail1"
      onClick={() => handleImageExpand(`${api}/images/${imgpr2}`)}
    />)
  )}


   {produit.image1 && (
    imgpr.includes('.mp4') ? (
      <img
      src={`${api}/images/${imgpr3}`}
      alt={produit.image3}
      className="imgdetail1"
      onClick={() => handleImageExpand(`${api}/images/${imgpr3}`)}
    />
      
    ) : imgpr3.includes('.mp4') ?(
      <video controls className="imgdetail1" >
      <source src={`${api}/images/${imgpr3}`} type="video/mp4"  onClick={() => handleImageExpand(`${api}/images/${imgpr3}`)}/>
      Your browser does not support the video tag.
    </video>
    ) : (  <img
      src={`${api}/images/${imgpr3}`}
      alt={produit.image3}
      className="imgdetail1"
      onClick={() => handleImageExpand(`${api}/images/${imgpr3}`)}
    />)
  )}





         
          
        </div>
        
        <div className="product-details">
        {nbetoile && Array.from({ length: nbetoile }).map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className={index < nbetoile ? 'star' : ''}
              style={{ color: 'orange' }}
            />
        ))}
        <h2 className="titre">{produit.titre}</h2>
       
        <p className="description">{produit.description}</p>
         

          <div className="size-color-section">
  <div className="size-section">
    <p>Taille : {selectedSize}</p>
    <div className="size-options">
      {taillprod.map((size) => (
        <p
          key={size}
          className={`size-option ${selectedSize === size ? 'selected' : ''}`}
          onClick={() => handleSizeChange(size)}
        >
          {size}
        </p>
      ))}
    </div>
  </div>
  <div className="color-section">
    <p>Couleur : {selectedColor}</p> 
    <ul className="color-options">
      {couleursprod.map((color) => (
        
          <FontAwesomeIcon icon={faSquare} style={{ color: couleursData.find(e => e.nom === color)?.code || 'black' }} 
            className={`color-option ${selectedColor === color ? 'selected' : ''}`}
            onClick={() => handleColorChange(color)}/>
       
      ))}
    </ul>
  </div>
</div>



          <p className="old_prix">
           {exchangeRates ? ((produit.old_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : produit.old_prix} <span className=''>{selectedCurrency}</span> 
</p>
          <p className="new_prix"> 
            {exchangeRates ? ((produit.nv_prix / exchangeRates.MAD) * exchangeRates[selectedCurrency]).toFixed(2) : produit.nv_prix} <span className=''>{selectedCurrency}</span> 
</p>

<p className='livraisondet'><FontAwesomeIcon
                                                
                                                icon={faCar}
                                                className=''
                                               
                                            /> {produit.etat_livraison === 1 ? 'Livraison Gratuit' : `Livraison ${produit.prix_livraison} MAD`}
                                            </p>
          <p className='userv'><FontAwesomeIcon icon={faStore} className=''/> Vendeur : <span className='uservv'>  {user.name} {user.prenom}</span></p>
        
          Quantité :  <input className="quantité" type="number" value={quantité} onChange={(e) => setQuantite(e.target.value)} min="1" />
          <span className="error-message">  {errqte} </span>
          <br/>
          <button className="btnadd" onClick={()=>codepromo()}>Ajouter code promo</button>
          <span>{showcode ? <><input className='inputcode' type='number' value={code_promo} onChange={(e)=>setCodePromo(e.target.value)} placeholder='Votre code promo!! pas necesaire' /></>:''}</span>
          {reponse && <p className="error-message">{reponse}</p>}
         

          <button className="add-to-cart-btn" onClick={addToCart}>
          {loadingcart ? <><FontAwesomeIcon icon={faSpinner} className='' spin /> Chargement...</>:<>Ajouter au Panier <FontAwesomeIcon icon={faCartPlus} /></>} 
          </button>
        
        </div>
        

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
      <div className="comment-section">
          <h3 className='h3cmt'>Commentaires</h3>
          <div className="user-rating">
            <p className='cmt'>Votre évaluation:</p>
            {Array.from({ length: 5 }).map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                className={index < userRating ? 'star-filled' : 'star'}
                onClick={(e) => handleStarClick(e, index)}
                />
            ))}
          </div>
          <input
          className='commentaire'
            rows="2"
            value={commantaire}
            placeholder="Écrivez votre commentaire..."
            onClick={handleCommentInputClick}
            onChange={(e) => setcommataire(e.target.value)}
          />
          <button onClick={submitComment} className='bttcommantaire'> &#10146;</button>
          
        </div>
      <div className="comments-list">
  {displayedComments.map((comment) => {
    // Find the corresponding client information for the current comment
    const clientInfo = clientcommantairee.find((cl) => cl.id === comment.client_id);

    return (
      <div key={comment.id} className="comment">
        {clientInfo && (
          <p className='usercmt'>{`${clientInfo.client_name} ${clientInfo.client_prenom}`}</p>
        )}
        <p className='textcmt'>{comment.commentaire}</p>
        {Array.from({ length: comment.nb_etoil }).map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            className={index < comment.nb_etoil ? 'star' : ''}
            style={{ color: 'orange' }}
          />
        ))}
       
      </div>
    );
  })}
    {!showAllComments && comments.length > 3 && (
      <Link onClick={toggleShowAllComments}>Afficher tous les commentaires</Link>
    )}
     {showAllComments && (
      <Link onClick={toggleShowAllComments}>Afficher moins de commentaires</Link>
    )}
</div>  
   
    <Productscategorie/>
 
    <Accueil />
 

    </>
  );
  
// ...


};

export default DetailProduit;
