import axios from 'axios';

export const api = axios.create({
  // Pointe vers ton fichier .env ou localhost par défaut
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});