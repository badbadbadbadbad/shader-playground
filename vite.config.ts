import { defineConfig } from 'vite'
import { svelte } from "@sveltejs/vite-plugin-svelte";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  base: "/shader-playground/",
  plugins: [
      svelte(),
      glsl(),
  ],
  server: { // Run in dev vm, open in host
      host: "0.0.0.0",
      port: 5173,
  },
});