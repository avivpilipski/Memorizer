'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-indigo-50/30 to-white">
      <Header />
      <main className={`flex-grow container mx-auto px-4 py-8 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}