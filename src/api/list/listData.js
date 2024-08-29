import axios from 'axios';

const API_BASE_URL = 'https://api-social-stats.windowschannel.us';

export const fetchTemporalData = async (institutions, dates) => {
  try {
    const chunkSize = 5; // Ajusta este valor según sea necesario
    const results = [];

    for (let i = 0; i < dates.length; i += chunkSize) {
      const datesToFetch = dates.slice(i, i + chunkSize);
      const dataPromises = datesToFetch.map(date => 
        fetchSocialStats({ date, institutions })
      );
      const chunkResults = await Promise.all(dataPromises);
      results.push(...chunkResults.flatMap(result => result.metrics));

      // Añade un pequeño retraso entre las peticiones para evitar sobrecarga
      if (i + chunkSize < dates.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching temporal data:', error);
    throw error;
  }
};

export const fetchSocialStats = async (options = {}) => {
  const {
    category = 'todos',
    date = '2021-06-01',
    institutions = []
  } = options;

  let fullUrl = `${API_BASE_URL}/api/social-metrics/`;

  const queryParams = new URLSearchParams();
  queryParams.append('type', category);
  queryParams.append('date', date);
  
  if (institutions.length > 0) {
    queryParams.append('institutions', institutions.join(','));
  }

  const queryString = queryParams.toString();
  fullUrl += `?${queryString}`;

  try {
    const response = await axios.get(fullUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.data || !Array.isArray(response.data.metrics)) {
      throw new Error('Unexpected data structure received from the server');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching social stats:', error);
    throw error;
  }
};