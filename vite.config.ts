import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5174,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      try {
        // Wait for the Express app to be created
        console.log("Creating Express server...");
        const app = await createServer();
        console.log("Express server created, adding middleware...");

        // Add Express app as middleware to Vite dev server
        server.middlewares.use("/api", app);
        console.log("Express middleware added for /api routes");
      } catch (error) {
        console.error("Failed to create server:", error);
      }
    },
  };
}
