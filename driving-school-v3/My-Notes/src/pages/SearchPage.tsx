/**
 * SearchPage - Display search results with highlighting.
 */
import React, { useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchStore } from '../store/searchStore';
import { useNotesStore } from '../store/notesStore';
import { useLabelsStore } from '../store/labelsStore';
import { NoteCard } from '../components/organisms/NoteCard';
import { NoteEditor } from '../components/organisms/NoteEditor';
import { useSettingsStore } from '../store/settingsStore';
import type { Note } from '../types';

const SearchPage: React.FC = () => {
  const query = useSearchStore((state) => state.query);
  const results = useSearchStore((state) => state.results);
  const isSearching = useSearchStore((state) => state.isSearching);
  const rebuildIndex = useSearchStore((state) => state.rebuildIndex);
  const isNotesInitialized = useNotesStore((state) => state.isInitialized);
  const isLabelsInitialized = useLabelsStore((state) => state.isInitialized);
  const settings = useSettingsStore((state) => state.settings);
  
  const viewMode = settings.viewMode;

  const [editingNote, setEditingNote] = React.useState<Note | null>(null);

  // Rebuild search index when stores are initialized or notes change
  useEffect(() => {
    if (isNotesInitialized && isLabelsInitialized) {
      rebuildIndex();
    }
  }, [isNotesInitialized, isLabelsInitialized, rebuildIndex]);

  const gridClass =
    viewMode === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
      : 'flex flex-col gap-3 max-w-2xl mx-auto';

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MagnifyingGlassIcon className="mb-4 h-24 w-24 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">
          Enter a search term to find notes
        </p>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-amber-500" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Searching...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MagnifyingGlassIcon className="mb-4 h-24 w-24 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">
          No matching notes found for "{query}"
        </p>
      </div>
    );
  }

  return (
    <>
      <div>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>

        <div className={gridClass}>
          {results.map(({ note, highlights }) => (
            <div key={note.id} className="relative">
              <NoteCard
                note={note}
                onClick={() => setEditingNote(note)}
              />
              {/* Show match locations in a subtle way */}
              {(highlights.title || highlights.content) && (
                <div className="absolute -bottom-1 left-2 right-2 rounded-b-lg bg-yellow-100/50 px-2 py-1 text-xs dark:bg-yellow-900/30">
                  {highlights.title && (
                    <span
                      className="text-gray-600 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: `Title: ${highlights.title}` }}
                    />
                  )}
                  {highlights.content && (
                    <span
                      className="text-gray-600 dark:text-gray-300 block truncate"
                      dangerouslySetInnerHTML={{ __html: highlights.content }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Note editor modal */}
      <NoteEditor
        note={editingNote || undefined}
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
      />
    </>
  );
};

export default SearchPage;
