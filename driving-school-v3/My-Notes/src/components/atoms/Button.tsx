/**
 * Button component with multiple variants.
 * Fully accessible with keyboard navigation and focus states.
 */
import React from 'react';
import { clsx } from '../../utils/clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-white hover:shadow-lg active:scale-[0.98] dark:text-[var(--color-on-primary)]',
  secondary:
    'bg-[var(--color-secondary-container)] text-[var(--color-text-primary)] hover:shadow-md active:scale-[0.98] dark:bg-[var(--color-surface-container-high)]',
  ghost:
    'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] active:scale-[0.98] dark:hover:bg-[var(--color-surface-container)]',
  danger:
    'bg-[var(--color-error)] text-white hover:shadow-lg active:scale-[0.98]',
  icon:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-container-high)] rounded-full p-2.5 active:scale-95',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isIconOnly = variant === 'icon';

    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
          'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-38',
          !isIconOnly && 'rounded-full',
          !isIconOnly && sizeStyles[size],
          variantStyles[variant],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
