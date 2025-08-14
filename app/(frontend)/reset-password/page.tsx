'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Lock, Eye, EyeOff, Home, ArrowRight, Frame, Shield } from 'lucide-react';
import { authService } from '@/lib/auth';
import { Input } from '@/components/ui/input';

interface ResetPasswordState {
  status: 'validating' | 'ready' | 'resetting' | 'success' | 'error';
  message: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resetState, setResetState] = useState<ResetPasswordState>({
    status: 'validating',
    message: 'Validating reset link...'
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [] });

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  // Password strength calculator
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    else feedback.push('One special character');

    return { score, feedback };
  };

  useEffect(() => {
    // Validate the reset link parameters
    if (!email || !token) {
      setResetState({
        status: 'error',
        message: 'Invalid reset link. Email or token is missing.'
      });
      return;
    }

    // Simulate link validation (in real app, you might want to validate with backend)
    setTimeout(() => {
      setResetState({
        status: 'ready',
        message: 'Please enter your new password below.'
      });
    }, 1500);
  }, [email, token]);

  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setPasswordStrength({ score: 0, feedback: [] });
    }
  }, [newPassword]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !token) {
      setResetState({
        status: 'error',
        message: 'Invalid reset link.'
      });
      return;
    }

    if (newPassword.length < 6) {
      setResetState({
        status: 'error',
        message: 'Password must be at least 6 characters long.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetState({
        status: 'error',
        message: 'Passwords do not match.'
      });
      return;
    }

    setResetState({
      status: 'resetting',
      message: 'Resetting your password...'
    });

    try {
      const result = await authService.resetPassword({
        email,
        token,
        newPassword
      });

      setResetState({
        status: 'success',
        message: 'Password reset successfully! You can now login with your new password.'
      });

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (error) {
      setResetState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Password reset failed. Please try again.'
      });
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-pink-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Frame className="h-12 w-12 text-pink-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
          <p className="text-gray-600 mt-2">Reset Your Password</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                {resetState.status === 'validating' && (
                  <Loader2 className="h-6 w-6 text-pink-600 animate-spin absolute -bottom-1 -right-1" />
                )}
              </div>
            </div>
          </div>

          {/* Validating State */}
          {resetState.status === 'validating' && (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Validating Reset Link
              </h2>
              <p className="text-gray-600">
                Please wait while we validate your password reset link...
              </p>
              <div className="flex justify-center">
                <div className="w-8 h-1 bg-pink-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Ready to Reset */}
          {resetState.status === 'ready' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Create New Password
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose a strong password for your account
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Password Strength</span>
                        <span className={`font-medium ${
                          passwordStrength.score <= 2 ? 'text-red-600' : 
                          passwordStrength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getPasswordStrengthText(passwordStrength.score)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          <span>Missing: {passwordStrength.feedback.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || passwordStrength.score < 3}
                  className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>Reset Password</span>
                </button>
              </form>
            </div>
          )}

          {/* Resetting State */}
          {resetState.status === 'resetting' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 text-pink-600 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Resetting Password
              </h2>
              <p className="text-gray-600">
                Please wait while we update your password...
              </p>
            </div>
          )}

          {/* Success State */}
          {resetState.status === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600">
                {resetState.message}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-800">
                  Your password has been successfully updated. You can now login with your new password.
                </p>
              </div>
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <span>Redirecting to login in 3 seconds...</span>
                </div>
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center w-full bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors space-x-2"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Error State */}
          {resetState.status === 'error' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Reset Failed
              </h2>
              <p className="text-gray-600">
                {resetState.message}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-800">
                  If you continue to experience issues, please contact support or request a new password reset email.
                </p>
              </div>
              <div className="space-y-3 mt-6">
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Go Back to Home</span>
                </Link>
                <button
                  onClick={() => {
                    setResetState({ status: 'ready', message: 'Please enter your new password below.' });
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="inline-flex items-center justify-center w-full bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors space-x-2"
                >
                  <span>Try Again</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? <a href="mailto:support@photoframix.com" className="text-pink-600 hover:text-pink-700">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-pink-600 animate-spin mx-auto" />
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
