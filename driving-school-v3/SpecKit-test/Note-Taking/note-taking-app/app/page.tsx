'use client';

import { Plus, Archive as ArchiveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/layout/EmptyState';
import { Button } from '@/components/ui/Button';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterMenu, FilterOptions } from '@/components/ui/FilterMenu';
import { NoteGrid } from '@/components/notes/NoteGrid';
import { NoteList } from '@/components/notes/NoteList';
import { useNotes } from '@/hooks/useNotes';
import { useViewMode } from '@/hooks/useViewMode';
import { Note } from '@/types';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { notes, loading, createNote, togglePin, toggleArchive, deleteNote } = useNotes();
  const { viewMode, setViewMode } = useViewMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    colors: [],
    tags: [],
    showPinned: null,
    showArchived: false // Default to active notes only
  });

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [notes]);

  // Filter and search notes
  const filteredNotes = useMemo(() => {
    let result = notes;

    // Filter by archived status
    if (filters.showArchived === false) {
      result = result.filter(note => !note.archived);
    } else if (filters.showArchived === true) {
      result = result.filter(note => note.archived);
    }

    // Filter by pinned status
    if (filters.showPinned === true) {
      result = result.filter(note => note.pinned);
    } else if (filters.showPinned === false) {
      result = result.filter(note => !note.pinned);
    }

    // Filter by colors
    if (filters.colors.length > 0) {
      result = result.filter(note => filters.colors.includes(note.color));
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      result = result.filter(note =>
        filters.tags.some(tag => note.tags.includes(tag))
      );
    }

    // Search by title and content
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(query);
        const contentMatch = note.blocks.some(block => {
          if (block.type === 'text') {
            return block.content.toLowerCase().includes(query);
          }
          return false;
        });
        return titleMatch || contentMatch;
      });
    }

    // Sort: pinned first, then by updated date
    return result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, filters, searchQuery]);

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote();
      router.push(`/notes/${newNote.id}`);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleNoteClick = (note: Note) => {
    router.push(`/notes/${note.id}`);
  };

  const handlePin = async (note: Note) => {
    try {
      await togglePin(note.id);
    } catch (error) {
      console.error('Failed to pin note:', error);
    }
  };

  const handleArchive = async (note: Note) => {
    try {
      await toggleArchive(note.id);
    } catch (error) {
      console.error('Failed to archive note:', error);
    }
  };

  const handleDelete = async (note: Note) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note.id);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <FilterMenu 
            filters={filters}
            onChange={setFilters}
            availableTags={allTags}
          />
          <Link href="/archive">
            <Button variant="ghost">
              <ArchiveIcon className="w-4 h-4 mr-2" />
              Archive
            </Button>
          </Link>
        </div>
      </div>

      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            My Notes
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          <Button onClick={handleCreateNote} size="md">
            <Plus className="h-5 w-5 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {/* Notes display */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={<Plus className="h-16 w-16" />}
          title={searchQuery || filters.colors.length || filters.tags.length ? 'No notes found' : 'No notes yet'}
          description={searchQuery || filters.colors.length || filters.tags.length ? 'Try adjusting your search or filters' : 'Get started by creating your first note'}
          action={
            <Button onClick={handleCreateNote} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Note
            </Button>
          }
        />
      ) : viewMode === 'grid' ? (
        <NoteGrid
          notes={filteredNotes}
          onNoteClick={handleNoteClick}
          onNotePin={handlePin}
          onNoteArchive={handleArchive}
          onNoteDelete={handleDelete}
        />
      ) : (
        <NoteList
          notes={filteredNotes}
          onNoteClick={handleNoteClick}
          onNotePin={handlePin}
          onNoteArchive={handleArchive}
          onNoteDelete={handleDelete}
        />
      )}
    </AppLayout>
  );
}
