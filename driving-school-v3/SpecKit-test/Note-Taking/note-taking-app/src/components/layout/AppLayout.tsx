/**
 * AppLayout Component
 * Main application layout wrapper
 */

'use client';

import React from 'react';
import { Header } from './Header';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const handleMenuClick = () => {
    // TODO: Implement sidebar/menu functionality
    console.log('Menu clicked');
  };

  const handleSearchClick = () => {
    // TODO: Implement search functionality
    console.log('Search clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={handleMenuClick} onSearchClick={handleSearchClick} />
      
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
