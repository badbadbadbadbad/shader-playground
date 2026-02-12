import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import glsl from "vite-plugin-glsl";

export default defineConfig({
    plugins: [
        svelte(),
        glsl()
    ],
    resolve: {
        conditions: ["browser", "development"],
    },
    test: {
        environment: "jsdom",
        globals: true,
        css: true,
        include: ["test/**/*.{test,spec}.{ts,js}"],
        setupFiles: "./test/setup.ts",
    },
});
