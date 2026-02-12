import { test, expect } from "@playwright/test";

test("app loads and layout exists without console errors", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
    });

    page.on("pageerror", (error) => {
        consoleErrors.push(String(error));
    });

    await page.goto("/");

    await expect(page.locator("#header-text")).toHaveText("shader-playground");
    await expect(page.locator("#left-canvas")).toBeVisible();
    await expect(page.locator("#right-canvas")).toBeVisible();
    await expect(page.locator("#theme-toggle")).toBeVisible();

    expect(consoleErrors).toEqual([]);
});
