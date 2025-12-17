/**
 * Settings store using Zustand with persistence to IndexedDB.
 * Manages app-wide settings like view mode and dark mode.
 */
import { create } from 'zustand';
import type { AppSettings } from '../types';
import { settingsStorage } from '../services/storage';

const DEFAULT_SETTINGS: AppSettings = {
  viewMode: 'grid',
  darkMode: false,
  notificationsEnabled: true,
  syncEnabled: true,
};

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  toggleViewMode: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
  toggleSync: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      const savedSettings = await settingsStorage.get();
      set({
        settings: savedSettings || DEFAULT_SETTINGS,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize settings:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  updateSettings: async (updates) => {
    const newSettings = { ...get().settings, ...updates };
    await settingsStorage.set(newSettings);
    set({ settings: newSettings });
  },

  toggleDarkMode: async () => {
    await get().updateSettings({ darkMode: !get().settings.darkMode });
  },

  toggleViewMode: async () => {
    const newMode = get().settings.viewMode === 'grid' ? 'list' : 'grid';
    await get().updateSettings({ viewMode: newMode });
  },

  toggleNotifications: async () => {
    await get().updateSettings({ notificationsEnabled: !get().settings.notificationsEnabled });
  },

  toggleSync: async () => {
    await get().updateSettings({ syncEnabled: !get().settings.syncEnabled });
  },
}));
