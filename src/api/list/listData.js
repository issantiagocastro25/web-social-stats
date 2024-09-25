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
  const { category = 'salud', institutionId = null, date = '2021-06-01' } = options;

  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/stats`, {
      params: {
        category,
        type_institution_id: institutionId,
        stats_date: date
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching summary and unique followers data:', error);
    throw error;
  }
};

export const fetchCategories = async (category, date) => {
  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/institutions/types`, {
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