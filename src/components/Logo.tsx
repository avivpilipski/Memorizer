'use client';

import { motion } from 'framer-motion';
import { HiOutlineMusicNote } from 'react-icons/hi';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'full';
  className?: string;
};

export default function Logo({ 
  size = 'md', 
  variant = 'default',
  className = ''
}: LogoProps) {
  // Size mappings
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  // Render different variants
  if (variant === 'minimal') {
    return (
      <motion.div 
        className={`flex items-center justify-center ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 blur-sm rounded-full"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-full p-2 flex items-center justify-center">
            <HiOutlineMusicNote className={`${iconSizes[size]} text-indigo-600`} />
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'full') {
    return (
      <motion.div 
        className={`flex items-center ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative mr-3">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 blur-sm rounded-full"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-full p-2 flex items-center justify-center">
            <HiOutlineMusicNote className={`${iconSizes[size]} text-indigo-600`} />
          </div>
        </div>
        <div>
          <h1 className={`font-bold ${sizeClasses[size]} bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
            Memorizer
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Practice Plan Generator</p>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div 
      className={`flex items-center ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative mr-2">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 blur-sm rounded-full"></div>
        <div className="relative bg-white dark:bg-gray-900 rounded-full p-2 flex items-center justify-center">
          <HiOutlineMusicNote className={`${iconSizes[size]} text-indigo-600`} />
        </div>
      </div>
      <h1 className={`font-bold ${sizeClasses[size]} bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
        Memorizer
      </h1>
    </motion.div>
  );
}