import { getStoredAuth } from './authService';
import { apiService } from './apiService';

export interface KnowledgeDb {
  knowledgeDbId: string;
  name: string;
  description: string;
  createdAt: string;
  documentCount: number;
  namespace: string;
}

export interface CreateKnowledgeDbRequest {
  name: string;
  description: string;
}

export async function createKnowledgeDb(data: CreateKnowledgeDbRequest): Promise<KnowledgeDb> {
  const auth = getStoredAuth();
  if (!auth?.idToken) {
    throw new Error('No ID token available');
  }

  const response = await apiService.createKnowledgeDb(auth.idToken, data);
  return response.data;
}

export async function listKnowledgeDbs(): Promise<{ knowledgedbs: KnowledgeDb[]; count: number }> {
  const auth = getStoredAuth();
  if (!auth?.idToken) {
    throw new Error('No ID token available');
  }

  const response = await apiService.listKnowledgeDbs(auth.idToken);
  return response.data;
}

export async function deleteKnowledgeDb(knowledgeDbId: string): Promise<void> {
  const auth = getStoredAuth();
  if (!auth?.idToken) {
    throw new Error('No ID token available');
  }

  await apiService.deleteKnowledgeDb(auth.idToken, knowledgeDbId);
}