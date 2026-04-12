import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://10.0.2.2:8000/api/', // ✅ Android emulator fix
});

// Attach JWT token to every request automatically
API.interceptors.request.use(
  async (config) => {
    // Skip token for public endpoints
    const publicEndpoints = ['users/login/', 'users/register/', 'users/token/refresh/'];
    const isPublic = publicEndpoints.some(ep => config.url?.includes(ep));

    if (!isPublic) {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;