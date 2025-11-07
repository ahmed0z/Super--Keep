'use client';

import { useEffect, useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { AppLayout } from '@/components/layout/AppLayout';
import { NoteGrid } from '@/components/notes/NoteGrid';
import { NoteList } from '@/components/notes/NoteList';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { useViewMode } from '@/hooks/useViewMode';
import { Archive, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ArchivePage() {
  const { notes, refetch } = useNotes();
  const { viewMode, setViewMode } = useViewMode();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      await refetch();
      setLoading(false);
    };
    loadNotes();
  }, [refetch]);

  const archivedNotes = notes.filter(note => note.archived);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Archive className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Archive
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({archivedNotes.length})
              </span>
            </div>
          </div>

          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : archivedNotes.length === 0 ? (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No archived notes
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Archived notes will appear here
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <NoteGrid notes={archivedNotes} />
        ) : (
          <NoteList notes={archivedNotes} />
        )}
      </div>
    </AppLayout>
  );
}
