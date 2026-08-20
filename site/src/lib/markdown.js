// markdown.js — renderizador Markdown -> HTML sin dependencias.
// Cubre lo que usa el contenido del repo: titulos, tablas (con y sin pipes
// exteriores), listas anidadas, citas, listas de definicion con sangria de 4
// espacios, bloques de codigo, reglas y formato en linea.

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ESCAPES[m]);

export const slug = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "s";

const RE_HEADING = /^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/;
const RE_FENCE = /^ {0,3}(```|~~~)(.*)$/;
const RE_HR = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/;
const RE_QUOTE = /^ {0,3}>\s?(.*)$/;
const RE_BULLET = /^(\s*)([-*+])\s+(.*)$/;
const RE_ORDERED = /^(\s*)(\d+)[.)]\s+(.*)$/;
const RE_TABLE_SEP = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/;
const RE_INDENTED = /^ {4,}\S/;

const CODE_OPEN = "\u0001";
const CODE_CLOSE = "\u0002";

const isBlank = (l) => !l || !l.trim();

const isTableAt = (lines, i) =>
  Boolean(lines[i]) && lines[i].includes("|") && Boolean(lines[i + 1]) && RE_TABLE_SEP.test(lines[i + 1]);

const isBlockStart = (lines, i) => {
  const l = lines[i];
  if (l === undefined || isBlank(l)) return true;
  return (
    RE_HEADING.test(l) ||
    RE_FENCE.test(l) ||
    RE_HR.test(l) ||
    RE_QUOTE.test(l) ||
    RE_BULLET.test(l) ||
    RE_ORDERED.test(l) ||
    isTableAt(lines, i)
  );
};

// ---------------------------------------------------------------- en linea

const splitCells = (row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

/** Resuelve "a/b" + "../c.md" sin depender de node:path. */
function resolveRelative(base, target) {
  const out = [];
  for (const part of `${base}/${target}`.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return out.join("/");
}

// Reescribe enlaces relativos entre ficheros Markdown a rutas del sitio.
function resolveHref(href, ctx) {
  const [path, hash = ""] = href.split("#");
  // Ancla dentro del mismo documento: se vuelve a generar con el mismo slug
  // que los titulos, para que casen aunque el original venga con acentos.
  if (!path) return hash ? `#${slug(hash)}` : href;
  if (/^(https?:|mailto:|tel:)/i.test(path)) return href;
  if (!ctx.linkMap) return href;
  const key = ctx.baseDir ? resolveRelative(ctx.baseDir, path) : path.replace(/^\.\//, "");
  const mapped = ctx.linkMap[key] ?? ctx.linkMap[path.replace(/^\.\//, "")];
  if (!mapped) return href;
  return `${ctx.prefix || ""}${mapped}${hash ? "#" + hash : ""}`;
}

function inline(text, ctx = {}) {
  const code = [];
  let out = escapeHtml(text);

  // El codigo en linea se aparta para que el resto de reglas no lo toquen.
  out = out.replace(/`([^`]+)`/g, (_, c) => `${CODE_OPEN}${code.push(c) - 1}${CODE_CLOSE}`);

  out = out.replace(/\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (_, label, href) => {
    const url = resolveHref(href, ctx);
    const attrs = /^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${url}"${attrs}>${label || url}</a>`;
  });

  out = out.replace(/(^|[\s(])(https?:\/\/[^\s<>()]+[^\s<>().,;:])/g, (_, pre, url) => {
    return `${pre}<a href="${url}" target="_blank" rel="noopener noreferrer">${url.replace(/^https?:\/\//, "")}</a>`;
  });

  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*\w])\*([^*\n]+)\*(?![*\w])/g, "$1<em>$2</em>");
  out = out.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  const restore = new RegExp(`${CODE_OPEN}(\\d+)${CODE_CLOSE}`, "g");
  return out.replace(restore, (_, n) => `<code>${code[Number(n)]}</code>`);
}

const paragraphize = (text, ctx) => inline(text, ctx).replace(/ {2,}\n/g, "<br />\n").replace(/\n/g, " ");

// ---------------------------------------------------------------- bloques

function uniqueSlug(base, headings) {
  let id = base;
  let n = 2;
  while (headings.used.has(id)) id = `${base}-${n++}`;
  headings.used.add(id);
  return id;
}

function parseList(lines, start, ctx, headings) {
  const first = lines[start].match(RE_BULLET) || lines[start].match(RE_ORDERED);
  const baseIndent = first[1].length;
  const ordered = !RE_BULLET.test(lines[start]);
  const items = [];
  let i = start;

  while (i < lines.length) {
    if (isBlank(lines[i])) {
      const next = lines[i + 1];
      if (next === undefined || !(RE_BULLET.test(next) || RE_ORDERED.test(next))) break;
      i++;
      continue;
    }
    const m = lines[i].match(RE_BULLET) || lines[i].match(RE_ORDERED);
    if (!m) break;
    const indent = m[1].length;
    if (indent < baseIndent) break;

    if (indent > baseIndent) {
      const [html, next] = parseList(lines, i, ctx, headings);
      if (items.length) items[items.length - 1] += html;
      else items.push(html);
      i = next;
      continue;
    }

    const content = [m[3]];
    i++;
    while (i < lines.length && !isBlank(lines[i])) {
      if (RE_BULLET.test(lines[i]) || RE_ORDERED.test(lines[i])) break;
      if (isTableAt(lines, i) || RE_HEADING.test(lines[i]) || RE_FENCE.test(lines[i])) break;
      content.push(lines[i].trim());
      i++;
    }
    items.push(`<li>${paragraphize(content.join("\n"), ctx)}`);
  }

  const tag = ordered ? "ol" : "ul";
  const body = items.map((it) => (it.startsWith("<li>") ? `${it}</li>` : it)).join("");
  return [`<${tag} class="list">${body}</${tag}>`, i];
}

function parseDefinitionList(lines, start, ctx) {
  const items = [];
  let i = start;

  while (i < lines.length && !isBlank(lines[i]) && lines[i + 1] !== undefined && RE_INDENTED.test(lines[i + 1])) {
    const term = lines[i].trim();
    i++;
    const body = [];
    while (i < lines.length && !isBlank(lines[i])) {
      const startsNewTerm =
        !RE_INDENTED.test(lines[i]) && lines[i + 1] !== undefined && RE_INDENTED.test(lines[i + 1]);
      if (startsNewTerm) break;
      body.push(lines[i].replace(/^ {4}/, ""));
      i++;
    }
    items.push(`<dt>${inline(term, ctx)}</dt><dd>${paragraphize(body.join("\n"), ctx)}</dd>`);

    // Un solo salto en blanco encadena el siguiente termino de la misma lista.
    if (isBlank(lines[i]) && lines[i + 1] !== undefined && lines[i + 2] !== undefined && RE_INDENTED.test(lines[i + 2])) {
      i++;
    }
  }

  return [`<dl class="deflist">${items.join("")}</dl>`, i];
}

function parseBlocks(lines, ctx, headings) {
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line)) {
      i++;
      continue;
    }

    const fence = line.match(RE_FENCE);
    if (fence) {
      const marker = fence[1];
      const lang = fence[2].trim();
      const body = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(marker)) body.push(lines[i++]);
      i++;
      const cls = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      out.push(`<pre class="code-block"><code${cls}>${escapeHtml(body.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(RE_HEADING);
    if (heading) {
      const level = heading[1].length;
      const id = uniqueSlug(slug(heading[2]), headings);
      if (level <= 3) headings.toc.push({ level, text: heading[2], id });
      out.push(`<h${level} id="${id}" class="md-h${level}">${inline(heading[2], ctx)}</h${level}>`);
      i++;
      continue;
    }

    if (RE_HR.test(line) && !line.includes("|")) {
      out.push('<div class="rule" role="separator"><span></span></div>');
      i++;
      continue;
    }

    if (RE_QUOTE.test(line)) {
      const body = [];
      while (i < lines.length && RE_QUOTE.test(lines[i])) {
        body.push(lines[i].match(RE_QUOTE)[1]);
        i++;
      }
      out.push(`<blockquote class="quote">${parseBlocks(body, ctx, headings)}</blockquote>`);
      continue;
    }

    if (isTableAt(lines, i)) {
      const header = splitCells(lines[i]);
      const aligns = splitCells(lines[i + 1]).map((c) => {
        const left = c.startsWith(":");
        const right = c.endsWith(":");
        if (left && right) return "center";
        return right ? "right" : "";
      });
      i += 2;
      const rows = [];
      while (i < lines.length && !isBlank(lines[i]) && lines[i].includes("|")) rows.push(splitCells(lines[i++]));

      const cell = (tag, value, n) => {
        const cls = aligns[n] ? ` class="align-${aligns[n]}"` : "";
        return `<${tag}${cls}>${inline(value ?? "", ctx)}</${tag}>`;
      };
      const head = `<thead><tr>${header.map((c, n) => cell("th", c, n)).join("")}</tr></thead>`;
      const body = rows.length
        ? `<tbody>${rows.map((r) => `<tr>${header.map((_, n) => cell("td", r[n], n)).join("")}</tr>`).join("")}</tbody>`
        : "";
      out.push(`<div class="table-scroll"><table class="table">${head}${body}</table></div>`);
      continue;
    }

    if (RE_BULLET.test(line) || RE_ORDERED.test(line)) {
      const [html, next] = parseList(lines, i, ctx, headings);
      out.push(html);
      i = next;
      continue;
    }

    if (lines[i + 1] !== undefined && RE_INDENTED.test(lines[i + 1])) {
      const [html, next] = parseDefinitionList(lines, i, ctx);
      out.push(html);
      i = next;
      continue;
    }

    const para = [];
    while (i < lines.length && !isBlank(lines[i])) {
      if (para.length && isBlockStart(lines, i)) break;
      if (para.length && lines[i + 1] !== undefined && RE_INDENTED.test(lines[i + 1])) break;
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${paragraphize(para.join("\n"), ctx)}</p>`);
  }

  return out.join("\n");
}

// ---------------------------------------------------------------- publico

export function renderMarkdown(source, options = {}) {
  const lines = String(source ?? "").replace(/\r\n?/g, "\n").split("\n");
  const headings = { toc: [], used: new Set() };
  const ctx = { linkMap: options.linkMap, prefix: options.prefix, baseDir: options.baseDir };

  let title = null;
  let rest = lines;

  // El primer H1 se saca del cuerpo: la cabecera de la pagina ya lo pinta.
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(RE_HEADING);
    if (m && m[1].length === 1) {
      title = m[2];
      rest = [...lines.slice(0, i), ...lines.slice(i + 1)];
      break;
    }
  }

  return { html: parseBlocks(rest, ctx, headings), title, toc: headings.toc };
}

export default renderMarkdown;
