import { test, expect } from '@playwright/test';

test.describe('Full Page Screenshots for Review', () => {
  test('capture full recipe creator page - empty state', async ({ page }) => {
    await page.goto('/recipes/create');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/full-page/01-empty-state.png',
      fullPage: true
    });
  });

  test('capture full recipe creator page - with some content', async ({ page }) => {
    await page.goto('/recipes/create');
    await page.waitForLoadState('networkidle');

    // Fill in some content to see the progress indicator work
    await page.fill('input[placeholder*="catchy title"]', 'Delicious Chocolate Chip Cookies');
    await page.fill('textarea[placeholder*="short description"]', 'These cookies are absolutely amazing! Crispy on the outside, chewy on the inside.');

    // Wait a moment for auto-save indicator
    await page.waitForTimeout(1000);

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/full-page/02-with-content.png',
      fullPage: true
    });
  });

  test('capture full recipe creator page - with ingredients parsed', async ({ page }) => {
    await page.goto('/recipes/create');
    await page.waitForLoadState('networkidle');

    // Fill in title
    await page.fill('input[placeholder*="catchy title"]', 'Chocolate Chip Cookies');

    // Add ingredients
    const ingredientText = `2 cups all-purpose flour
1/2 tsp salt
1 tsp baking soda
1 cup butter (softened)
3/4 cup granulated sugar
3/4 cup brown sugar
2 large eggs
2 tsp vanilla extract
2 cups chocolate chips`;

    await page.fill('textarea[placeholder*="type naturally"]', ingredientText);

    // Wait for parsing
    await page.waitForTimeout(1500);

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/full-page/03-with-parsed-ingredients.png',
      fullPage: true
    });
  });

  test('capture mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/recipes/create');
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/full-page/04-mobile-empty.png',
      fullPage: true
    });
  });

  test('capture tablet view', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/recipes/create');
    await page.waitForLoadState('networkidle');

    // Fill some content
    await page.fill('input[placeholder*="catchy title"]', 'Amazing Recipe');

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/full-page/05-tablet-view.png',
      fullPage: true
    });
  });
});
