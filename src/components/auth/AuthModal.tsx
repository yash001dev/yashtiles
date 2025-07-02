import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { login, register, forgotPassword, resetPassword, error, clearError } = useAuth();
  const { showSuccess, showError } = useNotifications();

  // Form data states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    resetToken: '',
  });

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      resetToken: '',
    });
    setMessage('');
    clearError();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    clearError();

    try {
      switch (mode) {
        case 'login':
          await login(formData.email, formData.password);
          showSuccess('Welcome back!', 'You have successfully signed in.');
          handleClose();
          break;

        case 'register':
          if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          await register(formData.firstName, formData.lastName, formData.email, formData.password);
          showSuccess('Welcome to YashTiles!', 'Your account has been created successfully.');
          handleClose();
          break;

        case 'forgot-password':
          await forgotPassword(formData.email);
          showSuccess('Reset link sent', 'If the email exists, a reset link has been sent');
          setMessage('If the email exists, a reset link has been sent');
          break;

        case 'reset-password':
          await resetPassword(formData.email, formData.resetToken, formData.password);
          showSuccess('Password reset successful', 'Your password has been reset successfully');
          setMessage('Password has been reset successfully');
          setMode('login');
          break;
      }
    } catch (err) {
      // Error is handled by the context
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 rounded-lg transition-colors duration-200"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => setMode('forgot-password')}
          className="text-pink-500 hover:text-pink-600 text-sm"
        >
          Forgot your password?
        </button>
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setMode('register')}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </>
  );

  const renderRegisterForm = () => (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 rounded-lg transition-colors duration-200"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setMode('login')}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 rounded-lg transition-colors duration-200"
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode('login')}
          className="text-pink-500 hover:text-pink-600 text-sm"
        >
          Back to sign in
        </button>
      </div>
    </>
  );

  const renderResetPasswordForm = () => (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            name="resetToken"
            placeholder="Reset token"
            value={formData.resetToken}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="New password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 rounded-lg transition-colors duration-200"
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </>
  );

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Welcome Back';
      case 'register':
        return 'Create Account';
      case 'forgot-password':
        return 'Forgot Password';
      case 'reset-password':
        return 'Reset Password';
      default:
        return 'Authentication';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login':
        return 'Sign in to your account';
      case 'register':
        return 'Join YashTiles today';
      case 'forgot-password':
        return 'Reset your password';
      case 'reset-password':
        return 'Enter your new password';
      default:
        return '';
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return renderLoginForm();
      case 'register':
        return renderRegisterForm();
      case 'forgot-password':
        return renderForgotPasswordForm();
      case 'reset-password':
        return renderResetPasswordForm();
      default:
        return renderLoginForm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
              <p className="text-gray-600 text-sm mt-1">{getSubtitle()}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Display error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Display success message */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderForm()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
