'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Mail, Home, ArrowRight, Frame } from 'lucide-react';
import { authService } from '@/lib/auth';

interface VerificationState {
  status: 'loading' | 'success' | 'error';
  message: string;
  user?: any;
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying your email...'
  });

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const email = searchParams.get('email');
        const token = searchParams.get('token');

        if (!email || !token) {
          setVerificationState({
            status: 'error',
            message: 'Invalid verification link. Email or token is missing.'
          });
          return;
        }

        // Call the verification API
        const result = await authService.verifyEmail({
          email,
          token
        });
        
        setVerificationState({
          status: 'success',
          message: 'Email verified successfully! You are now logged in.',
          user: result.user
        });

        // Redirect to design frame page after 3 seconds
        setTimeout(() => {
          router.push('/frame');
        }, 3000);

      } catch (error) {
        setVerificationState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Email verification failed. Please try again.'
        });
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Frame className="h-12 w-12 text-pink-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
          <p className="text-gray-600 mt-2">Email Verification</p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            {/* Loading State */}
            {verificationState.status === 'loading' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Mail className="h-16 w-16 text-pink-600" />
                    <Loader2 className="h-6 w-6 text-pink-600 animate-spin absolute -bottom-1 -right-1" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Verifying Your Email
                </h2>
                <p className="text-gray-600">
                  Please wait while we verify your email address...
                </p>
                <div className="flex justify-center">
                  <div className="w-8 h-1 bg-pink-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Success State */}
            {verificationState.status === 'success' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Email Verified Successfully!
                </h2>
                <p className="text-gray-600">
                  {verificationState.message}
                </p>
                {verificationState.user && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-green-800">
                      Welcome, <span className="font-semibold">{verificationState.user.firstName} {verificationState.user.lastName}</span>!
                    </p>
                  </div>
                )}
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <span>Redirecting to design page in 3 seconds...</span>
                  </div>
                  <Link 
                    href="/frame" 
                    className="inline-flex items-center justify-center w-full bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors space-x-2"
                  >
                    <span>Start Photo Framing</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Error State */}
            {verificationState.status === 'error' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Verification Failed
                </h2>
                <p className="text-gray-600">
                  {verificationState.message}
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-red-800">
                    If you continue to experience issues, please contact support or try requesting a new verification email.
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
                  <Link 
                    href="/frame" 
                    className="inline-flex items-center justify-center w-full bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors space-x-2"
                  >
                    <span>Try Design Page</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? <a href="mailto:support@yashtiles.com" className="text-pink-600 hover:text-pink-700">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-pink-600 animate-spin mx-auto" />
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
