import api from './api';

export const uploadDocument = async (achievementId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(
    `/documents/upload/${achievementId}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return response.data;
};

export const getDocumentsByAchievement = async (achievementId) => {
  const response = await api.get(`/documents/achievement/${achievementId}`);
  return response.data;
};

export const downloadDocument = async (storedFileName, originalFileName) => {
  const response = await api.get(
    `/documents/download/${storedFileName}`,
    { responseType: 'blob' }
  );

  // Create a temporary URL for the downloaded file blob
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', originalFileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};