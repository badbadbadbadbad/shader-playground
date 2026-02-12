import { test, expect } from "@playwright/test";
import * as path from "node:path";

test("uploading an image via file input does not crash", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
    });

    page.on("pageerror", (error) => {
        consoleErrors.push(String(error));
    });

    await page.goto("/");

    const fileInput = page.locator("#file-input");
    const fixturePath = path.resolve(process.cwd(), "test-playwright/fixtures/test.png");

    await fileInput.setInputFiles(fixturePath);

    await page.waitForTimeout(200);

    await expect(page.locator("#left-canvas canvas")).toHaveCount(1);
    await expect(page.locator("#right-canvas canvas")).toHaveCount(1);

    expect(consoleErrors).toEqual([]);
});
