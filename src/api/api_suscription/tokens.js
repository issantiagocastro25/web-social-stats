
import api from '../index';

export const getAllSubscriptionPlans = async () => {
    try {
      const response = await api.get('/payment/subscription-plans/');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  };
  
  export const createSubscriptionPlan = async (planData) => {
    try {
      const response = await api.post('/payment/subscription-plans/', planData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      throw error;
    }
  };
  
  export const updateSubscriptionPlan = async (planId, planData) => {
    try {
      const response = await api.put(`/payment/subscription-plans/${planId}/`, planData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      throw error;
    }
  };
  
  export const deleteSubscriptionPlan = async (planId) => {
    try {
      await api.delete(`/payment/subscription-plans/${planId}/`);
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      throw error;
    }
  };

  export const getAllAccessTokens = async () => {
    try {
      const response = await api.get('/payment/list-token/tokens/access/');
      return response.data.tokens;  // Ajustado para manejar la estructura de respuesta actual
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw error;
    }
  };

  export const createAccessToken = async (tokenData) => {
    try {
      const response = await api.post('/payment/create-token/access/', tokenData);
      return response.data;
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  };

  export const updateAccessToken = async (tokenId, tokenData) => {
    try {
      const response = await api.put(`/payment/tokens/access/update/${tokenId}/`, tokenData);
      return response.data;
    } catch (error) {
      console.error('Error updating token:', error);
      throw error;
    }
  };
  
  export const deleteAccessToken = async (tokenId) => {
    try {
      const response = await api.delete(`/payment/tokens/access/delete/${tokenId}/`);
      return response;
    } catch (error) {
      console.error('Error deleting token:', error);
      throw error;
    }
  };