import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchSocialStats = async (options = {}) => {
  const {
    category = 'todos',
    date = '2021-06-01',
  } = options;

  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/`, {
      params: {
        type: category,
        category:'salud',
        date,
      }
      // params: {
      //   type: 'todos',
      //   category:'salud',
      //   date: '2021-06-01',
      // }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching social stats:', error);
    throw error;
  }
};

export const fetchTemporalData = async (institutions, dates) => {
  try {
    const results = await Promise.all(dates.map(async (date) => {
      const response = await fetchSocialStats({ date, category: 'todos' });
      return response.data.metrics.filter(item => institutions.includes(item.Institucion)).map(item => ({ ...item, date }));
    }));
    return results.flat();
  } catch (error) {
    console.error('Error fetching temporal data:', error);
    throw error;
  }
};

export const fetchSummaryCardsData = async (institutionId, date) => {
  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/stats`, {
      params: {
        category: 'salud',
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

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/institutions/categories?category=salud`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};