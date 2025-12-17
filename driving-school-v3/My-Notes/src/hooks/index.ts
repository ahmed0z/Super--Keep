/**
 * Custom hooks for the KeepNotes application.
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { useNotesStore } from '../store/notesStore';
import { useLabelsStore } from '../store/labelsStore';
import { useSettingsStore } from '../store/settingsStore';
import { useSearchStore } from '../store/searchStore';
import { addConnectivityListener, isOnline } from '../services/storage';

/**
 * Hook to track online/offline status.
 */
export function useOnlineStatus() {
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const unsubscribe = addConnectivityListener(setOnline);
    return unsubscribe;
  }, []);

  return online;
}

/**
 * Hook for debounced value updates.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for keyboard shortcuts.
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrlMatch = options.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
      const shiftMatch = options.shift ? e.shiftKey : !e.shiftKey;
      const altMatch = options.alt ? e.altKey : !e.altKey;

      if (e.key === key && ctrlMatch && shiftMatch && altMatch) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options.ctrl, options.shift, options.alt]);
}

/**
 * Hook for click outside detection.
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
}

/**
 * Hook for local storage with state sync.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook for media query matching.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Hook for checking if the app is installed as a PWA.
 */
export function useIsPWA(): boolean {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if running as standalone (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // Also check iOS Safari
    const isIOSPWA = (window.navigator as any).standalone === true;
    setIsPWA(isStandalone || isIOSPWA);
  }, []);

  return isPWA;
}

/**
 * Combined hook for notes with filtering.
 */
export function useNotes() {
  const store = useNotesStore();

  return {
    notes: store.notes,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    pinnedNotes: store.getPinnedNotes(),
    unpinnedNotes: store.getUnpinnedNotes(),
    archivedNotes: store.getArchivedNotes(),
    trashedNotes: store.getTrashedNotes(),
    createNote: store.createNote,
    updateNote: store.updateNote,
    deleteNote: store.deleteNote,
    togglePin: store.togglePin,
    toggleArchive: store.toggleArchive,
    moveToTrash: store.moveToTrash,
    restoreFromTrash: store.restoreFromTrash,
    setColor: store.setColor,
  };
}

/**
 * Combined hook for labels.
 */
export function useLabels() {
  const store = useLabelsStore();

  return {
    labels: store.labels,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    createLabel: store.createLabel,
    updateLabel: store.updateLabel,
    deleteLabel: store.deleteLabel,
    getLabelById: store.getLabelById,
  };
}

/**
 * Combined hook for search.
 */
export function useSearch() {
  const store = useSearchStore();

  return {
    query: store.query,
    results: store.results,
    isSearching: store.isSearching,
    setQuery: store.setQuery,
    clearSearch: store.clearSearch,
    rebuildIndex: store.rebuildIndex,
  };
}

/**
 * Combined hook for settings.
 */
export function useSettings() {
  const store = useSettingsStore();

  return {
    settings: store.settings,
    isLoading: store.isLoading,
    updateSettings: store.updateSettings,
    toggleDarkMode: store.toggleDarkMode,
    toggleViewMode: store.toggleViewMode,
  };
}
