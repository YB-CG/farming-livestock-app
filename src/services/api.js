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

export const updateUserProfile = async (userData) => {
  const formData = new FormData();
  
  Object.keys(userData).forEach(key => {
    if (userData[key]) {
      // For profile_picture field, append the file data
      if (key === 'profile_picture' && userData[key]) {
        const fileUri = userData[key].uri;
        const fileName = fileUri.split('/').pop();
        const fileType = fileName.split('.').pop();
        
        formData.append('profile_picture', {
          uri: fileUri,
          name: fileName,
          type: `image/${fileType}`, // Ensure the correct mime type for the image file
        });
      } else {
        formData.append(key, userData[key]);
      }
    }
  });

  try {
    const response = await api.patch('/account/user/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to update profile', error);
    throw error; // Re-throw error to be handled elsewhere
  }
};


export const updateFarmInfo = (farmId, farmData) => api.patch(`/account/farm/${farmId}/`, farmData);
export const getGoogleLoginUrl = () => api.get('/auth/google/login/');


// Create livestock
export const createLivestock = (livestockData) => {
  return api.post('/management/livestock/', livestockData, {
    headers: {
      'Content-Type': 'multipart/form-data', // This ensures that the data is sent as form-data
    },
  });
};


// Update livestock
// Update the updateLivestock function to use FormData
export const updateLivestock = async (livestockId, livestockData) => {
  const formData = new FormData();

  Object.keys(livestockData).forEach(key => {
    if (livestockData[key] !== null && livestockData[key] !== undefined) {
      if (key === 'photo' && livestockData[key]?.uri) {
        const uriParts = livestockData[key].uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('photo', {
          uri: livestockData[key].uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      } else {
        formData.append(key, livestockData[key]);
      }
    }
  });

  try {
    return await api.patch(`/management/livestock/${livestockId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    throw new Error('Failed to update livestock: ' + error.message);
  }
};


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
// Get inventory/products/{product_id}/
export const getProduct = (productId) => api.get(`/inventory/products/${productId}/`);
// Create inventory/products/
export const createProduct = (productData) => {
  return api.post('/inventory/products/', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
// Update inventory/products/{product_id}/ with form data
export const updateProduct = (productId, productData) => {
  return api.patch(`/inventory/products/${productId}/`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete inventory/products/{product_id}/
export const deleteProduct = (productId) => api.delete(`/inventory/products/${productId}/`);


// Get inventory/categories/
export const getCategories = () => api.get('/inventory/categories/');

// /inventory/products/category/{category_id}/
export const getProductsByCategory = (categoryId) => api.get(`/inventory/products/category/${categoryId}/`);

// Calendar Events API functions
export const getCalendarEvents = () => api.get('/tasks/calendar-events/');

export const getCalendarEvent = (eventId) => api.get(`/tasks/calendar-events/${eventId}/`);

export const createCalendarEvent = (eventData) => api.post('/tasks/calendar-events/', eventData);

export const updateCalendarEvent = (eventId, eventData) => api.patch(`/tasks/calendar-events/${eventId}/`, eventData);

export const deleteCalendarEvent = (eventId) => api.delete(`/tasks/calendar-events/${eventId}/`);


// getTasks function
export const getTasks = () => api.get('/tasks/tasks/');

// getTask function
export const getTask = (taskId) => api.get(`/tasks/tasks/${taskId}/`);

// createTask function
export const createTask = (taskData) => api.post('/tasks/tasks/', taskData);

// updateTask function
export const updateTask = (taskId, taskData) => api.patch(`/tasks/tasks/${taskId}/`, taskData);

// deleteTask function
export const deleteTask = (taskId) => api.delete(`/tasks/tasks/${taskId}/`);



export default api;
