'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Note, Block } from '@/types';
import { sanitizeHTML } from '@/lib/utils/sanitize';
import { IconButton } from '@/components/ui/IconButton';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Code,
  Heading2
} from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
  autoSave?: boolean;
  className?: string;
}

export function NoteEditor({ 
  note, 
  onUpdate, 
  autoSave = true,
  className = '' 
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(
    note.blocks.find(b => b.type === 'text')?.content || ''
  );
  const [isDirty, setIsDirty] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save logic
  const saveChanges = useCallback(() => {
    if (!isDirty) return;

    const textBlock: Block = {
      id: note.blocks[0]?.id || crypto.randomUUID(),
      type: 'text',
      content: sanitizeHTML(content),
      order: 0
    };

    onUpdate({
      title: title.trim() || 'Untitled',
      blocks: [textBlock],
      updatedAt: new Date().toISOString()
    });

    setIsDirty(false);
  }, [title, content, note.blocks, onUpdate, isDirty]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !isDirty) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveChanges();
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [autoSave, isDirty, saveChanges]);

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
  };

  // Handle content changes
  const handleContentInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || '';
    setContent(newContent);
    setIsDirty(true);
  };

  // Format selection
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 's':
          e.preventDefault();
          saveChanges();
          break;
      }
    }
  };

  // Focus title on mount
  useEffect(() => {
    if (titleRef.current && !note.title) {
      titleRef.current.focus();
    }
  }, [note.title]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Title Input */}
      <input
        ref={titleRef}
        type="text"
        value={title}
        onChange={handleTitleChange}
        onKeyDown={handleKeyDown}
        placeholder="Title"
        className="text-2xl font-bold bg-transparent border-none outline-none w-full
                   placeholder:text-gray-400 dark:placeholder:text-gray-600
                   focus:ring-0"
        aria-label="Note title"
        maxLength={200}
      />

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700">
        <IconButton
          icon={<Bold className="w-4 h-4" />}
          label="Bold (Ctrl+B)"
          onClick={() => formatText('bold')}
          variant="ghost"
          size="sm"
        />
        <IconButton
          icon={<Italic className="w-4 h-4" />}
          label="Italic (Ctrl+I)"
          onClick={() => formatText('italic')}
          variant="ghost"
          size="sm"
        />
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
        <IconButton
          icon={<Heading2 className="w-4 h-4" />}
          label="Heading"
          onClick={() => formatText('formatBlock', 'h2')}
          variant="ghost"
          size="sm"
        />
        <IconButton
          icon={<List className="w-4 h-4" />}
          label="Bullet list"
          onClick={() => formatText('insertUnorderedList')}
          variant="ghost"
          size="sm"
        />
        <IconButton
          icon={<ListOrdered className="w-4 h-4" />}
          label="Numbered list"
          onClick={() => formatText('insertOrderedList')}
          variant="ghost"
          size="sm"
        />
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
        <IconButton
          icon={<LinkIcon className="w-4 h-4" />}
          label="Insert link"
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) formatText('createLink', url);
          }}
          variant="ghost"
          size="sm"
        />
        <IconButton
          icon={<Code className="w-4 h-4" />}
          label="Code block"
          onClick={() => formatText('formatBlock', 'pre')}
          variant="ghost"
          size="sm"
        />
      </div>

      {/* Content Editor */}
      <div
        ref={contentRef}
        contentEditable
        onInput={handleContentInput}
        onKeyDown={handleKeyDown}
        className="min-h-[200px] p-4 outline-none bg-transparent
                   prose prose-sm dark:prose-invert max-w-none
                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        aria-label="Note content"
        role="textbox"
        aria-multiline="true"
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
      />

      {/* Save indicator */}
      {isDirty && autoSave && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Saving...
        </div>
      )}
    </div>
  );
}
