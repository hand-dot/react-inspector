import { defineConfig } from "vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
  manifest_version: 3,
  name: "React Inspector",
  version: "1.0.0",
  content_scripts: [{ js: ["src/content.ts"], matches: ["<all_urls>"] }],
  devtools_page: "src/devtools.html",
  background: { service_worker: "src/background.ts", type: "module" },
  commands: {
    inspect: {
      suggested_key: {
        default: "Ctrl+Shift+X",
        mac: "Command+Shift+X",
      },
      description: 'Inspect the page using the "React Inspector" extension.',
    },
  },
  permissions: ["activeTab", "scripting", "contextMenus"],
});

export default defineConfig({
  server: { port: 54321 },
  plugins: [crx({ manifest })],
  optimizeDeps: {
    entries: ["src/*.html"],
  },
});
