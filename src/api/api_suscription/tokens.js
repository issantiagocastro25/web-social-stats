
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