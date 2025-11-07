'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const ctrlOrMeta = shortcut.ctrlKey || shortcut.metaKey;
      const matchesModifiers =
        (!ctrlOrMeta || event.ctrlKey || event.metaKey) &&
        (!shortcut.shiftKey || event.shiftKey) &&
        (!shortcut.altKey || event.altKey);

      if (matchesModifiers && event.key.toLowerCase() === shortcut.key.toLowerCase()) {
        event.preventDefault();
        shortcut.handler();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Global keyboard shortcuts hook
export function useGlobalShortcuts() {
  const router = useRouter();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      ctrlKey: true,
      handler: () => {
        // Create new note
        router.push('/');
        // Trigger create note action
        const createButton = document.querySelector('[data-action="create-note"]') as HTMLButtonElement;
        createButton?.click();
      },
      description: 'Create new note'
    },
    {
      key: 'f',
      ctrlKey: true,
      handler: () => {
        // Focus search
        const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: 'Focus search'
    },
    {
      key: '/',
      handler: () => {
        // Focus search (alternative)
        const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: 'Focus search'
    },
    {
      key: 'Escape',
      handler: () => {
        // Clear focus
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      },
      description: 'Clear focus'
    }
  ];

  useKeyboardShortcuts(shortcuts);
}
