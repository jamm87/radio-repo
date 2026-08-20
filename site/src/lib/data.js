// data.js — normaliza los conjuntos de datos del repositorio en el modelo
// unico que consume la web.
//
// Politica de publicacion (la misma que el sync de Notion): solo entra lo
// marcado como publicable, y las categorias de seguridad y defensa quedan
// fuera aunque vengan marcadas como publicables en origen.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const stripAccents = (s) =>
  String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const norm = (s) => stripAccents(s).toLowerCase().trim();

const CATEGORIA_EXCLUIDA = new Set(["seguridad/defensa", "defensa", "fuerzas de seguridad"]);

const CATEGORIAS = [
  [["aeronautica", "emergencia aerea"], "Aeronáutica"],
  [["radioaficionados", "radioaficionado"], "Radioaficionados"],
  [["maritima", "maritimo"], "Marítima"],
  [["pmr446", "pmr446/uso libre", "uso comun"], "PMR446 y uso libre"],
  [["medios/broadcast", "broadcast", "medios"], "Medios y radiodifusión"],
  [["transporte"], "Transporte"],
  [["servicios/utilities", "utilidad", "servicios"], "Servicios y utilidad"],
  [["emergencia sanitaria", "proteccion civil", "emergencias"], "Emergencias"],
];

function categoria(value) {
  const key = norm(value);
  for (const [aliases, label] of CATEGORIAS) if (aliases.includes(key)) return label;
  return "Otros / sin identificar";
}

const BANDAS = [
  [(f) => f < 0.535, "LF / VLF"],
  [(f) => f < 1.71, "Onda media"],
  [(f) => f < 30, "HF"],
  [(f) => f < 87.5, "VHF baja"],
  [(f) => f < 108, "Radiodifusión FM"],
  [(f) => f < 137, "Banda aérea"],
  [(f) => f < 144, "VHF servicios"],
  [(f) => f < 146, "2 m radioafición"],
  [(f) => f < 156, "VHF servicios"],
  [(f) => f < 163, "Marítima VHF"],
  [(f) => f < 300, "VHF alta"],
  [(f) => f < 430, "UHF baja"],
  [(f) => f < 440, "70 cm radioafición"],
  [(f) => f < 446, "UHF servicios"],
  [(f) => f < 447, "PMR446"],
  [(f) => f < 1240, "UHF alta"],
  [(f) => f < 1300, "23 cm radioafición"],
  [(f) => f < 3000, "UHF alta"],
];

/** Banda deducida de la frecuencia: unifica las etiquetas dispares del origen. */
function banda(mhz) {
  if (mhz == null) return "Sin banda";
  for (const [test, label] of BANDAS) if (test(mhz)) return label;
  return "SHF / microondas";
}

const MODOS = { digital: "Digital", nfm: "NFM", fm: "FM", am: "AM", usb: "USB", lsb: "LSB", cw: "CW" };
const modo = (value) => {
  const key = norm(value);
  if (!key) return "";
  return MODOS[key] || String(value).toUpperCase().slice(0, 8);
};

// Las zonas llegan escritas de dos formas ("Madrid/Nacional", "Madrid / Sierra");
// se unifica la separacion para que el filtro no muestre variantes del mismo sitio.
const zona = (value) => String(value || "Nacional").replace(/\s*\/\s*/g, " / ").trim();

const claveDedupe = (nombre, mhz) => `${Math.round((mhz ?? 0) * 1e5)}|${norm(nombre).replace(/[^a-z0-9]/g, "").slice(0, 18)}`;

/**
 * Conjunto unico de frecuencias: primero las curadas (con coordenadas, estado
 * y verificacion AIP) y despues las comunitarias publicables que no dupliquen
 * una curada.
 */
export function loadFrequencies(repoRoot) {
  const curadas = readJson(join(repoRoot, "data", "frequencies.json"));
  const ampliadas = readJson(join(repoRoot, "data", "frecuencias.json"));

  const items = [];
  const vistas = new Set();

  for (const d of curadas.frecuencias) {
    const clave = claveDedupe(d.n, d.f);
    vistas.add(clave);
    items.push({
      n: d.n,
      f: d.f ?? null,
      m: modo(d.m),
      b: banda(d.f),
      c: categoria(d.c),
      z: zona(d.z),
      e: d.e || "Por escuchar",
      aip: Boolean(d.aip),
      lat: d.lat ?? null,
      lng: d.lng ?? null,
      fuente: "Curado en el proyecto",
      v: 1,
      notas: d.notas || "",
    });
  }

  let descartadas = 0;
  for (const d of ampliadas) {
    if (d.publicable !== "SI") continue;
    if (CATEGORIA_EXCLUIDA.has(norm(d.categoria))) {
      descartadas++;
      continue;
    }
    const mhz = typeof d.frecuencia_mhz === "number" ? d.frecuencia_mhz : null;
    const clave = claveDedupe(d.nombre, mhz);
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    items.push({
      n: d.nombre || "(sin nombre)",
      f: mhz,
      m: modo(d.modo),
      b: banda(mhz),
      c: categoria(d.categoria),
      z: zona(d.zona),
      e: "Sin verificar",
      aip: false,
      lat: null,
      lng: null,
      fuente: d.fuente || "Fuente comunitaria",
      v: 0,
      notas: d.notas || "",
    });
  }

  items.sort((a, b2) => (a.f ?? 1e9) - (b2.f ?? 1e9));

  const facetas = (key) => [...new Set(items.map((x) => x[key]).filter(Boolean))].sort((a, b3) => a.localeCompare(b3, "es"));

  return {
    meta: curadas.meta,
    zonas: curadas.zonas,
    items,
    sdr: curadas.sdr || [],
    recursos: curadas.recursos || [],
    facetas: {
      categoria: facetas("c"),
      banda: facetas("b"),
      zona: facetas("z"),
      modo: facetas("m"),
    },
    resumen: {
      total: items.length,
      curadas: items.filter((x) => x.v === 1).length,
      aip: items.filter((x) => x.aip).length,
      conCoordenadas: items.filter((x) => x.lat != null).length,
      descartadas,
    },
  };
}

/** Repetidores y balizas de la URE, con el locator convertido a coordenadas. */
export function loadRepeaters(repoRoot) {
  const raw = readJson(join(repoRoot, "data", "repetidores_balizas_ure.json"));

  const items = raw.map((r) => {
    const coords = locatorToLatLng(r.Locator);
    return {
      call: r.Callsign || "",
      f: typeof r.Frecuencia_MHz === "number" ? r.Frecuencia_MHz : null,
      t: r.Tipo || "",
      b: r.Banda || "",
      shift: r.Shift || "",
      m: r.Modo || "",
      canal: r.Canal || "",
      ctcss: r.Subtono_CTCSS || "",
      loc: r.Locator || "",
      alt: r.Altitud_m === "" || r.Altitud_m == null ? null : Number(r.Altitud_m),
      titular: r.Titular || "",
      estado: r.Estado || "",
      lat: coords ? coords.lat : null,
      lng: coords ? coords.lng : null,
    };
  });

  items.sort((a, b) => (a.f ?? 1e9) - (b.f ?? 1e9));

  const facetas = (key) => [...new Set(items.map((x) => x[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));

  return {
    items,
    facetas: {
      banda: facetas("b"),
      tipo: facetas("t"),
      modo: facetas("m"),
      estado: facetas("estado"),
    },
    resumen: {
      total: items.length,
      repetidores: items.filter((x) => x.t === "Repetidor").length,
      balizas: items.filter((x) => x.t === "Baliza").length,
      digitales: items.filter((x) => /DMR|D-Star|C4FM/i.test(x.m)).length,
      conCoordenadas: items.filter((x) => x.lat != null).length,
    },
  };
}

/**
 * Locator Maidenhead (4 o 6 caracteres) a latitud/longitud del centro del
 * cuadro. Es la unica georreferencia que publica la URE.
 */
export function locatorToLatLng(locator) {
  const loc = String(locator ?? "").trim().toUpperCase();
  if (!/^[A-R]{2}[0-9]{2}([A-X]{2})?$/.test(loc)) return null;

  const A = "A".charCodeAt(0);
  let lng = (loc.charCodeAt(0) - A) * 20 - 180;
  let lat = (loc.charCodeAt(1) - A) * 10 - 90;
  lng += Number(loc[2]) * 2;
  lat += Number(loc[3]) * 1;

  if (loc.length === 6) {
    lng += (loc.charCodeAt(4) - A) * (2 / 24) + 1 / 24;
    lat += (loc.charCodeAt(5) - A) * (1 / 24) + 0.5 / 24;
  } else {
    lng += 1;
    lat += 0.5;
  }

  return { lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) };
}
