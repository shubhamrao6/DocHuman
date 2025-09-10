import { getStoredAuth } from './authService';
import { apiService } from './apiService';

export interface Document {
  documentId: string;
  filename: string;
  fileType: string;
  fileSize: number;
  knowledgeDbId: string;
  chunkCount: number;
  createdAt: string;
  status: string;
}

export async function listDocuments(knowledgeDbId?: string): Promise<{ documents: Document[]; count: number }> {
  const auth = getStoredAuth();
  if (!auth?.idToken) {
    throw new Error('No ID token available');
  }

  const response = await apiService.listDocuments(auth.idToken, knowledgeDbId);
  return response.data;
}

export async function deleteDocument(documentId: string): Promise<void> {
  const auth = getStoredAuth();
  if (!auth?.idToken) {
    throw new Error('No ID token available');
  }

  await apiService.deleteDocument(auth.idToken, documentId);
}

export async function getDocumentDetails(documentId: string): Promise<any> {
  const auth = getStoredAuth();
  if (!auth?.idToken) {
    throw new Error('No ID token available');
  }

  const response = await apiService.getDocumentDetails(auth.idToken, documentId);
  return response.data;
}