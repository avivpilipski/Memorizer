'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
};

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}: ButtonProps) {
  // Base classes
  const baseClasses = 'rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-3 py-2 space-x-1',
    md: 'text-sm px-4 py-3 space-x-2',
    lg: 'text-base px-6 py-4 space-x-3'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500 shadow-md',
    secondary: 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-100 focus:ring-indigo-500 shadow-sm',
    outline: 'bg-transparent text-indigo-600 hover:bg-indigo-50 border border-indigo-200 focus:ring-indigo-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${disabledClasses} ${className}`}
    >
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      {icon && iconPosition === 'left' && <span className="w-1"></span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="w-1"></span>}
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </motion.button>
  );
}