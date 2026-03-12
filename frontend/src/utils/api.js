import axios from 'axios';

// Dynamically determine the API Base URL
// Use VITE_API_URL from environment variables if available, otherwise default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default API;
export { API_BASE_URL };
