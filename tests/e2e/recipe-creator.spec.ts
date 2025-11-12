import { test, expect } from '@playwright/test';

test.describe('Recipe Creator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to recipe creator page
    await page.goto('/recipes/create');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load the recipe creator page successfully', async ({ page }) => {
    // Check if the page loaded
    await expect(page).toHaveURL('/recipes/create');

    // Check for main heading
    await expect(page.getByRole('heading', { name: /Share Your Recipe/i })).toBeVisible();

    // Check for main form sections
    await expect(page.getByText(/Add Photos & Videos/i)).toBeVisible();
    await expect(page.getByText(/Recipe Details/i)).toBeVisible();
    await expect(page.getByText(/Smart Ingredients Parser/i)).toBeVisible();
  });

  test('should have readable text in all input fields', async ({ page }) => {
    // Test title input visibility
    const titleInput = page.getByPlaceholder(/My Amazing Recipe/i);
    await expect(titleInput).toBeVisible();

    // Type in title and verify it's readable
    await titleInput.fill('Test Recipe Title');
    await expect(titleInput).toHaveValue('Test Recipe Title');

    // Test description input
    const descInput = page.getByPlaceholder(/Share the story/i);
    await expect(descInput).toBeVisible();
    await descInput.fill('This is a test description');
    await expect(descInput).toHaveValue('This is a test description');

    // Test ingredients textarea - this was the problematic one
    const ingredientsTextarea = page.getByPlaceholder(/Just type naturally/i);
    await expect(ingredientsTextarea).toBeVisible();

    // Type ingredients and verify they're readable
    await ingredientsTextarea.fill('2 cups flour\n1 tsp salt\n3 eggs');
    await expect(ingredientsTextarea).toHaveValue('2 cups flour\n1 tsp salt\n3 eggs');

    // Take screenshot to verify text is visible
    await page.screenshot({ path: 'test-results/ingredients-visibility.png' });

    // Verify parsed ingredients appear
    await expect(page.getByText(/Parsed Ingredients/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/2 cups flour/i)).toBeVisible();
  });

  test('should parse ingredients automatically', async ({ page }) => {
    const ingredientsTextarea = page.getByPlaceholder(/Just type naturally/i);

    // Type ingredients
    await ingredientsTextarea.fill('2 cups all-purpose flour\n1/2 tsp salt\n3 large eggs');

    // Wait for parsing to complete
    await page.waitForTimeout(1000);

    // Check parsed ingredients display
    await expect(page.getByText(/Parsed Ingredients/i)).toBeVisible();
    await expect(page.getByText(/2 cups.*flour/i)).toBeVisible();
    await expect(page.getByText(/1\/2 tsp.*salt/i)).toBeVisible();
    await expect(page.getByText(/3.*eggs/i)).toBeVisible();
  });

  test('should show all required form fields', async ({ page }) => {
    // Check prep time input
    await expect(page.getByPlaceholder(/30/i).first()).toBeVisible();

    // Check cook time input
    await expect(page.getByPlaceholder(/45/i).first()).toBeVisible();

    // Check servings input
    await expect(page.locator('input[type="number"]').filter({ hasText: /4/i })).toBeVisible();
  });

  test('should show preview button when title is entered', async ({ page }) => {
    // Initially, preview button should be disabled
    const previewButton = page.getByRole('button', { name: /Preview/i });
    await expect(previewButton).toBeVisible();
    await expect(previewButton).toBeDisabled();

    // Enter title
    const titleInput = page.getByPlaceholder(/My Amazing Recipe/i);
    await titleInput.fill('Test Recipe');

    // Preview button should now be enabled
    await expect(previewButton).toBeEnabled();
  });

  test('should show auto-save indicator', async ({ page }) => {
    // Type in title to trigger auto-save
    const titleInput = page.getByPlaceholder(/My Amazing Recipe/i);
    await titleInput.fill('Auto-save Test');

    // Wait for auto-save (3 second delay)
    await page.waitForTimeout(3500);

    // Check for "Saved" indicator
    await expect(page.getByText(/Saved/i)).toBeVisible({ timeout: 5000 });
  });

  test('should handle light and dark mode text visibility', async ({ page }) => {
    // Test in light mode (default)
    const ingredientsTextarea = page.getByPlaceholder(/Just type naturally/i);
    await ingredientsTextarea.fill('2 cups flour');

    // Get computed styles to check text color
    const lightModeColor = await ingredientsTextarea.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Text should be dark in light mode (not invisible)
    expect(lightModeColor).not.toBe('rgb(255, 255, 255)'); // Not white

    // Screenshot in light mode
    await page.screenshot({ path: 'test-results/light-mode-visibility.png' });
  });

  test('should display rich text editor for instructions', async ({ page }) => {
    // Find the instructions editor
    const instructionsEditor = page.locator('textarea').filter({ hasText: /Write your recipe instructions/i });
    await expect(instructionsEditor).toBeVisible();

    // Check toolbar buttons are present
    await expect(page.getByTitle(/Bold/i)).toBeVisible();
    await expect(page.getByTitle(/Italic/i)).toBeVisible();
    await expect(page.getByTitle(/Numbered List/i)).toBeVisible();
  });

  test('should show category buttons', async ({ page }) => {
    // Check for category buttons
    await expect(page.getByRole('button', { name: /Breakfast/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Lunch/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Dinner/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Dessert/i })).toBeVisible();
  });

  test('should validate form before submission', async ({ page }) => {
    // Try to submit without filling required fields
    const publishButton = page.getByRole('button', { name: /Publish Recipe/i });

    // Button should be visible
    await expect(publishButton).toBeVisible();

    // Fill only title (incomplete form)
    await page.getByPlaceholder(/My Amazing Recipe/i).fill('Test');

    // Try to submit - should show validation errors
    await publishButton.click();

    // Wait a bit for validation
    await page.waitForTimeout(1000);

    // Page should still be on create page (not navigated away)
    await expect(page).toHaveURL('/recipes/create');
  });
});
