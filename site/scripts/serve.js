// serve.js — servidor estatico minimo para previsualizar dist/ en local.
// Resuelve directorios a index.html y devuelve 404.html cuando no hay ruta.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "..", "dist");
const PORT = process.env.PORT || 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
};

function resolveFile(urlPath) {
  // normalize + el prefijo dist evitan salir del directorio publicado.
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const target = join(dist, safe);
  if (!target.startsWith(dist)) return null;
  if (existsSync(target) && statSync(target).isDirectory()) {
    const index = join(target, "index.html");
    return existsSync(index) ? index : null;
  }
  return existsSync(target) ? target : null;
}

createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  const file = resolveFile(urlPath);

  if (!file) {
    const notFound = join(dist, "404.html");
    res.writeHead(404, { "Content-Type": MIME[".html"] });
    res.end(existsSync(notFound) ? readFileSync(notFound) : "404");
    return;
  }

  res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
