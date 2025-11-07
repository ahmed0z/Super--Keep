/**
 * ViewToggle Component
 * Toggle between grid and list view modes
 */

'use client';

import React from 'react';
import { Grid3x3, List } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { ViewMode } from '@/types';

export interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <IconButton
        icon={<Grid3x3 className="h-5 w-5" />}
        label="Grid view"
        variant={currentView === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={currentView === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}
      />
      <IconButton
        icon={<List className="h-5 w-5" />}
        label="List view"
        variant={currentView === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={currentView === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}
      />
    </div>
  );
}
