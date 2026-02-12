import { render, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import App from "../src/App.svelte";

vi.mock("../src/controller/WebsiteController.ts", () => {
    return {
        default: class {
            init = vi.fn();
        },
    };
});

describe("App", () => {
    it("applies dark theme by default on mount", () => {
        render(App);
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    it("toggles theme when button clicked", async () => {
        const { getByRole } = render(App);

        const button = getByRole("button", { name: /toggle/i });

        await fireEvent.click(button);
        expect(document.documentElement.dataset.theme).toBe("light");

        await fireEvent.click(button);
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    it("renders GitHub link", () => {
        const { getByRole } = render(App);
        const link = getByRole("link", { name: "GitHub" });

        expect(link).toHaveAttribute(
            "href",
            "https://github.com/badbadbadbadbad/shader-playground"
        );
    });
});
