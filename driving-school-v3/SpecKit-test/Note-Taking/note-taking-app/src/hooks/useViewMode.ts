/**
 * useViewMode Hook
 * Custom hook for managing view mode state
 */

'use client';

import { useUIStore } from '@/store';
import { ViewMode } from '@/types';

export function useViewMode() {
  const { viewMode, setViewMode } = useUIStore();

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
    isGridView: viewMode === 'grid',
    isListView: viewMode === 'list',
  };
}
