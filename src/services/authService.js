import axios from 'axios';

// Tạo axios instance với base URL từ biến môi trường
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lưu token vào localStorage
export const saveToken = (token) => {
  localStorage.setItem('access_token', token);
};

// Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem('access_token');
};

// Xóa token khỏi localStorage
export const removeToken = () => {
  localStorage.removeItem('access_token');
};

// API đăng nhập
export const login = async (username, password) => {
  try {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    // Nếu backend yêu cầu grant_type, bỏ comment dòng dưới:
    // params.append('grant_type', 'password');

    const response = await api.post('/api/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Lưu token vào localStorage
    if (response.data.access_token) {
      saveToken(response.data.access_token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// API đăng ký
export const register = async (username, password, role = 'user') => {
  try {
    const response = await api.post('/api/auth/register', {
      username,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Thiết lập header Authorization cho các request tiếp theo
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 