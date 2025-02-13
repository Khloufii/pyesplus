import React from 'react';
import reducer from './reducer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Inscription from './inscription'
import Addcategories from './admin/CategorieCompenent/addcategories';
import AddProduct from './admin/ProduitCompenent/addproduit';
import Navigation from './menu1';
import Listproduit from './admin/ProduitCompenent/listeproduits';
import Updateproduit from './admin/ProduitCompenent/ubdateproduit';
import Accueil from './accueil';
import LoginComponent from './login';
import { AuthProvider,useAuth } from './authprovider';
import Authmenu from './authmenu';
import Updatuser from './admin/gestion des compts/updateuser';
import Updatepassword from './admin/gestion des compts/updatepassword';
import Listesuser from './admin/gestion des compts/listeuser';
import Newuser from './admin/gestion des compts/newuser';
import Updateimg from './admin/ProduitCompenent/updateimg';
import AddBonAchat from './admin/add_bon_achat';
import Updatebonachat from './admin/updatebonachat';
import Addcodepromo from './admin/addcodepromo';
import Updatecodepromo from './admin/updatecodepromo';
import Dashboard from './admin/dashbord';
import ListVproduit from './vendeur/ProduitCompenent/produitvendeur';
import AddVProduct from './vendeur/ProduitCompenent/addVproduit';
import UpdateVproduit from './vendeur/ProduitCompenent/ubdateVproduit';
import UpdateVimg from './vendeur/ProduitCompenent/updateVimg';
import Menudashboard from './menudashboard';
import Addcodepromov from './vendeur/addcodepromov';
import AddBonAchatv from './vendeur/add_bon_achatv';
import Profil from './profil';
import Updatebonachatv from './vendeur/updatebonachatv';
import Updatecodepromov from './vendeur/updatecodepromov';
import DetailProduit from './client/detailprod';
import Cart from './client/panier';
import UserOrders from './client/commande';
import ProductDetail from './client/detailcommande';
import AdminOrders from './admin/commandeadmin';
import Commandedetail from './admin/detailcommandeadmin';
import VendeurOrders from './vendeur/commandevendeur';
import UpdateUserPassword from './updateuserpassword';
import CommandedetailV from './vendeur/detailcommandevendeur';
import DashbordMenu from './dashbordmenu';
import Null from './null';
import Contact from './contact';
import Home from './home';
import { SearchProvider, Serche } from './SearchContext';
import Productsrechercher from './productssercher';
import { Provider } from 'react-redux';
import store from './stor';
import Panier from './client/panier';
import PromoProductsList from './productspromotion';
import TopProductsList from './topprod';
import Menuclient from './dashbordmenu';
import { useDispatch,useSelector } from 'react-redux';
import { selectprofil } from './reducer';
import NewProductsList from './productsnew';
import FormulairCmd from './formulaire_commande';
import Copiright from './copirght';
import VisitorList from './admin/visiteur';
import Productsnetflex from './productnetflex';
function App() {
  const auth = useAuth();
 
    return (
      
      <div>
       
       <Provider store={store}>
        <Router>
            <div>
            <AuthProvider>
             <Navigation/>
        
            
             
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/acueill" element={<Accueil />} />
            
            {!auth.user && <>
            <Route path="/Inscription/:id" element={<Inscription />} />
            <Route path="/login/:id" element={<LoginComponent />} />
            </>}


            {auth.user && auth.user.type === 'admin'?
            <>
            <Route path="/dashbord" element={<Dashboard />} />
            <Route path="/addcategories" element={<Addcategories />} />
            <Route path="/listeuser" element={<Listesuser />} />
            <Route path="/updateuser/:id" element={<Updatuser />} />
            <Route path="/updatemotdepass/:id" element={<Updatepassword />} />
            <Route path="/newuser" element={<Newuser />} />
            <Route path="/addproduit" element={<AddProduct />} />
            <Route path="/updateproduit/:id" element={<Updateproduit />} />
            <Route path="/updateimg/:id/:img" element={<Updateimg />} />
            <Route path="/listproduits" element={<Listproduit />} />
            <Route path="/updateimg/:id/:img" element={<Updateimg />} />
            <Route path="/addbonachat" element={<AddBonAchat />} />
            <Route path="/addcodepromo" element={<Addcodepromo />} />
            <Route path="/updatebonachat/:id" element={<Updatebonachat />} />
            <Route path="/updatecodepromo/:id" element={<Updatecodepromo />} />
            <Route path="/commandeadmin" element={<AdminOrders />} />
            <Route path="/detailcommandeadmin/:id/:client_id" element={<Commandedetail />} /> 
            <Route path="/profil/:id" element={<Profil />} />
            <Route path="/userpassword" element={<UpdateUserPassword />} />
            <Route path="/visiteur" element={<VisitorList />} />
            </>:''
            }
            

            {auth.user && auth.user.type === 'client' ?
            <>
            <Route path="/profil/:id" element={<Profil />} />
            <Route path="/userpassword" element={<UpdateUserPassword />} />
            <Route path="/commande" element={<UserOrders />} />
            <Route path="/detailcommande/:id/:total_prix" element={<ProductDetail />} />
            </>:''
            }

            

            {auth.user && auth.user.type === 'vendeur' ? <>
            <Route path="/dashbord" element={<Dashboard />} />
            <Route path="/addVproduit" element={<AddVProduct />} />
            <Route path="/updateVproduit/:id" element={<UpdateVproduit />} />
            <Route path="/updateVimg/:id/:img" element={<UpdateVimg />} />
            <Route path="/produitvendeur" element={<ListVproduit />} />
            <Route path="/addbonachatv" element={<AddBonAchatv />} />
            <Route path="/addcodepromov" element={<Addcodepromov />} />
            <Route path="/updatebonachatv/:id" element={<Updatebonachatv />} />
            <Route path="/updatecodepromov/:id" element={<Updatecodepromov />} />
            <Route path="/commandevendeur" element={<VendeurOrders />} />
            <Route path="/detailcommandevendeur/:id" element={<CommandedetailV />} />
            <Route path="/profil/:id" element={<Profil />} />
            <Route path="/userpassword" element={<UpdateUserPassword />} />
            </>:''}
            
           

            <Route path="/detailprod/:id" element={<DetailProduit />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/productsresrcher/:type/:id" element={<Productsrechercher />} />
            <Route path="/productspromotion" element={<PromoProductsList />} />
            <Route path="/CodeNetflix" element={<Productsnetflex />} />
            <Route path="/plusvendu" element={<TopProductsList />} />
            <Route path="/newproduct" element={<NewProductsList />} />
            <Route path="/formulair_cmd" element={<FormulairCmd />} />


         </Routes>
        
         <Contact/>
         <Copiright/>
         </AuthProvider>
         
          </div>
        </Router> 
        </Provider>
        
      </div>
    );
  }
  export default App;
