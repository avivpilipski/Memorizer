'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

type HeaderProps = {
  className?: string;
};

export default function Header({ className = '' }: HeaderProps) {
  const { user, isGuest, logout } = useAuth();
  const router = useRouter();
  const [showPlansDropdown, setShowPlansDropdown] = useState(false);

  const handleSignOut = async () => {
    await logout();
    router.push('/signin');
  };

  return (
    <header className={`bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10 ${className}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo size="md" variant="default" />
        
        <div className="flex items-center space-x-6">
          {user && (
            <div className="relative">
              <button 
                onClick={() => setShowPlansDropdown(!showPlansDropdown)}
                className="flex items-center text-sm text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <HiOutlineUser className="mr-1.5" /> 
                <span className="hidden sm:inline">{user.displayName || user.email}</span>
              </button>
              
              {showPlansDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-10 overflow-hidden border border-indigo-50"
                >
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">Your Account</div>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      <HiOutlineLogout className="mr-2 text-gray-500" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          
          {(user || isGuest) && !showPlansDropdown && (
            <button
              onClick={handleSignOut}
              className="flex items-center text-sm text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <HiOutlineLogout className="mr-1.5" /> 
              <span className="hidden sm:inline">{isGuest ? 'Sign In' : 'Sign Out'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}