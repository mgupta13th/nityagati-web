import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Plain SPA config -- no router, no proxy, no env wiring yet. Added only
// when the screens that actually need them are built (see the readiness
// report this scaffold implements Commit 1 of).
export default defineConfig({
  plugins: [react()],
});
