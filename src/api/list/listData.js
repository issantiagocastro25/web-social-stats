import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.102:8000';

export const fetchTemporalData = async (institutions, dates, onProgress) => {
  try {
    let allResults = [];
    const batchSize = 5; // Ajusta este valor según sea necesario

    for (let i = 0; i < dates.length; i += batchSize) {
      const batchDates = dates.slice(i, i + batchSize);
      const batchPromises = batchDates.map(date => 
        fetchSocialStats({ date, institutions })
      );
      const batchResults = await Promise.all(batchPromises);
      
      const flattenedResults = batchResults.flatMap(result => 
        result.metrics.map(item => ({ ...item, date: batchDates[batchResults.indexOf(result)] }))
      );
      
      allResults = [...allResults, ...flattenedResults];
      
      // Informar del progreso
      if (onProgress) {
        onProgress((i + batchSize) / dates.length);
      }

      // Pequeña pausa para evitar sobrecargar el servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return allResults;
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