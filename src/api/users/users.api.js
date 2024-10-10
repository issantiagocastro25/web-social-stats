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

export const updateUser = async (userId, dataUpdate) => {
  try {
    const response = await api.put(`/api/user/update-user/${userId}/`, dataUpdate);
    return response.data;
  } catch (error) {
    console.error('Error updating token:', error);
    throw error;
  }
};