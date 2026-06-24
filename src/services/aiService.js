import api from './api';

export const evaluateFaculty = async () => {
  const response = await api.get('/ai/evaluate');
  return response.data;
};