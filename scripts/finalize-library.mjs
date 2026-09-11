import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const entry = path.join(dist, "index.js");
const style = path.join(dist, "style.css");
const declaration = path.join(dist, "index.d.ts");
const styleImport = 'import "./style.css";\n';

// Fail the build immediately if Vite/TypeScript stop producing the package contract.
await Promise.all([fs.access(entry), fs.access(style), fs.access(declaration)]);

let js = await fs.readFile(entry, "utf8");
if (!js.startsWith(styleImport)) {
  js = styleImport + js;
  await fs.writeFile(entry, js, "utf8");
}

const baseOut = path.join(dist, "base");
await fs.mkdir(baseOut, { recursive: true });
for (const file of ["theme.css", "theme-system.css"]) {
  await fs.copyFile(
    path.join(root, "src", "styles", "base", file),
    path.join(baseOut, file),
  );
}

const required = [
  entry,
  style,
  declaration,
  path.join(baseOut, "theme.css"),
  path.join(baseOut, "theme-system.css"),
];
await Promise.all(required.map(file => fs.access(file)));

console.log("[library] package contract verified: JS + declarations + CSS exports");
