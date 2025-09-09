import { apiService } from './apiService';

export type AuthCredentials = {
  email: string;
  password: string;
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

export let authResponse: AuthResponse | null = null;

export async function login(credentials: AuthCredentials): Promise<void> {
  try {
    const response = await apiService.login(credentials);
    console.log('Login successful:', response.data);
    authResponse = response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized: Invalid credentials');
    } else {
      console.log('Login error:', error);
    }
    authResponse = null;
  }
}