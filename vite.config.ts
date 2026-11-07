import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

const MIME_MAP: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".css": "text/css",
  ".js": "text/javascript",
};

function serveStaticFolders(): Plugin {
  return {
    name: "serve-static-folders",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const reqUrl = (req as { url?: string }).url?.split("?")[0] || "";
        if (reqUrl.startsWith("/assets/") || reqUrl.startsWith("/stats/")) {
          const filePath = path.join(process.cwd(), reqUrl.slice(1));
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            if (MIME_MAP[ext]) {
              res.setHeader("Content-Type", MIME_MAP[ext]);
            }
            return fs.createReadStream(filePath).pipe(res);
          }
        }
        next();
      });
    },
    closeBundle() {
      for (const dir of ["assets", "stats"]) {
        const src = path.join(process.cwd(), dir);
        const dest = path.join(process.cwd(), "dist", dir);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true });
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), serveStaticFolders()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) {
            return "three";
          }
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react";
          }
        },
      },
    },
  },
});
