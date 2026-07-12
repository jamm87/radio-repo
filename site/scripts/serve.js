// serve.js — servidor estatico minimo para previsualizar dist/ en local.
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "..", "dist");
const PORT = process.env.PORT || 4173;
const MIME = { ".html": "text/html", ".svg": "image/svg+xml", ".json": "application/json" };

createServer((req, res) => {
  let path = decodeURIComponent(req.url.split("?")[0]);
  if (path === "/") path = "/index.html";
  const file = join(dist, path);
  if (existsSync(file)) {
    res.writeHead(200, { "Content-Type": MIME[extname(file)] || "text/plain" });
    res.end(readFileSync(file));
  } else {
    res.writeHead(404); res.end("404");
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
