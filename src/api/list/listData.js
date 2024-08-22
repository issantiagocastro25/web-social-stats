import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.102:8000';

export const fetchSocialStats = async (options = {}) => {
  const {
    category = '',
    params = {},
  } = options;

  let fullUrl = `${API_BASE_URL}/api/social-metrics/`;

  const queryParams = new URLSearchParams();
  
  // Reemplazar espacios por guiones bajos y eliminar tildes
  if (category) {
    const formattedCategory = category.trim()
      .replace(/\s+/g, ' ')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    queryParams.append('type', formattedCategory);
  }

  // Agregar otros parámetros si existen
  for (const [key, value] of Object.entries(params)) {
    queryParams.append(key, value);
  }

  const queryString = queryParams.toString();
  if (queryString) {
    fullUrl += `?${queryString}`;
  }

  console.log('Fetching data from:', fullUrl);

  try {
    const response = await axios.get(fullUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Response received:', response.data);
    
    // Asegúrate de que la respuesta tenga la estructura esperada
    if (!response.data || !Array.isArray(response.data.metrics)) {
      throw new Error('Unexpected data structure received from the server');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching social stats:', error);
    
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      throw new Error(`Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error(`Request error: ${error.message}`);
    }
  }
};