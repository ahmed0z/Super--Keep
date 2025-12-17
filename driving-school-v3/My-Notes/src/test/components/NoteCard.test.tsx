/**
 * Unit tests for NoteCard component.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NoteCard } from '../../components/organisms/NoteCard';
import type { Note } from '../../types';

// Mock the stores
vi.mock('../../store/notesStore', () => ({
  useNotesStore: vi.fn(() => ({
    togglePin: vi.fn(),
    toggleArchive: vi.fn(),
    moveToTrash: vi.fn(),
    restoreFromTrash: vi.fn(),
    permanentlyDelete: vi.fn(),
    duplicateNote: vi.fn(),
    setColor: vi.fn(),
    addLabel: vi.fn(),
    removeLabel: vi.fn(),
    setReminder: vi.fn(),
    addCollaborator: vi.fn(),
    removeCollaborator: vi.fn(),
    toggleChecklistItem: vi.fn(),
  })),
}));

vi.mock('../../store/labelsStore', () => ({
  useLabelsStore: vi.fn(() => ({
    labels: [
      { id: 'label-1', name: 'Work', createdAt: '', updatedAt: '', order: 1 },
      { id: 'label-2', name: 'Personal', createdAt: '', updatedAt: '', order: 2 },
    ],
    createLabel: vi.fn(),
  })),
}));

// Wrapper with Router
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Sample note for testing
const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: 'note-1',
  title: 'Test Note',
  content: 'This is a test note content',
  type: 'text',
  checklistItems: [],
  color: 'default',
  labels: [],
  isPinned: false,
  isArchived: false,
  isTrashed: false,
  collaborators: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  order: 1,
  syncStatus: 'synced',
  ...overrides,
});

describe('NoteCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders note title and content', () => {
    const note = createMockNote();
    render(<NoteCard note={note} />, { wrapper: Wrapper });

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('This is a test note content')).toBeInTheDocument();
  });

  it('renders without title when empty', () => {
    const note = createMockNote({ title: '' });
    render(<NoteCard note={note} />, { wrapper: Wrapper });

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('This is a test note content')).toBeInTheDocument();
  });

  it('applies correct color class', () => {
    const note = createMockNote({ color: 'yellow' });
    const { container } = render(<NoteCard note={note} />, { wrapper: Wrapper });

    expect(container.firstChild).toHaveClass('bg-note-yellow');
  });

  it('calls onClick when card is clicked', () => {
    const note = createMockNote();
    const handleClick = vi.fn();
    render(<NoteCard note={note} onClick={handleClick} />, { wrapper: Wrapper });

    fireEvent.click(screen.getByRole('button', { name: /note:/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows pinned icon when note is pinned', () => {
    const note = createMockNote({ isPinned: true });
    render(<NoteCard note={note} />, { wrapper: Wrapper });

    // Pin button should show filled icon
    expect(screen.getByLabelText(/unpin note/i)).toBeInTheDocument();
  });

  it('renders checklist items for checklist type', () => {
    const note = createMockNote({
      type: 'checklist',
      content: '',
      checklistItems: [
        { id: 'item-1', text: 'First item', checked: false, order: 1 },
        { id: 'item-2', text: 'Second item', checked: true, order: 2 },
      ],
    });
    render(<NoteCard note={note} />, { wrapper: Wrapper });

    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
  });

  it('shows labels when note has labels', () => {
    const note = createMockNote({ labels: ['label-1'] });
    render(<NoteCard note={note} />, { wrapper: Wrapper });

    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('shows collaborator count when there are collaborators', () => {
    const note = createMockNote({
      collaborators: [
        { id: 'collab-1', email: 'test@example.com', role: 'editor', addedAt: '' },
      ],
    });
    render(<NoteCard note={note} />, { wrapper: Wrapper });

    expect(screen.getByText(/shared with 1 people/i)).toBeInTheDocument();
  });

  it('is focusable via keyboard', () => {
    const note = createMockNote();
    render(<NoteCard note={note} />, { wrapper: Wrapper });

    const card = screen.getByRole('button', { name: /note:/i });
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('triggers onClick on Enter key', () => {
    const note = createMockNote();
    const handleClick = vi.fn();
    render(<NoteCard note={note} onClick={handleClick} />, { wrapper: Wrapper });

    const card = screen.getByRole('button', { name: /note:/i });
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
