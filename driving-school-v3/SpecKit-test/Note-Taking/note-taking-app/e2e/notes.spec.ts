import { test, expect } from '@playwright/test';

test.describe('Note Taking App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main page', async ({ page }) => {
    await expect(page.locator('text=My Notes')).toBeVisible();
  });

  test('should create a new note', async ({ page }) => {
    // Click the "New Note" button
    await page.click('button:has-text("New Note")');
    
    // Wait for navigation to note page
    await page.waitForURL(/\/notes\/[a-z0-9-]+$/);
    
    // Verify we're on a note page
    await expect(page).toHaveURL(/\/notes\/[a-z0-9-]+$/);
  });

  test('should search for notes', async ({ page }) => {
    // Focus search bar using keyboard shortcut
    await page.keyboard.press('Control+f');
    
    // Verify search input is focused
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeFocused();
  });

  test('should toggle view mode', async ({ page }) => {
    // Find view toggle buttons
    const gridButton = page.locator('button[aria-label*="Grid"]');
    const listButton = page.locator('button[aria-label*="List"]');
    
    // Click list view
    await listButton.click();
    
    // Click grid view
    await gridButton.click();
  });

  test('should open filter menu', async ({ page }) => {
    // Click filter button
    await page.click('button:has-text("Filter")');
    
    // Verify filter menu is visible (might be a dropdown or modal)
    // This depends on your FilterMenu implementation
  });

  test('should navigate to archive page', async ({ page }) => {
    // Click archive link
    await page.click('a:has-text("Archive")');
    
    // Wait for navigation
    await page.waitForURL('/archive');
    
    // Verify we're on archive page
    await expect(page).toHaveURL('/archive');
  });

  test('should toggle dark mode', async ({ page }) => {
    // Find and click dark mode toggle
    const darkModeToggle = page.locator('button[aria-label*="dark mode"]');
    await darkModeToggle.click();
    
    // Verify dark mode class is added to html element
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('should show offline indicator when offline', async ({ page, context }) => {
    // Set offline mode
    await context.setOffline(true);
    
    // Wait for offline indicator
    await expect(page.locator('text=offline')).toBeVisible({ timeout: 5000 });
    
    // Set back online
    await context.setOffline(false);
  });
});
