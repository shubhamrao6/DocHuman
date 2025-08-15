// authService.ts
// Handles authentication logic for login and signup

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

import { login as apiLogin } from './ragApiService';

export let authResponse: AuthResponse | null = null;

export async function login(credentials: AuthCredentials): Promise<void> {
  try {
    // Use the login endpoint from ragApiService.ts
    const apiUrl = 'https://vi62anncr8.execute-api.us-east-1.amazonaws.com/prod';
    const response = await apiLogin(apiUrl, {
      email: credentials.email,
      password: credentials.password
    });
    // If successful, log and save response
    console.log('Login successful:', response.data);
    authResponse = response.data;
    // You can also save to localStorage if needed
    // localStorage.setItem('auth', JSON.stringify(authResponse));
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized: Invalid credentials');
    } else {
      console.log('Login error:', error);
    }
    // Move forward (do nothing else)
    authResponse = null;
  }
}
