import api from '../index';
import axios from 'axios';


export const getPricing = async () => {
    const response = await api.get('/payment/get/pricing/');
    return response.data;
};

export const getPaymentUrl = async (user_id, plans) => {
  try {
    const response = await api.post('/payment/create-subscription/', {
      plans: plans,
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

export const getTokenDetail = async (token) => {
  try {
    const response = await api.get(`/payment/tokens/${token}/`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching token details:', error);
    throw error;
  }
};

// New functions for managing subscriptions and tokens
export const getAllTokens = async () => {
  try {
    const response = await api.get('/payment/list-tokens/');
    return response.data.tokens;  // Ajustado para manejar la estructura de respuesta actual
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

export const createToken = async (tokenData) => {
  try {
    const response = await api.post('/payment/create-token/', tokenData);
    return response.data;
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};

export const updateToken = async (tokenId, tokenData) => {
  try {
    const response = await api.put(`/payment/tokens/${tokenId}/`, tokenData);
    return response.data;
  } catch (error) {
    console.error('Error updating token:', error);
    throw error;
  }
};

export const deleteToken = async (tokenId) => {
  try {
    await api.delete(`/payment/tokens/${tokenId}/`);
  } catch (error) {
    console.error('Error deleting token:', error);
    throw error;
  }
};

export const getUserSubscriptions = async (userId) => {
  try {
    const response = await api.get(`/payment/subscriptions/${userId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId, subscriptionData) => {
  try {
    const response = await api.put(`/payment/subscriptions/${subscriptionId}/`, subscriptionData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};