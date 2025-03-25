'use client';

import { motion } from 'framer-motion';
import Logo from './Logo';

type FooterProps = {
  className?: string;
};

export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo size="sm" variant="full" />
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>© {currentYear} Memorizer. All rights reserved.</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-center text-gray-400 dark:text-gray-500">
            Elevate your practice routine with personalized schedules
          </p>
        </div>
      </div>
    </footer>
  );
}