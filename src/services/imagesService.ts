import { getStoredAuth } from './authService';
import { apiService } from './apiService';

export interface Image {
  imageId: string;
  filename: string;
  knowledgeDbId: string;
  prompt?: string;
  provider?: string;
  fileSize: number;
  createdAt: string;
  status: string;
  description?: string;
}

export async function listImages(knowledgeDbId?: string): Promise<{ images: Image[]; count: number }> {
  const auth = getStoredAuth();
  if (!auth?.idToken) {
    throw new Error('No ID token available');
  }

  const response = await apiService.listImages(auth.idToken, knowledgeDbId);
  return response.data;
}

export async function getImageDetails(imageId: string): Promise<Image & { downloadUrl?: string }> {
  const auth = getStoredAuth();
  if (!auth?.idToken) {
    throw new Error('No ID token available');
  }

  const response = await apiService.getImageDetails(auth.idToken, imageId);
  return response.data;
}

export async function deleteImage(imageId: string): Promise<void> {
  const auth = getStoredAuth();
  if (!auth?.idToken) {
    throw new Error('No ID token available');
  }

  await apiService.deleteImage(auth.idToken, imageId);
}