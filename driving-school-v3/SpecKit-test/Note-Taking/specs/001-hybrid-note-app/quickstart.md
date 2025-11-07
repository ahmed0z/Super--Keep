# Quickstart Guide: Hybrid Note-Taking App

**Feature**: 001-hybrid-note-app  
**Date**: 2025-11-07  
**Version**: 1.0.0

## Overview

This guide walks you through setting up the development environment, running the app, and understanding the project structure for the hybrid note-taking application.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.17+ or v20.x (LTS recommended)
- **npm**: v9+ or **pnpm**: v8+ (pnpm recommended for faster installs)
- **Git**: v2.30+
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest version)
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

**Check versions**:
```bash
node --version   # Should be v18.17+ or v20.x
npm --version    # Should be v9+
git --version    # Should be v2.30+
```

---

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd note-taking-app
git checkout 001-hybrid-note-app
```

### 2. Install Dependencies

Using **npm**:
```bash
npm install
```

Or using **pnpm** (faster):
```bash
pnpm install
```

This installs:
- Next.js 14+ (App Router)
- React 18+
- TypeScript 5.x
- Tailwind CSS 3.x
- Zustand (state management)
- Zod (validation)
- Vitest, React Testing Library, Playwright (testing)

### 3. Configure Environment

Create a `.env.local` file in the project root:

```bash
# .env.local (optional for now, no backend)

# App Configuration
NEXT_PUBLIC_APP_NAME="Hybrid Notes"
NEXT_PUBLIC_MAX_NOTES=100
NEXT_PUBLIC_MAX_BLOCKS_PER_NOTE=25

# Development
NODE_ENV=development
```

**Note**: Since this is a static site with no backend, environment variables are minimal.

### 4. Verify Setup

Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the empty notes view with "Create your first note" message.

---

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

The app runs at `http://localhost:3000` with:
- ✅ Hot Module Replacement (HMR)
- ✅ Fast Refresh for React components
- ✅ TypeScript type checking
- ✅ Tailwind CSS compilation

### Project Structure

```
note-taking-app/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home (notes list)
│   │   ├── notes/[id]/       # Individual note view
│   │   └── archive/          # Archived notes
│   │
│   ├── components/           # React components
│   │   ├── ui/               # Reusable UI (Button, Card, etc.)
│   │   ├── layout/           # Layout components
│   │   ├── notes/            # Note-specific components
│   │   └── blocks/           # Content block components
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useNotes.ts       # Notes CRUD operations
│   │   ├── useAutoSave.ts    # Auto-save logic
│   │   └── ...
│   │
│   ├── lib/                  # Business logic
│   │   ├── storage/          # localStorage service
│   │   ├── validation/       # Zod schemas
│   │   └── utils/            # Utilities
│   │
│   ├── types/                # TypeScript types
│   │   ├── note.ts
│   │   ├── block.ts
│   │   └── storage.ts
│   │
│   └── store/                # Zustand stores
│       ├── notesStore.ts
│       └── uiStore.ts
│
├── tests/                    # Test files
│   ├── unit/
│   ├── components/
│   └── e2e/
│
├── public/                   # Static assets
├── specs/                    # Documentation
└── [config files]
```

### Key Files to Know

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main notes list page |
| `src/components/notes/NoteEditor.tsx` | Note editing interface |
| `src/components/blocks/BlockContainer.tsx` | Block rendering logic |
| `src/lib/storage/noteStorage.ts` | localStorage abstraction |
| `src/store/notesStore.ts` | Global notes state (Zustand) |
| `src/lib/validation/noteSchema.ts` | Zod validation schemas |

---

## Common Tasks

### Creating a New Component

```bash
# Create UI component
touch src/components/ui/NewComponent.tsx

# Component template:
```

```typescript
/**
 * NewComponent
 * 
 * Brief description of what this component does.
 */

interface NewComponentProps {
  // Props definition
}

export function NewComponent({ }: NewComponentProps) {
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}
```

### Adding a New Block Type

1. **Update types** (`src/types/block.ts`):
   ```typescript
   export interface NewBlock extends BaseBlock {
     type: 'newType'
     // ... specific fields
   }
   
   export type ContentBlock = TextBlock | ChecklistBlock | TableBlock | NewBlock
   ```

2. **Update Zod schema** (`src/lib/validation/blockSchema.ts`):
   ```typescript
   export const NewBlockSchema = z.object({
     // ... validation rules
   })
   ```

3. **Create component** (`src/components/blocks/NewBlock.tsx`):
   ```typescript
   export function NewBlock({ block }: { block: NewBlock }) {
     // Render logic
   }
   ```

4. **Register in BlockContainer** (`src/components/blocks/BlockContainer.tsx`):
   ```typescript
   const blockComponents = {
     text: TextBlock,
     checklist: ChecklistBlock,
     table: TableBlock,
     newType: NewBlock, // Add here
   }
   ```

### Working with localStorage

```typescript
// Import the storage service
import { noteStorage } from '@/lib/storage/noteStorage'

// Create a note
const newNote = noteStorage.createNote({
  title: 'My Note',
  color: 'blue',
  archived: false,
  blocks: []
})

// Get all notes
const notes = noteStorage.getAllNotes()

// Update a note
noteStorage.updateNote({
  id: noteId,
  title: 'Updated Title'
})

// Delete a note
noteStorage.deleteNote(noteId)
```

### Using Zustand Store

```typescript
// In a component
import { useNotesStore } from '@/store/notesStore'

export function MyComponent() {
  const notes = useNotesStore(state => state.notes)
  const addNote = useNotesStore(state => state.addNote)
  
  const handleCreate = () => {
    addNote({
      title: 'New Note',
      color: 'default',
      archived: false,
      blocks: []
    })
  }
  
  return (
    <button onClick={handleCreate}>Create Note</button>
  )
}
```

---

## Testing

### Running Tests

```bash
# Unit tests (Vitest)
npm run test

# Component tests (React Testing Library)
npm run test:components

# E2E tests (Playwright)
npm run test:e2e

# All tests
npm run test:all

# Test with coverage
npm run test:coverage
```

### Writing Tests

**Unit Test Example** (`tests/unit/utils/date.test.ts`):
```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from '@/lib/utils/date'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-11-07')
    expect(formatDate(date)).toBe('Nov 7, 2025')
  })
})
```

**Component Test Example** (`tests/components/NoteCard.test.tsx`):
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NoteCard } from '@/components/notes/NoteCard'

describe('NoteCard', () => {
  it('renders note title', () => {
    render(<NoteCard note={mockNote} />)
    expect(screen.getByText('Test Note')).toBeInTheDocument()
  })
})
```

**E2E Test Example** (`tests/e2e/note-creation.spec.ts`):
```typescript
import { test, expect } from '@playwright/test'

test('creates a new note', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('button:has-text("New Note")')
  await page.fill('input[placeholder="Title"]', 'My Note')
  await page.click('button:has-text("Save")')
  await expect(page.locator('text=My Note')).toBeVisible()
})
```

---

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Formatting

```bash
# Check formatting with Prettier
npm run format:check

# Auto-format code
npm run format
```

### Type Checking

```bash
# Run TypeScript compiler check
npm run type-check
```

### Pre-commit Hooks

Husky runs automatically before commits:
1. Lints staged files
2. Runs type checking
3. Formats code

**Bypass** (not recommended):
```bash
git commit --no-verify
```

---

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates:
- Static HTML/CSS/JS files in `out/` directory
- Optimized bundles with code splitting
- Minified and compressed assets

### Preview Production Build Locally

```bash
npm run start
# or use serve
npx serve out
```

### Build Output

```
out/
├── index.html              # Home page
├── notes/
│   └── [id].html          # Note pages (dynamic)
├── archive.html           # Archive page
├── _next/
│   ├── static/            # Static assets
│   └── ...
└── [other static files]
```

---

## Deployment

Since this is a static site, deploy to any static hosting:

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

### GitHub Pages

```bash
# Build
npm run build

# Deploy out/ directory to gh-pages branch
npx gh-pages -d out
```

### Other Platforms

Works with:
- Cloudflare Pages
- AWS S3 + CloudFront
- Render
- Railway

**Key**: Set build command to `npm run build` and output directory to `out/`

---

## Troubleshooting

### Common Issues

**Issue**: `localStorage is not defined` during build
```bash
# Solution: Ensure localStorage is only accessed in useEffect or client components
# Add 'use client' directive to components using localStorage
```

**Issue**: Type errors with ContentBlock
```typescript
// Solution: Use type guards
if (isTextBlock(block)) {
  // TypeScript now knows block is TextBlock
  console.log(block.content)
}
```

**Issue**: Tailwind styles not applying
```bash
# Restart dev server
npm run dev

# Clear .next cache
rm -rf .next
npm run dev
```

**Issue**: Tests failing with "localStorage is not defined"
```typescript
// Add to test setup (tests/setup.ts)
global.localStorage = new LocalStorageMock()
```

### Debug Mode

```bash
# Enable detailed logging
DEBUG=* npm run dev

# TypeScript verbose
npm run type-check --verbose
```

### Clear localStorage

In browser console:
```javascript
localStorage.clear()
location.reload()
```

---

## Mobile Development

### Testing on Mobile Devices

**Option 1: Local Network**
```bash
# Find your IP address
# Windows: ipconfig
# Mac/Linux: ifconfig

# Access from mobile browser
http://YOUR_IP:3000
```

**Option 2: Browser DevTools**
- Chrome DevTools: Toggle device toolbar (Ctrl+Shift+M)
- Emulate iPhone, Android devices
- Test responsive breakpoints

**Option 3: Playwright Mobile Tests**
```typescript
// tests/e2e/mobile.spec.ts
test.use({
  ...devices['iPhone 13']
})

test('mobile note creation', async ({ page }) => {
  // Test mobile-specific interactions
})
```

### Mobile Debugging

```bash
# Chrome Remote Debugging (Android)
# Enable USB debugging on device
# chrome://inspect in Chrome

# Safari Web Inspector (iOS)
# Enable Web Inspector on device
# Safari > Develop > [Your Device]
```

---

## Keyboard Shortcuts

Implement these for better UX:

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New note |
| `Ctrl/Cmd + S` | Save note (auto-saves anyway) |
| `Ctrl/Cmd + /` | Toggle view mode |
| `Ctrl/Cmd + Backspace` | Delete note |
| `Esc` | Close editor |

---

## Next Steps

1. ✅ **Development**: Start building features from tasks.md
2. ✅ **Testing**: Write tests as you develop (TDD encouraged)
3. ✅ **UI Polish**: Refine mobile responsiveness
4. ✅ **Accessibility**: Test with screen readers, keyboard navigation
5. ✅ **Performance**: Monitor Lighthouse scores
6. 🔄 **Future**: Plan migration to Supabase (see data-model.md)

---

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zustand**: https://docs.pmnd.rs/zustand
- **Zod**: https://zod.dev
- **Vitest**: https://vitest.dev
- **Playwright**: https://playwright.dev

---

## Getting Help

- **Specification**: See `specs/001-hybrid-note-app/spec.md`
- **Data Model**: See `specs/001-hybrid-note-app/data-model.md`
- **Technical Decisions**: See `specs/001-hybrid-note-app/research.md`
- **Constitution**: See `.specify/memory/constitution.md`

---

**Happy Coding!** 🚀

If you encounter issues, check the troubleshooting section or review the specification documents.
