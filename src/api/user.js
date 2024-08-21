import api from './index';

export const getUserProfile = async () => {
  const response = await api.get('/api/user/profile/');
  return response.data;
};

export const getUserDetail = async () => {
  try {
    const response = await api.get('/api/user/detail/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/api/user/profile/', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword1, newPassword2) => {
  try {
    const response = await api.post('/api/user/change-password/', {
      old_password: oldPassword,
      new_password1: newPassword1,
      new_password2: newPassword2
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};