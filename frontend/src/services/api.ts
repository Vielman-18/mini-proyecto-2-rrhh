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
  crear: (periodo: string, tipoPeriodo: string, estado: string) =>
    api.post('/nomina', { tipo_periodo: tipoPeriodo, periodo, estado }),
  listar: () => api.get('/nomina'),
  eliminar: (id: number) => api.delete(`/nomina/${id}/delete`),
};

export const departamentosService = {
  listar: () => api.get('/departamentos'),
  crear: (data: { nombre: string; descripcion?: string }) => api.post('/departamentos', data),
  eliminar: (id: number) => api.delete(`/departamentos/${id}`),
};

export const puestosService = {
  listar: () => api.get('/puestos'),
  crear: (data: { nombre: string; departamento: string; salarioBase?: number }) => api.post('/puestos', data),
  eliminar: (id: number) => api.delete(`/puestos/${id}`),
};

export default api;