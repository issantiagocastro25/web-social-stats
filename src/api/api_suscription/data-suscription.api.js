import api from '../index';
import axios from 'axios';


export const getPricing = async () => {
    const response = await api.get('/payment/get/pricing/');
    return response.data;
  };