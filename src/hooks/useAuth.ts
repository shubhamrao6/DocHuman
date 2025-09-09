import { useState } from 'react';
import { login, signup, logout } from '../services/authService';

export const useAuth = () => {
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    email: '',
    password: ''
  });
  const [emailFormErrors, setEmailFormErrors] = useState({
    email: '',
    password: ''
  });
  const [signupFormData, setSignupFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [signupFormErrors, setSignupFormErrors] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleEmailSignup = () => {
    setShowEmailForm(true);
  };

  const validateEmailForm = () => {
    const errors = {
      email: '',
      password: ''
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(emailFormData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!emailFormData.password) {
      errors.password = 'Password is required';
    } else if (emailFormData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setEmailFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const validateSignupForm = () => {
    const errors = {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    };

    if (!signupFormData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!signupFormData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(signupFormData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!signupFormData.password) {
      errors.password = 'Password is required';
    } else if (signupFormData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setSignupFormErrors(errors);
    return !errors.email && !errors.password && !errors.firstName && !errors.lastName;
  };

  const handleEmailFormSubmit = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();
    if (validateEmailForm()) {
      setIsLoading(true);
      try {
        await login({ email: emailFormData.email, password: emailFormData.password });
        onSuccess();
        setShowEmailForm(false);
        setEmailFormData({ email: '', password: '' });
        setEmailFormErrors({ email: '', password: '' });
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignupFormSubmit = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();
    if (validateSignupForm()) {
      setIsLoading(true);
      try {
        await signup(signupFormData);
        onSuccess();
        setSignupFormData({ email: '', password: '', firstName: '', lastName: '' });
        setSignupFormErrors({ email: '', password: '', firstName: '', lastName: '' });
      } catch (error) {
        console.error('Signup failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEmailFormData(prev => ({ ...prev, [field]: value }));
    setSignupFormData(prev => ({ ...prev, [field]: value }));
    if (emailFormErrors[field as keyof typeof emailFormErrors]) {
      setEmailFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (signupFormErrors[field as keyof typeof signupFormErrors]) {
      setSignupFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
  };

  const handleLogout = async () => {
    console.log('🔓 handleLogout called');
    setIsLoading(true);
    try {
      await logout();
      console.log('🔓 Logout completed successfully');
    } catch (error) {
      console.error('🔓 Logout failed:', error);
    } finally {
      setIsLoading(false);
      console.log('🔓 Loading state reset');
    }
  };

  const handleBackToLogin = () => {
    setShowEmailForm(false);
    setEmailFormData({ email: '', password: '' });
    setEmailFormErrors({ email: '', password: '' });
  };

  return {
    showEmailForm,
    isLoading,
    emailFormData,
    emailFormErrors,
    signupFormData,
    signupFormErrors,
    handleGoogleLogin,
    handleGoogleSignup,
    handleEmailSignup,
    handleEmailFormSubmit,
    handleSignupFormSubmit,
    handleInputChange,
    handleBackToLogin,
    handleLogout
  };
};