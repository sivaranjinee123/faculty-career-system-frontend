import api from './api';

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (name, department) => {
  const response = await api.put('/auth/me', { name, department });
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/me/password', {
    currentPassword, newPassword
  });
  return response.data;
};