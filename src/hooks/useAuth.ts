import { useState } from 'react';
import { login } from '../services';

export const useAuth = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    email: '',
    password: ''
  });
  const [emailFormErrors, setEmailFormErrors] = useState({
    email: '',
    password: ''
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

  const handleEmailFormSubmit = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();
    if (validateEmailForm()) {
      setIsLoading(true);
      await login({ email: emailFormData.email, password: emailFormData.password });
      setIsLoading(false);
      onSuccess();
      setShowEmailForm(false);
      setEmailFormData({ email: '', password: '' });
      setEmailFormErrors({ email: '', password: '' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEmailFormData(prev => ({ ...prev, [field]: value }));
    if (emailFormErrors[field as keyof typeof emailFormErrors]) {
      setEmailFormErrors(prev => ({ ...prev, [field]: '' }));
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
    handleGoogleLogin,
    handleEmailSignup,
    handleEmailFormSubmit,
    handleInputChange,
    handleBackToLogin
  };
};