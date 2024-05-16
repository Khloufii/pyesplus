import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './authprovider';
import Contact from './contact';


const element=document.getElementById("root");
const root=ReactDOM.createRoot(element)



// 5) afficher le composant dans le browser
root.render(  
     <React.StrictMode>
        <AuthProvider>
            <App/> 
        </AuthProvider>
     </React.StrictMode>,

)