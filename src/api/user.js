import api from './index';

export const getUserProfile = async () => {
  try {
    // Asume que tienes un endpoint para obtener el perfil del usuario
    // Puede que necesites crear este endpoint en tu backend de Django
    const response = await api.get('/accounts/profile/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    // Asume que tienes un endpoint para actualizar el perfil del usuario
    // Puede que necesites crear este endpoint en tu backend de Django
    const response = await api.put('/accounts/profile/', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};