# My Notes

A production-quality, Google Keep-inspired note-taking web application built with React, TypeScript, and modern web technologies. Features offline support, full CRUD operations, labels, reminders, search, and collaboration UI.

![My Notes App](./docs/screenshot.png)

## ✨ Features

### Core Features
- **📝 Rich Notes**: Create text notes and checklists with titles and content
- **🎨 Color Coding**: 12 beautiful background colors to organize notes visually
- **📌 Pin & Archive**: Pin important notes to the top, archive completed ones
- **🗑️ Trash**: Soft delete with 7-day auto-cleanup
- **🏷️ Labels**: Create, edit, and assign labels for organization
- **🔍 Full-Text Search**: Instant search with result highlighting
- **⏰ Reminders**: Set date/time reminders for notes
- **👥 Collaboration UI**: Share notes with collaborators (UI ready)

### Technical Features
- **📱 Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **🌙 Dark Mode**: System preference detection with manual override
- **📴 Offline Support**: Full functionality offline with IndexedDB persistence
- **⚡ PWA**: Installable as a Progressive Web App
- **♿ Accessible**: WCAG 2.1 AA compliant with keyboard navigation
- **🧪 Tested**: Unit tests with Vitest and E2E tests with Playwright

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 with TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **State Management** | Zustand 5 |
| **Storage** | localForage (IndexedDB) |
| **Search** | FlexSearch |
| **Routing** | React Router 7 |
| **UI Components** | Headless UI, Heroicons |
| **Date Handling** | date-fns |
| **PWA** | vite-plugin-pwa |
| **Testing** | Vitest, Testing Library, Playwright |

## 📁 Project Structure

```
My-Notes/
├── public/               # Static assets
│   ├── favicon.svg       # App favicon
│   ├── pwa-192x192.svg   # PWA icon (small)
│   └── pwa-512x512.svg   # PWA icon (large)
├── src/
│   ├── components/       # React components
│   │   ├── atoms/        # Basic UI components (Button, Input, etc.)
│   │   ├── molecules/    # Composite components (SearchBar, ColorPicker, etc.)
│   │   └── organisms/    # Complex components (NoteCard, NoteEditor, etc.)
│   ├── data/             # Seed data for development
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # Data services (storage)
│   ├── store/            # Zustand stores
│   ├── test/             # Test setup and unit tests
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
├── e2e/                  # Playwright E2E tests
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── playwright.config.ts  # Playwright configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later (or pnpm/yarn)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd My-Notes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright tests with UI |
| `npm run type-check` | Run TypeScript type checking |

## 🏗️ Architecture

### Component Architecture

The app follows the **Atomic Design** methodology:

- **Atoms**: Basic UI elements (`Button`, `Input`, `Checkbox`, `Badge`, etc.)
- **Molecules**: Combinations of atoms (`SearchBar`, `ColorPicker`, `LabelManager`)
- **Organisms**: Complex UI sections (`NoteCard`, `NoteEditor`, `Sidebar`)
- **Pages**: Full page layouts (`NotesPage`, `ArchivePage`, `SettingsPage`)

### State Management

**Zustand** stores manage application state:

| Store | Purpose |
|-------|---------|
| `notesStore` | Notes CRUD, filtering, bulk operations |
| `labelsStore` | Label management |
| `settingsStore` | User preferences (theme, view mode) |
| `searchStore` | Search query and results with FlexSearch |
| `toastStore` | Toast notifications |

### Data Persistence

- **IndexedDB** via localForage for reliable, large-capacity offline storage
- **Sync Queue** for tracking offline changes (ready for server sync)
- **Auto-save** on every change with debouncing

### Offline Strategy

1. **Service Worker** caches static assets and app shell
2. **IndexedDB** stores all notes locally
3. **Online/Offline detection** with visual indicator
4. **Sync Queue** tracks changes for future server sync

## 🧪 Testing

### Unit Tests

Unit tests cover core components using Vitest and Testing Library:

```bash
# Run all unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- Button.test.tsx
```

### E2E Tests

End-to-end tests verify critical user flows with Playwright:

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run specific test
npx playwright test notes.spec.ts
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deployment Options

#### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables

No environment variables required for basic functionality. For future backend integration:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL for sync |
| `VITE_WS_URL` | WebSocket URL for real-time |

## ♿ Accessibility

The app is designed with accessibility in mind:

- ✅ WCAG 2.1 AA compliant color contrast
- ✅ Full keyboard navigation
- ✅ Screen reader support with ARIA labels
- ✅ Focus management and visible focus indicators
- ✅ Reduced motion support
- ✅ Skip links and landmark regions

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search bar |
| `c` | Create new note |
| `Esc` | Close modal/dialog |
| `Tab` | Navigate through elements |
| `Enter` | Activate focused element |

## 🔮 Future Improvements

### Phase 1: Backend Integration
- [ ] User authentication (OAuth, email/password)
- [ ] Cloud sync with conflict resolution
- [ ] Real-time collaboration with WebSockets
- [ ] Server-side search for large datasets

### Phase 2: Enhanced Features
- [ ] Rich text editor (bold, italic, headings)
- [ ] Image and file attachments
- [ ] Voice notes with transcription
- [ ] Drawing/sketching canvas
- [ ] Recurring reminders
- [ ] Note templates

### Phase 3: Advanced Features
- [ ] AI-powered auto-labeling
- [ ] Smart search with natural language
- [ ] Cross-device sync status
- [ ] Export to PDF, Markdown, Google Keep
- [ ] Browser extension for quick capture
- [ ] Mobile apps (React Native or PWA)

### Phase 4: Enterprise Features
- [ ] Team workspaces
- [ ] Admin dashboard
- [ ] Audit logs
- [ ] SSO integration
- [ ] API for integrations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Google Keep](https://keep.google.com)
- Icons by [Heroicons](https://heroicons.com)
- UI primitives by [Headless UI](https://headlessui.com)

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
