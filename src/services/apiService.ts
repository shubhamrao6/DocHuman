import axios from 'axios';

const API_BASE_URL = 'https://vi62anncr8.execute-api.us-east-1.amazonaws.com/prod';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiService = {
  // Health
  healthCheck: () => api.get('/health'),

  // Auth
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/signup', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
  
  logout: (accessToken: string, refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  // KnowledgeDB
  createKnowledgeDb: (accessToken: string, data: { name: string; description: string }) =>
    api.post('/knowledgedbs', data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  
  listKnowledgeDbs: (accessToken: string) =>
    api.get('/knowledgedbs', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  
  deleteKnowledgeDb: (accessToken: string, knowledgeDbId: string) =>
    api.delete(`/knowledgedbs/${knowledgeDbId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  // Documents
  uploadDocument: (accessToken: string, data: { fileContent: string; filename: string; fileType: string; knowledgeDbId: string }) =>
    api.post('/documents/upload', data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  
  uploadDocumentFile: (accessToken: string, file: File, knowledgeDbId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('knowledgeDbId', knowledgeDbId);
    return api.post('/documents/upload', formData, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      },
    });
  },
  
  uploadImageFile: (accessToken: string, file: File, knowledgeDbId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('knowledgeDbId', knowledgeDbId);
    return api.post('/images/upload', formData, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      },
    });
  },

  // Images
  listImages: (accessToken: string, knowledgeDbId?: string) => {
    const url = knowledgeDbId ? `/images?knowledgeDbId=${knowledgeDbId}` : '/images';
    return api.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  
  getImageDetails: (accessToken: string, imageId: string) =>
    api.get(`/images/${imageId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  
  deleteImage: (accessToken: string, imageId: string) =>
    api.delete(`/images/${imageId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  
  listDocuments: (accessToken: string, knowledgeDbId?: string) => {
    const url = knowledgeDbId ? `/documents?knowledgeDbId=${knowledgeDbId}` : '/documents';
    return api.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  
  getDocumentDetails: (accessToken: string, documentId: string) =>
    api.get(`/documents/${documentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  
  deleteDocument: (accessToken: string, documentId: string) =>
    api.delete(`/documents/${documentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  
  reindexDocument: (accessToken: string, documentId: string) =>
    api.post('/documents/reindex', { documentId }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  // Search
  searchDocuments: (accessToken: string, data: { question: string; knowledge_db: string; top_k: number }) =>
    api.post('/search', data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};