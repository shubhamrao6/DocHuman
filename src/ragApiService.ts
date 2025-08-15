// ragApiService.ts
// Service for RAG Document Management System API calls using axios
import axios, { AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: 'https://vi62anncr8.execute-api.us-east-1.amazonaws.com/prod', // Set your API base URL here or pass dynamically
});

// Health Check
export function healthCheck(apiUrl: string) {
  return api.get(`${apiUrl}/health`);
}

// Auth
export function signup(apiUrl: string, data: { email: string; password: string; firstName: string; lastName: string }) {
  return api.post(`${apiUrl}/auth/signup`, data);
}

export function login(apiUrl: string, data: { email: string; password: string }) {
  return api.post(`${apiUrl}/auth/login`, data);
}

export function refreshToken(apiUrl: string, refreshToken: string) {
  return api.post(`${apiUrl}/auth/refresh`, { refreshToken });
}

export function logout(apiUrl: string, accessToken: string, refreshToken: string) {
  return api.post(`${apiUrl}/auth/logout`, { refreshToken }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// KnowledgeDB
export function createKnowledgeDb(apiUrl: string, accessToken: string, data: { name: string; description: string }) {
  return api.post(`${apiUrl}/knowledgedbs`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function listKnowledgeDbs(apiUrl: string, accessToken: string) {
  return api.get(`${apiUrl}/knowledgedbs`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function deleteKnowledgeDb(apiUrl: string, accessToken: string, knowledgeDbId: string) {
  return api.delete(`${apiUrl}/knowledgedbs/${knowledgeDbId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// Documents
export function uploadDocument(apiUrl: string, accessToken: string, data: { fileContent: string; filename: string; fileType: string; knowledgeDbId: string }) {
  return api.post(`${apiUrl}/documents/upload`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function listDocuments(apiUrl: string, accessToken: string, knowledgeDbId?: string) {
  const url = knowledgeDbId ? `${apiUrl}/documents?knowledgeDbId=${knowledgeDbId}` : `${apiUrl}/documents`;
  return api.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function getDocumentDetails(apiUrl: string, accessToken: string, documentId: string) {
  return api.get(`${apiUrl}/documents/${documentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function deleteDocument(apiUrl: string, accessToken: string, documentId: string) {
  return api.delete(`${apiUrl}/documents/${documentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function reindexDocument(apiUrl: string, accessToken: string, documentId: string) {
  return api.post(`${apiUrl}/documents/reindex`, { documentId }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// Search
export function searchDocuments(apiUrl: string, accessToken: string, data: { question: string; knowledge_db: string; top_k: number }) {
  return api.post(`${apiUrl}/search`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
