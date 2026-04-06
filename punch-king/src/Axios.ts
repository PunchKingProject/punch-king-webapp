import axios from 'src/Axios.ts';
import { resetRegistration } from './store/registration.slice.ts';
import { store } from './store';

const stagingUrl = 'https://punch-king-api.onrender.com/';

export const customFetch = axios.create({
  baseURL: stagingUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: false,
});

// Attach rid as a bearer token
customFetch.interceptors.request.use((config) => {
  const pk_rid = localStorage.getItem('token');
  if (pk_rid) {
    config.headers['Authorization'] = `Bearer ${pk_rid}`;
  }
  return config;
});

customFetch.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      store.dispatch(resetRegistration());

      // Optionally, redirect the user to the login page
      // window.location.href = '/login'
    }
    return Promise.reject(err);
  }
);
