'use client';

import { ToastProvider } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { OfflineIndicator } from "@/components/ui/OfflineIndicator";
import { PWAInstallPrompt } from "@/components/ui/PWAInstallPrompt";
import { OnboardingFlow } from "@/components/ui/OnboardingFlow";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        {children}
        <OfflineIndicator />
        <PWAInstallPrompt />
        <OnboardingFlow />
      </ToastProvider>
    </ErrorBoundary>
  );
}
