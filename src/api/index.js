import axios from 'axios';

function getCookie(name) {
  let cookieValue = null;
  if (typeof document !== 'undefined') {
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
  }
  return cookieValue;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
});

api.interceptors.request.use((config) => {
  config.headers['X-CSRFToken'] = getCookie('csrftoken');
  return config;
});

// api.defaults.xsrfCookieName = 'csrftoken';
// api.defaults.xsrfHeaderName = 'X-CSRFToken';

export default api;