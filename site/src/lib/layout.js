// layout.js — el armazon de pagina: cabecera, raiz de navegacion, contenido,
// indice lateral y pie. Todas las rutas se guardan relativas a la raiz del
// sitio (sin barra inicial) y aqui se convierten a rutas relativas al fichero
// que se esta generando, para que el sitio funcione igual en la raiz de un
// dominio, en un subdirectorio de GitHub Pages o abierto desde disco.

import { escapeHtml } from "./markdown.js";
import { accordion, breadcrumbs as breadcrumbsComponent } from "./components.js";

export const SITE = {
  name: "RADIO://ES",
  title: "Radio España",
  description:
    "Portal abierto de radio en España: frecuencias, repetidores, plan de bandas, guías de escucha y el temario completo del examen HAREC.",
  repo: "https://github.com/jamm87/radio-repo",
};

/** Prefijo relativo para una ruta del sitio ("curso/parte1/" -> "../../"). */
export function prefixFor(path) {
  const depth = String(path || "").split("/").filter(Boolean).length;
  return depth === 0 ? "" : "../".repeat(depth);
}

// Ojo: "" es una ruta valida (la portada); solo null/undefined significa "sin enlace".
const href = (prefix, target) => {
  if (target == null) return "#";
  if (/^(https?:|mailto:|#)/i.test(target)) return target;
  return `${prefix}${target}` || "./";
};

const THEME_SCRIPT = `(function(){
  try {
    var root = document.documentElement;
    var theme = localStorage.getItem("radio-theme");
    if (theme !== "light" && theme !== "dark") {
      theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add("theme-" + theme);
    var tint = localStorage.getItem("radio-tint");
    if (tint) root.classList.add("tint-" + tint);
  } catch (e) {}
})();`;

const TINTS = ["green", "blue", "yellow", "purple", "orange", "pink", "red"];
const TINT_HEX = {
  green: "#39ff44",
  blue: "#0047ff",
  yellow: "#e4f221",
  purple: "#8000ff",
  orange: "#ffac1c",
  pink: "#ff00ff",
  red: "#ff0000",
};

function masthead({ prefix, path, topNav }) {
  const links = topNav
    .map((item) => {
      const active = path === item.path || (item.path && path.startsWith(item.path) && item.path !== "");
      return `<a class="masthead__link" href="${href(prefix, item.path)}"${active ? ' aria-current="true"' : ""}>${escapeHtml(item.label)}</a>`;
    })
    .join("");

  const swatches = TINTS.map(
    (t) =>
      `<button class="tint-swatch" type="button" data-tint="${t}" aria-pressed="false" title="Tinte ${t}" aria-label="Tinte ${t}" style="background:${TINT_HEX[t]}"></button>`
  ).join("");

  return `<header class="masthead">
  <nav class="sacred-nav" aria-label="Principal">
    <a class="sacred-nav__logo masthead__logo" href="${href(prefix, "")}">RADIO<span class="dim">://</span>ES</a>
    <div class="sacred-nav__children masthead__links">${links}</div>
    <div class="sacred-nav__right masthead__tools">
      <span class="tint-swatches" role="group" aria-label="Tinte de color">
        <button class="tint-swatch" type="button" data-tint="" aria-pressed="true" title="Sin tinte" aria-label="Sin tinte" style="background:var(--theme-background);box-shadow:inset 0 0 0 1px var(--theme-text)"></button>
        ${swatches}
      </span>
      <button class="toolbtn" type="button" id="themeToggle" aria-label="Cambiar tema claro u oscuro">◐<span class="visually-hidden"> cambiar tema</span></button>
    </div>
  </nav>
</header>`;
}

function railGroup(group, { prefix, path }) {
  const items = group.items
    .map((item) => {
      const current = item.path === path;
      return `<a class="rail__link" href="${href(prefix, item.path)}"${current ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`;
    })
    .join("");

  const open = group.items.some((item) => path === item.path || (item.path && path.startsWith(item.path)));
  if (group.collapsible) {
    return accordion({ title: group.label, children: items, open });
  }
  return `<div class="rail__group"><div class="rail__label">${escapeHtml(group.label)}</div>${items}</div>`;
}

/*
  El indice va dentro de un <details open>: en escritorio el resumen se oculta
  por CSS y se ve siempre; en movil app.js lo cierra al cargar para que no
  empuje al contenido. Sin JavaScript queda abierto, que es el fallo seguro.
*/
function rail({ prefix, path, nav }) {
  return `<aside class="shell__rail" aria-label="Índice del sitio">
  <details class="rail-details" id="railIndex" open>
    <summary class="rail-details__summary">Índice del sitio</summary>
    <div class="rail-sticky">${nav.map((group) => railGroup(group, { prefix, path })).join("")}</div>
  </details>
</aside>`;
}

const hasToc = (toc) => Boolean(toc && toc.length >= 3);

function tocRail(toc) {
  if (!hasToc(toc)) return '<aside class="shell__toc" aria-hidden="true"></aside>';
  const links = toc
    .filter((h) => h.level <= 3)
    .map((h) => `<a class="toc__link toc__link--${h.level}" href="#${escapeHtml(h.id)}">${escapeHtml(h.text)}</a>`)
    .join("");
  return `<aside class="shell__toc" aria-label="En esta página">
  <div class="rail-sticky"><div class="rail__label">En esta página</div>${links}</div>
</aside>`;
}

function footer({ prefix, buildDate, stats }) {
  return `<footer class="footer">
  <div class="footer__grid">
    <div>
      <div class="rail__label">Radio España</div>
      <div>Portal abierto de radioescucha y preparación HAREC.</div>
      <div>${escapeHtml(stats)}</div>
    </div>
    <div>
      <div class="rail__label">Fuentes</div>
      <div><a href="https://aip.enaire.es/" target="_blank" rel="noopener noreferrer">AIP ENAIRE</a> · <a href="https://www.ure.es/repetidores/" target="_blank" rel="noopener noreferrer">URE</a></div>
      <div><a href="https://avance.digital.gob.es/espectro/Paginas/cnaf.aspx" target="_blank" rel="noopener noreferrer">CNAF</a> · <a href="https://eaharec.com/" target="_blank" rel="noopener noreferrer">eaharec.com</a></div>
    </div>
    <div>
      <div class="rail__label">Proyecto</div>
      <div><a href="${SITE.repo}" target="_blank" rel="noopener noreferrer">Código en GitHub</a></div>
      <div><a href="${href(prefix, "acerca/")}">Acerca y licencias</a></div>
      <div>Componentes: <a href="https://github.com/internet-development/www-sacred" target="_blank" rel="noopener noreferrer">SRCL</a> (MIT)</div>
    </div>
    <div>
      <div class="rail__label">Aviso</div>
      <div>Solo escucha pasiva de frecuencias publicadas. Verifica siempre contra el AIP y el CNAF en vigor.</div>
      <div class="mono-dim">Compilado: ${escapeHtml(buildDate)}</div>
    </div>
  </div>
</footer>`;
}

/** Genera el documento completo de una pagina. */
export function renderPage({
  path = "",
  title,
  description,
  eyebrow,
  lede,
  trail = [],
  toc = [],
  body = "",
  nav = [],
  topNav = [],
  buildDate = "",
  stats = "",
  head = "",
  scripts = "",
  wide = false,
}) {
  const prefix = prefixFor(path);
  const pageTitle = title === SITE.title ? `${SITE.title} — ${SITE.name}` : `${title} — ${SITE.name}`;
  const trailHtml = trail.length
    ? breadcrumbsComponent(trail.map((t) => ({ label: t.label, href: t.path != null ? href(prefix, t.path) : null })))
    : "";

  return `<!doctype html>
<html lang="es" class="theme-dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(pageTitle)}</title>
<meta name="description" content="${escapeHtml(description || SITE.description)}" />
<meta name="color-scheme" content="dark light" />
<meta property="og:title" content="${escapeHtml(pageTitle)}" />
<meta property="og:description" content="${escapeHtml(description || SITE.description)}" />
<meta property="og:type" content="website" />
<link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="${prefix}assets/sacred.css" />
<link rel="stylesheet" href="${prefix}assets/radio.css" />
${head}
<script>${THEME_SCRIPT}</script>
</head>
<body>
<a class="skip-link" href="#contenido">Saltar al contenido</a>
${masthead({ prefix, path, topNav })}
<div class="shell${hasToc(toc) ? "" : " shell--no-toc"}">
  ${rail({ prefix, path, nav })}
  <main class="shell__main" id="contenido">
    <div class="page-head">
      ${trailHtml}
      ${eyebrow ? `<div class="page-head__eyebrow">${escapeHtml(eyebrow)}</div>` : ""}
      <h1>${escapeHtml(title)}</h1>
      ${lede ? `<p class="page-head__lede">${lede}</p>` : ""}
    </div>
    <div class="${wide ? "" : "prose"}">${body}</div>
  </main>
  ${tocRail(toc)}
</div>
${footer({ prefix, buildDate, stats })}
<script src="${prefix}assets/app.js" defer></script>
${scripts}
</body>
</html>`;
}

export { href as siteHref };
