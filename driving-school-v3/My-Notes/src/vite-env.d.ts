/// <reference types="vite/client" />

// Extend window for PWA types
declare global {
  interface Window {
    seedData: () => Promise<void>;
    isDatabaseEmpty: () => Promise<boolean>;
  }
}

// Vite PWA virtual module
declare module 'virtual:pwa-register' {
  export type RegisterSWOptions = {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: any) => void;
  };

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_ENABLE_SW: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
