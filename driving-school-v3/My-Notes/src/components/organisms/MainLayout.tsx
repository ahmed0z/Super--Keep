/**
 * MainLayout component - the main app shell with sidebar and header.
 */
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { clsx } from '../../utils/clsx';

export const MainLayout: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header onMenuClick={() => setSidebarExpanded(!sidebarExpanded)} />

      {/* Sidebar - always visible, just expands/collapses */}
      <Sidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      {/* Backdrop for mobile when expanded */}
      {sidebarExpanded && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarExpanded(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content - adjusts margin based on sidebar state */}
      <main
        className={clsx(
          'min-h-screen pt-16 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
          sidebarExpanded ? 'lg:pl-72' : 'lg:pl-20'
        )}
      >
        <div className="px-4 py-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
