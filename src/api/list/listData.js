import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchSocialStats = async (options = {}) => {
  const {
    category = 'salud',
    type = 'todos',
    date = '2021-06-01',
  } = options;

  console.log('fetchSocialStats called with options:', options);

  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/`, {
      params: {
        type,
        category,
        date,
      }
    });
    
    console.log('fetchSocialStats response:', response.data);
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
      return response.data.metrics.filter(item => institutions.includes(item.Institucion)).map(item => ({ ...item, date }));
    }));
    return results.flat();
  } catch (error) {
    console.error('Error fetching temporal data:', error);
    throw error;
  }
};

export const fetchSummaryCardsData = async (institutionId, date, category) => {
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
    console.error('Error fetching summary cards data:', error);
    throw error;
  }
};

export const fetchCategories = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/institutions/categories`, {
      params: {
        category
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};