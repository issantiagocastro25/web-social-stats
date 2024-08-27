import api from '../index';

export const getYouTubeChannelStats = async (query) => {
    try {
      const response = await api.get('api/social-metrics/youtube/statistics/', {
        params: { query }
      });
      return response.data;
    } catch (error) {
        console.error('Error fetching YouTube channel stats:', error);
        if (error.response) {
          // El servidor respondió con un estado fuera del rango de 2xx
          throw new Error(error.response.data.error || 'Error al obtener estadísticas del canal');
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          throw new Error('No se pudo conectar con el servidor');
        } else {
          // Algo sucedió al configurar la petición que provocó un error
          throw new Error('Error al procesar la solicitud');
        }
    }
  };