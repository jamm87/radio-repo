// build.js — genera el sitio completo en site/dist/.
// Sin dependencias externas: solo Node 18+.
//
//   node scripts/build.js
//
// Fuentes: content/**.md y docs/**.md para el contenido, data/*.json para los
// conjuntos de datos, site/src/** para plantillas, estilos y cliente.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { renderMarkdown } from "../src/lib/markdown.js";
import { renderPage, SITE } from "../src/lib/layout.js";
import { loadFrequencies, loadRepeaters } from "../src/lib/data.js";
import * as Paginas from "../src/pages/paginas.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, "..");
const repoRoot = join(siteRoot, "..");
const dist = join(siteRoot, "dist");

const buildDate = new Date().toISOString().slice(0, 10);
const read = (...parts) => readFileSync(join(repoRoot, ...parts), "utf8");

const write = (path, contents) => {
  const file = join(dist, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents);
};

// --------------------------------------------------------------- contenido

const temaFiles = (parte) =>
  readdirSync(join(repoRoot, "content", "curso", `parte${parte}`))
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ file: f, numero: Number(f.match(/tema(\d+)/)[1]) }))
    .sort((a, b) => a.numero - b.numero);

function loadCurso() {
  const temas = [];
  for (const parte of [1, 2]) {
    for (const { file, numero } of temaFiles(parte)) {
      const source = `content/curso/parte${parte}/${file}`;
      const rendered = renderMarkdown(read(source));
      temas.push({
        parte,
        numero,
        source,
        path: `curso/parte${parte}/tema${numero}/`,
        titulo: (rendered.title || `Tema ${numero}`).replace(/^Tema \d+:\s*/, ""),
        tituloCompleto: rendered.title || `Tema ${numero}`,
        secciones: rendered.toc.filter((h) => h.level === 2).length,
      });
    }
  }
  return { temas };
}

const GUIAS = [
  {
    source: "content/guias/propagacion.md",
    path: "guias/propagacion/",
    titulo: "Propagación y bandas de interés",
    resumen: "Qué bandas se monitorizan, cómo las condiciona la atmósfera y por qué el emplazamiento pesa más que la potencia.",
    meta: "VHF/UHF · troposfera",
  },
  {
    source: "content/guias/sdr-portatil.md",
    path: "guias/sdr-portatil/",
    titulo: "Escucha digital con SDR y portátil",
    resumen: "Cadena completa en Linux y Windows: drivers, receptor, decodificador y encaminado de audio. Con guía de compra.",
    meta: "RTL-SDR · DSD · TETRA",
  },
  {
    source: "content/guias/dmr-tetra.md",
    path: "guias/dmr-tetra/",
    titulo: "Escucha digital: DMR y TETRA",
    resumen: "Las dos rutas para escuchar modos digitales, su coste y el límite que impone el cifrado en redes de emergencias.",
    meta: "DMR · TETRA",
  },
];

const REFERENCIA = [
  {
    source: "content/referencia/codigo-q.md",
    path: "referencia/codigo-q/",
    titulo: "Diccionario de siglas y código Q",
    resumen: "El código Q esencial, su origen telegráfico de 1909 y cómo se usa hoy en fonía.",
    meta: "13 códigos",
  },
  {
    source: "docs/plan_bandas_radioaficionado_ES.md",
    path: "bandas/",
    titulo: "Plan de bandas de radioaficionado",
    resumen: "Referencia rápida y extendida de cada banda: segmentos, modos, potencias y notas del Reglamento y del CNAF.",
    meta: "CNAF · IARU R1",
  },
  {
    source: "content/enlaces.md",
    path: "enlaces/",
    titulo: "Enlaces de interés",
    resumen: "Directorios de repetidores, comunidades, fuentes oficiales y software de referencia.",
    meta: "24 enlaces",
  },
  {
    path: "legal/",
    titulo: "Marco legal de la escucha",
    resumen: "Qué permite y qué prohíbe la normativa española, y qué publica este sitio en consecuencia.",
    meta: "Ley 9/2014 · CNAF",
  },
];

// ------------------------------------------------------------------- datos

const freq = loadFrequencies(repoRoot);
const rep = loadRepeaters(repoRoot);
const curso = loadCurso();

// ------------------------------------------------------------- navegacion

const nav = [
  { label: "Inicio", items: [{ label: "Portada", path: "" }] },
  {
    label: "Escuchar",
    items: [
      { label: "Frecuencias", path: "frecuencias/" },
      { label: "Repetidores y balizas", path: "repetidores/" },
    ],
  },
  {
    label: "Curso HAREC",
    collapsible: true,
    items: [
      { label: "Índice del curso", path: "curso/" },
      ...curso.temas.map((t) => ({ label: `${t.parte}.${t.numero} ${t.titulo}`, path: t.path })),
      { label: "Recursos del curso", path: "curso/recursos/" },
    ],
  },
  { label: "Guías", items: GUIAS.map((g) => ({ label: g.titulo, path: g.path })) },
  { label: "Referencia", items: REFERENCIA.map((r) => ({ label: r.titulo, path: r.path })) },
  { label: "Proyecto", items: [{ label: "Acerca del proyecto", path: "acerca/" }] },
];

const topNav = [
  { label: "Frecuencias", path: "frecuencias/" },
  { label: "Repetidores", path: "repetidores/" },
  { label: "Curso", path: "curso/" },
  { label: "Guías", path: "guias/" },
  { label: "Referencia", path: "referencia/" },
  { label: "Acerca", path: "acerca/" },
];

const stats = `${new Intl.NumberFormat("es-ES").format(freq.resumen.total)} frecuencias · ${rep.resumen.total} repetidores · ${curso.temas.length} temas`;

// Enlaces entre ficheros Markdown -> rutas del sitio.
const linkMap = {
  "README.md": "acerca/",
  "CHANGELOG.md": "acerca/",
  "LICENSE": "acerca/",
  "docs/RADIO-ES.md": "acerca/",
  "site/README.md": "acerca/",
  "docs/plan_bandas_radioaficionado_ES.md": "bandas/",
  "content/enlaces.md": "enlaces/",
  "content/curso/README.md": "curso/",
  "content/curso/recursos.md": "curso/recursos/",
  ...Object.fromEntries(GUIAS.map((g) => [g.source, g.path])),
  ...Object.fromEntries(REFERENCIA.filter((r) => r.source).map((r) => [r.source, r.path])),
  ...Object.fromEntries(curso.temas.map((t) => [t.source, t.path])),
};

const pages = [];

const emit = (page) => {
  pages.push(page.path);
  write(`${page.path}index.html`, renderPage({ ...page, nav, topNav, buildDate, stats }));
};

/** Pagina generada desde un fichero Markdown del repositorio. */
function emitMarkdown({ source, path, title, eyebrow, trail, lede, pager, prepend = "", append = "" }) {
  const baseDir = dirname(source);
  const prefix = "../".repeat(path.split("/").filter(Boolean).length);
  const rendered = renderMarkdown(read(source), { linkMap, prefix, baseDir });

  const pagerHtml = pager
    ? `<div class="rule" role="separator"><span></span></div><nav class="pager" aria-label="Navegación entre temas">
        ${pager.prev ? `<a href="${prefix}${pager.prev.path}">← ${escapeAttr(pager.prev.label)}</a>` : "<span></span>"}
        ${pager.next ? `<a href="${prefix}${pager.next.path}">${escapeAttr(pager.next.label)} →</a>` : "<span></span>"}
      </nav>`
    : "";

  emit({
    path,
    title: title || rendered.title || "Documento",
    eyebrow,
    trail,
    lede,
    toc: rendered.toc,
    body: `${prepend}${rendered.html}${append}${pagerHtml}`,
    description: lede ? stripTags(lede) : undefined,
  });
}

const stripTags = (s) => String(s).replace(/<[^>]*>/g, "").slice(0, 180);
const escapeAttr = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

// -------------------------------------------------------------- generacion

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Estáticos: estilos y cliente.
for (const [from, to] of [
  ["src/styles/sacred.css", "assets/sacred.css"],
  ["src/styles/radio.css", "assets/radio.css"],
  ["src/client/app.js", "assets/app.js"],
  ["src/client/explorador.js", "assets/explorador.js"],
]) {
  write(to, readFileSync(join(siteRoot, from), "utf8"));
}

for (const file of ["favicon.svg", "CNAME"]) {
  const source = join(siteRoot, "public", file);
  if (existsSync(source)) cpSync(source, join(dist, file));
}
write(".nojekyll", "");

// Datos que consume el cliente.
write(
  "data/frecuencias.json",
  JSON.stringify({
    // Solo los campos pensados para el cliente: freq.meta.source nombra la
    // fuente interna de edicion y no debe llegar al JSON publico.
    meta: { name: freq.meta.name, description: freq.meta.description, notice: freq.meta.notice, coordsNote: freq.meta.coords_note, generado: buildDate },
    items: freq.items,
    facetas: { c: freq.facetas.categoria, b: freq.facetas.banda, z: freq.facetas.zona, m: freq.facetas.modo },
  })
);
write(
  "data/repetidores.json",
  JSON.stringify({
    meta: { fuente: "URE — listado nacional de repetidores y balizas", generado: buildDate },
    items: rep.items,
    facetas: { b: rep.facetas.banda, t: rep.facetas.tipo, m: rep.facetas.modo, estado: rep.facetas.estado },
  })
);

// Portada.
emit({
  path: "",
  title: SITE.title,
  eyebrow: "Portal abierto de radio en España",
  body: Paginas.inicio({ prefix: "", freq, rep, curso, guias: GUIAS }),
});

// Exploradores.
emit({
  path: "frecuencias/",
  title: "Frecuencias",
  eyebrow: "Escuchar",
  lede: `${new Intl.NumberFormat("es-ES").format(freq.resumen.total)} frecuencias publicables de banda aérea, radioafición, PMR446, marítimo, radiodifusión y servicios. Filtra, consulta el mapa y exporta memorias para CHIRP.`,
  trail: [{ label: "Inicio", path: "" }, { label: "Frecuencias" }],
  wide: true,
  body: Paginas.frecuencias({ freq }),
  scripts: `<script src="../assets/explorador.js" defer></script>
<script>${clienteFrecuencias()}</script>`,
});

emit({
  path: "repetidores/",
  title: "Repetidores y balizas",
  eyebrow: "Escuchar",
  lede: `Listado nacional de la URE: ${rep.resumen.repetidores} repetidores y ${rep.resumen.balizas} balizas, con canal, desplazamiento, subtono y posición aproximada.`,
  trail: [{ label: "Inicio", path: "" }, { label: "Repetidores" }],
  wide: true,
  body: Paginas.repetidores({ rep }),
  scripts: `<script src="../assets/explorador.js" defer></script>
<script>${clienteRepetidores()}</script>`,
});

// Curso.
emit({
  path: "curso/",
  title: "Curso HAREC",
  eyebrow: "Aprender",
  lede: "Temario completo del examen de radioaficionado en España, en 19 temas repartidos en dos partes.",
  trail: [{ label: "Inicio", path: "" }, { label: "Curso HAREC" }],
  body: Paginas.cursoIndice({ prefix: "../", curso }),
});

curso.temas.forEach((tema, index) => {
  const prev = curso.temas[index - 1];
  const next = curso.temas[index + 1];
  emitMarkdown({
    source: tema.source,
    path: tema.path,
    title: tema.tituloCompleto,
    eyebrow: `Curso HAREC · Parte ${tema.parte === 1 ? "I" : "II"}`,
    trail: [
      { label: "Inicio", path: "" },
      { label: "Curso", path: "curso/" },
      { label: `Parte ${tema.parte === 1 ? "I" : "II"}`, path: "curso/" },
      { label: `Tema ${tema.numero}` },
    ],
    pager: {
      prev: prev ? { path: prev.path, label: `${prev.parte}.${prev.numero} ${prev.titulo}` } : null,
      next: next ? { path: next.path, label: `${next.parte}.${next.numero} ${next.titulo}` } : null,
    },
  });
});

emitMarkdown({
  source: "content/curso/recursos.md",
  path: "curso/recursos/",
  title: "Recursos y enlaces del curso",
  eyebrow: "Curso HAREC",
  trail: [{ label: "Inicio", path: "" }, { label: "Curso", path: "curso/" }, { label: "Recursos" }],
});

// Guias.
emit({
  path: "guias/",
  title: "Guías de escucha",
  eyebrow: "Aprender",
  lede: "Cómo se comporta el espectro que vas a escuchar y cómo montar la cadena de recepción.",
  trail: [{ label: "Inicio", path: "" }, { label: "Guías" }],
  body: Paginas.indiceSeccion({
    prefix: "../",
    intro:
      "Tres guías prácticas, consolidadas desde el espacio de trabajo del proyecto: qué condiciona la propagación en las bandas de interés, cómo montar una cadena SDR completa y qué se puede decodificar realmente en digital.",
    entradas: GUIAS,
  }),
});

GUIAS.forEach((guia) => {
  emitMarkdown({
    source: guia.source,
    path: guia.path,
    title: guia.titulo,
    eyebrow: "Guías",
    trail: [{ label: "Inicio", path: "" }, { label: "Guías", path: "guias/" }, { label: guia.titulo }],
    lede: guia.resumen,
  });
});

// Referencia.
emit({
  path: "referencia/",
  title: "Referencia",
  eyebrow: "Consultar",
  lede: "Plan de bandas, diccionario de siglas, directorio de fuentes y marco legal.",
  trail: [{ label: "Inicio", path: "" }, { label: "Referencia" }],
  body: Paginas.indiceSeccion({ prefix: "../", entradas: REFERENCIA }),
});

emitMarkdown({
  source: "content/referencia/codigo-q.md",
  path: "referencia/codigo-q/",
  title: "Diccionario de siglas y código Q",
  eyebrow: "Referencia",
  trail: [{ label: "Inicio", path: "" }, { label: "Referencia", path: "referencia/" }, { label: "Código Q" }],
});

emitMarkdown({
  source: "docs/plan_bandas_radioaficionado_ES.md",
  path: "bandas/",
  title: "Plan de bandas de radioaficionado",
  eyebrow: "Referencia",
  trail: [{ label: "Inicio", path: "" }, { label: "Referencia", path: "referencia/" }, { label: "Plan de bandas" }],
  lede: "Cuadro Nacional de Atribución de Frecuencias y plan de bandas IARU Región 1 para el servicio de aficionado en España.",
});

emitMarkdown({
  source: "content/enlaces.md",
  path: "enlaces/",
  title: "Enlaces de interés",
  eyebrow: "Referencia",
  trail: [{ label: "Inicio", path: "" }, { label: "Referencia", path: "referencia/" }, { label: "Enlaces" }],
});

emit({
  path: "legal/",
  title: "Marco legal de la escucha",
  eyebrow: "Referencia",
  trail: [{ label: "Inicio", path: "" }, { label: "Referencia", path: "referencia/" }, { label: "Marco legal" }],
  body: Paginas.legal(),
});

// Acerca.
const cambios = renderMarkdown(read("CHANGELOG.md"), { linkMap, prefix: "../" });
emit({
  path: "acerca/",
  title: "Acerca del proyecto",
  eyebrow: "Proyecto",
  lede: "Qué contiene el sitio, cómo se genera y bajo qué licencias.",
  trail: [{ label: "Inicio", path: "" }, { label: "Acerca" }],
  body: Paginas.acerca({
    prefix: "../",
    freq,
    rep,
    curso,
    cambios: cambios.html,
    arbol: arbolRepo(),
  }),
});

// 404 con la misma navegacion.
write(
  "404.html",
  renderPage({
    path: "",
    title: "Página no encontrada",
    eyebrow: "Error 404",
    lede: "Esa dirección no existe en el sitio. Prueba con el índice de la izquierda.",
    body: `<p><a href="./">Volver a la portada</a></p>`,
    nav,
    topNav,
    buildDate,
    stats,
  })
);

// sitemap y robots. La URL base se puede fijar con SITE_URL al compilar.
const baseUrl = (process.env.SITE_URL || "https://jamm87.github.io/radio-repo/").replace(/\/*$/, "/");
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${baseUrl}${p}</loc><lastmod>${buildDate}</lastmod></url>`).join("\n")}
</urlset>`
);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${baseUrl}sitemap.xml\n`);

console.log(`build ok -> site/dist/ (${pages.length} páginas, ${freq.items.length} frecuencias, ${rep.items.length} repetidores)`);

// ------------------------------------------------------- cliente por pagina

function arbolRepo() {
  return [
    {
      title: "radio-repo",
      children: [
        { title: "content/", children: [{ title: "curso/ — 19 temas HAREC" }, { title: "guias/ — 3 guías" }, { title: "referencia/ — código Q" }, { title: "enlaces.md" }] },
        { title: "data/ — conjuntos de datos JSON" },
        { title: "docs/ — plan de bandas, hojas maestras" },
        {
          title: "site/",
          children: [
            { title: "src/styles/ — sacred.css + radio.css" },
            { title: "src/lib/ — markdown, componentes, layout, datos" },
            { title: "src/pages/ — constructores de página" },
            { title: "src/client/ — tema y explorador" },
            { title: "scripts/build.js" },
          ],
        },
        { title: "tools/ — utilidades Python" },
      ],
    },
  ];
}

function clienteFrecuencias() {
  return `document.addEventListener("DOMContentLoaded", function () {
  var E = window.RADIO.explorer;
  var esc = E.esc, fmt = E.fmtMhz;
  var PMR16 = [];
  for (var i = 0; i < 16; i++) PMR16.push({ name: "PMR446 C" + (i + 1), freq: +(446.00625 + i * 0.0125).toFixed(5), mode: "NFM", comment: "PMR446 canal " + (i + 1) });

  E.mount("explorador", {
    src: "../data/frecuencias.json",
    csvName: "radio-es-frecuencias-chirp.csv",
    extract: function (p) { return p.items; },
    key: function (d) { return d.f + "|" + d.n; },
    label: function (d) { return d.n; },
    haystack: function (d) { return [d.n, d.c, d.b, d.z, d.m, d.e, d.notas, d.fuente, d.f].join(" "); },
    isVerified: function (d) { return d.v === 1 || d.aip; },
    selects: [
      { field: "c", label: "categoría: todas" },
      { field: "b", label: "banda: todas" },
      { field: "z", label: "zona: todas" },
      { field: "m", label: "modo: todos" }
    ],
    columns: [
      { field: "f", label: "MHz", numeric: true, cellClass: "num", render: function (d) { return fmt(d.f); } },
      { field: "n", label: "Nombre", cellClass: "wrap", render: function (d) {
          return esc(d.n) + (d.notas ? '<div class="muted">' + esc(d.notas) + "</div>" : "");
        } },
      { field: "m", label: "Modo", render: function (d) { return esc(d.m); } },
      { field: "b", label: "Banda", render: function (d) { return esc(d.b); } },
      { field: "c", label: "Categoría", render: function (d) { return esc(d.c); } },
      { field: "z", label: "Zona", render: function (d) { return '<span class="muted">' + esc(d.z) + "</span>"; } },
      { field: "e", label: "Estado", render: function (d) {
          if (d.aip) return '<span class="pill pill--ok">AIP✓</span>';
          if (d.v === 1) return '<span class="pill">' + esc(d.e) + "</span>";
          return '<span class="pill pill--off">sin verificar</span>';
        } },
      { field: "fuente", label: "Fuente", cellClass: "wrap", render: function (d) { return '<span class="muted">' + esc(d.fuente) + "</span>"; } }
    ],
    toChirp: function (d) {
      return { name: d.n, freq: d.f, mode: d.m, comment: (d.notas || "") + (d.z ? " [" + d.z + "]" : "") };
    },
    toPoint: function (d) {
      return { lat: d.lat, lng: d.lng, group: d.c,
        popup: "<strong>" + esc(d.n) + "</strong><br/>" + fmt(d.f) + " MHz · " + esc(d.m) + "<br/>" + esc(d.c) };
    },
    presets: function (name, state, render) {
      if (name === "pmr16") { E.download("radio-es-pmr446-chirp.csv", E.chirpRows(PMR16)); return; }
      if (name === "nada") { state.selected.clear(); render(); return; }
      var pick;
      if (name === "aero") pick = function (d) { return d.c === "Aeronáutica"; };
      else if (name === "ham") pick = function (d) { return d.c === "Radioaficionados"; };
      else if (name === "pmr") pick = function (d) { return d.c === "PMR446 y uso libre"; };
      else if (name === "mar") pick = function (d) { return d.c === "Marítima"; };
      else pick = null;
      var pool = pick ? state.items.filter(pick) : state.filtered;
      pool.forEach(function (d) { if (d.f != null) state.selected.add(d.f + "|" + d.n); });
      render();
    }
  });
});`;
}

function clienteRepetidores() {
  return `document.addEventListener("DOMContentLoaded", function () {
  var E = window.RADIO.explorer;
  var esc = E.esc, fmt = E.fmtMhz;

  E.mount("explorador", {
    src: "../data/repetidores.json",
    csvName: "radio-es-repetidores-chirp.csv",
    extract: function (p) { return p.items; },
    key: function (d) { return d.f + "|" + d.call; },
    label: function (d) { return d.call; },
    haystack: function (d) { return [d.call, d.t, d.b, d.m, d.canal, d.loc, d.titular, d.estado, d.f].join(" "); },
    isVerified: function () { return true; },
    selects: [
      { field: "b", label: "banda: todas" },
      { field: "t", label: "tipo: todos" },
      { field: "m", label: "modo: todos" },
      { field: "estado", label: "estado: todos" }
    ],
    columns: [
      { field: "f", label: "MHz", numeric: true, cellClass: "num", render: function (d) { return fmt(d.f); } },
      { field: "call", label: "Indicativo", render: function (d) { return "<strong>" + esc(d.call) + "</strong>"; } },
      { field: "t", label: "Tipo", render: function (d) { return esc(d.t); } },
      { field: "b", label: "Banda", render: function (d) { return esc(d.b); } },
      { field: "shift", label: "Shift", render: function (d) { return '<span class="muted">' + esc(d.shift || "—") + "</span>"; } },
      { field: "m", label: "Modo", render: function (d) {
          var digital = /DMR|D-Star|C4FM/i.test(d.m);
          return '<span class="pill' + (digital ? "" : " pill--off") + '">' + esc(d.m) + "</span>";
        } },
      { field: "ctcss", label: "CTCSS", cellClass: "num", render: function (d) { return d.ctcss ? esc(d.ctcss) : '<span class="muted">—</span>'; } },
      { field: "canal", label: "Canal", render: function (d) { return esc(d.canal || "—"); } },
      { field: "loc", label: "Locator", render: function (d) { return '<span class="muted">' + esc(d.loc) + "</span>"; } },
      { field: "titular", label: "Titular", cellClass: "wrap", render: function (d) { return esc(d.titular); } }
    ],
    toChirp: function (d) {
      var shift = E.parseShift(d.shift);
      return { name: d.call, freq: d.f, mode: /DMR|D-Star|C4FM/i.test(d.m) ? "NFM" : d.m,
        ctcss: d.ctcss, duplex: shift.duplex, offset: shift.offset,
        comment: [d.canal, d.loc, d.titular].filter(Boolean).join(" ") };
    },
    toPoint: function (d) {
      return { lat: d.lat, lng: d.lng, group: d.t,
        popup: "<strong>" + esc(d.call) + "</strong><br/>" + fmt(d.f) + " MHz " + esc(d.shift) + "<br/>" + esc(d.m) + (d.ctcss ? " · CTCSS " + esc(d.ctcss) : "") + "<br/>" + esc(d.titular) };
    },
    presets: function (name, state, render) {
      if (name === "nada") { state.selected.clear(); render(); return; }
      var pick;
      if (name === "vhf") pick = function (d) { return d.b === "144 MHz"; };
      else if (name === "uhf") pick = function (d) { return d.b === "432 MHz"; };
      else if (name === "analogico") pick = function (d) { return /^FM/i.test(d.m); };
      else if (name === "digital") pick = function (d) { return /DMR|D-Star|C4FM/i.test(d.m); };
      else pick = null;
      var pool = pick ? state.items.filter(pick) : state.filtered;
      pool.forEach(function (d) { if (d.f != null) state.selected.add(d.f + "|" + d.call); });
      render();
    }
  });
});`;
}
