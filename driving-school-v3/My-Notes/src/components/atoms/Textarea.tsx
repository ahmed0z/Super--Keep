/**
 * Textarea component with auto-resize capability.
 */
import React, { useEffect, useRef } from 'react';
import { clsx } from '../../utils/clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, autoResize = false, className, id, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Auto-resize logic
    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoResize) return;

      const adjustHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      adjustHeight();
      textarea.addEventListener('input', adjustHeight);
      return () => textarea.removeEventListener('input', adjustHeight);
    }, [autoResize, props.value]);

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
        <textarea
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          id={inputId}
          className={clsx(
            'w-full rounded-lg border bg-white px-3 py-2 text-gray-900 transition-colors',
            'placeholder:text-gray-400 resize-none',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50',
            'dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-300 dark:border-gray-600',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
