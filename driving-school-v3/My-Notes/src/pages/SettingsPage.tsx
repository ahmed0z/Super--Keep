/**
 * SettingsPage - App settings and preferences.
 */
import React from 'react';
import { useSettingsStore } from '../store/settingsStore';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-medium text-gray-800 dark:text-white">Settings</h1>

      <div className="space-y-6">
        {/* Appearance */}
        <section>
          <h2 className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-200">
            Appearance
          </h2>

          <div className="space-y-4">
            {/* Dark mode */}
            <label className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Dark mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use dark theme for the app
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => updateSettings({ darkMode: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
            </label>

            {/* View mode */}
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p className="mb-2 font-medium text-gray-800 dark:text-white">Default view</p>
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                Choose how notes are displayed
              </p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="viewMode"
                    value="grid"
                    checked={settings.viewMode === 'grid'}
                    onChange={() => updateSettings({ viewMode: 'grid' })}
                    className="h-4 w-4 border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-gray-700 dark:text-gray-200">Grid</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="viewMode"
                    value="list"
                    checked={settings.viewMode === 'list'}
                    onChange={() => updateSettings({ viewMode: 'list' })}
                    className="h-4 w-4 border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-gray-700 dark:text-gray-200">List</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-200">
            Notifications
          </h2>

          <label className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Enable reminders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show notifications for note reminders
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
              className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            />
          </label>
        </section>

        {/* Sync */}
        <section>
          <h2 className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-200">
            Sync & Backup
          </h2>

          <label className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Auto sync</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically sync notes when online (requires backend)
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.syncEnabled}
              onChange={(e) => updateSettings({ syncEnabled: e.target.checked })}
              className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            />
          </label>

          <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
            <strong>Note:</strong> Cloud sync requires a backend server to be configured.
            Currently, all data is stored locally in your browser.
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-200">
            About
          </h2>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="font-medium text-gray-800 dark:text-white">KeepNotes</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              A Google Keep-inspired notes application with offline support.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
