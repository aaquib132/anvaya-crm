import axios from 'axios'

const API = axios.create({
    baseURL: "http://localhost:3000", // "https://anvaya-crm-backend-d8nv.onrender.com"
});

export default API;