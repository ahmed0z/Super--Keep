/**
 * UI Store
 * Zustand store for managing UI preferences and state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewMode, NoteFilter, UIPreferences, NoteEditorState, SearchState, SelectionState, ToastMessage } from '@/types';
import { DEFAULT_VIEW_MODE, DEFAULT_COLOR_SCHEME } from '@/lib/utils/constants';

interface UIState {
  // Preferences (persisted)
  preferences: UIPreferences;
  setPreferences: (preferences: Partial<UIPreferences>) => void;
  
  // View and filter
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  filter: NoteFilter;
  setFilter: (filter: NoteFilter) => void;
  
  // Note editor
  editor: NoteEditorState;
  openEditor: (noteId: string | null) => void;
  closeEditor: () => void;
  setEditorDirty: (isDirty: boolean) => void;
  
  // Search
  search: SearchState;
  setSearchQuery: (query: string) => void;
  setSearchActive: (isActive: boolean) => void;
  setSearchResults: (results: string[]) => void;
  clearSearch: () => void;
  
  // Selection
  selection: SelectionState;
  toggleNoteSelection: (noteId: string) => void;
  selectAll: (noteIds: string[]) => void;
  clearSelection: () => void;
  setMultiSelectMode: (enabled: boolean) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial preferences
      preferences: {
        viewMode: DEFAULT_VIEW_MODE,
        colorScheme: DEFAULT_COLOR_SCHEME,
        compactView: false,
      },
      
      setPreferences: (newPreferences: Partial<UIPreferences>) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      // View mode
      viewMode: DEFAULT_VIEW_MODE,
      setViewMode: (mode: ViewMode) => {
        set({ viewMode: mode });
        get().setPreferences({ viewMode: mode });
      },

      // Filter
      filter: 'all',
      setFilter: (filter: NoteFilter) => set({ filter }),

      // Note editor
      editor: {
        noteId: null,
        isOpen: false,
        isDirty: false,
      },
      
      openEditor: (noteId: string | null) =>
        set({ editor: { noteId, isOpen: true, isDirty: false } }),
      
      closeEditor: () =>
        set({ editor: { noteId: null, isOpen: false, isDirty: false } }),
      
      setEditorDirty: (isDirty: boolean) =>
        set((state) => ({ editor: { ...state.editor, isDirty } })),

      // Search
      search: {
        query: '',
        isActive: false,
        results: [],
      },
      
      setSearchQuery: (query: string) =>
        set((state) => ({ search: { ...state.search, query } })),
      
      setSearchActive: (isActive: boolean) =>
        set((state) => ({ search: { ...state.search, isActive } })),
      
      setSearchResults: (results: string[]) =>
        set((state) => ({ search: { ...state.search, results } })),
      
      clearSearch: () =>
        set({ search: { query: '', isActive: false, results: [] } }),

      // Selection
      selection: {
        selectedNoteIds: new Set(),
        isMultiSelectMode: false,
      },
      
      toggleNoteSelection: (noteId: string) =>
        set((state) => {
          const newSet = new Set(state.selection.selectedNoteIds);
          if (newSet.has(noteId)) {
            newSet.delete(noteId);
          } else {
            newSet.add(noteId);
          }
          return {
            selection: { ...state.selection, selectedNoteIds: newSet },
          };
        }),
      
      selectAll: (noteIds: string[]) =>
        set((state) => ({
          selection: {
            ...state.selection,
            selectedNoteIds: new Set(noteIds),
          },
        })),
      
      clearSelection: () =>
        set((state) => ({
          selection: {
            ...state.selection,
            selectedNoteIds: new Set(),
          },
        })),
      
      setMultiSelectMode: (enabled: boolean) =>
        set((state) => ({
          selection: {
            ...state.selection,
            isMultiSelectMode: enabled,
            selectedNoteIds: enabled ? state.selection.selectedNoteIds : new Set(),
          },
        })),

      // Toast notifications
      toasts: [],
      
      showToast: (message: string, type: ToastMessage['type'] = 'info', duration = 3000) => {
        const id = `toast_${Date.now()}_${Math.random()}`;
        const toast: ToastMessage = { id, message, type, duration };
        
        set((state) => ({ toasts: [...state.toasts, toast] }));
        
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
      },
      
      removeToast: (id: string) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
    }),
    {
      name: 'ui-preferences',
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);
