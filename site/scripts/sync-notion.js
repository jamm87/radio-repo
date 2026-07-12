// sync-notion.js — descarga la base de datos "radio" de Notion y regenera data/frequencies.json
//
// Uso:
//   NOTION_TOKEN=secret_xxx node scripts/sync-notion.js
//
// Requiere una integracion interna de Notion con acceso a la base de datos, y su
// data source id. No usa dependencias externas (fetch nativo de Node 18+).
//
// Nota: mantiene el bloque de coordenadas y metadatos del JSON actual; solo
// actualiza las filas. Las entradas de la categoria de fuerzas de seguridad se
// descartan aunque aparezcan en Notion (defensa en profundidad).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");

const TOKEN = process.env.NOTION_TOKEN;
const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID || "b709a140-dd16-4ae8-b892-eb0d5e1ed159";
const NOTION_VERSION = "2022-06-28";

if (!TOKEN) {
  console.error("Falta NOTION_TOKEN. Exporta el token de tu integracion de Notion.");
  process.exit(1);
}

// bloqueo por si acaso: nunca publicar redes de seguridad
const BLOCKLIST = /guardia civil|polic[ií]a|seguridad privada|t[eé]trapol|tetra|sirdee|cnp|ertzain|mossos/i;

const prop = (p, name, kind) => {
  const v = p[name];
  if (!v) return null;
  switch (kind || v.type) {
    case "title": return v.title?.map(t => t.plain_text).join("") || null;
    case "rich_text": return v.rich_text?.map(t => t.plain_text).join("") || null;
    case "number": return v.number;
    case "select": return v.select?.name || null;
    case "checkbox": return !!v.checkbox;
    case "url": return v.url || null;
    default: return null;
  }
};

async function queryAll() {
  const rows = [];
  let cursor = undefined;
  do {
    const res = await fetch(`https://api.notion.com/v1/data_sources/${DATA_SOURCE_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 }),
    });
    if (!res.ok) {
      // fallback al endpoint clasico de databases
      const res2 = await fetch(`https://api.notion.com/v1/databases/${DATA_SOURCE_ID}/query`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${TOKEN}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 }),
      });
      if (!res2.ok) throw new Error(`Notion HTTP ${res.status}/${res2.status}: ${await res2.text()}`);
      const j2 = await res2.json();
      rows.push(...j2.results);
      cursor = j2.has_more ? j2.next_cursor : undefined;
      continue;
    }
    const j = await res.json();
    rows.push(...j.results);
    cursor = j.has_more ? j.next_cursor : undefined;
  } while (cursor);
  return rows;
}

function mapRow(page) {
  const p = page.properties;
  return {
    n: prop(p, "Nombre", "title"),
    f: prop(p, "Frecuencia (MHz)", "number"),
    t: prop(p, "Tipo", "select"),
    c: prop(p, "Categoría", "select"),
    b: prop(p, "Banda", "select"),
    m: prop(p, "Modo", "select"),
    z: prop(p, "Zona", "select"),
    e: prop(p, "Estado", "select"),
    aip: prop(p, "Verificado AIP", "checkbox"),
    url: prop(p, "userDefined:URL", "url"),
    notas: prop(p, "Notas", "rich_text"),
  };
}

const run = async () => {
  console.log("Descargando de Notion…");
  const raw = await queryAll();
  const all = raw.map(mapRow).filter(r => r.n && !BLOCKLIST.test(`${r.n} ${r.notas || ""} ${r.c || ""}`));

  // conserva coordenadas ya presentes en el JSON actual, cruzando por nombre
  const current = JSON.parse(readFileSync(join(root, "data", "frequencies.json"), "utf8"));
  const coordByName = {};
  for (const grp of ["frecuencias", "sdr", "recursos"]) {
    for (const it of current[grp] || []) {
      if (it.lat != null && it.lng != null) coordByName[it.n] = { lat: it.lat, lng: it.lng };
    }
  }

  const withCoords = (r) => {
    const c = coordByName[r.n];
    return c ? { ...r, lat: c.lat, lng: c.lng } : r;
  };

  const out = {
    ...current,
    meta: { ...current.meta, synced_at: new Date().toISOString() },
    frecuencias: all.filter(r => r.t === "Frecuencia").map(withCoords),
    sdr: all.filter(r => ["SDR Hardware", "SDR Software", "WebSDR"].includes(r.t)).map(withCoords),
    recursos: all.filter(r => r.t === "Recurso").map(withCoords),
  };

  writeFileSync(join(root, "data", "frequencies.json"), JSON.stringify(out, null, 2) + "\n");
  console.log(`sync ok -> ${out.frecuencias.length} frecuencias, ${out.sdr.length} sdr, ${out.recursos.length} recursos`);
};

run().catch(e => { console.error(e); process.exit(1); });
