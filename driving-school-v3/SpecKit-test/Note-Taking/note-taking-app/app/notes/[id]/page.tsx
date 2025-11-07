'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pin, Archive, Trash2, Palette } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { IconButton } from '@/components/ui/IconButton';
import { useNotes } from '@/hooks/useNotes';
import { formatDate } from '@/lib/utils/date';
import { getNoteColorClasses } from '@/lib/utils/colors';

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const { notes, togglePin, toggleArchive, deleteNote } = useNotes();
  
  const noteId = params.id as string;
  const note = notes.find((n) => n.id === noteId);

  if (!note) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Note not found</h2>
          <button onClick={() => router.push('/')} className="text-blue-600">
            Go back
          </button>
        </div>
      </AppLayout>
    );
  }

  const handlePin = async () => {
    await togglePin(note.id);
  };

  const handleArchive = async () => {
    await toggleArchive(note.id);
    router.push('/');
  };

  const handleDelete = async () => {
    if (confirm('Delete this note?')) {
      await deleteNote(note.id);
      router.push('/');
    }
  };

  const colorClasses = getNoteColorClasses(note.color);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <IconButton
            icon={<ArrowLeft className="h-5 w-5" />}
            label="Back"
            onClick={() => router.push('/')}
          />
          <div className="flex gap-2">
            <IconButton
              icon={<Pin className="h-5 w-5" />}
              label={note.pinned ? 'Unpin' : 'Pin'}
              onClick={handlePin}
            />
            <IconButton
              icon={<Archive className="h-5 w-5" />}
              label="Archive"
              onClick={handleArchive}
            />
            <IconButton
              icon={<Trash2 className="h-5 w-5" />}
              label="Delete"
              variant="danger"
              onClick={handleDelete}
            />
          </div>
        </div>

        {/* Note content */}
        <div className={`${colorClasses} rounded-lg p-6`}>
          <h1 className="text-3xl font-bold mb-4">{note.title || 'Untitled'}</h1>
          
          <div className="space-y-4">
            {note.blocks.map((block) => {
              if (block.type === 'text') {
                return (
                  <p key={block.id} className="text-lg whitespace-pre-wrap">
                    {block.content}
                  </p>
                );
              }
              if (block.type === 'checklist') {
                return (
                  <div key={block.id} className="space-y-2">
                    {block.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          readOnly
                          className="w-5 h-5"
                        />
                        <span className={item.checked ? 'line-through opacity-60' : ''}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>

          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-500 mt-6">
            Last updated: {formatDate(note.updatedAt)}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
