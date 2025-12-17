/**
 * Labels store using Zustand with persistence to IndexedDB.
 * Manages label creation, editing, and deletion.
 */
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Label } from '../types';
import { labelsStorage } from '../services/storage';
import { useNotesStore } from './notesStore';
import { useToastStore } from './toastStore';

interface LabelsState {
  labels: Label[];
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  createLabel: (name: string) => Promise<Label>;
  updateLabel: (id: string, name: string) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
  reorderLabels: (labelIds: string[], newOrder: number[]) => Promise<void>;

  // Getters
  getLabelById: (id: string) => Label | undefined;
  getLabelByName: (name: string) => Label | undefined;
}

export const useLabelsStore = create<LabelsState>((set, get) => ({
  labels: [],
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      const labels = await labelsStorage.getAll();
      set({ labels, isLoading: false, isInitialized: true });
    } catch (error) {
      console.error('Failed to initialize labels:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  createLabel: async (name) => {
    // Check for duplicate names
    const existingLabel = get().getLabelByName(name.trim());
    if (existingLabel) {
      useToastStore.getState().showToast('Label already exists', 'error');
      throw new Error('Label already exists');
    }

    const now = new Date().toISOString();
    const maxOrder = Math.max(0, ...get().labels.map((l) => l.order));

    const newLabel: Label = {
      id: uuidv4(),
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
      order: maxOrder + 1,
    };

    await labelsStorage.set(newLabel);
    set((state) => ({ labels: [...state.labels, newLabel] }));
    useToastStore.getState().showToast('Label created', 'success');
    return newLabel;
  },

  updateLabel: async (id, name) => {
    const label = get().labels.find((l) => l.id === id);
    if (!label) return;

    // Check for duplicate names
    const existingLabel = get().getLabelByName(name.trim());
    if (existingLabel && existingLabel.id !== id) {
      useToastStore.getState().showToast('Label name already exists', 'error');
      throw new Error('Label name already exists');
    }

    const updatedLabel: Label = {
      ...label,
      name: name.trim(),
      updatedAt: new Date().toISOString(),
    };

    await labelsStorage.set(updatedLabel);
    set((state) => ({
      labels: state.labels.map((l) => (l.id === id ? updatedLabel : l)),
    }));
  },

  deleteLabel: async (id) => {
    await labelsStorage.delete(id);
    set((state) => ({
      labels: state.labels.filter((l) => l.id !== id),
    }));

    // Remove label from all notes that have it
    const notesStore = useNotesStore.getState();
    const notesWithLabel = notesStore.notes.filter((n) => n.labels.includes(id));
    for (const note of notesWithLabel) {
      await notesStore.removeLabel(note.id, id);
    }

    useToastStore.getState().showToast('Label deleted', 'success');
  },

  reorderLabels: async (labelIds, newOrder) => {
    const updates = labelIds.map((id, index) => {
      const label = get().labels.find((l) => l.id === id);
      if (!label) return null;
      return { ...label, order: newOrder[index], updatedAt: new Date().toISOString() };
    }).filter(Boolean) as Label[];

    await Promise.all(updates.map((label) => labelsStorage.set(label)));
    set((state) => ({
      labels: state.labels.map((l) => {
        const update = updates.find((u) => u.id === l.id);
        return update || l;
      }),
    }));
  },

  getLabelById: (id) => get().labels.find((l) => l.id === id),
  getLabelByName: (name) => get().labels.find((l) => l.name.toLowerCase() === name.toLowerCase().trim()),
}));
