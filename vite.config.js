// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "localhost",
    port: 5555,
    cors: "*",
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
  },
  preview: {
    port: 5555,
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    minify: "esbuild",

    rollupOptions: {
      input: {
        dialog: "utils/dialog.js",
        fixlazyload: "utils/fixlazyload.js",
        videolazyload: "utils/videolazyload.js",
        videolowpowermode: "utils/videolowpowermode.js",
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
