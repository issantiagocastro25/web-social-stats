import axios from 'axios';

const API_BASE_URL = 'https://api-social-stats.windowschannel.us';

export const fetchSocialStats = async (options = {}) => {
  const {
    category = 'todos',
    year = '2021',
  } = options;

  const date = year === '2020' ? '2020-12-01' : '2021-06-01';
  
  let fullUrl = `${API_BASE_URL}/api/social-metrics/`;

  // No es necesario usar encodeURIComponent aquí
  const queryParams = new URLSearchParams();
  queryParams.append('type', category);  // Se elimina encodeURIComponent
  queryParams.append('date', date);

  const queryString = queryParams.toString();
  fullUrl += `?${queryString}`;

  console.log('Fetching data from:', fullUrl);

  try {
    const response = await axios.get(fullUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Response received:', response.data);
    
    if (!response.data || !Array.isArray(response.data.metrics)) {
      throw new Error('Unexpected data structure received from the server');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching social stats:', error);
    throw error;
  }
};
