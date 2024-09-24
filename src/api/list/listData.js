import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Función para obtener estadísticas sociales generales
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

// Función para obtener datos temporales
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

// Función combinada para obtener datos de resumen y seguidores únicos
export const fetchSummaryAndUniqueFollowers = async (options = {}) => {
  const {
    category = 'salud',
    institutionId = null,
    date = '2021-06-01',
  } = options;

  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/stats`, {
      params: {
        category,
        type_institution_id: institutionId,
        stats_date: date
      }
    });
    console.log('Summary and unique followers data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching summary and unique followers data:', error);
    throw error;
  }
};

// Función para obtener categorías
export const fetchCategories = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/institutions/categories`, {
      params: {
        category
      }
    });
    
    // Sort the categories based on the ordering field
    const sortedCategories = response.data.sort((a, b) => a.ordering - b.ordering);
    
    return sortedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Función para obtener datos de población
export const fetchPopulationData = async (options = {}) => {
  const {
    category,
    date,
  } = options;

  if (!category || !date) {
    throw new Error('Category and date are required for fetching population data');
  }

  try {
    const response = await axios.get(`${API_URL}/api/social-metrics/population`, {
      params: {
        category,
        date,
      }
    });
    
    console.log('Population data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching population data:', error);
    throw error;
  }
};
