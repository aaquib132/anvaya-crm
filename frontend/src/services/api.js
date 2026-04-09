import axios from 'axios'

const baseURL = "https://anvaya-crm-backend-d8nv.onrender.com";

const API = axios.create({ baseURL });

export default API;
