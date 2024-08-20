import api from './index';

export const getUserProfile = async () => {
  const response = await api.get('/api/user/profile/');
  return response.data;
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