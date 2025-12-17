import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './components/organisms/MainLayout';
import NotesPage from './pages/NotesPage';
import ArchivePage from './pages/ArchivePage';
import TrashPage from './pages/TrashPage';
import LabelPage from './pages/LabelPage';
import RemindersPage from './pages/RemindersPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import { useNotesStore } from './store/notesStore';
import { useLabelsStore } from './store/labelsStore';
import { useSettingsStore } from './store/settingsStore';
import { ToastContainer } from './components/molecules/ToastContainer';

/**
 * Main App component that sets up routing and initializes stores.
 * The app uses a persistent layout with a sidebar and main content area.
 */
function App() {
  const initializeNotes = useNotesStore((state) => state.initialize);
  const initializeLabels = useLabelsStore((state) => state.initialize);
  const settings = useSettingsStore((state) => state.settings);
  const initializeSettings = useSettingsStore((state) => state.initialize);

  // Initialize all stores on app mount
  useEffect(() => {
    const init = async () => {
      await Promise.all([initializeNotes(), initializeLabels(), initializeSettings()]);
    };
    init();
  }, [initializeNotes, initializeLabels, initializeSettings]);

  // Apply dark mode class to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<NotesPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="label/:labelId" element={<LabelPage />} />
          <Route path="archive" element={<ArchivePage />} />
          <Route path="trash" element={<TrashPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
