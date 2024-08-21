import api from './index';

export const login = async (email, password, remember) => {
  try {
    const response = await api.post('/api/login/', {
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

export const checkAuthStatus = async () => {
  try {
    const response = await api.get('/api/auth-status/');
    return response.data;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/api/logout/');
    if (response.data.success) {
      console.log('Logout exitoso');
      
      // Limpia cualquier token o dato de sesión almacenado localmente
      localStorage.removeItem('token');
      sessionStorage.clear();
      
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error('Error durante el logout:', error);
    return { success: false, error: error.response?.data?.message || 'Error en el proceso de logout' };
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

export const resetPassword = async (resetKey, password1, password2) => {
  try {
    const response = await api.post(`/api/password/reset/key/${resetKey}/`, {
      new_password1: password1,
      new_password2: password2
    });
    
    if (response.data.success) {
      return {
        success: true,
        message: 'Password reset successfully'
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'An error occurred during password reset'
      };
    }
  } catch (error) {
    console.error('Error in password reset:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'An error occurred during password reset'
    };
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


// Nueva función para manejar la lógica de "Olvidé mi contraseña"
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/api/forgot-password/', {
      email: email
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Ocurrió un error. Por favor, intenta de nuevo.'
      };
    }
  } catch (error) {
    console.error('Error en la solicitud de restablecimiento de contraseña:', error);
    return {
      success: false,
      error: 'Ocurrió un error al conectar con el servidor. Por favor, intenta de nuevo.'
    };
  }
};