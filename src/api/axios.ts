import axios from 'axios';

export const api = axios.create({
  // À modifier selon le port que tu as choisi Issa
  baseURL: 'http://localhost:8000/api', 
  
  timeout: 5000, 
  
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);