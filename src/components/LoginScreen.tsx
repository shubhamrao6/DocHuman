import React from 'react';

interface LoginScreenProps {
  showEmailForm: boolean;
  isLoading: boolean;
  emailFormData: { email: string; password: string };
  emailFormErrors: { email: string; password: string };
  handleGoogleLogin: () => void;
  handleEmailSignup: () => void;
  handleEmailFormSubmit: (e: React.FormEvent) => void;
  handleInputChange: (field: string, value: string) => void;
  handleBackToLogin: () => void;
  navigateToSignup: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  showEmailForm,
  isLoading,
  emailFormData,
  emailFormErrors,
  handleGoogleLogin,
  handleEmailSignup,
  handleEmailFormSubmit,
  handleInputChange,
  handleBackToLogin,
  navigateToSignup
}) => (
  <div className="bg-black min-h-screen flex items-center justify-center">
    <div className="bg-[#2A2A2A] rounded-2xl p-8 w-full max-w-md mx-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Sign In</h1>
        <p className="text-gray-300">Enter your credentials to continue</p>
      </div>

      <form onSubmit={handleEmailFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={emailFormData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
              emailFormErrors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Enter your email"
          />
          {emailFormErrors.email && (
            <p className="mt-1 text-sm text-red-400">{emailFormErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={emailFormData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
              emailFormErrors.password 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Enter your password"
          />
          {emailFormErrors.password && (
            <p className="mt-1 text-sm text-red-400">{emailFormErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4">
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </div>

      <div className="mt-4 text-center">
        <button 
          onClick={navigateToSignup}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Create an account
        </button>
      </div>

    </div>
  </div>
);