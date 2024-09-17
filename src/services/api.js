// api.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://farming-livestock-core.onrender.com/api/';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = '39a730a3b67c279a2e49cdf6951d75a9'; // Your OpenWeatherMap API key

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token logic (unchanged)
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token refresh logic (unchanged)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}auth/refresh-token/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          await AsyncStorage.setItem('userToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        }
      } catch (e) {
        console.log('Error refreshing token:', e);
      }
    }
    return Promise.reject(error);
  }
);

// Weather API function
export const getWeather = async (lat, lon) => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: 'Accra,gh',
        appid: API_KEY,
        units: 'metric', // For Celsius
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const login = (email, password) => api.post('/auth/get-token/', { email, password });
export const register = (userData) => api.post('/account/user/register/', userData);
export const forgotPassword = (email) => api.post('/auth/password/reset/', { email });
export const getUserProfile = () => api.get('/account/user/');
export const getFarmInfo = (farmId) => api.get(`/account/farm/${farmId}/`);
export const updateUserProfile = (userData) => api.patch('/account/user/', userData);
export const updateFarmInfo = (farmId, farmData) => api.patch(`/account/farm/${farmId}/`, farmData);
export const getGoogleLoginUrl = () => api.get('/auth/google/login/');


// Create livestock
export const createLivestock = (livestockData) => api.post('/management/livestock/', livestockData);

// Update livestock
export const updateLivestock = (livestockId, livestockData) => api.patch(`/management/livestock/${livestockId}/`, livestockData);

// Delete livestock
export const deleteLivestock = (livestockId) => api.delete(`/management/livestock/${livestockId}/`);

// Retrieve a single livestock
export const getLivestock = (livestockId) => api.get(`/management/livestock/${livestockId}/`);

// List livestock with pagination support
export const getLivestockList = (page = 1) => api.get('/management/livestock/', {
  params: { page },
});

// Get inventory/products/
export const getProducts = () => api.get('/inventory/products/');
// Get inventory/categories/
export const getCategories = () => api.get('/inventory/categories/');

export default api;
