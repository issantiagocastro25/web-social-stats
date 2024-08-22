// api/list/listData.js

import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.102:8000';

export const fetchSocialMetrics = async (options = {}) => {
  const {
    endpoint = '/api/social-metrics/',
    params = {},
    timeout = 5000,
    type = null, // Nuevo parámetro para el tipo de institución
  } = options;

  // Construir los parámetros de consulta
  const queryParams = new URLSearchParams(params);
  if (type) {
    queryParams.append('type', type);
  }

  const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;

  try {
    console.log(`Fetching data from: ${url}`);
    const response = await axios.get(url, {
      timeout,
    });

    console.log('Response received:', response.data);

    // Asumiendo que la respuesta tiene una estructura específica
    // Ajusta esto según la estructura real de tu API
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error('Formato de respuesta inesperado');
    }
  } catch (error) {
    console.error('Error fetching social metrics:', error);

    if (error.response) {
      // La solicitud fue hecha y el servidor respondió con un código de estado
      // que cae fuera del rango de 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      throw new Error(`Error del servidor: ${error.response.status}`);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No response received:', error.request);
      throw new Error('No se recibió respuesta del servidor');
    } else {
      // Algo sucedió en la configuración de la solicitud que provocó un error
      console.error('Error message:', error.message);
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
  }
};

export const fetchInstitutionDetails = async (institutionId) => {
  const url = `${API_BASE_URL}/institution/${institutionId}/`;

  try {
    console.log(`Fetching institution details from: ${url}`);
    const response = await axios.get(url);

    console.log('Institution details received:', response.data);

    return response.data;
  } catch (error) {
    console.error(`Error fetching details for institution ${institutionId}:`, error);
    throw error;
  }
};

export const updateInstitution = async (institutionId, data) => {
  const url = `${API_BASE_URL}/institution/${institutionId}/`;

  try {
    console.log(`Updating institution ${institutionId} with data:`, data);
    const response = await axios.put(url, data);

    console.log('Update response:', response.data);

    return response.data;
  } catch (error) {
    console.error(`Error updating institution ${institutionId}:`, error);
    throw error;
  }
};

export const createInstitution = async (data) => {
  const url = `${API_BASE_URL}/institution/`;

  try {
    console.log('Creating new institution with data:', data);
    const response = await axios.post(url, data);

    console.log('Creation response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error creating new institution:', error);
    throw error;
  }
};

export const deleteInstitution = async (institutionId) => {
  const url = `${API_BASE_URL}/institution/${institutionId}/`;

  try {
    console.log(`Deleting institution ${institutionId}`);
    const response = await axios.delete(url);

    console.log('Deletion response:', response.data);

    return response.data;
  } catch (error) {
    console.error(`Error deleting institution ${institutionId}:`, error);
    throw error;
  }
};