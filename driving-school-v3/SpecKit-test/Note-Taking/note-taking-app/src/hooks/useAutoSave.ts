/**
 * useAutoSave Hook
 * Custom hook for auto-saving data with debouncing
 */

'use client';

import { useEffect, useRef } from 'react';
import { AUTO_SAVE_DELAY_MS } from '@/lib/utils/constants';

export function useAutoSave<T>(
  value: T,
  onSave: (value: T) => Promise<void> | void,
  delay: number = AUTO_SAVE_DELAY_MS
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousValueRef = useRef<T>(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip auto-save on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousValueRef.current = value;
      return;
    }

    // Skip if value hasn't changed
    if (JSON.stringify(value) === JSON.stringify(previousValueRef.current)) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave(value);
        previousValueRef.current = value;
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, onSave, delay]);

  // Force save function for manual saves
  const forceSave = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    try {
      await onSave(value);
      previousValueRef.current = value;
    } catch (error) {
      console.error('Force save failed:', error);
      throw error;
    }
  };

  return { forceSave };
}
