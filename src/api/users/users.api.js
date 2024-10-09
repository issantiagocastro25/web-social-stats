import api from '../index';
import axios from 'axios';


export const getAllUsers = async () => {
    const response = await api.get('/api/user/get-users/');
    return response.data;
  };

  export const getAllRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/roles/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  };