'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
};

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  animate = true,
}: CardProps) {
  // Base classes
  const baseClasses = 'rounded-2xl overflow-hidden';
  
  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-md',
    elevated: 'bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl',
    subtle: 'bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm'
  };
  
  const cardContent = (
    <div className={`${baseClasses} ${paddingClasses[padding]} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {cardContent}
      </motion.div>
    );
  }
  
  return cardContent;
}