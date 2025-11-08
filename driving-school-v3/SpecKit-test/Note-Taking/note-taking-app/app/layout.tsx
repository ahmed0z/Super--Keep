'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { OfflineIndicator } from "@/components/ui/OfflineIndicator";
import { PWAInstallPrompt } from "@/components/ui/PWAInstallPrompt";
import { OnboardingFlow } from "@/components/ui/OnboardingFlow";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes - Hybrid Note-Taking App",
  description: "A modern note-taking app combining the best features of Google Keep and Notion",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ToastProvider>
            {children}
            <OfflineIndicator />
            <PWAInstallPrompt />
            <OnboardingFlow />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
