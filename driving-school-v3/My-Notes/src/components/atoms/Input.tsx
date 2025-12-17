/**
 * Input component with proper accessibility.
 */
import React from 'react';
import { clsx } from '../../utils/clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded-2xl border-2 bg-[var(--color-surface)] px-4 py-3',
            'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
            'transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
            'focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-container)]',
            'disabled:cursor-not-allowed disabled:bg-[var(--color-surface-container)] disabled:opacity-50',
            error
              ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error-container)]'
              : 'border-[var(--color-outline-variant)]',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
