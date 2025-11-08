'use client';

import { WifiOff } from 'lucide-react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function OfflineIndicator() {
  const { isOnline } = useServiceWorker();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-lg animate-slideIn">
      <WifiOff className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
        You're offline
      </span>
    </div>
  );
}
