import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://travelbharat-lxbw.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
      console.log('Request data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 ${response.status} ${response.config.url}`);
      console.log('Response data:', response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      console.error('Error response:', { status, data });
      
      switch (status) {
        case 401:
          console.error('Unauthorized! Please login again.');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: You don\'t have permission');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error. Please try again later.');
          break;
        default:
          console.error(`Error ${status}:`, data?.message || 'Something went wrong');
      }
      
      throw {
        status,
        message: data?.message || 'Request failed',
        data: data
      };
    } else if (error.request) {
      console.error('Network error: Unable to connect to server');
      throw {
        status: 0,
        message: 'Network error. Please check your connection.',
        data: null
      };
    } else {
      console.error('Error:', error.message);
      throw {
        status: -1,
        message: error.message || 'An unexpected error occurred',
        data: null
      };
    }
  }
);

// API object with all methods
export const api = {
  // Subscribe to newsletter
  subscribe: async (email) => {
    try {
      const response = await axiosInstance.post('/subscribers/subscribe', { email });
      return { success: true, data: response.data, message: response.data.message };
    } catch (error) {
      console.error('Subscribe API error:', error);
      throw error;
    }
  },
  
  // Create booking
  createBooking: async (bookingData) => {
    try {
      const response = await axiosInstance.post('/bookings', bookingData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Booking API error:', error);
      throw error;
    }
  },
  
  // Get all tourist places
  getPlaces: async (params) => {
    try {
      const response = await axiosInstance.get('/places', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get places error:', error);
      return { success: false, data: [] };
    }
  },
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    return {
      success: false,
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    return {
      success: false,
      message: 'Network error. Please check your internet connection.',
      status: 0,
      data: null
    };
  } else {
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      status: -1,
      data: null
    };
  }
};

export default axiosInstance;