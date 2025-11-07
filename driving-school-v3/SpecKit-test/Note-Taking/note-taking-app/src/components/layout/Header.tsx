/**
 * Header Component
 * Application header with search, view toggle, and actions
 */

'use client';

import React from 'react';
import { Menu, Search } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';

export interface HeaderProps {
  onMenuClick?: () => void;
  onSearchClick?: () => void;
}

export function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <IconButton
            icon={<Menu className="h-5 w-5" />}
            label="Menu"
            variant="ghost"
            onClick={onMenuClick}
            className="md:hidden"
          />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Notes
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            icon={<Search className="h-5 w-5" />}
            label="Search"
            variant="ghost"
            onClick={onSearchClick}
          />
        </div>
      </div>
    </header>
  );
}
