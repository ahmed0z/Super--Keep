'use client';

import { useParams, useRouter } from 'next/navigation';
import { useNotes } from '@/hooks/useNotes';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const { notes, updateNote } = useNotes();
  const [isSaving, setIsSaving] = useState(false);

  const noteId = params.id as string;
  const note = notes.find((n) => n.id === noteId);

  if (!note) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Note not found
          </h1>
          <Button
            variant="primary"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleUpdate = async (updates: Partial<typeof note>) => {
    setIsSaving(true);
    try {
      updateNote(noteId, updates);
    } catch (error) {
      console.error('Failed to update note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndClose = () => {
    router.push('/');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="secondary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveAndClose}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save & Close'}
          </Button>
        </div>

        {/* Editor */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <NoteEditor
            note={note}
            onUpdate={handleUpdate}
            autoSave={true}
          />
        </div>
      </div>
    </AppLayout>
  );
}
