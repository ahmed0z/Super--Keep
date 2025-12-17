/**
 * Badge/Label component for displaying tags.
 */
import React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { clsx } from '../../utils/clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  onRemove?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  onRemove,
  className,
}) => {
  const variantStyles = {
    default: 'bg-[var(--color-surface-container-high)] text-[var(--color-text-primary)]',
    primary: 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]',
    secondary: 'bg-[var(--color-secondary-container)] text-[var(--color-text-primary)]',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        'transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
        variantStyles[variant],
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 active:scale-90 transition-transform"
          aria-label="Remove"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};
