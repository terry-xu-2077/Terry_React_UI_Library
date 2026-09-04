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

const legacyOut = path.join(dist, "legacy-classic");
await fs.mkdir(legacyOut, { recursive: true });
for (const file of ["theme.css", "theme-system.css"]) {
  await fs.copyFile(
    path.join(root, "src", "styles", "legacy-classic", file),
    path.join(legacyOut, file),
  );
}

const required = [
  entry,
  style,
  declaration,
  path.join(legacyOut, "theme.css"),
  path.join(legacyOut, "theme-system.css"),
];
await Promise.all(required.map(file => fs.access(file)));

console.log("[library] package contract verified: JS + declarations + CSS exports");
