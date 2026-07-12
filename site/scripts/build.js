// build.js — genera dist/index.html inyectando data/frequencies.json en la plantilla.
// Sin dependencias externas: solo Node 18+.
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const repoRoot = join(root, "..");
const dist = join(root, "dist");

// Fuente de verdad de datos en la raíz del repo: data/frequencies.json
const data = readFileSync(join(repoRoot, "data", "frequencies.json"), "utf8");
JSON.parse(data); // valida
const template = readFileSync(join(root, "src", "template.html"), "utf8");

const html = template.replace("/*__DATA__*/null", data);

mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, "index.html"), html);

// copia estáticos si existen
for (const f of ["favicon.svg", "CNAME"]) {
  const p = join(root, "public", f);
  if (existsSync(p)) cpSync(p, join(dist, f));
}
// .nojekyll para que GitHub Pages sirva todo tal cual
writeFileSync(join(dist, ".nojekyll"), "");

console.log("build ok -> dist/index.html");
