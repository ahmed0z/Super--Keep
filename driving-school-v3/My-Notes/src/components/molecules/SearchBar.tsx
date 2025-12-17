/**
 * SearchBar component with instant search.
 * Includes keyboard shortcuts and accessibility features.
 */
import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSearchStore } from '../../store/searchStore';
import { clsx } from '../../utils/clsx';

interface SearchBarProps {
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const clearSearch = useSearchStore((state) => state.clearSearch);

  // Focus search with keyboard shortcut (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        clearSearch();
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Navigate to search page if not already there
    if (value && location.pathname !== '/search') {
      navigate('/search');
    }
  };

  const handleClear = () => {
    clearSearch();
    inputRef.current?.focus();
    if (location.pathname === '/search') {
      navigate('/');
    }
  };

  return (
    <div className={clsx('relative flex-1 max-w-2xl', className)}>
      <div className="relative">
        <MagnifyingGlassIcon
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-tertiary)]"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search notes..."
          className={clsx(
            'w-full rounded-full py-3.5 pl-12 pr-12 text-base',
            'bg-[var(--color-surface-container-high)]',
            'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
            'transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
            'focus:bg-[var(--color-surface)] focus:shadow-lg focus:outline-none',
            'dark:focus:bg-[var(--color-surface-container)]'
          )}
          aria-label="Search notes"
          aria-describedby="search-hint"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-container)] transition-colors"
            aria-label="Clear search"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <span id="search-hint" className="sr-only">
        Press / to focus search, Escape to clear
      </span>
    </div>
  );
};
