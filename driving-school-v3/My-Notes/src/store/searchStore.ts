/**
 * Search store using FlexSearch for fast full-text search.
 */
import { create } from 'zustand';
import FlexSearch from 'flexsearch';
import type { SearchResult } from '../types';
import { useNotesStore } from './notesStore';
import { useLabelsStore } from './labelsStore';

// Create a FlexSearch index for notes
const createSearchIndex = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (FlexSearch as any).Document({
    document: {
      id: 'id',
      index: ['title', 'content', 'labelNames'],
      store: true,
    },
    tokenize: 'forward',
    resolution: 9,
  });
};

interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  index: ReturnType<typeof createSearchIndex>;

  // Actions
  setQuery: (query: string) => void;
  search: (query: string) => void;
  rebuildIndex: () => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  isSearching: false,
  index: createSearchIndex(),

  setQuery: (query) => {
    set({ query });
    if (query.trim()) {
      get().search(query);
    } else {
      set({ results: [] });
    }
  },

  search: (query) => {
    set({ isSearching: true });

    const { index } = get();
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      set({ results: [], isSearching: false });
      return;
    }

    try {
      // Search in all indexed fields
      const searchResults = index.search(trimmedQuery, { limit: 50 });
      
      // Flatten and deduplicate results
      const noteIds = new Set<string>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      searchResults.forEach((result: any) => {
        result.result.forEach((id: string) => noteIds.add(String(id)));
      });

      // Get the actual notes and create search results with highlights
      const notes = useNotesStore.getState().notes;
      const labels = useLabelsStore.getState().labels;

      const results: SearchResult[] = Array.from(noteIds)
        .map((id) => {
          const note = notes.find((n) => n.id === id);
          if (!note || note.isTrashed) return null;

          // Create highlights
          const highlights: SearchResult['highlights'] = {};

          if (note.title.toLowerCase().includes(trimmedQuery)) {
            highlights.title = highlightText(note.title, trimmedQuery);
          }

          if (note.content.toLowerCase().includes(trimmedQuery)) {
            highlights.content = highlightText(note.content, trimmedQuery);
          }

          const matchingLabels = note.labels
            .map((labelId) => labels.find((l) => l.id === labelId)?.name)
            .filter((name): name is string => name?.toLowerCase().includes(trimmedQuery) || false);

          if (matchingLabels.length > 0) {
            highlights.labels = matchingLabels.map((name) => highlightText(name, trimmedQuery));
          }

          // Calculate relevance score
          let score = 0;
          if (highlights.title) score += 10;
          if (highlights.content) score += 5;
          if (highlights.labels) score += highlights.labels.length * 3;

          return { note, highlights, score };
        })
        .filter((r): r is SearchResult => r !== null)
        .sort((a, b) => b.score - a.score);

      set({ results, isSearching: false });
    } catch (error) {
      console.error('Search error:', error);
      set({ results: [], isSearching: false });
    }
  },

  rebuildIndex: () => {
    const notes = useNotesStore.getState().notes;
    const labels = useLabelsStore.getState().labels;

    // Create a new index
    const newIndex = createSearchIndex();

    // Index all notes
    notes.forEach((note) => {
      const labelNames = note.labels
        .map((labelId) => labels.find((l) => l.id === labelId)?.name || '')
        .join(' ');

      newIndex.add({
        id: note.id,
        title: note.title,
        content: note.content,
        labelNames,
      });
    });

    set({ index: newIndex });
  },

  clearSearch: () => {
    set({ query: '', results: [] });
  },
}));

/**
 * Helper function to highlight matching text.
 * Returns HTML string with <mark> tags around matches.
 */
function highlightText(text: string, query: string): string {
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700/50 rounded px-0.5">$1</mark>');
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
