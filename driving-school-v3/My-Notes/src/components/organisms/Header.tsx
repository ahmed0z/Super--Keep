/**
 * Header component with search and settings.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { SearchBar } from '../molecules/SearchBar';
import { IconButton } from '../atoms/IconButton';
import { useSettingsStore } from '../../store/settingsStore';
import { isOnline } from '../../services/storage';
import { clsx } from '../../utils/clsx';

interface HeaderProps {
  onMenuClick: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, className }) => {
  const settings = useSettingsStore((state) => state.settings);
  const toggleDarkMode = useSettingsStore((state) => state.toggleDarkMode);
  const toggleViewMode = useSettingsStore((state) => state.toggleViewMode);
  const online = isOnline();

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-3 px-3',
        'bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)]',
        'transition-colors duration-300',
        className
      )}
    >
      {/* Menu button */}
      <IconButton
        icon={<Bars3Icon className="h-6 w-6" />}
        label="Toggle menu"
        onClick={onMenuClick}
      />

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary)] shadow-md">
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 4v1.38c-.83-.33-1.72-.5-2.61-.5-1.79 0-3.58.68-4.95 2.05l3.33 3.33h1.11v1.11c.86.86 1.98 1.31 3.11 1.36V15H6v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-5h-1V4H9zm-1.11 6.41V8.26H5.61L4.57 7.22a5.07 5.07 0 0 1 1.82-.34c1.34 0 2.59.52 3.54 1.46l1.41 1.41-.2.2c-.51.51-1.19.8-1.92.8-.47 0-.93-.12-1.33-.34zM17 18H8v-1h5v-2h-1v-1.49c.63-.09 1.22-.35 1.73-.72l.69.69L16 14V6h1v12z"/>
          </svg>
        </div>
        <span className="text-xl font-semibold text-[var(--color-text-primary)] tracking-tight">My Notes</span>
      </Link>

      {/* Search bar */}
      <SearchBar className="mx-4" />

      {/* Right side actions */}
      <div className="flex items-center gap-1">
        {/* Offline indicator */}
        {!online && (
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-tertiary-container)] px-4 py-2 text-sm font-medium text-[var(--color-tertiary)]">
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
            Offline
          </div>
        )}

        {/* View mode toggle */}
        <IconButton
          icon={
            settings.viewMode === 'grid' ? (
              <ListBulletIcon className="h-5 w-5" />
            ) : (
              <Squares2X2Icon className="h-5 w-5" />
            )
          }
          label={settings.viewMode === 'grid' ? 'List view' : 'Grid view'}
          onClick={toggleViewMode}
        />

        {/* Dark mode toggle */}
        <IconButton
          icon={
            settings.darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )
          }
          label={settings.darkMode ? 'Light mode' : 'Dark mode'}
          onClick={toggleDarkMode}
        />
      </div>
    </header>
  );
};
