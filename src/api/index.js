// import axios from 'axios';
// import Cookies from 'js-cookie';

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true, // Asegúrate de que se envíen las credenciales
// });

// // Interceptor para agregar el token CSRF
// api.interceptors.request.use((config) => {
//   const csrfToken = Cookies.get('csrftoken'); // Obtener el token CSRF usando js-cookie
//   console.log(csrfToken);
//   if (csrfToken) {
//     config.headers['X-CSRFToken'] = csrfToken; // Establecer el encabezado CSRF
//   }
//   return config;
// }, (error) => {
//   // Manejo de errores en la solicitud
//   return Promise.reject(error);
// });

// export default api;


import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Function to get CSRF token
const getCSRFToken = async () => {
  try {
    const response = await axios.get('/getCsrf-token/');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};

// Interceptor to add CSRF token to requests
api.interceptors.request.use(async (config) => {
  let csrfToken = Cookies.get('csrftoken');
  
  if (!csrfToken) {
    csrfToken = await getCSRFToken();
    if (csrfToken) {
      Cookies.set('csrftoken', csrfToken);
    }
  }

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;