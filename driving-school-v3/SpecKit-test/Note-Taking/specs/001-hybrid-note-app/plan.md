# Implementation Plan: Hybrid Note-Taking App

**Branch**: `001-hybrid-note-app` | **Date**: 2025-11-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-hybrid-note-app/spec.md`

## Summary

Building a hybrid note-taking application that combines Google Keep's minimalist interface with Notion's rich content capabilities. The app will support rich content blocks (text, checklists, tables) within notes, with a clean grid/list view for organization. Implementation uses Next.js as a static site with client-side data persistence (localStorage), optimized for mobile-first responsive design.

**Key Technical Decisions**:
- Next.js 14+ with App Router and Static Site Generation (SSG)
- Client-side only architecture (no backend/database initially)
- localStorage for data persistence
- Mobile-first responsive design with Tailwind CSS
- TypeScript throughout for type safety

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14+  
**Primary Dependencies**: 
  - Next.js 14+ (App Router, SSG)
  - React 18+
  - Tailwind CSS 3.x
  - Zustand (lightweight state management)
  - React Hook Form (form handling)
  - date-fns (date utilities)
  - lucide-react (icons)

**Storage**: Client-side localStorage (browser-based persistence, no backend database)

**Testing**: 
  - Vitest (unit tests)
  - React Testing Library (component tests)
  - Playwright (E2E tests)
  - @testing-library/user-event (user interaction testing)

**Target Platform**: 
  - Modern web browsers (Chrome, Firefox, Safari, Edge)
  - Mobile browsers (iOS Safari, Chrome Mobile)
  - Progressive Web App (PWA) capabilities
  - Responsive breakpoints: mobile (320px+), tablet (768px+), desktop (1024px+)

**Project Type**: Web application (static site, client-side only)

**Performance Goals**: 
  - First Contentful Paint (FCP) < 1.5s
  - Largest Contentful Paint (LCP) < 2.5s
  - Time to Interactive (TTI) < 3.5s
  - Note creation response < 100ms
  - Block manipulation response < 50ms
  - Auto-save latency < 500ms

**Constraints**: 
  - No backend/API (static site only)
  - localStorage limit: ~5-10MB per origin
  - Support up to 100 notes in localStorage
  - Support up to 25 blocks per note
  - Mobile-first responsive design mandatory
  - Offline-capable (all functionality works without network)

**Scale/Scope**: 
  - Target: Personal use (single device, single user)
  - Up to 100 notes
  - Up to 25 content blocks per note
  - Support for 3 block types (text, checklist, table)
  - 8 color themes for notes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: The original constitution was written for Supabase-based apps. This project is a static site prototype with no backend. The following adaptations apply:

### ✅ PASSES: Component-First Architecture
- **Requirement**: Modular, reusable components with clear separation of concerns
- **Status**: ✅ COMPLIANT
- **Implementation**: 
  - Separate UI components (`/components/ui/`)
  - Feature components (`/components/notes/`, `/components/blocks/`)
  - Custom hooks for business logic (`/hooks/`)
  - Utilities for data access (`/lib/storage/`)

### ⚠️ ADAPTED: Data Strategy (Originally Supabase-First)
- **Original Requirement**: Supabase as single source of truth
- **Adaptation**: localStorage as single source of truth (prototype phase)
- **Status**: ✅ ACCEPTABLE (documented deviation for prototype)
- **Rationale**: User explicitly requested "no databases" and "mocked data" for initial implementation
- **Migration Path**: localStorage schema designed to map cleanly to future Supabase tables
- **Implementation**:
  - All data operations through abstracted storage service
  - Service interface can be swapped for Supabase later
  - Type-safe data contracts defined upfront

### ✅ PASSES: Type Safety (NON-NEGOTIABLE)
- **Requirement**: TypeScript strict mode, no `any` types
- **Status**: ✅ COMPLIANT
- **Implementation**:
  - `strict: true` in tsconfig.json
  - Zod schemas for runtime validation
  - Type definitions for all entities (Note, Block types)
  - No `any` types allowed

### ⚠️ ADAPTED: Security First
- **Original Requirement**: Supabase Auth, RLS policies
- **Adaptation**: No authentication (single-user, local-only prototype)
- **Status**: ✅ ACCEPTABLE (documented deviation for prototype)
- **Rationale**: Static site, no backend, single-user local storage
- **Future Consideration**: When migrating to Supabase, implement Auth + RLS
- **Current Security**:
  - Input sanitization for XSS prevention
  - CSP headers via Next.js config
  - No external API calls or data transmission

### ✅ PASSES: Performance & User Experience
- **Requirement**: Optimistic UI, responsive design, accessibility
- **Status**: ✅ COMPLIANT
- **Implementation**:
  - Optimistic updates for all CRUD operations
  - Mobile-first responsive design with Tailwind
  - WCAG 2.1 AA compliance (keyboard navigation, ARIA labels, color contrast)
  - Loading states and error boundaries
  - Core Web Vitals targets defined

### ✅ PASSES: Code Quality Requirements
- **Requirement**: ESLint, Prettier, pre-commit hooks, JSDoc
- **Status**: ✅ COMPLIANT
- **Implementation**:
  - ESLint + Prettier configured
  - Husky pre-commit hooks
  - JSDoc comments for all functions/components
  - Complexity limits enforced via ESLint rules

### ⚠️ ADAPTED: Testing Requirements
- **Original Requirement**: Integration tests with Supabase test project
- **Adaptation**: Integration tests with localStorage mock
- **Status**: ✅ ACCEPTABLE
- **Implementation**:
  - Unit tests for business logic (Vitest)
  - Component tests (React Testing Library)
  - E2E tests for critical flows (Playwright)
  - localStorage service mocked in tests

### Constitution Compliance Summary

| Principle | Status | Notes |
|-----------|--------|-------|
| Component-First Architecture | ✅ PASS | Fully compliant |
| Data Strategy | ⚠️ ADAPTED | localStorage replaces Supabase for prototype |
| Type Safety | ✅ PASS | Fully compliant |
| Security First | ⚠️ ADAPTED | No auth required for single-user prototype |
| Performance & UX | ✅ PASS | Fully compliant with mobile-first |
| Code Quality | ✅ PASS | Fully compliant |
| Testing | ⚠️ ADAPTED | localStorage-based tests instead of Supabase |

**Overall Assessment**: ✅ APPROVED with documented adaptations for static site prototype.

**Gate Status**: 🟢 PROCEED TO PHASE 0

## Project Structure

### Documentation (this feature)

```text
specs/001-hybrid-note-app/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (technical decisions)
├── data-model.md        # Phase 1 output (entities & validation)
├── quickstart.md        # Phase 1 output (setup & dev guide)
├── contracts/           # Phase 1 output (TypeScript interfaces)
│   ├── Note.ts          # Note entity contract
│   ├── Block.ts         # Block entity contracts
│   └── Storage.ts       # Storage service contract
├── checklists/          # Quality validation
│   └── requirements.md  # Requirements checklist
└── spec.md             # Feature specification
```

### Source Code (repository root)

```text
note-taking-app/                 # Next.js project root
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page (notes list)
│   │   ├── notes/
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Individual note view
│   │   ├── archive/
│   │   │   └── page.tsx         # Archived notes view
│   │   └── globals.css          # Global styles + Tailwind
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── IconButton.tsx
│   │   │   └── ViewToggle.tsx
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── AppLayout.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── notes/               # Note-related components
│   │   │   ├── NoteCard.tsx     # Note preview in grid/list
│   │   │   ├── NoteGrid.tsx     # Grid view layout
│   │   │   ├── NoteList.tsx     # List view layout
│   │   │   ├── NoteEditor.tsx   # Note editing interface
│   │   │   └── NoteActions.tsx  # Delete, archive, color actions
│   │   │
│   │   └── blocks/              # Content block components
│   │       ├── BlockContainer.tsx    # Wrapper for all blocks
│   │       ├── TextBlock.tsx         # Text content block
│   │       ├── ChecklistBlock.tsx    # Checklist/todo block
│   │       ├── TableBlock.tsx        # Table block
│   │       ├── BlockToolbar.tsx      # Add/delete block controls
│   │       └── BlockTypeSelector.tsx # Block type picker
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useNotes.ts          # Notes CRUD operations
│   │   ├── useLocalStorage.ts   # localStorage abstraction
│   │   ├── useAutoSave.ts       # Auto-save logic (500ms debounce)
│   │   ├── useViewMode.ts       # Grid/list view toggle
│   │   └── useKeyboardShortcuts.ts # Keyboard navigation
│   │
│   ├── lib/                     # Business logic & utilities
│   │   ├── storage/             # Data persistence layer
│   │   │   ├── noteStorage.ts   # Note CRUD with localStorage
│   │   │   ├── migration.ts     # Data migration utilities
│   │   │   └── export.ts        # Export/import utilities
│   │   │
│   │   ├── validation/          # Data validation with Zod
│   │   │   ├── noteSchema.ts    # Note validation schema
│   │   │   ├── blockSchema.ts   # Block validation schemas
│   │   │   └── validators.ts    # Validation helper functions
│   │   │
│   │   ├── utils/               # General utilities
│   │   │   ├── date.ts          # Date formatting
│   │   │   ├── id.ts            # ID generation
│   │   │   ├── sanitize.ts      # XSS prevention
│   │   │   └── colors.ts        # Color palette definitions
│   │   │
│   │   └── constants.ts         # App-wide constants
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── note.ts              # Note entity types
│   │   ├── block.ts             # Block entity types
│   │   ├── storage.ts           # Storage interface types
│   │   └── ui.ts                # UI component prop types
│   │
│   └── store/                   # Zustand state management
│       ├── notesStore.ts        # Notes global state
│       ├── uiStore.ts           # UI preferences (view mode, etc.)
│       └── types.ts             # Store type definitions
│
├── tests/                       # Test files
│   ├── unit/                    # Unit tests
│   │   ├── storage/
│   │   ├── validation/
│   │   └── utils/
│   │
│   ├── components/              # Component tests
│   │   ├── notes/
│   │   ├── blocks/
│   │   └── ui/
│   │
│   └── e2e/                     # End-to-end tests
│       ├── note-creation.spec.ts
│       ├── block-manipulation.spec.ts
│       ├── note-organization.spec.ts
│       └── responsive.spec.ts
│
├── public/                      # Static assets
│   ├── manifest.json            # PWA manifest
│   └── icons/                   # App icons
│
├── .husky/                      # Git hooks
│   ├── pre-commit              # Lint + type check
│   └── pre-push                # Run tests
│
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Vitest configuration
├── playwright.config.ts        # Playwright configuration
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
└── package.json               # Dependencies
```

**Structure Decision**: Selected web application structure with Next.js App Router. The architecture separates concerns cleanly:

1. **App Router (`/app`)**: Next.js routing and page components
2. **Components (`/components`)**: Organized by domain (ui, layout, notes, blocks)
3. **Hooks (`/hooks`)**: Reusable business logic and state management
4. **Lib (`/lib`)**: Core utilities, storage layer, validation
5. **Types (`/types`)**: Centralized TypeScript definitions
6. **Store (`/store`)**: Global state with Zustand
7. **Tests**: Mirrored structure for unit, component, and E2E tests

This structure supports:
- Easy migration to Supabase (swap `/lib/storage/noteStorage.ts` implementation)
- Component reusability and testability
- Clear separation of UI, business logic, and data access
- Mobile-first responsive design with Tailwind

## Complexity Tracking

> **DEVIATION JUSTIFICATION**: This section documents adaptations from the Supabase-first constitution for the static site prototype.

| Adaptation | Why Needed | Original Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| localStorage instead of Supabase | User requirement: "no databases", "mocked data" for prototype phase | Supabase requires backend setup; prototype needs rapid development without infrastructure |
| No authentication system | Single-user, local-only static site | Supabase Auth unnecessary for single-device, single-user prototype; adds complexity without value |
| Client-side only architecture | Static site generation (SSG) requirement from user | Backend/API unnecessary when all data is local; reduces deployment complexity |
| Zustand over Redux Toolkit | Lightweight state needs (notes list, UI preferences) | Redux Toolkit overkill for simple local state; Zustand provides sufficient features with less boilerplate |

**Migration Path to Supabase**: When ready to add backend:
1. Keep all TypeScript types and Zod schemas (they map to Supabase tables)
2. Replace `/lib/storage/noteStorage.ts` with Supabase client implementation
3. Add authentication via Supabase Auth
4. Implement RLS policies matching current localStorage access patterns
5. Generate TypeScript types from Supabase schema (validate against existing types)
6. Update tests to use Supabase test project

All adaptations are temporary for the prototype phase and have a clear path to full constitution compliance when migrating to production with Supabase.
