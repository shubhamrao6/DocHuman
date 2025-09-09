import { apiService } from './apiService';

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignupData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthResponse = {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

const AUTH_STORAGE_KEY = 'docHuman_auth';

export function saveAuthResponse(response: AuthResponse): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
}

export function getStoredAuth(): AuthResponse | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  const auth = getStoredAuth();
  return auth !== null;
}

export function getCurrentUser(): AuthResponse['user'] | null {
  const auth = getStoredAuth();
  return auth?.user || null;
}

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  const response = await apiService.login(credentials);
  saveAuthResponse(response.data);
  return response.data;
}

export async function signup(data: SignupData): Promise<{ message: string; userId: string }> {
  const response = await apiService.signup(data);
  return response.data;
}

export async function refreshToken(): Promise<AuthResponse> {
  const auth = getStoredAuth();
  if (!auth?.refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await apiService.refreshToken(auth.refreshToken);
  const newAuth = { ...auth, ...response.data };
  saveAuthResponse(newAuth);
  return newAuth;
}

export async function logout(): Promise<void> {
  console.log('🔓 Starting logout process');
  const auth = getStoredAuth();
  console.log('🔓 Auth data:', auth ? 'Found' : 'Not found');
  
  if (auth?.refreshToken && auth?.accessToken) {
    console.log('🔓 Making logout API call');
    try {
      await apiService.logout(auth.accessToken, auth.refreshToken);
      console.log('🔓 Logout API call successful');
    } catch (error) {
      console.warn('🔓 Logout API call failed:', error);
    }
  } else {
    console.log('🔓 Missing tokens, skipping API call');
  }
  
  clearStoredAuth();
  console.log('🔓 Auth data cleared from storage');
}