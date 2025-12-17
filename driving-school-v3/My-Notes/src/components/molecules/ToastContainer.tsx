/**
 * Toast notification container component.
 * Displays stacked toast notifications with animations.
 */
import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useToastStore, type ToastType } from '../../store/toastStore';
import { clsx } from '../../utils/clsx';

const iconMap: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationCircleIcon,
  info: InformationCircleIcon,
};

const colorMap: Record<ToastType, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400',
};

const bgMap: Record<ToastType, string> = {
  success: 'bg-emerald-900/20',
  error: 'bg-red-900/20',
  warning: 'bg-amber-900/20',
  info: 'bg-blue-900/20',
};

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-3"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];

        return (
          <div
            key={toast.id}
            className={clsx(
              'flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl',
              'bg-[var(--color-surface-container-highest)] text-[var(--color-text-primary)]',
              'animate-[slideUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)]',
              'backdrop-blur-sm border border-[var(--color-outline-variant)]',
              bgMap[toast.type]
            )}
            role="alert"
          >
            <div className={clsx('rounded-full p-1', bgMap[toast.type])}>
              <Icon className={clsx('h-5 w-5 flex-shrink-0', colorMap[toast.type])} />
            </div>
            <p className="text-sm font-medium">{toast.message}</p>
            {toast.action && (
              <button
                type="button"
                onClick={toast.action.onClick}
                className="ml-2 rounded-full px-3 py-1 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] transition-colors"
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="ml-2 rounded-full p-1.5 hover:bg-[var(--color-surface-container)] active:scale-95 transition-all"
              aria-label="Dismiss notification"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
