import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const entry = path.join(dist, "index.js");
const styleImport = 'import "./style.css";\n';

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

console.log("[library] dist finalized: JS + declarations + CSS exports");
