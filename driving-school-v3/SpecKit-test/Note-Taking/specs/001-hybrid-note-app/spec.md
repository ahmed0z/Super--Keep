# Feature Specification: Hybrid Note-Taking App

**Feature Branch**: `001-hybrid-note-app`  
**Created**: 2025-11-07  
**Status**: Draft  
**Input**: User description: "I am building a note-taking app that combines all good features from Google Keep and Notion. I want to make it look as simple as Keep but inside the note itself I can add many types like in Notion (table, text, todo) all this inside the same note. At first make everything mocked later we will connect to a database."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick Note Creation with Simple Interface (Priority: P1)

Users can create a new note instantly with a minimalist interface similar to Google Keep. The interface shows a clean list/grid view of all notes with color coding options. This is the core value proposition - combining Keep's simplicity with rich content capabilities.

**Why this priority**: This is the foundation of the app. Without quick, frictionless note creation, users won't adopt the tool regardless of advanced features. MVP requires basic create/view/delete operations.

**Independent Test**: Can be fully tested by creating a new note, viewing it in the list, and verifying it appears with default styling. Delivers immediate value as a basic note-taking app.

**Acceptance Scenarios**:

1. **Given** I am on the main screen, **When** I click the "New Note" button, **Then** a new blank note editor opens with focus on the title field
2. **Given** I have created a note with a title and content, **When** I click save or navigate away, **Then** the note appears in my notes list with a preview
3. **Given** I am viewing my notes list, **When** I click on any note, **Then** the note opens in edit mode with all content blocks visible
4. **Given** I have multiple notes, **When** I view the notes list, **Then** I can see all notes in either grid or list view layout

---

### User Story 2 - Rich Content Blocks Inside Notes (Priority: P2)

Users can add multiple types of content blocks (text, checklist/todo, tables) within a single note, similar to Notion. Each content type has its own behavior - text blocks for paragraphs, checklist blocks for todo items with checkboxes, and table blocks for structured data.

**Why this priority**: This differentiates the app from simple note-takers. It provides the "Notion-like" power while maintaining Keep's simplicity. Required for the hybrid experience but can be added after basic notes work.

**Independent Test**: Can be tested by opening a note, adding different block types (text, todo, table), and verifying each behaves correctly. Delivers value as an enhanced note editor even without other features.

**Acceptance Scenarios**:

1. **Given** I am editing a note, **When** I click "Add Block" and select "Text", **Then** a new text block appears where I can type formatted content
2. **Given** I am editing a note, **When** I click "Add Block" and select "Checklist", **Then** a new checklist block appears with an empty checkbox item that I can type into
3. **Given** I have a checklist block, **When** I click a checkbox, **Then** the item toggles between checked and unchecked states
4. **Given** I am editing a note, **When** I click "Add Block" and select "Table", **Then** a new table block appears with default 2x2 grid that I can edit
5. **Given** I have multiple blocks in a note, **When** I view the note, **Then** all blocks display in the order I created them with their specific formatting
6. **Given** I have a table block, **When** I click to add a row or column, **Then** the table expands accordingly with editable cells

---

### User Story 3 - Note Organization and Visual Customization (Priority: P3)

Users can organize notes with colors and visual indicators similar to Google Keep. Notes can be assigned different background colors for quick visual categorization without needing complex tagging systems.

**Why this priority**: Enhances usability and personalization but not critical for MVP. Users can still create and use rich notes without color coding.

**Independent Test**: Can be tested by applying different colors to notes and verifying they display correctly in the list view. Delivers value as an organizational aid.

**Acceptance Scenarios**:

1. **Given** I am viewing or editing a note, **When** I click the color palette icon, **Then** I see a selection of color options
2. **Given** I have selected a color for a note, **When** I return to the notes list, **Then** the note displays with the chosen background color
3. **Given** I have colored notes, **When** I view them in grid or list layout, **Then** the colors help me visually distinguish between different notes

---

### User Story 4 - Note Management Operations (Priority: P1)

Users can perform basic CRUD operations: create, edit, delete, and archive notes. These are fundamental operations required for any note-taking app.

**Why this priority**: Essential functionality that must work for MVP. Without the ability to delete or edit notes, the app is unusable.

**Independent Test**: Can be tested by creating a note, editing it, archiving it, and deleting it. Verifies core data lifecycle management.

**Acceptance Scenarios**:

1. **Given** I am viewing a note, **When** I click the delete button and confirm, **Then** the note is removed from my notes list
2. **Given** I am viewing a note, **When** I click the archive button, **Then** the note moves to an archived section and doesn't appear in my main notes list
3. **Given** I have archived notes, **When** I navigate to the archive view, **Then** I can see all my archived notes
4. **Given** I am viewing an archived note, **When** I click unarchive, **Then** the note returns to my main notes list

---

### Edge Cases

- What happens when a user creates an empty note (no title, no content)?
- How does the system handle very long notes with many content blocks (50+ blocks)?
- What happens when a user tries to create a table with 100+ rows?
- How does the app handle rapid successive note creation (creating 10 notes in quick succession)?
- What happens when a user navigates away from an unsaved note?
- How does the system handle special characters, emojis, or very long text in note titles?
- What happens if a user tries to add a block type that doesn't exist?
- How does the app handle switching between grid and list view with many notes (1000+)?
- What happens when a checklist has 100+ items?
- How does the system respond when a user drags and drops blocks to reorder them (if drag-drop is implemented)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create new notes with optional title and content
- **FR-002**: System MUST display all notes in both grid view and list view layouts
- **FR-003**: System MUST allow users to switch between grid and list view
- **FR-004**: System MUST support adding text blocks within a note for paragraph content
- **FR-005**: System MUST support adding checklist/todo blocks within a note with checkable items
- **FR-006**: System MUST support adding table blocks within a note with editable rows and columns
- **FR-007**: System MUST allow users to toggle checkbox states in checklist blocks
- **FR-008**: System MUST allow users to add/remove rows and columns in table blocks
- **FR-009**: System MUST preserve the order of content blocks within a note
- **FR-010**: System MUST allow users to assign background colors to notes from a predefined palette
- **FR-011**: System MUST allow users to edit existing notes (title and all content blocks)
- **FR-012**: System MUST allow users to delete notes with confirmation
- **FR-013**: System MUST allow users to archive notes
- **FR-014**: System MUST provide a separate archive view for archived notes
- **FR-015**: System MUST allow users to unarchive notes from the archive view
- **FR-016**: System MUST use mocked/local data storage (no database connection initially)
- **FR-017**: System MUST persist note data across browser sessions using local storage or similar mechanism
- **FR-018**: System MUST display note previews in the list/grid view showing title and truncated content
- **FR-019**: System MUST provide visual feedback when users interact with blocks (hover states, focus states)
- **FR-020**: System MUST auto-save note changes without requiring explicit save button clicks
- **FR-021**: System MUST allow users to delete individual content blocks within a note
- **FR-022**: System MUST support basic text formatting in text blocks (bold, italic, bulleted lists)
- **FR-023**: System MUST allow users to add new checklist items by pressing Enter within an existing item
- **FR-024**: System MUST provide 8 distinct color options for note backgrounds
- **FR-025**: System MUST display notes in reverse chronological order (newest first) by default
- **FR-026**: System MUST auto-save note changes after 500ms of user inactivity
- **FR-027**: System MUST automatically remove empty notes (no title and no content) after 24 hours of inactivity

### Key Entities

- **Note**: Represents a user's note containing a title, creation timestamp, last modified timestamp, background color, archive status, and an ordered collection of content blocks
- **Content Block**: Represents a single piece of content within a note. Has a type (text, checklist, table), position/order within the note, and type-specific content
- **Text Block**: A content block containing plain or formatted text content
- **Checklist Block**: A content block containing an ordered list of checklist items, each with text content and a checked/unchecked state
- **Table Block**: A content block containing a two-dimensional grid of cells, each cell containing editable text content

## Assumptions & Design Decisions

### Data Persistence
- **Assumption**: Using browser's localStorage or sessionStorage for mocked data (no backend initially)
- **Rationale**: Allows rapid prototyping without database setup; data persists across sessions for testing

### User Interface
- **Assumption**: Single-user application (no authentication/multi-user support in MVP)
- **Rationale**: Keeps initial scope focused on core note-taking functionality
- **Assumption**: Desktop-first design (mobile responsive as secondary priority)
- **Rationale**: Richer content editing (tables) is easier on desktop; can optimize for mobile later

### Content Block Behavior
- **Assumption**: Default table size is 2x2 when created
- **Rationale**: Minimal starting point that users can expand as needed
- **Assumption**: Text blocks support basic formatting (bold, italic, lists)
- **Rationale**: Aligns with "Notion-like" capabilities without overwhelming simplicity
- **Assumption**: Checklist items can be added by pressing Enter in an existing item
- **Rationale**: Standard UX pattern from both Keep and Notion

### Note Organization
- **Assumption**: 8 predefined color options (matching Google Keep's palette)
- **Rationale**: Sufficient variety for visual organization without choice paralysis
- **Assumption**: Notes display in reverse chronological order (newest first) by default
- **Rationale**: Most recent notes are typically most relevant

### Performance & Limits
- **Assumption**: Support up to 100 notes in mocked storage
- **Rationale**: Sufficient for prototype testing; real database will handle more
- **Assumption**: Support up to 25 content blocks per note
- **Rationale**: Balances rich content capability with performance constraints
- **Assumption**: Auto-save triggers after 500ms of inactivity
- **Rationale**: Prevents data loss while minimizing performance impact

### Block Interactions
- **Assumption**: Users can delete individual blocks within a note
- **Rationale**: Essential for content editing flexibility
- **Assumption**: Blocks can be reordered via drag-and-drop (listed as potential edge case)
- **Rationale**: Enhances UX but not critical for MVP; can be added if time permits
- **Assumption**: Empty notes (no title or content) are automatically deleted after 24 hours
- **Rationale**: Prevents clutter from accidental creation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new note and start typing content within 2 seconds of opening the app
- **SC-002**: Users can add at least 3 different block types (text, checklist, table) to a single note
- **SC-003**: The interface maintains Google Keep-like simplicity with no more than 2 clicks required to access any primary feature
- **SC-004**: Users can successfully create, edit, and delete notes on first attempt without training or documentation
- **SC-005**: The app handles notes containing up to 25 content blocks without noticeable performance degradation (renders in under 1 second)
- **SC-006**: Note data persists across browser sessions with 100% reliability for up to 100 notes
- **SC-007**: Users can visually identify and organize notes by color with at least 8 color options available
- **SC-008**: Checklist items can be checked/unchecked with immediate visual feedback (under 100ms response time)
- **SC-009**: Table cells can be edited inline with the same ease as editing a text block
- **SC-010**: 90% of users can successfully create a note with mixed content types (text + checklist + table) without assistance
