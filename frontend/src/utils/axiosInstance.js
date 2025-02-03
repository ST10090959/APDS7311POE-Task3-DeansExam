import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8443/api',  // Updated to HTTP
  withCredentials: true,  // Keep this if your server uses cookies or sessions
});

export default axiosInstance;
