/**
 * IndexedDB storage service using localForage.
 * Provides a unified API for persistent storage with offline support.
 */
import localforage from 'localforage';
import type { Note, Label, AppSettings, SyncQueueItem } from '../types';

// Configure localForage instances for different data types
const notesStore = localforage.createInstance({
  name: 'keepnotes',
  storeName: 'notes',
  description: 'Store for notes data',
});

const labelsStore = localforage.createInstance({
  name: 'keepnotes',
  storeName: 'labels',
  description: 'Store for labels data',
});

const settingsStore = localforage.createInstance({
  name: 'keepnotes',
  storeName: 'settings',
  description: 'Store for app settings',
});

const syncQueueStore = localforage.createInstance({
  name: 'keepnotes',
  storeName: 'syncQueue',
  description: 'Store for pending sync operations',
});

/**
 * Storage service for notes operations.
 */
export const notesStorage = {
  async getAll(): Promise<Note[]> {
    const notes: Note[] = [];
    await notesStore.iterate<Note, void>((value) => {
      notes.push(value);
    });
    return notes.sort((a, b) => a.order - b.order);
  },

  async get(id: string): Promise<Note | null> {
    return notesStore.getItem(id);
  },

  async set(note: Note): Promise<Note> {
    await notesStore.setItem(note.id, note);
    return note;
  },

  async delete(id: string): Promise<void> {
    await notesStore.removeItem(id);
  },

  async bulkSet(notes: Note[]): Promise<void> {
    await Promise.all(notes.map((note) => notesStore.setItem(note.id, note)));
  },

  async clear(): Promise<void> {
    await notesStore.clear();
  },
};

/**
 * Storage service for labels operations.
 */
export const labelsStorage = {
  async getAll(): Promise<Label[]> {
    const labels: Label[] = [];
    await labelsStore.iterate<Label, void>((value) => {
      labels.push(value);
    });
    return labels.sort((a, b) => a.order - b.order);
  },

  async get(id: string): Promise<Label | null> {
    return labelsStore.getItem(id);
  },

  async set(label: Label): Promise<Label> {
    await labelsStore.setItem(label.id, label);
    return label;
  },

  async delete(id: string): Promise<void> {
    await labelsStore.removeItem(id);
  },

  async clear(): Promise<void> {
    await labelsStore.clear();
  },
};

/**
 * Storage service for app settings.
 */
export const settingsStorage = {
  async get(): Promise<AppSettings | null> {
    return settingsStore.getItem('settings');
  },

  async set(settings: AppSettings): Promise<AppSettings> {
    await settingsStore.setItem('settings', settings);
    return settings;
  },
};

/**
 * Storage service for sync queue operations.
 * Used to queue changes made offline for later sync.
 */
export const syncQueueStorage = {
  async getAll(): Promise<SyncQueueItem[]> {
    const items: SyncQueueItem[] = [];
    await syncQueueStore.iterate<SyncQueueItem, void>((value) => {
      items.push(value);
    });
    return items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  async add(item: SyncQueueItem): Promise<void> {
    await syncQueueStore.setItem(item.id, item);
  },

  async remove(id: string): Promise<void> {
    await syncQueueStore.removeItem(id);
  },

  async clear(): Promise<void> {
    await syncQueueStore.clear();
  },

  async updateRetryCount(id: string, count: number): Promise<void> {
    const item = await syncQueueStore.getItem<SyncQueueItem>(id);
    if (item) {
      item.retryCount = count;
      await syncQueueStore.setItem(id, item);
    }
  },
};

/**
 * Check if the browser is online.
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Listen for online/offline events.
 */
export const addConnectivityListener = (callback: (online: boolean) => void): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
