# Research & Technical Decisions: Hybrid Note-Taking App

**Feature**: 001-hybrid-note-app  
**Date**: 2025-11-07  
**Status**: Phase 0 Complete

## Overview

This document consolidates research findings and technical decisions for implementing the hybrid note-taking app as a Next.js static site with mobile-first design.

---

## Decision 1: Next.js 14+ with App Router & SSG

**Context**: Need a modern React framework that supports static site generation without backend complexity.

**Decision**: Use Next.js 14+ with App Router in static export mode (`output: 'export'`)

**Rationale**:
- **Static Export**: Next.js can generate fully static sites that run without a Node.js server
- **App Router**: Modern file-based routing with better TypeScript support and React Server Components
- **Built-in Optimization**: Automatic code splitting, image optimization, font optimization
- **Developer Experience**: Hot reload, TypeScript support out of the box, great documentation
- **Mobile Performance**: Excellent lighthouse scores achievable with Next.js optimizations
- **No Backend Required**: Static export works entirely in browser, perfect for localStorage-based app

**Alternatives Considered**:
1. **Create React App (CRA)**
   - ❌ Deprecated, no longer recommended by React team
   - ❌ Less optimized build output
   - ❌ More configuration needed for production builds

2. **Vite + React**
   - ✅ Very fast development server
   - ✅ Excellent build performance
   - ⚠️ More manual setup for routing, SSG
   - ⚠️ Less opinionated structure (more decisions needed)
   - **Why rejected**: Next.js provides more out-of-the-box optimizations and better defaults for static sites

3. **Remix**
   - ✅ Excellent developer experience
   - ❌ Focused on server-side rendering, not ideal for static-only sites
   - ❌ More complex than needed for this use case

**Implementation Notes**:
```javascript
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true // Required for static export
  }
}
```

---

## Decision 2: Tailwind CSS for Mobile-First Styling

**Context**: Need a CSS solution that enables rapid mobile-first development with consistent design.

**Decision**: Use Tailwind CSS 3.x with custom design tokens

**Rationale**:
- **Mobile-First**: Built-in mobile-first breakpoint system (`sm:`, `md:`, `lg:`)
- **Rapid Development**: Utility classes enable fast iteration
- **Consistent Design**: Enforces design system through configuration
- **Small Bundle Size**: PurgeCSS removes unused styles automatically
- **Dark Mode**: Built-in dark mode support for future enhancement
- **Component Composition**: Works well with React component patterns

**Alternatives Considered**:
1. **CSS Modules**
   - ✅ Scoped styles, no conflicts
   - ❌ More verbose, slower iteration
   - ❌ Harder to maintain consistent spacing/colors

2. **Styled Components / Emotion**
   - ✅ CSS-in-JS with full TypeScript support
   - ❌ Runtime performance cost
   - ❌ Larger bundle size
   - ❌ Hydration issues in Next.js App Router

3. **Vanilla CSS / SCSS**
   - ❌ No built-in mobile-first utilities
   - ❌ Harder to maintain consistency
   - ❌ More custom code needed

**Custom Configuration**:
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        // Google Keep inspired palette
        note: {
          default: '#ffffff',
          red: '#f28b82',
          orange: '#fbbc04',
          yellow: '#fff475',
          green: '#ccff90',
          teal: '#a7ffeb',
          blue: '#cbf0f8',
          purple: '#d7aefb',
          pink: '#fdcfe8',
        }
      }
    }
  }
}
```

---

## Decision 3: Zustand for State Management

**Context**: Need lightweight state management for notes list and UI preferences.

**Decision**: Use Zustand for global state management

**Rationale**:
- **Minimal Boilerplate**: Simple, hooks-based API
- **TypeScript First**: Excellent TypeScript support
- **Small Bundle**: ~1KB gzipped vs Redux Toolkit ~12KB
- **No Context Provider Needed**: Works with direct imports
- **DevTools**: Browser extension for debugging
- **Middleware Support**: Persist middleware for localStorage sync

**Alternatives Considered**:
1. **Redux Toolkit**
   - ✅ Industry standard, well documented
   - ❌ Too much boilerplate for simple app
   - ❌ Larger bundle size
   - ❌ More complex setup

2. **React Context + useReducer**
   - ✅ No external dependency
   - ❌ Re-render performance issues with large state
   - ❌ No persistence middleware
   - ❌ More boilerplate than Zustand

3. **Jotai / Recoil**
   - ✅ Atomic state management
   - ⚠️ Different mental model (atoms vs stores)
   - ⚠️ Smaller ecosystem than Zustand

**Implementation Example**:
```typescript
// store/notesStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NotesStore {
  notes: Note[]
  addNote: (note: Note) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      // ... other actions
    }),
    { name: 'notes-storage' }
  )
)
```

---

## Decision 4: localStorage with Zod Validation

**Context**: Need client-side data persistence with type safety and data integrity.

**Decision**: Use localStorage with Zod schema validation for all data operations

**Rationale**:
- **Native Browser API**: No external dependencies for storage
- **5-10MB Limit**: Sufficient for 100 notes with 25 blocks each
- **Synchronous**: Immediate read/write, perfect for optimistic UI
- **Zod Validation**: Runtime type checking prevents corrupted data
- **Migration Path**: Schema-based storage makes future Supabase migration straightforward

**Data Structure**:
```typescript
// localStorage structure
{
  "notes-storage": {
    notes: Note[],
    version: "1.0.0"
  },
  "ui-preferences": {
    viewMode: "grid" | "list",
    theme: "light" | "dark"
  }
}
```

**Alternatives Considered**:
1. **IndexedDB**
   - ✅ Larger storage limit (50MB+)
   - ❌ Asynchronous API (more complexity)
   - ❌ Overkill for simple key-value storage
   - ❌ Harder to debug

2. **sessionStorage**
   - ❌ Cleared on tab close (doesn't persist)
   - Not suitable for note-taking app

3. **External Storage (Supabase, Firebase)**
   - ❌ Violates user requirement: "no databases"
   - Future migration path, not for prototype

**Validation Strategy**:
```typescript
// validation/noteSchema.ts
import { z } from 'zod'

export const NoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200),
  blocks: z.array(BlockSchema).max(25),
  color: z.enum(['default', 'red', 'orange', /* ... */]),
  archived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Validate on read/write
export function saveNote(note: Note) {
  const validated = NoteSchema.parse(note) // Throws if invalid
  localStorage.setItem(`note-${note.id}`, JSON.stringify(validated))
}
```

---

## Decision 5: Content Block Architecture

**Context**: Need extensible system for different block types (text, checklist, table).

**Decision**: Use discriminated union types with component mapping

**Rationale**:
- **Type Safety**: TypeScript discriminated unions ensure exhaustive type checking
- **Extensibility**: Easy to add new block types in future
- **Component Mapping**: Clean separation between data model and UI
- **Notion-Like**: Matches Notion's block-based architecture

**Type Definition**:
```typescript
// types/block.ts
type BlockType = 'text' | 'checklist' | 'table'

interface BaseBlock {
  id: string
  type: BlockType
  position: number
}

interface TextBlock extends BaseBlock {
  type: 'text'
  content: string
  formatting?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
}

interface ChecklistBlock extends BaseBlock {
  type: 'checklist'
  items: Array<{
    id: string
    text: string
    checked: boolean
  }>
}

interface TableBlock extends BaseBlock {
  type: 'table'
  rows: number
  columns: number
  cells: Record<string, string> // `${row}-${col}`: content
}

type ContentBlock = TextBlock | ChecklistBlock | TableBlock
```

**Component Mapping**:
```typescript
// components/blocks/BlockContainer.tsx
const blockComponents = {
  text: TextBlock,
  checklist: ChecklistBlock,
  table: TableBlock
}

function BlockContainer({ block }: { block: ContentBlock }) {
  const Component = blockComponents[block.type]
  return <Component block={block} />
}
```

**Alternatives Considered**:
1. **Single Block Type with Conditional Rendering**
   - ❌ Poor type safety
   - ❌ Hard to maintain as block types grow

2. **Class-Based Inheritance**
   - ❌ Not idiomatic React/TypeScript
   - ❌ More complex than discriminated unions

---

## Decision 6: Auto-Save with Debouncing

**Context**: Need to save changes automatically without explicit save button, but avoid excessive storage writes.

**Decision**: Implement 500ms debounced auto-save with optimistic UI

**Rationale**:
- **User Experience**: No manual save needed (Keep/Notion behavior)
- **Performance**: Debouncing reduces localStorage writes
- **500ms Delay**: Balances responsiveness vs performance (industry standard)
- **Optimistic UI**: Changes appear instantly, persist in background

**Implementation**:
```typescript
// hooks/useAutoSave.ts
import { useEffect, useRef } from 'react'
import { debounce } from 'lodash-es'

export function useAutoSave(note: Note, saveFunction: (note: Note) => void) {
  const debouncedSave = useRef(
    debounce((n: Note) => saveFunction(n), 500)
  ).current

  useEffect(() => {
    if (note.id) {
      debouncedSave(note)
    }
    
    return () => debouncedSave.cancel()
  }, [note, debouncedSave])
}
```

**Alternatives Considered**:
1. **Immediate Save (no debounce)**
   - ❌ Too many localStorage writes
   - ❌ Performance degradation on fast typing

2. **Manual Save Button**
   - ❌ Violates Keep/Notion UX patterns
   - ❌ Risk of losing unsaved changes

3. **Longer Debounce (2-5 seconds)**
   - ❌ Higher risk of data loss
   - ❌ Users expect quicker persistence

---

## Decision 7: Mobile-First Responsive Breakpoints

**Context**: User requirement for mobile-ready application.

**Decision**: Implement mobile-first design with Tailwind breakpoints

**Breakpoints**:
- **Base (0px)**: Mobile phones (320px-639px)
- **sm (640px)**: Large phones / small tablets
- **md (768px)**: Tablets
- **lg (1024px)**: Desktops
- **xl (1280px)**: Large desktops

**Mobile-First Patterns**:
```typescript
// Example: Grid layout
<div className="
  grid grid-cols-1    // Mobile: 1 column
  sm:grid-cols-2      // Large phones: 2 columns
  md:grid-cols-3      // Tablets: 3 columns
  lg:grid-cols-4      // Desktop: 4 columns
  gap-4
">
```

**Touch Targets**:
- Minimum 44x44px tap targets (Apple HIG / Material Design)
- Increased padding on mobile for easier interaction
- Gesture support (swipe to delete/archive)

**Performance Optimization**:
- Lazy load images/icons
- Virtual scrolling for large note lists (react-window)
- Code splitting per route

**Alternatives Considered**:
1. **Desktop-First Design**
   - ❌ Violates user requirement
   - ❌ Harder to scale down than scale up

2. **Separate Mobile/Desktop Codebases**
   - ❌ Duplicate effort
   - ❌ Harder to maintain

---

## Decision 8: Testing Strategy

**Context**: Need comprehensive testing without backend complexity.

**Decision**: Three-layer testing approach with localStorage mocking

**Testing Stack**:
1. **Unit Tests**: Vitest
   - Fast, Vite-based test runner
   - Compatible with Next.js
   - ESM support out of the box

2. **Component Tests**: React Testing Library
   - User-centric testing approach
   - Works well with Vitest
   - Encourages accessible markup

3. **E2E Tests**: Playwright
   - Cross-browser testing (Chrome, Firefox, Safari)
   - Mobile device emulation
   - Screenshots/videos for debugging

**localStorage Mocking**:
```typescript
// tests/mocks/localStorage.ts
export class LocalStorageMock {
  private store: Record<string, string> = {}
  
  getItem(key: string) {
    return this.store[key] || null
  }
  
  setItem(key: string, value: string) {
    this.store[key] = value
  }
  
  clear() {
    this.store = {}
  }
}

global.localStorage = new LocalStorageMock()
```

**Test Coverage Targets**:
- Unit tests: 80%+ for business logic
- Component tests: 70%+ for UI components
- E2E tests: Critical user paths only

**Alternatives Considered**:
1. **Jest instead of Vitest**
   - ⚠️ Vitest is faster and designed for Vite/Next.js
   - Jest works but requires more configuration

2. **Cypress instead of Playwright**
   - ⚠️ Playwright has better mobile emulation
   - Playwright supports multiple browsers easily

---

## Decision 9: Accessibility (WCAG 2.1 AA)

**Context**: Constitution requirement for accessibility compliance.

**Decision**: Implement WCAG 2.1 AA standards with focus on keyboard navigation

**Key Requirements**:
1. **Keyboard Navigation**
   - All features accessible via keyboard
   - Visible focus indicators
   - Logical tab order

2. **Screen Reader Support**
   - Semantic HTML (`<button>`, `<input>`, `<textarea>`)
   - ARIA labels where needed
   - Announcements for dynamic content

3. **Color Contrast**
   - 4.5:1 for normal text
   - 3:1 for large text
   - Test all 8 note color themes

4. **Mobile Accessibility**
   - 44x44px minimum touch targets
   - Zoom support (up to 200%)
   - No horizontal scrolling at 320px

**Implementation Tools**:
- `eslint-plugin-jsx-a11y`: Catch issues during development
- `@axe-core/react`: Runtime accessibility testing
- Lighthouse CI: Automated accessibility scoring

**Example**:
```typescript
// Accessible color picker
<div role="radiogroup" aria-label="Note color">
  {colors.map(color => (
    <button
      key={color}
      role="radio"
      aria-checked={selectedColor === color}
      aria-label={`${color} color`}
      onClick={() => setColor(color)}
      className="w-12 h-12 rounded focus:ring-2"
      style={{ backgroundColor: color }}
    />
  ))}
</div>
```

---

## Decision 10: Progressive Web App (PWA) Support

**Context**: Enhance mobile experience with installable app capabilities.

**Decision**: Add basic PWA support (manifest, icons)

**Rationale**:
- **Installable**: Users can add to home screen
- **Offline-First**: Already works offline (localStorage)
- **Native Feel**: Fullscreen mode, app icon
- **Low Effort**: Next.js has good PWA plugin support

**Implementation**:
```json
// public/manifest.json
{
  "name": "Hybrid Notes",
  "short_name": "Notes",
  "description": "Hybrid note-taking app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1f2937",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Future Enhancement**:
- Service Worker for true offline support
- Background sync when network returns
- Push notifications (when backend added)

---

## Research Summary

All technical unknowns from the plan have been resolved with informed decisions:

| Area | Decision | Rationale |
|------|----------|-----------|
| **Framework** | Next.js 14+ App Router SSG | Best static site DX, mobile optimization |
| **Styling** | Tailwind CSS | Mobile-first utilities, rapid development |
| **State** | Zustand | Lightweight, perfect for local state |
| **Storage** | localStorage + Zod | Simple, type-safe, sufficient capacity |
| **Blocks** | Discriminated unions | Type-safe, extensible |
| **Auto-save** | 500ms debounce | Industry standard, good UX |
| **Responsive** | Mobile-first breakpoints | User requirement compliance |
| **Testing** | Vitest + RTL + Playwright | Modern, fast, comprehensive |
| **A11y** | WCAG 2.1 AA | Constitution requirement |
| **PWA** | Basic manifest | Low effort, high value |

**Status**: ✅ Phase 0 Complete - Ready for Phase 1 (Design & Contracts)
