// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.102:8000';

export const fetchSocialStats = async (options = {}) => {
  const {
    endpoint = '/api/social-metrics/?type=Educacion',  // Ajusta esto según la ruta correcta de tu API
    params = {},
  } = options;
  
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      params,
    });

    // Asumiendo que la respuesta de la API tiene la misma estructura que tu JSON actual
    return response.data;
  } catch (error) {
    console.error('Error fetching social stats:', error);
    
    if (error.response) {
      // El servidor respondió con un estado fuera del rango 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No response received:', error.request);
      throw new Error('No response received from server');
    } else {
      // Algo sucedió en la configuración de la solicitud que provocó un error
      console.error('Error message:', error.message);
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

// Si necesitas más endpoints, puedes agregarlos aquí
export const fetchInstitutionDetails = async (institutionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/institution/${institutionId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for institution ${institutionId}:`, error);
    throw error;
  }
};