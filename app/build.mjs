// Build the website into dist/ (esbuild: one JS bundle + one CSS file).   npm run build
import { build } from "esbuild";
import fs from "node:fs";

fs.rmSync("dist", { recursive: true, force: true });
await build({
  entryPoints: { main: "web/src/main.tsx" },
  bundle: true,
  outdir: "dist",
  minify: true,
  sourcemap: true,
  target: "es2022",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});
fs.copyFileSync("web/index.html", "dist/index.html");
console.log("built dist/");
