import api from './api';

export const getAllApplications = async () => {
  const response = await api.get('/applications/all');
  return response.data;
};

export const getPendingApplications = async () => {
  const response = await api.get('/applications/pending');
  return response.data;
};

export const reviewApplication = async (id, status, comment) => {
  const response = await api.put(`/applications/${id}/review`, {
    status, comment
  });
  return response.data;
};