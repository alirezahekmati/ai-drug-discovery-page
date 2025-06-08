import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/ai-drug-discovery-page/", // IMPORTANT: This must match your repository name!
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});
