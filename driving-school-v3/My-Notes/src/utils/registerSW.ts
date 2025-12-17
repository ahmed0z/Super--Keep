/**
 * Service Worker registration utility.
 * Registers the PWA service worker for offline support.
 */
import { registerSW as registerVitePWA } from 'virtual:pwa-register';

export function registerSW() {
  // Only register in production or if explicitly enabled
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SW) {
    const updateSW = registerVitePWA({
      onNeedRefresh() {
        // Show a prompt to the user to refresh for new content
        if (confirm('New content available. Reload?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
      onRegistered(registration) {
        console.log('Service Worker registered:', registration);
      },
      onRegisterError(error) {
        console.error('Service Worker registration failed:', error);
      },
    });
  }
}

/**
 * Request notification permission for reminders.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Show a local notification.
 */
export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      ...options,
    });
  }
}
