/**
 * Icon button component for toolbar actions.
 */
import React from 'react';
import { clsx } from '../../utils/clsx';
import { Tooltip } from './Tooltip';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, showTooltip = true, size = 'md', variant = 'default', className, ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    };

    const variantStyles = {
      default: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-container-high)] active:scale-95',
      filled: 'text-[var(--color-on-primary-container)] bg-[var(--color-primary-container)] hover:shadow-md active:scale-95',
    };

    const button = (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={clsx(
          'inline-flex items-center justify-center rounded-full',
          'transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
          'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-38',
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );

    if (showTooltip) {
      return <Tooltip content={label}>{button}</Tooltip>;
    }

    return button;
  }
);

IconButton.displayName = 'IconButton';
