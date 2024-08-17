import api from './index';

export const login = async (email, password, remember) => {
  try {
    const response = await api.post('/accounts/login/', {
      email: email,
      password: password,
      remember: remember
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGoogleLoginUrl = async () => {
  const response = await api.get('/auth/google/login/');
  return response.data.login_url;
};

export const googleLogin = async (code) => {
  const response = await api.get(`/auth/google/callback/?code=${code}`);
  return response.data;
};

export const logout = async () => {
  try {
    const response = await api.post('/accounts/logout/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (email, password1, password2, firstName, lastName, type_identification, identification, phone) => {
  try {

    // Primero, obtenemos el token CSRF
    //await api.get('/accounts/signup/');

    const response = await api.post('/accounts/signup/', {
      email,
      password1,
      password2,
      first_name: firstName,
      last_name: lastName,
      type_identification: type_identification,
      identification: identification,
      phone: phone
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await api.post('/accounts/password/reset/', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword1, newPassword2) => {
  try {
    const response = await api.post('/accounts/password/change/', {
      old_password: oldPassword,
      new_password1: newPassword1,
      new_password2: newPassword2
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};