import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAvailableDates = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/dates`);
    return response.data.map(item => item.date);
  } catch (error) {
    console.error('Error fetching available dates:', error);
    throw error;
  }
};


// Existing fetchSocialStats function remains unchanged
export const fetchSocialStats = async (options = {}) => {
  const { category = 'salud', type = 'todos', date = '2021-06-01' } = options;

  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/`, {
      params: { type, category, date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching social stats:', error);
    throw error;
  }
};

// New function for paginated social stats
export const fetchPaginatedSocialStats = async (options = {}) => {
  const { 
    category = 'salud', 
    type = 'todos', 
    date = '2024-08-31', 
    page = 1, 
    pageSize = 100, 
    search = '' 
  } = options;

  console.log('fetchPaginatedSocialStats called with options:', options);

  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/`, {
      params: { 
        type, 
        category, 
        date, 
        page, 
        page_size: pageSize, 
        search 
      }
    });
    
    console.log('API Response:', response.data);
    
    if (response.data && response.data.data && Array.isArray(response.data.data.metrics)) {
      return response.data;
    } else {
      console.error('Unexpected API response structure:', response.data);
      throw new Error('Respuesta de API inesperada');
    }
  } catch (error) {
    console.error('Error fetching paginated social stats:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};


export const fetchTemporalData = async (institutions, dates, category) => {
  try {
    const results = await Promise.all(dates.map(async (date) => {
      const response = await fetchSocialStats({ date, type: 'todos', category });
      return response.data.metrics
        .filter(item => institutions.includes(item.Institucion))
        .map(item => ({ ...item, date }));
    }));
    return results.flat();
  } catch (error) {
    console.error('Error fetching temporal data:', error);
    throw error;
  }
};

export const fetchSummaryAndUniqueFollowers = async (options = {}) => {
  const { category = 'salud', date = '2024-08-31' } = options;

  console.log('Fetching summary and unique followers with options:', options);

  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/stats`, {
      params: {
        category,
        stats_date: date
      }
    });
    
    console.log('Summary and unique followers API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching summary and unique followers:', error);
    throw error;
  }
}

export const fetchCategories = async (category, date) => {
  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/institutions-types`, {
      params: {
        category,
        stats_date: date
      }
    });
    // Asumiendo que la respuesta ya viene ordenada, si no, descomenta la siguiente línea
    // const sortedCategories = response.data.sort((a, b) => a.ordering - b.ordering);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchPopulationData = async (options = {}) => {
  const { category, date } = options;

  if (!category || !date) {
    throw new Error('Category and date are required for fetching population data');
  }

  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/population`, {
      params: { category, date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching population data:', error);
    throw error;
  }
};
