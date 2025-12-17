/**
 * Seed data for development and testing.
 * Run this script to populate the app with sample notes and labels.
 */
import { v4 as uuidv4 } from 'uuid';
import type { Note, Label, NoteColor } from '../types';
import { notesStorage, labelsStorage } from '../services/storage';

// Sample labels
const sampleLabels: Label[] = [
  {
    id: uuidv4(),
    name: 'Work',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: uuidv4(),
    name: 'Personal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 2,
  },
  {
    id: uuidv4(),
    name: 'Ideas',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 3,
  },
  {
    id: uuidv4(),
    name: 'Shopping',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 4,
  },
  {
    id: uuidv4(),
    name: 'Recipes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 5,
  },
];

// Helper to create notes
const createNote = (
  title: string,
  content: string,
  options: Partial<Note> = {}
): Note => {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    title,
    content,
    type: 'text',
    checklistItems: [],
    color: 'default' as NoteColor,
    labels: [],
    isPinned: false,
    isArchived: false,
    isTrashed: false,
    collaborators: [],
    createdAt: now,
    updatedAt: now,
    order: Math.floor(Math.random() * 1000),
    syncStatus: 'synced',
    ...options,
  };
};

// Sample notes
const createSampleNotes = (labels: Label[]): Note[] => {
  const workLabel = labels.find((l) => l.name === 'Work')!;
  const personalLabel = labels.find((l) => l.name === 'Personal')!;
  const ideasLabel = labels.find((l) => l.name === 'Ideas')!;
  const shoppingLabel = labels.find((l) => l.name === 'Shopping')!;
  const recipesLabel = labels.find((l) => l.name === 'Recipes')!;

  return [
    // Pinned notes
    createNote(
      'Project Deadline',
      'Remember to submit the quarterly report by Friday. Include:\n- Financial summary\n- Team updates\n- Next quarter goals',
      {
        isPinned: true,
        color: 'yellow',
        labels: [workLabel.id],
        reminder: {
          id: uuidv4(),
          dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          isRecurring: false,
          notified: false,
        },
      }
    ),

    createNote(
      'Meeting Notes',
      'Key takeaways from today\'s standup:\n\n• Sprint planning next week\n• New feature launch in 2 weeks\n• Team outing scheduled for month end',
      {
        isPinned: true,
        color: 'blue',
        labels: [workLabel.id],
      }
    ),

    // Regular notes
    createNote(
      'Book Recommendations',
      '1. Atomic Habits by James Clear\n2. Deep Work by Cal Newport\n3. The Psychology of Money by Morgan Housel\n4. Thinking, Fast and Slow by Daniel Kahneman',
      {
        color: 'purple',
        labels: [personalLabel.id],
      }
    ),

    createNote(
      'App Ideas',
      '• Habit tracker with social features\n• Recipe app with meal planning\n• Expense tracker with budgeting\n• Mood journal with insights',
      {
        color: 'green',
        labels: [ideasLabel.id],
      }
    ),

    createNote(
      'Weekend Plans',
      'Saturday:\n- Morning jog at 7am\n- Brunch with Sarah at 11am\n- Grocery shopping\n\nSunday:\n- Sleep in\n- Movie marathon\n- Meal prep for the week',
      {
        color: 'pink',
        labels: [personalLabel.id],
      }
    ),

    createNote(
      '',
      'Call mom on her birthday next Tuesday! 🎂',
      {
        color: 'red',
        reminder: {
          id: uuidv4(),
          dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isRecurring: false,
          notified: false,
        },
      }
    ),

    createNote(
      'Quick Notes',
      '• Password for wifi: GuestNetwork2024\n• Car service appointment: March 15th\n• Dentist: Dr. Smith, 555-0123',
      {
        color: 'teal',
      }
    ),

    // Checklist note
    {
      id: uuidv4(),
      title: 'Grocery List',
      content: '',
      type: 'checklist' as const,
      checklistItems: [
        { id: uuidv4(), text: 'Milk', checked: false, order: 1 },
        { id: uuidv4(), text: 'Eggs', checked: true, order: 2 },
        { id: uuidv4(), text: 'Bread', checked: false, order: 3 },
        { id: uuidv4(), text: 'Cheese', checked: false, order: 4 },
        { id: uuidv4(), text: 'Apples', checked: true, order: 5 },
        { id: uuidv4(), text: 'Chicken breast', checked: false, order: 6 },
        { id: uuidv4(), text: 'Olive oil', checked: false, order: 7 },
      ],
      color: 'orange' as NoteColor,
      labels: [shoppingLabel.id],
      isPinned: false,
      isArchived: false,
      isTrashed: false,
      collaborators: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 100,
      syncStatus: 'synced' as const,
    },

    createNote(
      'Pasta Recipe',
      'Simple Garlic Pasta:\n\n1. Cook pasta according to package\n2. Sauté minced garlic in olive oil\n3. Add red pepper flakes\n4. Toss pasta with garlic oil\n5. Top with parmesan and parsley\n\nServes 4. Total time: 20 minutes.',
      {
        color: 'brown',
        labels: [recipesLabel.id],
      }
    ),

    createNote(
      'Fitness Goals',
      '2024 Goals:\n□ Run a 5K\n□ 30 push-ups without stopping\n□ Touch my toes (flexibility!)\n□ Drink 8 glasses of water daily\n□ Sleep 7+ hours every night',
      {
        color: 'green',
        labels: [personalLabel.id],
      }
    ),

    createNote(
      'Code Snippets',
      '// Debounce function\nconst debounce = (fn, delay) => {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => fn(...args), delay);\n  };\n};',
      {
        color: 'darkblue',
        labels: [workLabel.id, ideasLabel.id],
      }
    ),

    // Archived note
    createNote(
      'Old Project Notes',
      'These notes are from the legacy project. Keeping for reference but moving to archive.',
      {
        isArchived: true,
        color: 'gray',
        labels: [workLabel.id],
      }
    ),
  ];
};

/**
 * Seed the database with sample data.
 */
export async function seedData(): Promise<void> {
  console.log('🌱 Seeding database with sample data...');

  // Clear existing data
  await labelsStorage.clear();
  await notesStorage.clear();

  // Insert labels
  for (const label of sampleLabels) {
    await labelsStorage.set(label);
  }
  console.log(`✅ Created ${sampleLabels.length} labels`);

  // Insert notes
  const notes = createSampleNotes(sampleLabels);
  for (const note of notes) {
    await notesStorage.set(note);
  }
  console.log(`✅ Created ${notes.length} notes`);

  console.log('🎉 Seed complete! Refresh the page to see the data.');
}

/**
 * Check if the database is empty.
 */
export async function isDatabaseEmpty(): Promise<boolean> {
  const notes = await notesStorage.getAll();
  return notes.length === 0;
}

// Export for use in browser console: window.seedData()
if (typeof window !== 'undefined') {
  (window as any).seedData = seedData;
  (window as any).isDatabaseEmpty = isDatabaseEmpty;
}
