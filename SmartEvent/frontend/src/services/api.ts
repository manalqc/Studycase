import { User, Event, Registration, ApiResponse } from '../types';
import axios from 'axios';

// Configure axios
const API_URL = 'http://localhost:5223/api';

// Add JWT token to requests if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Ensure content type is set for POST and PUT requests
    if (config.method === 'post' || config.method === 'put') {
      config.headers['Content-Type'] = 'application/json';
    }
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Helper function to handle API errors
const handleApiError = (error: any): ApiResponse<any> => {
  console.error('API Error:', error);
  return {
    success: false,
    data: null,
    message: error.response?.data?.message || 'An unexpected error occurred'
  };
};

// Events API
export const eventsApi = {
  async getAll(): Promise<ApiResponse<Event[]>> {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getById(id: string): Promise<ApiResponse<Event | null>> {
    try {
      const response = await axios.get(`${API_URL}/events/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async create(eventData: Event): Promise<ApiResponse<Event>> {
    try {
      console.log('Creating event with data:', eventData);
      
      // Remove any properties that might cause issues with the backend
      const { creator, ...cleanEventData } = eventData as any;
      
      const response = await axios.post(`${API_URL}/events`, cleanEventData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Event creation response:', response.data);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Event creation error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return handleApiError(error);
    }
  },

  async update(id: string, eventData: Partial<Event>): Promise<ApiResponse<Event>> {
    try {
      console.log('Updating event with data:', eventData);
      
      // Format dates if they're strings to ensure proper ISO format
      const formattedData = {
        ...eventData,
        startDate: eventData.startDate ? new Date(eventData.startDate).toISOString() : undefined,
        endDate: eventData.endDate ? new Date(eventData.endDate).toISOString() : undefined
      };
      
      const response = await axios.put(`${API_URL}/events/${id}`, formattedData);
      console.log('Event update response:', response.data);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Event update error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return handleApiError(error);
    }
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      console.log('Deleting event:', id);
      const response = await axios.delete(`${API_URL}/events/${id}`);
      console.log('Delete response:', response.data);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Delete error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return handleApiError(error);
    }
  },
};

// Registrations API
export const registrationsApi = {
  async getByEventId(eventId: string): Promise<ApiResponse<Registration[]>> {
    try {
      const response = await axios.get(`${API_URL}/registrations/event/${eventId}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getByUserId(): Promise<ApiResponse<Registration[]>> {
    try {
      const response = await axios.get(`${API_URL}/registrations/user`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async register(eventId: string): Promise<ApiResponse<Registration>> {
    try {
      console.log('Registering for event:', eventId);
      const response = await axios.post(`${API_URL}/registrations/${eventId}`, {});
      console.log('Registration response:', response.data);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return handleApiError(error);
    }
  },

  async cancelRegistration(eventId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.delete(`${API_URL}/registrations/${eventId}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Users API
export const usersApi = {
  async getAll(): Promise<ApiResponse<User[]>> {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getById(id: string): Promise<ApiResponse<User | null>> {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    try {
      const response = await axios.get(`${API_URL}/auth/current`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async register(name: string, email: string, isAdmin: boolean): Promise<ApiResponse<User>> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, isAdmin });
      
      // Store the JWT token
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      
      return {
        success: true,
        data: response.data.data.user
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async login(email: string): Promise<ApiResponse<User>> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email });
      
      // Store the JWT token
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      
      return {
        success: true,
        data: response.data.data.user
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async logout(): Promise<ApiResponse<boolean>> {
    try {
      await axios.post(`${API_URL}/auth/logout`);
      
      // Remove the JWT token
      localStorage.removeItem('token');
      
      return {
        success: true,
        data: true
      };
    } catch (error) {
      // Still remove the token even if the API call fails
      localStorage.removeItem('token');
      return handleApiError(error);
    }
  }
};
