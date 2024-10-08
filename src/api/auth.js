import api from './index';
import axios from 'axios';

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

async function getCSRFToken() {
  try {
    const response = await api.get('/api/get-csrf-token/', {
      credentials: 'include', // Importante para incluir las cookies
    });
    
    if (response.ok) {
      const csrftoken = getCookie('csrftoken');
      if (csrftoken) {
        return csrftoken;
      }
    }
    throw new Error('No se pudo obtener el token CSRF');
  } catch (error) {
    console.error('Error al obtener el token CSRF:', error);
    throw error;
  }
}

export const logout = async () => {
  try {
    // Obtener el token CSRF justo antes de hacer logout
    const csrftoken = getCookie('csrftoken');

    console.log('CSRF Token obtenido:', csrftoken); // Para depuración

    const response = await api.post('/api/logout/', {}, {
      headers: {
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Importante para incluir las cookies en la solicitud
    });

    if (response.data.success) {
      console.log('Logout exitoso');
      
      // Limpia cualquier token o dato de sesión almacenado localmente
      localStorage.removeItem('token');
      sessionStorage.clear();
      window.location.href = '/';
      
      return { success: true, message: response.data.message };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error('Error durante el logout:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error en el proceso de logout' 
    };
  }
};

// Función auxiliar para obtener el valor de una cookie
function getCookie(name) {
  let cookieValue = null;
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
  return cookieValue;
}

export const signup = async (email, password, password2, firstName, lastName, identification, phone) => {
  try {
    const response = await api.post('/api/register/', {
      email,
      password: password,
      password2: password2,
      first_name: firstName,
      last_name: lastName,
      identification: identification,
      phone
    }, {
      withCredentials: true  // Importante para manejar cookies de sesión
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un estado fuera del rango de 2xx
      throw new Error(error.response.data.message || error.response.data.password || 'Error en el registro');
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Algo ocurrió al configurar la petición que provocó un error
      throw new Error('Error en la configuración de la petición');
    }
  }
};

export const resetPassword = async (uidb64, token, newPassword) => {
  try {
    const response = await api.post('/api/reset-password/', { uidb64, token, new_password: newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/api/forgot-password/', { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
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


// Nueva función para manejar la lógica de "Olvidé mi contraseña"
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/api/forgot-password/', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};