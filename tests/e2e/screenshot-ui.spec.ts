import { test } from '@playwright/test';

test.describe('UI/UX Screenshots', () => {
  test('capture recipe creator UI states', async ({ page }) => {
    // Navigate to recipe creator
    await page.goto('/recipes/create');
    await page.waitForLoadState('networkidle');

    // 1. Initial empty state
    await page.screenshot({
      path: 'test-results/ui-analysis/01-initial-state.png',
      fullPage: true
    });

    // 2. Scroll to ingredients section
    await page.getByText('Ingredients').first().scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'test-results/ui-analysis/02-ingredients-section.png',
      fullPage: true
    });

    // 3. Fill in some data to see active state
    await page.getByPlaceholder(/Give your recipe a catchy title/i).fill('Delicious Chocolate Chip Cookies');
    await page.getByPlaceholder(/Write a short description/i).fill('These are the best chocolate chip cookies you\'ll ever taste!');

    await page.screenshot({
      path: 'test-results/ui-analysis/03-with-title-description.png',
      fullPage: true
    });

    // 4. Fill ingredients
    const ingredientsTextarea = page.getByPlaceholder(/Just type naturally/i);
    await ingredientsTextarea.scrollIntoViewIfNeeded();
    await ingredientsTextarea.fill('2 cups all-purpose flour\n1 cup butter\n3/4 cup sugar\n2 eggs\n1 tsp vanilla extract\n2 cups chocolate chips');

    await page.waitForTimeout(1000); // Wait for parsing
    await page.screenshot({
      path: 'test-results/ui-analysis/04-ingredients-filled.png',
      fullPage: true
    });

    // 5. Scroll to file upload section
    await page.getByText('Add Photos & Videos').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'test-results/ui-analysis/05-file-upload-section.png'
    });

    // 6. Scroll to instructions section
    await page.getByText('Instructions').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'test-results/ui-analysis/06-instructions-section.png'
    });

    // 7. Recipe details section
    await page.getByText('Recipe Details').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'test-results/ui-analysis/07-recipe-details.png'
    });

    // 8. Bottom with publish button
    await page.getByRole('button', { name: /Publish Recipe/i }).scrollIntoViewIfNeeded();
    await page.screenshot({
      path: 'test-results/ui-analysis/08-publish-button.png'
    });

    // 9. Mobile viewport - initial state
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/recipes/create');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'test-results/ui-analysis/09-mobile-initial.png',
      fullPage: true
    });

    // 10. Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/recipes/create');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'test-results/ui-analysis/10-tablet-initial.png',
      fullPage: true
    });
  });
});
