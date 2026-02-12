import { test, expect } from "@playwright/test";

test("theme toggle switches document theme", async ({ page }) => {
    await page.goto("/");

    const themeToggleButton = page.locator("#theme-toggle");

    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(initialTheme).toBe("dark");

    await themeToggleButton.click();

    const themeAfterFirstClick = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(themeAfterFirstClick).toBe("light");

    await themeToggleButton.click();

    const themeAfterSecondClick = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(themeAfterSecondClick).toBe("dark");
});
