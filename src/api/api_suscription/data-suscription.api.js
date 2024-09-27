import api from '../index';
import axios from 'axios';


export const getPricing = async () => {
    const response = await api.get('/payment/get/pricing/');
    return response.data;
};

export const getPaymentUrl = async (user_id, plan) => {
  try {
    const response = await api.post('/payment/create-subscription/', {
      plan: plan,
      user_id: user_id,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};