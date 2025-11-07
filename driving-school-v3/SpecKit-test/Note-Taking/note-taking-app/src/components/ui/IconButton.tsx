/**
 * IconButton Component
 * Button component optimized for icons with proper touch targets
 */

import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string; // For accessibility
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  default: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-400',
  danger: 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400',
};

const sizeClasses = {
  sm: 'w-9 h-9 min-w-[36px] min-h-[36px]',
  md: 'w-11 h-11 min-w-[44px] min-h-[44px]',
  lg: 'w-12 h-12 min-w-[48px] min-h-[48px]',
};

export function IconButton({
  icon,
  label,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  const baseClasses = 'rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button
      className={classes}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  );
}
