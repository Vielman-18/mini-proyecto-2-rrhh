import axios from 'axios';

const API_URL = 'https://rrhh-nomina-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, role: string) =>
    api.post('/auth/register', { email, password, role }),
};

export const empleadosService = {
  listar: () => api.get('/empleados'),
  crear: (data: any) => api.post('/empleados', data),
  obtener: (id: number) => api.get(`/empleados/${id}`),
  actualizar: (id: number, data: any) => api.put(`/empleados/${id}`, data),
  eliminar: (id: number) => api.delete(`/empleados/${id}`),
};

export const nominaService = {
  crear: (periodo: string) => api.post('/nomina/crear', { periodo }),
  listar: () => api.get('/nomina/listar'),
};

export default api;