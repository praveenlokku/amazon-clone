import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Ensure the URL starts with http:// or https:// to prevent relative path errors in production
if (API_BASE_URL && !API_BASE_URL.startsWith('http')) {
    API_BASE_URL = `https://${API_BASE_URL.trim()}`;
}

// Ensure there is no trailing slash
API_BASE_URL = API_BASE_URL.replace(/\/$/, '');

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default API;
export { API_BASE_URL };
