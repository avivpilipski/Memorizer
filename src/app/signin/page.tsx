'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiOutlineUserAdd } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function SignIn() {
  const { signInWithGoogle, continueAsGuest } = useAuth();
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGuestAccess = () => {
    continueAsGuest();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/30 to-white flex flex-col items-center justify-center p-4">
      <Card variant="elevated" padding="lg" className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo size="lg" variant="minimal" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 font-heading">Welcome to Memorizer</h1>
          <p className="text-gray-600 text-balance">Sign in to save and track your practice plans</p>
        </div>

        <div className="space-y-5">
          <Button 
            onClick={handleGoogleSignIn} 
            disabled={authLoading} 
            variant="secondary" 
            fullWidth 
            icon={authLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
            ) : (
              <FcGoogle className="w-5 h-5" />
            )}
          >
            Sign in with Google
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <Button 
            onClick={handleGuestAccess} 
            variant="primary" 
            fullWidth 
            icon={<HiOutlineUserAdd className="w-5 h-5" />}
          >
            Continue as Guest
          </Button>
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  );
}