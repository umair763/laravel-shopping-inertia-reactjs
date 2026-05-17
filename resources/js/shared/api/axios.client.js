import axios from 'axios';

const client = axios.create({
  baseURL: window.location.origin,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add token to requests if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('api_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
