import axios from 'axios';

const API_BASE_URL = 'http://186.30.107.85:8000';

export const fetchSocialStats = async (options = {}) => {
  const {
    category = 'todos',
    date = '2021-06-01',
  } = options;

  let fullUrl = `${API_BASE_URL}/api/social-metrics/`;

  const queryParams = new URLSearchParams();
  queryParams.append('type', category);
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
    
    // if (!response.data || !Array.isArray(response.data.metrics)) {
    //   throw new Error('Unexpected data structure received from the server');
    // }

    return response.data;
  } catch (error) {
    console.error('Error fetching social stats:', error);
    throw error;
  }
};

export const fetchTemporalData = async (institutions, dates) => {
  try {
    const results = await Promise.all(dates.map(async (date) => {
      const response = await fetchSocialStats({ date, institutions });
      return response.data.map(item => ({ ...item, date }));
    }));
    return results.flat();
  } catch (error) {
    console.error('Error fetching temporal data:', error);
    throw error;
  }
};

export const fetchSummaryCardsData = async (institutionId, date) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/social-metrics/stats`, {
      params: {
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
    const response = await axios.get(`${API_BASE_URL}/api/social-metrics/institutions/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};