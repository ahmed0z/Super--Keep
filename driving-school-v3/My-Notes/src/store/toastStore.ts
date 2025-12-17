/**
 * Toast notification store.
 * Manages toast notifications displayed to the user.
 */
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, action?: Toast['action']) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (message, type = 'info', action) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, action };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      get().dismissToast(id);
    }, 4000);
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));
