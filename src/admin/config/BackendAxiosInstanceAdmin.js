import axios from 'axios';

const BackendAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL_BACKEND,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default BackendAxiosInstance;
