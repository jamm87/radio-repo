// paginas.js — constructores del cuerpo de cada pagina. Todos devuelven HTML
// y usan los componentes de components.js; el armazon lo pone layout.js.

import { escapeHtml } from "../lib/markdown.js";
import {
  accordion,
  actionButton,
  actionListItem,
  alertBanner,
  badge,
  card,
  divider,
  simpleTable,
  treeView,
} from "../lib/components.js";

const n = (value) => new Intl.NumberFormat("es-ES").format(value);

/*
  Rotulo de la portada. Se compone desde una tabla de glifos de ancho fijo (4
  columnas por caracter) en lugar de escribirlo a mano: asi todas las filas
  miden lo mismo y solo se usa el bloque lleno, que cualquier monoespaciada
  dibuja a un ancho exacto.
*/
const GLIFOS = {
  R: ["███ ", "█  █", "███ ", "█ █ ", "█  █"],
  A: [" ██ ", "█  █", "████", "█  █", "█  █"],
  D: ["███ ", "█  █", "█  █", "█  █", "███ "],
  I: ["████", " ██ ", " ██ ", " ██ ", "████"],
  O: ["████", "█  █", "█  █", "█  █", "████"],
  E: ["████", "█   ", "███ ", "█   ", "████"],
  S: [" ███", "█   ", " ██ ", "   █", "███ "],
  ":": ["    ", " ██ ", "    ", " ██ ", "    "],
  "/": ["   █", "  █ ", " ██ ", " █  ", "█   "],
};

const LOGO = (() => {
  const texto = "RADIO://ES";
  const filas = [0, 1, 2, 3, 4].map((fila) =>
    texto
      .split("")
      .map((ch) => GLIFOS[ch][fila])
      .join(" ")
  );
  return `\n${filas.join("\n")}`;
})();

const stat = (value, label) =>
  `<div class="stat"><div class="stat__n">${escapeHtml(value)}</div><div class="stat__label">${escapeHtml(label)}</div></div>`;

const indexRow = ({ href, num, title, meta }) =>
  `<a class="index-row" href="${escapeHtml(href)}">
    <span class="index-row__n">${escapeHtml(num || "")}</span>
    <span class="index-row__t">${escapeHtml(title)}</span>
    <span class="index-row__dots" aria-hidden="true"></span>
    <span class="index-row__meta">${escapeHtml(meta || "")}</span>
  </a>`;

const cardLink = ({ href, title, meta, children }) =>
  `<a class="card-link" href="${escapeHtml(href)}">${card({
    title,
    children: `${meta ? `<div class="card-link__meta">${escapeHtml(meta)}</div>` : ""}${children}`,
  })}</a>`;

// ----------------------------------------------------------------- portada

export function inicio({ prefix, freq, rep, curso, guias }) {
  const p = (path) => `${prefix}${path}`;

  const resumen = `<div class="stats">
    ${stat(n(freq.resumen.total), "frecuencias publicadas")}
    ${stat(n(rep.resumen.total), "repetidores y balizas")}
    ${stat(String(curso.temas.length), "temas del curso HAREC")}
    ${stat(String(guias.length + 3), "documentos de referencia")}
  </div>`;

  const secciones = `<div class="cards">
    ${cardLink({
      href: p("frecuencias/"),
      title: "Frecuencias",
      meta: `${n(freq.resumen.total)} entradas · ${n(freq.resumen.curadas)} curadas · ${freq.resumen.aip} AIP✓`,
      children:
        "Buscador con filtros por categoría, banda, zona y modo. Mapa de estaciones con coordenadas y exportación de memorias para CHIRP.",
    })}
    ${cardLink({
      href: p("repetidores/"),
      title: "Repetidores y balizas",
      meta: `${n(rep.resumen.repetidores)} repetidores · ${rep.resumen.balizas} balizas · ${rep.resumen.digitales} digitales`,
      children:
        "Listado nacional de la URE con canal, desplazamiento, subtono CTCSS y locator convertido a coordenadas. Exportable a CHIRP con duplex y tono.",
    })}
    ${cardLink({
      href: p("curso/"),
      title: "Curso HAREC",
      meta: `${curso.temas.length} temas · 2 partes`,
      children:
        "Temario completo del examen de radioaficionado: electricidad y radioelectricidad, y normativa reglamentaria. Adaptado de eaharec.com.",
    })}
    ${cardLink({
      href: p("bandas/"),
      title: "Plan de bandas",
      meta: "CNAF · IARU Región 1",
      children:
        "Referencia rápida y extendida de cada banda de aficionado en España: segmentos, modos, potencias y notas del Reglamento.",
    })}
    ${cardLink({
      href: p("guias/"),
      title: "Guías de escucha",
      meta: `${guias.length} guías`,
      children: "Propagación, cadena de software SDR en Linux y Windows, y qué se puede y qué no se puede decodificar en DMR y TETRA.",
    })}
    ${cardLink({
      href: p("referencia/"),
      title: "Referencia",
      meta: "Código Q · enlaces · marco legal",
      children: "Diccionario de siglas, directorio de fuentes y comunidades, y el marco legal de la escucha en España.",
    })}
  </div>`;

  const empezar = `${actionListItem({ icon: "1", href: p("guias/propagacion/"), children: "Entender qué se oye y por qué: propagación y bandas" })}
${actionListItem({ icon: "2", href: p("frecuencias/"), children: "Buscar frecuencias y llevarlas a la emisora con CHIRP" })}
${actionListItem({ icon: "3", href: p("repetidores/"), children: "Localizar el repetidor más cercano y sus subtonos" })}
${actionListItem({ icon: "4", href: p("curso/"), children: "Preparar el examen HAREC para poder transmitir" })}`;

  return `<section class="hero">
  <pre class="hero__ascii" aria-label="RADIO://ES">${escapeHtml(LOGO)}</pre>
  <p class="page-head__lede">Todo el proyecto en un sitio: los datos de escucha, la documentación de referencia y el temario del examen, con el mismo sistema de componentes y la misma navegación.<span class="cursor" aria-hidden="true"></span></p>
</section>

${divider({ type: "DOUBLE" })}
${resumen}
${divider()}

<h2 class="md-h2">Secciones</h2>
${secciones}

${divider()}
<h2 class="md-h2">Por dónde empezar</h2>
${empezar}

${divider()}
${alertBanner(
  `<strong>Escucha pasiva y fuentes públicas.</strong> Este sitio solo publica frecuencias de bandas de uso común o publicadas en fuentes oficiales (AIP de ENAIRE, CNAF, plan de bandas IARU/URE, listados de la URE). No incluye canales tácticos de fuerzas de seguridad ni redes reservadas: ${n(
    freq.resumen.descartadas
  )} entradas del conjunto de origen quedan fuera por esa política. Ver <a href="${p("legal/")}">el marco legal</a>.`
)}`;
}

// ------------------------------------------------------- explorador de datos

const toolbarSelect = (field, label) =>
  `<select class="sacred-select" data-field="${escapeHtml(field)}" aria-label="${escapeHtml(label)}"><option value="">${escapeHtml(label)}</option></select>`;

function explorerShell({ id, searchPlaceholder, selects, chips, columns, footerNote, chirp }) {
  const head = columns
    .map(
      (c) =>
        `<th data-sort="${escapeHtml(c.field)}" aria-sort="none" scope="col" title="Ordenar por ${escapeHtml(c.label)}">${escapeHtml(c.label)}</th>`
    )
    .join("");

  const chirpBlock = chirp
    ? `${divider()}
${card({
  title: "Exportar a CHIRP",
  mode: "left",
  children: `<p>Selecciona filas con las casillas (o usa un preset) y descarga un CSV en el formato genérico de CHIRP. En CHIRP: <strong>Archivo → Importar</strong>.</p>
  <div class="chips" style="margin-top:calc(var(--theme-line-height-base) * 0.5rem)">
    ${chirp.presets.map((preset) => `<button class="chip" type="button" data-preset="${escapeHtml(preset.id)}">${escapeHtml(preset.label)}</button>`).join("")}
  </div>
  <div class="chips" style="margin-top:calc(var(--theme-line-height-base) * 0.5rem)">
    <span class="mono-dim">seleccionadas: <strong class="js-selected">0</strong></span>
    ${actionButton({ hotkey: "▤", label: "Ver CSV", id: "", dataset: {} }).replace('class="sacred-action-button"', 'class="sacred-action-button js-preview"')}
    ${actionButton({ hotkey: "⬇", label: "Descargar CSV" }).replace('class="sacred-action-button"', 'class="sacred-action-button js-csv"')}
  </div>
  <pre class="csv-preview js-csv-preview" aria-live="polite"></pre>`,
})}`
    : "";

  return `<section id="${escapeHtml(id)}">
  <div class="toolbar">
    <div class="toolbar__wide">
      <input class="sacred-input js-search" type="search" placeholder="${escapeHtml(searchPlaceholder)}" aria-label="Buscar" />
    </div>
    ${selects.map((s) => toolbarSelect(s.field, s.label)).join("")}
  </div>

  <div class="chips" style="margin-top:calc(var(--theme-line-height-base) * 0.5rem)">
    ${chips.join("")}
  </div>

  <div class="sacred-row-between" style="margin:calc(var(--theme-line-height-base) * 0.5rem) 0">
    <span class="mono-dim"><strong class="js-count">0</strong> resultados</span>
    <span class="js-status loading" role="status"></span>
  </div>

  <div class="js-map" id="map" aria-hidden="true"></div>

  <div class="datatable-wrap">
    <table class="datatable">
      <thead>
        <tr>
          <th scope="col"><label class="sacred-checkbox"><input type="checkbox" class="js-select-all" aria-label="Seleccionar todo lo filtrado" /><span class="sacred-checkbox__figure" aria-hidden="true"></span></label></th>
          ${head}
        </tr>
      </thead>
      <tbody class="js-tbody"></tbody>
    </table>
  </div>

  <p class="mono-dim" style="margin-top:calc(var(--theme-line-height-base) * 0.5rem)">${footerNote}</p>
  ${chirpBlock}
</section>`;
}

export function frecuencias({ freq }) {
  const columns = [
    { field: "f", label: "MHz" },
    { field: "n", label: "Nombre" },
    { field: "m", label: "Modo" },
    { field: "b", label: "Banda" },
    { field: "c", label: "Categoría" },
    { field: "z", label: "Zona" },
    { field: "e", label: "Estado" },
    { field: "fuente", label: "Fuente" },
  ];

  const chips = [
    '<button class="chip js-verified" type="button" aria-pressed="false">Solo verificadas</button>',
    '<button class="chip js-only-selected" type="button" aria-pressed="false">Solo seleccionadas</button>',
    '<button class="chip js-map-toggle" type="button" aria-pressed="false">▤ Mapa</button>',
    '<button class="chip js-reset" type="button">Limpiar filtros</button>',
  ];

  return explorerShell({
    id: "explorador",
    searchPlaceholder: "buscar… (LEMD, APRS, AIS, repetidor, 145)",
    selects: [
      { field: "c", label: "categoría: todas" },
      { field: "b", label: "banda: todas" },
      { field: "z", label: "zona: todas" },
      { field: "m", label: "modo: todos" },
    ],
    chips,
    columns,
    footerNote: `${n(freq.resumen.curadas)} entradas curadas en el proyecto (con coordenadas, estado y verificación AIP) y el resto procedentes de fuentes comunitarias publicables, sin verificar. Contrasta siempre con el AIP y el CNAF en vigor.`,
    chirp: {
      presets: [
        { id: "aero", label: "Banda aérea" },
        { id: "ham", label: "Radioafición" },
        { id: "pmr", label: "PMR446" },
        { id: "pmr16", label: "PMR446 ×16 ↓" },
        { id: "mar", label: "Marítimo" },
        { id: "filtrado", label: "Todo lo filtrado" },
        { id: "nada", label: "Limpiar selección" },
      ],
    },
  });
}

export function repetidores({ rep }) {
  const columns = [
    { field: "f", label: "MHz" },
    { field: "call", label: "Indicativo" },
    { field: "t", label: "Tipo" },
    { field: "b", label: "Banda" },
    { field: "shift", label: "Shift" },
    { field: "m", label: "Modo" },
    { field: "ctcss", label: "CTCSS" },
    { field: "canal", label: "Canal" },
    { field: "loc", label: "Locator" },
    { field: "titular", label: "Titular" },
  ];

  const chips = [
    '<button class="chip js-only-selected" type="button" aria-pressed="false">Solo seleccionados</button>',
    '<button class="chip js-map-toggle" type="button" aria-pressed="false">▤ Mapa</button>',
    '<button class="chip js-reset" type="button">Limpiar filtros</button>',
  ];

  return explorerShell({
    id: "explorador",
    searchPlaceholder: "buscar… (ED4, Madrid, DMR, IN80, R5)",
    selects: [
      { field: "b", label: "banda: todas" },
      { field: "t", label: "tipo: todos" },
      { field: "m", label: "modo: todos" },
      { field: "estado", label: "estado: todos" },
    ],
    chips,
    columns,
    footerNote: `Listado nacional de estaciones automáticas desatendidas autorizadas, publicado por la URE. Las coordenadas se derivan del locator Maidenhead, así que sitúan la estación dentro de su cuadro, no en su emplazamiento exacto. ${rep.resumen.conCoordenadas} de ${rep.resumen.total} entradas tienen locator válido.`,
    chirp: {
      presets: [
        { id: "vhf", label: "144 MHz" },
        { id: "uhf", label: "432 MHz" },
        { id: "analogico", label: "Solo FM" },
        { id: "digital", label: "Solo digitales" },
        { id: "filtrado", label: "Todo lo filtrado" },
        { id: "nada", label: "Limpiar selección" },
      ],
    },
  });
}

// ----------------------------------------------------------- indice del curso

export function cursoIndice({ prefix, curso }) {
  const parte = (id, titulo) => {
    const temas = curso.temas.filter((t) => t.parte === id);
    return `<h2 class="md-h2">${escapeHtml(titulo)}</h2>
    <div class="index-list">${temas
      .map((t) => indexRow({ href: `${prefix}${t.path}`, num: String(t.numero), title: t.titulo, meta: `${t.secciones} secciones` }))
      .join("")}</div>`;
  };

  const examen = simpleTable({
    head: ["Dato", "Valor"],
    rows: [
      ["Duración", "90 minutos"],
      ["Formato", "Test por ordenador en la JPIT provincial"],
      ["Aprobado", "50 % en cada parte, de forma independiente"],
      ["Resultado", "Certificado HAREC (CEPT T/R 61-02)"],
      ["Programa", "Anexo II de la Orden IET/1311/2013"],
    ],
  });

  return `<p>Temario completo para la preparación del examen de obtención del diploma de operador de estaciones de radioaficionado en España. Sigue el programa oficial del <strong>Anexo II de la Orden IET/1311/2013</strong>, conforme a la Recomendación <strong>CEPT T/R 61-02</strong>.</p>

${alertBanner(
  `<strong>Atribución.</strong> El contenido del curso reutiliza y adapta el proyecto de código abierto <a href="https://eaharec.com" target="_blank" rel="noopener noreferrer">eaharec.com</a> (licencia MIT). Repositorio original: <a href="https://github.com/t00mas/eaharec" target="_blank" rel="noopener noreferrer">github.com/t00mas/eaharec</a>.`
)}

${parte(1, "Parte I — Electricidad y radioelectricidad")}
${parte(2, "Parte II — Normativa reglamentaria")}

<h2 class="md-h2">Recursos</h2>
<div class="index-list">
  ${indexRow({ href: `${prefix}curso/recursos/`, num: "→", title: "Recursos y enlaces del curso", meta: "normativa, CEPT, organizaciones" })}
  ${indexRow({ href: `${prefix}bandas/`, num: "→", title: "Plan de bandas de radioaficionado", meta: "CNAF · IARU" })}
  ${indexRow({ href: `${prefix}referencia/codigo-q/`, num: "→", title: "Diccionario de siglas y código Q", meta: "referencia rápida" })}
</div>

<h2 class="md-h2">El examen</h2>
${examen}`;
}

// -------------------------------------------------------------- indice simple

export function indiceSeccion({ prefix, intro, entradas }) {
  return `${intro ? `<p>${intro}</p>` : ""}
<div class="cards">
  ${entradas
    .map((e) =>
      cardLink({
        href: `${prefix}${e.path}`,
        title: e.titulo,
        meta: e.meta,
        children: escapeHtml(e.resumen || ""),
      })
    )
    .join("")}
</div>`;
}

// ---------------------------------------------------------------------- pie

export function acerca({ prefix, freq, rep, curso, cambios, arbol }) {
  const datos = simpleTable({
    head: ["Conjunto", "Entradas", "Origen"],
    rows: [
      [`<a href="${prefix}frecuencias/">Frecuencias publicadas</a>`, n(freq.resumen.total), "Curado del proyecto + fuentes comunitarias publicables"],
      ["· de ellas curadas", n(freq.resumen.curadas), "Verificadas una a una, con coordenadas y estado"],
      ["· de ellas contrastadas con AIP", String(freq.resumen.aip), "AIP de ENAIRE"],
      [`<a href="${prefix}repetidores/">Repetidores y balizas</a>`, n(rep.resumen.total), "Listado nacional de la URE"],
      [`<a href="${prefix}curso/">Temas del curso HAREC</a>`, String(curso.temas.length), "Adaptado de eaharec.com (MIT)"],
    ],
    align: ["", "right", ""],
  });

  return `<p>Radio España reúne en un solo sitio el material de escucha, la documentación de referencia y el temario del examen HAREC que antes vivían repartidos entre el repositorio, un espacio de Notion y hojas de cálculo sueltas.</p>

<h2 class="md-h2">Qué contiene</h2>
${datos}

<h2 class="md-h2">Cómo está construido</h2>
<p>Sitio estático generado por un script de Node sin dependencias externas. El contenido son ficheros Markdown del repositorio y los datos son los JSON de <code>data/</code>; el build los normaliza, los deduplica y aplica la política de publicación antes de escribir nada.</p>
<p>La interfaz usa <a href="https://github.com/internet-development/www-sacred" target="_blank" rel="noopener noreferrer">SRCL (www-sacred)</a> como sistema de componentes, portado a CSS plano en <code>site/src/styles/sacred.css</code>: se conservan sus tokens de color de la paleta ANSI, la rejilla de <code>ch</code> y altura de línea, y el marcado de cada componente.</p>

${accordion({
  title: "Estructura del repositorio",
  open: false,
  children: treeView(arbol),
})}

<h2 class="md-h2">Política de publicación</h2>
<p>Solo se publica escucha pasiva de frecuencias de bandas de uso común o publicadas en fuentes oficiales. Las entradas marcadas como no publicables en origen, y cualquier entrada de categorías de seguridad y defensa, quedan fuera del sitio aunque estén en los ficheros de datos del repositorio (<strong>${n(
    freq.resumen.descartadas
  )}</strong> descartadas en el último build por este motivo). Ver <a href="${prefix}legal/">el marco legal</a>.</p>

<h2 class="md-h2">Licencias y atribuciones</h2>
<ul class="list">
  <li>Código del proyecto: <strong>MIT</strong>.</li>
  <li>Curso HAREC: adaptado de <a href="https://eaharec.com" target="_blank" rel="noopener noreferrer">eaharec.com</a>, licencia MIT.</li>
  <li>Sistema de componentes: <a href="https://github.com/internet-development/www-sacred" target="_blank" rel="noopener noreferrer">SRCL</a>, licencia MIT.</li>
  <li>Datos: fuentes públicas citadas en cada conjunto (AIP de ENAIRE, CNAF, URE, plan de bandas IARU).</li>
  <li>Mapa: tiles de CARTO sobre datos de OpenStreetMap; biblioteca Leaflet.</li>
</ul>

<h2 class="md-h2">Registro de cambios</h2>
${cambios}`;
}

export function legal() {
  return `<p>Escuchar no es lo mismo que difundir. La normativa española permite la recepción de emisiones no dirigidas al público en general, pero prohíbe divulgar su contenido o usarlo. Estas son las reglas que sigue este sitio y que conviene tener claras antes de sintonizar.</p>

<h2 class="md-h2">Qué dice la ley</h2>
${simpleTable({
  head: ["Norma", "Qué establece"],
  rows: [
    [
      '<a href="https://www.boe.es/buscar/act.php?id=BOE-A-2014-5980" target="_blank" rel="noopener noreferrer">Ley 9/2014 General de Telecomunicaciones</a>',
      "Secreto de las comunicaciones: la interceptación y, sobre todo, la divulgación o el aprovechamiento del contenido de comunicaciones no dirigidas al público está prohibida.",
    ],
    [
      '<a href="https://avance.digital.gob.es/espectro/Paginas/cnaf.aspx" target="_blank" rel="noopener noreferrer">CNAF</a>',
      "Determina qué servicio ocupa cada banda y en qué condiciones. Es la referencia para saber si una banda es de uso común o privativo.",
    ],
    [
      '<a href="https://www.boe.es/buscar/act.php?id=BOE-A-2013-7624" target="_blank" rel="noopener noreferrer">Orden IET/1311/2013</a>',
      "Reglamento del servicio de aficionados: condiciones de uso, potencias e indicativos. Para transmitir hace falta el diploma HAREC y la autorización.",
    ],
  ],
})}

<h2 class="md-h2">Reglas prácticas</h2>
<ul class="list">
  <li><strong>Escuchar</strong> emisiones de bandas de uso común (radioafición, PMR446, banda aérea, marítima, radiodifusión) no requiere autorización.</li>
  <li><strong>No difundas</strong> el contenido de lo que oigas fuera de esas bandas, ni lo uses para nada. El delito no es sintonizar, es divulgar o aprovechar.</li>
  <li><strong>No publiques</strong> frecuencias tácticas de fuerzas de seguridad ni redes reservadas. Este sitio las excluye por política.</li>
  <li><strong>Cifrado:</strong> las redes TETRA de emergencias van cifradas. Intentar romper el cifrado sí es ilegal; recibir metadatos no.</li>
  <li><strong>Para transmitir</strong> necesitas licencia. Ese es el objetivo del <a href="../curso/">curso HAREC</a>.</li>
</ul>

${alertBanner(
  "<strong>Este sitio no da asesoramiento jurídico.</strong> Es un resumen divulgativo de normativa pública. Ante la duda, consulta el texto consolidado en el BOE y el CNAF en vigor."
)}

<h2 class="md-h2">Qué publica este sitio</h2>
<p>Solo frecuencias de bandas de uso común o publicadas en fuentes oficiales: AIP de ENAIRE, CNAF, plan de bandas IARU/URE y el listado de repetidores de la URE. Las entradas marcadas como no publicables en el conjunto de datos de origen no llegan a la web. El criterio de cada entrada se puede consultar en la columna de fuente del <a href="../frecuencias/">explorador</a>.</p>`;
}

export { badge, n as formatNumber };
