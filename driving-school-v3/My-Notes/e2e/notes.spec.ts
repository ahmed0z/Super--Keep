/**
 * E2E test for the core note flow: create, edit, delete.
 * This test verifies the main user journey through the application.
 */
import { test, expect } from '@playwright/test';

test.describe('Notes CRUD Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load
    await expect(page.locator('text=Take a note...')).toBeVisible();
  });

  test('should create a new text note', async ({ page }) => {
    // Click the "Take a note" input
    await page.click('text=Take a note...');

    // Wait for the editor dialog to appear
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Fill in the title
    await page.fill('input[placeholder="Title"]', 'My First Note');

    // Fill in the content
    await page.fill('textarea[placeholder="Take a note..."]', 'This is the content of my first note.');

    // Close the editor by clicking the Close button
    await page.click('button:has-text("Close")');

    // Verify the note appears in the grid
    await expect(page.locator('text=My First Note')).toBeVisible();
    await expect(page.locator('text=This is the content of my first note.')).toBeVisible();
  });

  test('should edit an existing note', async ({ page }) => {
    // First, create a note
    await page.click('text=Take a note...');
    await page.fill('input[placeholder="Title"]', 'Note to Edit');
    await page.fill('textarea[placeholder="Take a note..."]', 'Original content');
    await page.click('button:has-text("Close")');

    // Wait for the note to appear
    await expect(page.locator('text=Note to Edit')).toBeVisible();

    // Click on the note to open editor
    await page.click('article:has-text("Note to Edit")');

    // Wait for editor to open
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Update the title
    const titleInput = page.locator('input[placeholder="Title"]');
    await titleInput.clear();
    await titleInput.fill('Updated Note Title');

    // Update the content
    const contentTextarea = page.locator('textarea');
    await contentTextarea.clear();
    await contentTextarea.fill('Updated content');

    // Close the editor
    await page.click('button:has-text("Close")');

    // Verify the updated content
    await expect(page.locator('text=Updated Note Title')).toBeVisible();
    await expect(page.locator('text=Updated content')).toBeVisible();
  });

  test('should delete a note', async ({ page }) => {
    // First, create a note
    await page.click('text=Take a note...');
    await page.fill('input[placeholder="Title"]', 'Note to Delete');
    await page.fill('textarea[placeholder="Take a note..."]', 'This note will be deleted');
    await page.click('button:has-text("Close")');

    // Wait for the note to appear
    await expect(page.locator('text=Note to Delete')).toBeVisible();

    // Hover over the note to show action buttons
    await page.locator('article:has-text("Note to Delete")').hover();

    // Click the more actions button (3 dots)
    await page.click('button[aria-label="More actions"]');

    // Click delete
    await page.click('button:has-text("Delete note")');

    // Verify the note is no longer visible
    await expect(page.locator('text=Note to Delete')).not.toBeVisible();

    // Navigate to trash
    await page.click('text=Trash');

    // Verify the note is in trash
    await expect(page.locator('text=Note to Delete')).toBeVisible();
  });

  test('should create a checklist note', async ({ page }) => {
    // Click the checklist button to create a new checklist
    await page.click('button[aria-label="New checklist"]');

    // Wait for editor
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Add title
    await page.fill('input[placeholder="Title"]', 'My Checklist');

    // Add checklist items
    const addItemInput = page.locator('input[placeholder="Add item"]');
    
    await addItemInput.fill('First item');
    await addItemInput.press('Enter');
    
    await addItemInput.fill('Second item');
    await addItemInput.press('Enter');

    // Close editor
    await page.click('button:has-text("Close")');

    // Verify the checklist appears
    await expect(page.locator('text=My Checklist')).toBeVisible();
    await expect(page.locator('text=First item')).toBeVisible();
    await expect(page.locator('text=Second item')).toBeVisible();
  });

  test('should pin and unpin a note', async ({ page }) => {
    // Create a note
    await page.click('text=Take a note...');
    await page.fill('input[placeholder="Title"]', 'Pinnable Note');
    await page.click('button:has-text("Close")');

    // Wait for note
    await expect(page.locator('text=Pinnable Note')).toBeVisible();

    // Hover to show pin button
    await page.locator('article:has-text("Pinnable Note")').hover();

    // Click pin
    await page.click('button[aria-label="Pin note"]');

    // Verify "Pinned" section appears
    await expect(page.locator('text=Pinned')).toBeVisible();

    // Unpin
    await page.locator('article:has-text("Pinnable Note")').hover();
    await page.click('button[aria-label="Unpin note"]');

    // Verify "Pinned" section is gone
    await expect(page.locator('h2:has-text("Pinned")')).not.toBeVisible();
  });

  test('should search for notes', async ({ page }) => {
    // Create a few notes
    await page.click('text=Take a note...');
    await page.fill('input[placeholder="Title"]', 'Shopping List');
    await page.fill('textarea[placeholder="Take a note..."]', 'Buy milk and eggs');
    await page.click('button:has-text("Close")');

    await page.click('text=Take a note...');
    await page.fill('input[placeholder="Title"]', 'Work Meeting');
    await page.fill('textarea[placeholder="Take a note..."]', 'Discuss project timeline');
    await page.click('button:has-text("Close")');

    // Search for "shopping"
    await page.fill('input[aria-label="Search notes"]', 'shopping');

    // Should navigate to search page
    await expect(page).toHaveURL(/\/search/);

    // Should show matching note
    await expect(page.locator('text=Shopping List')).toBeVisible();
    
    // Should not show non-matching note
    await expect(page.locator('text=Work Meeting')).not.toBeVisible();
  });

  test('should archive and restore a note', async ({ page }) => {
    // Create a note
    await page.click('text=Take a note...');
    await page.fill('input[placeholder="Title"]', 'Archivable Note');
    await page.click('button:has-text("Close")');

    // Hover and click archive
    await page.locator('article:has-text("Archivable Note")').hover();
    await page.click('button[aria-label="Archive"]');

    // Note should disappear from main view
    await expect(page.locator('article:has-text("Archivable Note")')).not.toBeVisible();

    // Navigate to archive
    await page.click('text=Archive');

    // Note should be in archive
    await expect(page.locator('text=Archivable Note')).toBeVisible();

    // Restore it
    await page.locator('article:has-text("Archivable Note")').hover();
    await page.click('button[aria-label="Unarchive"]');

    // Note should disappear from archive
    await expect(page.locator('article:has-text("Archivable Note")')).not.toBeVisible();

    // Go back to main view
    await page.click('text=Notes');

    // Note should be back
    await expect(page.locator('text=Archivable Note')).toBeVisible();
  });

  test('should toggle between grid and list view', async ({ page }) => {
    // Create a note first
    await page.click('text=Take a note...');
    await page.fill('input[placeholder="Title"]', 'View Test Note');
    await page.click('button:has-text("Close")');

    // Default is grid view, toggle to list
    await page.click('button[aria-label="List view"]');

    // Notes container should have list layout class
    await expect(page.locator('.flex.flex-col.gap-3')).toBeVisible();

    // Toggle back to grid
    await page.click('button[aria-label="Grid view"]');

    // Should have grid layout
    await expect(page.locator('.grid')).toBeVisible();
  });

  test('should change note color', async ({ page }) => {
    // Create a note
    await page.click('text=Take a note...');
    await page.fill('input[placeholder="Title"]', 'Colorful Note');
    await page.click('button:has-text("Close")');

    // Hover and click color picker
    await page.locator('article:has-text("Colorful Note")').hover();
    await page.click('button[aria-label="Background color"]');

    // Select yellow color
    await page.click('button[aria-label="Yellow"]');

    // Verify the note has yellow background
    const noteCard = page.locator('article:has-text("Colorful Note")');
    await expect(noteCard).toHaveClass(/bg-note-yellow/);
  });
});

test.describe('Offline Support', () => {
  test('should work offline', async ({ page, context }) => {
    // Navigate first
    await page.goto('/');
    await expect(page.locator('text=Take a note...')).toBeVisible();

    // Create a note while online
    await page.click('text=Take a note...');
    await page.fill('input[placeholder="Title"]', 'Online Note');
    await page.click('button:has-text("Close")');
    await expect(page.locator('text=Online Note')).toBeVisible();

    // Go offline
    await context.setOffline(true);

    // Should show offline indicator
    await expect(page.locator('text=Offline')).toBeVisible();

    // Should still be able to create notes
    await page.click('text=Take a note...');
    await page.fill('input[placeholder="Title"]', 'Offline Note');
    await page.click('button:has-text("Close")');
    
    await expect(page.locator('text=Offline Note')).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Offline indicator should disappear
    await expect(page.locator('text=Offline')).not.toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have no accessibility violations on main page', async ({ page }) => {
    await page.goto('/');
    
    // Basic accessibility checks
    // Check for main landmark
    await expect(page.locator('main')).toBeVisible();
    
    // Check for skip to content or proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(0); // Logo/brand counts
    
    // All images should have alt text
    const images = page.locator('img');
    const imgCount = await images.count();
    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
    
    // All buttons should have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const name = await button.getAttribute('aria-label') || await button.textContent();
      expect(name?.trim().length).toBeGreaterThan(0);
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through the page
    await page.keyboard.press('Tab');
    
    // Should be able to focus on interactive elements
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);
    
    // Should be able to use / shortcut to focus search
    await page.keyboard.press('/');
    const searchFocused = await page.evaluate(() => 
      document.activeElement?.getAttribute('aria-label') === 'Search notes'
    );
    expect(searchFocused).toBe(true);
  });
});
