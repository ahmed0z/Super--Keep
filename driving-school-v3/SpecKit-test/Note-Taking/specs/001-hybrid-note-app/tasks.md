# Tasks: Hybrid Note-Taking App

**Input**: Design documents from `/specs/001-hybrid-note-app/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT included in this task breakdown as they were not explicitly requested in the feature specification. Focus is on implementation first.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `src/app/`, `src/components/`, `src/lib/`, `src/hooks/`, `src/store/`, `src/types/`
- All paths relative to `note-taking-app/` project root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 14+ project with TypeScript and App Router at note-taking-app/
- [x] T002 Configure next.config.js for static export (output: 'export') at note-taking-app/next.config.js
- [x] T003 [P] Install core dependencies: React 18+, Zustand, Zod, date-fns, lucide-react at note-taking-app/package.json
- [x] T004 [P] Install dev dependencies: Vitest, React Testing Library, Playwright, ESLint, Prettier at note-taking-app/package.json
- [x] T005 [P] Setup Tailwind CSS 3.x with custom configuration (color palette) at note-taking-app/tailwind.config.ts
- [x] T006 [P] Configure TypeScript strict mode at note-taking-app/tsconfig.json
- [x] T007 [P] Setup ESLint with Next.js config and accessibility plugin at note-taking-app/.eslintrc.json
- [x] T008 [P] Setup Prettier configuration at note-taking-app/.prettierrc
- [x] T009 [P] Configure Husky pre-commit hooks for linting and type checking at note-taking-app/.husky/
- [x] T010 [P] Setup Vitest configuration at note-taking-app/vitest.config.ts
- [x] T011 [P] Setup Playwright configuration with mobile device emulation at note-taking-app/playwright.config.ts
- [x] T012 Create base directory structure: src/app, src/components, src/lib, src/hooks, src/store, src/types at note-taking-app/src/
- [x] T013 [P] Create global styles with Tailwind imports at note-taking-app/src/app/globals.css
- [x] T014 [P] Create PWA manifest.json at note-taking-app/public/manifest.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T015 Create TypeScript type definitions for Note entity at note-taking-app/src/types/note.ts
- [ ] T016 [P] Create TypeScript type definitions for Block entities (TextBlock, ChecklistBlock, TableBlock) at note-taking-app/src/types/block.ts
- [ ] T017 [P] Create TypeScript type definitions for Storage interface at note-taking-app/src/types/storage.ts
- [ ] T018 [P] Create TypeScript type definitions for UI props at note-taking-app/src/types/ui.ts
- [ ] T019 Create Zod validation schema for Note entity at note-taking-app/src/lib/validation/noteSchema.ts
- [ ] T020 [P] Create Zod validation schemas for all Block types at note-taking-app/src/lib/validation/blockSchema.ts
- [ ] T021 [P] Create validation helper functions at note-taking-app/src/lib/validation/validators.ts
- [ ] T022 Create localStorage storage service implementing IStorageService interface at note-taking-app/src/lib/storage/noteStorage.ts
- [ ] T023 [P] Create data migration utilities for future schema changes at note-taking-app/src/lib/storage/migration.ts
- [ ] T024 [P] Create export/import utilities for note backup at note-taking-app/src/lib/storage/export.ts
- [ ] T025 Create utility functions for date formatting at note-taking-app/src/lib/utils/date.ts
- [ ] T026 [P] Create utility functions for UUID generation at note-taking-app/src/lib/utils/id.ts
- [ ] T027 [P] Create XSS sanitization utilities at note-taking-app/src/lib/utils/sanitize.ts
- [ ] T028 [P] Create color palette constants (8 Google Keep colors) at note-taking-app/src/lib/utils/colors.ts
- [ ] T029 [P] Create app-wide constants at note-taking-app/src/lib/constants.ts
- [ ] T030 Create Zustand notes store with localStorage persistence at note-taking-app/src/store/notesStore.ts
- [ ] T031 [P] Create Zustand UI preferences store at note-taking-app/src/store/uiStore.ts
- [ ] T032 [P] Create store type definitions at note-taking-app/src/store/types.ts
- [ ] T033 Create custom hook useNotes for CRUD operations at note-taking-app/src/hooks/useNotes.ts
- [ ] T034 [P] Create custom hook useLocalStorage for storage abstraction at note-taking-app/src/hooks/useLocalStorage.ts
- [ ] T035 [P] Create custom hook useAutoSave with 500ms debounce at note-taking-app/src/hooks/useAutoSave.ts
- [ ] T036 Create root layout component at note-taking-app/src/app/layout.tsx
- [ ] T037 [P] Create base UI components: Button at note-taking-app/src/components/ui/Button.tsx
- [ ] T038 [P] Create base UI components: Card at note-taking-app/src/components/ui/Card.tsx
- [ ] T039 [P] Create base UI components: IconButton at note-taking-app/src/components/ui/IconButton.tsx
- [ ] T040 [P] Create AppLayout component with header at note-taking-app/src/components/layout/AppLayout.tsx
- [ ] T041 [P] Create Header component at note-taking-app/src/components/layout/Header.tsx
- [ ] T042 [P] Create EmptyState component at note-taking-app/src/components/layout/EmptyState.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick Note Creation with Simple Interface (Priority: P1) 🎯 MVP

**Goal**: Users can create, view, and navigate notes with a minimalist Google Keep-like interface in grid/list views

**Independent Test**: Create a new note, view it in the notes list (both grid and list views), click to open it, verify it displays correctly

### Implementation for User Story 1

- [ ] T043 [P] [US1] Create ViewToggle UI component for grid/list switching at note-taking-app/src/components/ui/ViewToggle.tsx
- [ ] T044 [P] [US1] Create useViewMode custom hook for view mode state at note-taking-app/src/hooks/useViewMode.ts
- [ ] T045 [P] [US1] Create NoteCard component for note preview display at note-taking-app/src/components/notes/NoteCard.tsx
- [ ] T046 [P] [US1] Create NoteGrid component for grid view layout at note-taking-app/src/components/notes/NoteGrid.tsx
- [ ] T047 [P] [US1] Create NoteList component for list view layout at note-taking-app/src/components/notes/NoteList.tsx
- [ ] T048 [US1] Create main page (home) with notes list view at note-taking-app/src/app/page.tsx
- [ ] T049 [US1] Add new note creation button and handler to main page at note-taking-app/src/app/page.tsx
- [ ] T050 [US1] Create individual note view page (dynamic route) at note-taking-app/src/app/notes/[id]/page.tsx
- [ ] T051 [US1] Implement note navigation and routing logic at note-taking-app/src/app/notes/[id]/page.tsx
- [ ] T052 [US1] Add loading states and error boundaries to note views at note-taking-app/src/app/page.tsx and note-taking-app/src/app/notes/[id]/page.tsx
- [ ] T053 [US1] Style components with mobile-first responsive design (Tailwind) at note-taking-app/src/components/notes/
- [ ] T054 [US1] Implement keyboard navigation (Ctrl+N for new note) at note-taking-app/src/hooks/useKeyboardShortcuts.ts

**Checkpoint**: At this point, User Story 1 should be fully functional - can create notes and view them in grid/list layouts

---

## Phase 4: User Story 4 - Note Management Operations (Priority: P1)

**Goal**: Users can edit, delete, archive/unarchive notes - essential CRUD operations

**Independent Test**: Create a note, edit its title, archive it, view archive, unarchive it, then delete it permanently

**Note**: Implementing US4 before US2 because basic CRUD is more critical than rich content blocks for MVP

### Implementation for User Story 4

- [ ] T055 [P] [US4] Create NoteActions component with delete/archive buttons at note-taking-app/src/components/notes/NoteActions.tsx
- [ ] T056 [US4] Implement delete note functionality with confirmation dialog at note-taking-app/src/components/notes/NoteActions.tsx
- [ ] T057 [US4] Implement archive note functionality at note-taking-app/src/components/notes/NoteActions.tsx
- [ ] T058 [US4] Implement unarchive note functionality at note-taking-app/src/components/notes/NoteActions.tsx
- [ ] T059 [US4] Create archive view page at note-taking-app/src/app/archive/page.tsx
- [ ] T060 [US4] Add navigation link to archive view in Header at note-taking-app/src/components/layout/Header.tsx
- [ ] T061 [US4] Filter archived notes from main view at note-taking-app/src/app/page.tsx
- [ ] T062 [US4] Add optimistic UI updates for delete/archive operations at note-taking-app/src/hooks/useNotes.ts
- [ ] T063 [US4] Handle edge case: empty notes auto-cleanup (24 hours) at note-taking-app/src/lib/storage/noteStorage.ts

**Checkpoint**: At this point, User Stories 1 AND 4 work together - full basic note management

---

## Phase 5: User Story 2 - Rich Content Blocks Inside Notes (Priority: P2)

**Goal**: Users can add text, checklist, and table blocks within notes for rich content editing

**Independent Test**: Open a note, add a text block, checklist block, and table block, verify each renders and behaves correctly

### Implementation for User Story 2

- [ ] T064 [P] [US2] Create BlockContainer component for block rendering dispatch at note-taking-app/src/components/blocks/BlockContainer.tsx
- [ ] T065 [P] [US2] Create TextBlock component with formatting support at note-taking-app/src/components/blocks/TextBlock.tsx
- [ ] T066 [P] [US2] Create ChecklistBlock component with checkable items at note-taking-app/src/components/blocks/ChecklistBlock.tsx
- [ ] T067 [P] [US2] Create TableBlock component with editable cells at note-taking-app/src/components/blocks/TableBlock.tsx
- [ ] T068 [P] [US2] Create BlockToolbar component for add/delete block controls at note-taking-app/src/components/blocks/BlockToolbar.tsx
- [ ] T069 [P] [US2] Create BlockTypeSelector component for choosing block type at note-taking-app/src/components/blocks/BlockTypeSelector.tsx
- [ ] T070 [US2] Create NoteEditor component integrating all block types at note-taking-app/src/components/notes/NoteEditor.tsx
- [ ] T071 [US2] Integrate NoteEditor into note view page at note-taking-app/src/app/notes/[id]/page.tsx
- [ ] T072 [US2] Implement add block functionality (text, checklist, table) at note-taking-app/src/components/notes/NoteEditor.tsx
- [ ] T073 [US2] Implement delete individual block functionality at note-taking-app/src/components/blocks/BlockToolbar.tsx
- [ ] T074 [US2] Implement checklist item toggle (check/uncheck) at note-taking-app/src/components/blocks/ChecklistBlock.tsx
- [ ] T075 [US2] Implement add checklist item on Enter key at note-taking-app/src/components/blocks/ChecklistBlock.tsx
- [ ] T076 [US2] Implement table cell editing at note-taking-app/src/components/blocks/TableBlock.tsx
- [ ] T077 [US2] Implement add/remove table rows and columns at note-taking-app/src/components/blocks/TableBlock.tsx
- [ ] T078 [US2] Implement block position/ordering preservation at note-taking-app/src/lib/storage/noteStorage.ts
- [ ] T079 [US2] Add auto-save integration for block changes at note-taking-app/src/hooks/useAutoSave.ts
- [ ] T080 [US2] Handle edge cases: max 25 blocks per note validation at note-taking-app/src/components/notes/NoteEditor.tsx

**Checkpoint**: All user stories P1 and P2 now work - notes with rich content blocks

---

## Phase 6: User Story 3 - Note Organization and Visual Customization (Priority: P3)

**Goal**: Users can assign colors to notes for visual organization and categorization

**Independent Test**: Select a note, apply different colors, verify the color persists and displays in grid/list views

### Implementation for User Story 3

- [ ] T081 [P] [US3] Create ColorPicker UI component with 8 color options at note-taking-app/src/components/ui/ColorPicker.tsx
- [ ] T082 [US3] Integrate ColorPicker into NoteActions component at note-taking-app/src/components/notes/NoteActions.tsx
- [ ] T083 [US3] Implement color change functionality in useNotes hook at note-taking-app/src/hooks/useNotes.ts
- [ ] T084 [US3] Apply note background color to NoteCard component at note-taking-app/src/components/notes/NoteCard.tsx
- [ ] T085 [US3] Apply note background color to NoteEditor component at note-taking-app/src/components/notes/NoteEditor.tsx
- [ ] T086 [US3] Ensure color contrast meets WCAG 2.1 AA standards at note-taking-app/src/lib/utils/colors.ts
- [ ] T087 [US3] Add color palette accessibility (ARIA labels) at note-taking-app/src/components/ui/ColorPicker.tsx

**Checkpoint**: All user stories complete and independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T088 [P] Add JSDoc comments to all functions and components across note-taking-app/src/
- [ ] T089 [P] Optimize mobile touch targets (44x44px minimum) across note-taking-app/src/components/
- [ ] T090 [P] Add keyboard navigation throughout app at note-taking-app/src/hooks/useKeyboardShortcuts.ts
- [ ] T091 [P] Implement focus indicators for accessibility across note-taking-app/src/app/globals.css
- [ ] T092 [P] Add ARIA labels and semantic HTML throughout note-taking-app/src/components/
- [ ] T093 [P] Optimize for Core Web Vitals (lazy loading, code splitting) at note-taking-app/src/app/
- [ ] T094 [P] Add error boundaries for graceful error handling at note-taking-app/src/app/layout.tsx
- [ ] T095 [P] Test and fix responsive breakpoints (320px to 1280px) across all components
- [ ] T096 [P] Add loading skeletons for better perceived performance at note-taking-app/src/components/ui/
- [ ] T097 [P] Implement localStorage quota exceeded handling at note-taking-app/src/lib/storage/noteStorage.ts
- [ ] T098 [P] Add data export functionality (JSON backup) at note-taking-app/src/lib/storage/export.ts
- [ ] T099 [P] Add data import functionality (JSON restore) at note-taking-app/src/lib/storage/export.ts
- [ ] T100 [P] Create README.md with project overview and setup instructions at note-taking-app/README.md
- [ ] T101 Run production build and verify static export works at note-taking-app/
- [ ] T102 Test on mobile devices (iOS Safari, Chrome Mobile) using Playwright
- [ ] T103 Run Lighthouse audit and optimize for 90+ scores
- [ ] T104 Validate against quickstart.md for completeness

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (Phase 3): Can start after Foundational - No dependencies on other stories
  - US4 (Phase 4): Can start after Foundational - No dependencies on other stories (parallel with US1)
  - US2 (Phase 5): Depends on US1 completion (needs NoteEditor integrated into note view)
  - US3 (Phase 6): Can start after Foundational - No dependencies on US1/US2/US4 (independent color feature)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: ✅ INDEPENDENT - Can start after Foundational (Phase 2)
- **User Story 4 (P1)**: ✅ INDEPENDENT - Can start after Foundational (Phase 2), works WITH US1
- **User Story 2 (P2)**: ⚠️ DEPENDS ON US1 - Needs note view page to integrate rich blocks
- **User Story 3 (P3)**: ✅ INDEPENDENT - Can start after Foundational (Phase 2)

### Within Each User Story

- Foundation tasks (T015-T042) MUST complete before ANY user story
- UI components marked [P] within a story can be built in parallel
- Integration tasks depend on their components being built
- Auto-save integration happens after core functionality works

### Parallel Opportunities

**Phase 1 (Setup)**: Tasks T003-T014 can all run in parallel (different config files)

**Phase 2 (Foundational)**: 
- T016-T018, T020-T021, T023-T029, T031-T032 can run in parallel (different files)
- T037-T039 can run in parallel (different UI components)
- T040-T042 can run in parallel (different layout components)

**Phase 3 (US1)**:
- T043-T047 can run in parallel (different component files)

**Phase 4 (US4)**: Can run FULLY IN PARALLEL with Phase 3 (US1) - different files, independent features

**Phase 5 (US2)**:
- T064-T069 can run in parallel (different block components)

**Phase 6 (US3)**: Can run FULLY IN PARALLEL with Phase 5 (US2) - different files, color feature is independent

**Phase 7 (Polish)**: Most tasks (T088-T099) can run in parallel - different concerns

---

## Parallel Example: User Story 1

```bash
# Launch all US1 components together:
Task: "Create ViewToggle UI component for grid/list switching at src/components/ui/ViewToggle.tsx"
Task: "Create useViewMode custom hook for view mode state at src/hooks/useViewMode.ts"
Task: "Create NoteCard component for note preview display at src/components/notes/NoteCard.tsx"
Task: "Create NoteGrid component for grid view layout at src/components/notes/NoteGrid.tsx"
Task: "Create NoteList component for list view layout at src/components/notes/NoteList.tsx"

# Then integrate them into pages (sequential):
Task: "Create main page (home) with notes list view at src/app/page.tsx"
Task: "Create individual note view page (dynamic route) at src/app/notes/[id]/page.tsx"
```

---

## Parallel Example: User Story 2 (Rich Blocks)

```bash
# Launch all block components together:
Task: "Create BlockContainer component for block rendering dispatch at src/components/blocks/BlockContainer.tsx"
Task: "Create TextBlock component with formatting support at src/components/blocks/TextBlock.tsx"
Task: "Create ChecklistBlock component with checkable items at src/components/blocks/ChecklistBlock.tsx"
Task: "Create TableBlock component with editable cells at src/components/blocks/TableBlock.tsx"
Task: "Create BlockToolbar component for add/delete block controls at src/components/blocks/BlockToolbar.tsx"
Task: "Create BlockTypeSelector component for choosing block type at src/components/blocks/BlockTypeSelector.tsx"

# Then integrate into NoteEditor:
Task: "Create NoteEditor component integrating all block types at src/components/notes/NoteEditor.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 4 Only)

1. ✅ Complete Phase 1: Setup (T001-T014)
2. ✅ Complete Phase 2: Foundational (T015-T042) - CRITICAL, blocks all stories
3. ✅ Complete Phase 3: User Story 1 (T043-T054) - Basic notes with grid/list view
4. ✅ Complete Phase 4: User Story 4 (T055-T063) - Full CRUD + archive
5. **STOP and VALIDATE**: Test creating, viewing, editing, archiving, deleting notes
6. Deploy/demo if ready - you have a working Google Keep clone!

**MVP Deliverable**: Fully functional note-taking app with:
- Create/edit/delete/archive notes
- Grid and list views
- Auto-save
- Mobile responsive
- localStorage persistence

### Incremental Delivery

1. Foundation (Phase 1 + 2) → ~42 tasks → Foundation ready ✅
2. Add US1 + US4 (Phase 3 + 4) → ~21 more tasks → **MVP READY** 🎯 (63 tasks total)
3. Add US2 (Phase 5) → ~17 more tasks → Rich content blocks ✨ (80 tasks total)
4. Add US3 (Phase 6) → ~7 more tasks → Color organization 🎨 (87 tasks total)
5. Polish (Phase 7) → ~17 more tasks → Production ready 🚀 (104 tasks total)

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

**Team A**: User Story 1 (T043-T054)  
**Team B**: User Story 4 (T055-T063) - runs parallel with Team A  
**Team C**: User Story 3 (T081-T087) - runs parallel with Teams A & B (US3 is independent)

Once US1 completes:
**Team A**: User Story 2 (T064-T080) - depends on US1's note view

Result: US1, US3, US4 complete in parallel, then US2 follows

---

## Task Count Summary

- **Phase 1 (Setup)**: 14 tasks
- **Phase 2 (Foundational)**: 28 tasks (BLOCKING)
- **Phase 3 (US1 - P1)**: 12 tasks 🎯 MVP Critical
- **Phase 4 (US4 - P1)**: 9 tasks 🎯 MVP Critical
- **Phase 5 (US2 - P2)**: 17 tasks
- **Phase 6 (US3 - P3)**: 7 tasks
- **Phase 7 (Polish)**: 17 tasks

**Total**: 104 tasks

**MVP Scope** (US1 + US4): 42 foundational + 21 user story = **63 tasks**

**Parallel Opportunities**: 
- Phase 1: 12 parallel tasks
- Phase 2: ~20 parallel tasks
- US1 + US4 can run in parallel (21 total tasks, ~14 parallelizable)
- US3 can run parallel with US1/US4/US2
- Phase 7: ~15 parallel tasks

**Estimated Effort** (1 task ≈ 30-60 min):
- MVP (63 tasks): 32-63 hours
- Full app (104 tasks): 52-104 hours

---

## Notes

- [P] tasks = different files, no dependencies - can execute in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable (except US2 needs US1's note view)
- Tests not included per specification (can add later if TDD approach desired)
- Commit after each task or logical group
- Stop at MVP checkpoint (after US1 + US4) to validate and demo
- Mobile-first design applied throughout
- All components use TypeScript strict mode
- Accessibility (WCAG 2.1 AA) baked into all UI components
