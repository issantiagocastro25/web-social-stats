import api from '../index';
import axios from 'axios';


export const getAllUsers = async () => {
    const response = await api.get('/api/user/get-users/');
    return response.data;
  };