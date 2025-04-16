// yourReducer.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';  

const Slice = createSlice({
  name: 'Slice',
  initialState: {
    api: 'http://127.0.0.1:8000',
    ip: localStorage.getItem('uniqueId'),
    categories: [],
    currencies: [],
    panier: [],
    listprod:[],
    avis:[],
    newprod:[],
    topprod:[],
    promoprod:[],
    selectedCurrency: 'MAD',
    categorieselect: '',
    searchTerm: '',
    nbpanier: 0,
    exchangeRates: null, // Add this line
    profil:{},
    categori_id:0,
    loading:false,
    totalvisite:0,
  },
  reducers: {
    setapi: (state, action) => { // Add this function
      state.api = action.payload;
    },
    setIp: (state, action) => { // Add this function
      state.ip = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCurrencies: (state, action) => {
      state.currencies = action.payload;
    },
    setPanier: (state, action) => {
      state.panier = action.payload;
    },
    setlistprod: (state, action) => {
      state.listprod = action.payload;
    },
    setavis: (state, action) => {
      state.avis = action.payload;
    },
    setnewprod: (state, action) => {
      state.newprod = action.payload;
    },
    settopprod: (state, action) => {
      state.topprod = action.payload;
    },
    setpromoprod: (state, action) => {
      state.promoprod = action.payload;
    },
    setcategorieselect: (state, action) => {
      state.categorieselect = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCurrency: (state, action) => {
      state.selectedCurrency = action.payload;
    },
    setExchangeRates: (state, action) => { // Add this function
      state.exchangeRates = action.payload;
    },
    setnbpanier: (state, action) => { // Add this function
      state.nbpanier = action.payload;
    }, 
    setprofil: (state, action) => { // Add this function
      state.profil = action.payload;
    },
    setcategorie_id: (state, action) => { // Add this function
      state.categori_id = action.payload;
    },
    setloading: (state, action) => { // Add this function
      state.loading = action.payload;
    },
    settotalvisit: (state, action) => { // Add this function
      state.totalvisite = action.payload;
    },
   },
});

export const {
  setapi,
  setIp,
  setCategories,
  setCurrencies,
  setPanier,
  setlistprod,
  setavis,
  setnewprod,
  settopprod,
  setpromoprod,
  setcategorieselect,
  setSearchTerm,
  setSelectedCurrency,
  setnbpanier,
  setExchangeRates, // Add this line
  setprofil,
  setcategorie_id,
  setloading,
  settotalvisit,
} = Slice.actions;
export const selectapi = (state) => state.Slice ? state.Slice.api : 'http://127.0.0.1:8000';
export const selectIp = (state) => state.Slice ? state.Slice.ip : '';
export const selectCategories = (state) => state.Slice ? state.Slice.categories : [];
export const selectCurrencies = (state) => state.Slice ? state.Slice.currencies : [];
export const selectPanier = (state) => state.Slice ? state.Slice.panier : [];
export const seleclistprod = (state) => state.Slice ? state.Slice.listprod : [];
export const selecavis = (state) => state.Slice ? state.Slice.avis : [];
export const selectnewprod = (state) => state.Slice ? state.Slice.newprod : [];
export const selecttopprod = (state) => state.Slice ? state.Slice.topprod : [];
export const selectpromoprod = (state) => state.Slice ? state.Slice.promoprod : [];
export const selectselectedCurrency = (state) => state.Slice ? state.Slice.selectedCurrency : '';
export const selectExchangeRates = (state) => state.Slice ? state.Slice.exchangeRates : null;
export const selectnbpanier = (state) => state.Slice ? state.Slice.nbpanier : 0;
export const selectprofil = (state) => state.Slice ? state.Slice.profil : {};
export const selectcatecorie_id = (state) => state.Slice ? state.Slice.categori_id : 0;
export const selectloading = (state) => state.Slice ? state.Slice.loading : false;
export const selecttotalvisit = (state) => state.Slice ? state.Slice.totalvisite : 0;

export default Slice.reducer;
