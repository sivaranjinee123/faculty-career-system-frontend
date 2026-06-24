import api from './api';

export const getMyAchievements = async () => {
  const response = await api.get('/achievements');
  return response.data;
};

export const getTotalPoints = async () => {
  const response = await api.get('/achievements/points');
  return response.data;
};

export const addAchievement = async (achievement) => {
  const response = await api.post('/achievements', achievement);
  return response.data;
};

export const updateAchievement = async (id, achievement) => {
  const response = await api.put(`/achievements/${id}`, achievement);
  return response.data;
};

export const deleteAchievement = async (id) => {
  await api.delete(`/achievements/${id}`);
};

export const getAchievementsByFacultyEmail = async (email) => {
  const response = await api.get(`/achievements/by-email/${email}`);
  return response.data;
};