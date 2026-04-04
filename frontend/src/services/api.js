import axios from 'axios'

const API = axios.create({
    baseURL: "https://anvaya-crm-backend-d8nv.onrender.com",
});

export default API;