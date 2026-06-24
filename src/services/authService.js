import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // this is the JWT token string
};

export const register = async (name, email, password, department) => {
  const response = await api.post('/auth/register', {
    name, email, password, department
  });
  return response.data;
};