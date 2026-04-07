import axios from 'axios'

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const baseURL = isLocal 
      ? "http://localhost:3000" 
      : "https://anvaya-crm-backend-d8nv.onrender.com";

console.log("🌐 API BaseURL:", baseURL);

const API = axios.create({ baseURL });

export default API;
