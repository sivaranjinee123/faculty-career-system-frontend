import api from './api';

export const getMyApplications = async () => {
  const response = await api.get('/applications/my');
  return response.data;
};

export const submitApplication = async (application) => {
  const response = await api.post('/applications', application);
  return response.data;
};