import { defineConfig } from 'vite'
import { svelte } from "@sveltejs/vite-plugin-svelte";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  base: "/shader-playground/",
  plugins: [
      svelte(),
      glsl(),
  ],
});