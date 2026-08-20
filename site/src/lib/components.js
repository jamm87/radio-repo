// components.js — los componentes de SRCL (www-sacred) como funciones que
// devuelven HTML. Misma estructura de nodos y mismas clases que sacred.css,
// para que el sitio estatico use el sistema sin arrastrar React.

import { escapeHtml } from "./markdown.js";

const attr = (name, value) => (value == null || value === false ? "" : ` ${name}="${escapeHtml(value)}"`);
const cls = (...names) => names.filter(Boolean).join(" ");

export const raw = (s) => String(s ?? "");

/** Card: el titulo va incrustado en la regla superior del marco. */
export function card({ title, children, mode = "center", double = false, id } = {}) {
  const corner = mode === "left" ? "left" : mode === "right" ? "right" : null;
  const left = `<div class="${cls("sacred-card__left", corner === "left" && "sacred-card__left--corner")}" aria-hidden="true"></div>`;
  const right = `<div class="${cls("sacred-card__right", corner === "right" && "sacred-card__right--corner")}" aria-hidden="true"></div>`;
  const heading = title ? `<h2 class="sacred-card__title">${escapeHtml(title)}</h2>` : "";
  return `<article class="${cls("sacred-card", double && "sacred-card--double")}"${attr("id", id)}>
  <header class="sacred-card__header">${left}${heading}${right}</header>
  <section class="sacred-card__body">${raw(children)}</section>
</article>`;
}

export const badge = (text) => `<span class="sacred-badge">${escapeHtml(text)}</span>`;

export function button({ label, href, theme = "PRIMARY", id, type = "button", disabled = false } = {}) {
  const variant = disabled ? "disabled" : theme === "SECONDARY" ? "secondary" : "primary";
  const classes = cls("sacred-button", `sacred-button--${variant}`);
  if (href && !disabled) return `<a class="${classes}"${attr("href", href)}${attr("id", id)}>${escapeHtml(label)}</a>`;
  if (disabled) return `<div class="${classes}">${escapeHtml(label)}</div>`;
  return `<button class="${classes}"${attr("id", id)} type="${escapeHtml(type)}">${escapeHtml(label)}</button>`;
}

export function actionButton({ hotkey, label, href, id, selected = false, dataset = {} } = {}) {
  const data = Object.entries(dataset).map(([k, v]) => attr(`data-${k}`, v)).join("");
  const classes = cls("sacred-action-button", selected && "sacred-action-button--selected");
  const inner = `${hotkey ? `<span class="sacred-action-button__hotkey">${escapeHtml(hotkey)}</span>` : ""}<span class="sacred-action-button__content">${escapeHtml(label)}</span>`;
  if (href) return `<a class="${classes}"${attr("href", href)}${attr("id", id)}${data}>${inner}</a>`;
  return `<button class="${classes}" type="button"${attr("id", id)}${data}>${inner}</button>`;
}

export function actionListItem({ icon = "→", children, href, target } = {}) {
  const external = target === "_blank" ? ' target="_blank" rel="noopener noreferrer"' : "";
  const inner = `<figure class="sacred-action-item__icon" aria-hidden="true">${escapeHtml(icon)}</figure><span class="sacred-action-item__text">${raw(children)}</span>`;
  return href
    ? `<a class="sacred-action-item"${attr("href", href)}${external}>${inner}</a>`
    : `<div class="sacred-action-item">${inner}</div>`;
}

export function divider({ type } = {}) {
  if (type === "GRADIENT") return '<div class="sacred-divider--gradient" role="separator"></div>';
  if (type === "DOUBLE") {
    return '<div class="sacred-divider sacred-divider--double" role="separator"><span class="sacred-divider__line"></span><span class="sacred-divider__line"></span></div>';
  }
  return '<div class="sacred-divider" role="separator"><span class="sacred-divider__line"></span></div>';
}

export const alertBanner = (children) => `<aside class="sacred-alert">${raw(children)}</aside>`;

export const message = (children) =>
  `<div class="sacred-message"><div class="sacred-message__left"><span class="sacred-message__triangle" aria-hidden="true"></span></div><div class="sacred-message__right"><div class="sacred-message__bubble">${raw(children)}</div></div></div>`;

export function accordion({ title, children, open = false, className } = {}) {
  return `<details class="${cls("sacred-accordion", className)}"${open ? " open" : ""}>
  <summary class="sacred-accordion__summary"><span class="sacred-accordion__icon" aria-hidden="true"></span><span class="sacred-accordion__title">${escapeHtml(title)}</span></summary>
  <div class="sacred-accordion__content">${raw(children)}</div>
</details>`;
}

export function breadcrumbs(items = []) {
  const parts = items.map((item, i) => {
    const last = i === items.length - 1;
    const label = escapeHtml(item.label);
    const node = last || !item.href
      ? `<span class="sacred-breadcrumbs__link" aria-current="page">${label}</span>`
      : `<a class="sacred-breadcrumbs__link" href="${escapeHtml(item.href)}">${label}</a>`;
    return `${node}${last ? "" : '<span class="sacred-breadcrumbs__symbol" aria-hidden="true">/</span>'}`;
  });
  return `<nav class="sacred-breadcrumbs" aria-label="Ruta">${parts.join("")}</nav>`;
}

/** SimpleTable: cabecera + filas ya formateadas como texto. */
export function simpleTable({ head = [], rows = [], align = [] } = {}) {
  const cell = (tag, value, i) => {
    const cellClass = align[i] === "right" ? ' class="align-right"' : align[i] === "center" ? ' class="align-center"' : "";
    return `<${tag}${cellClass}>${raw(value ?? "")}</${tag}>`;
  };
  const thead = head.length ? `<thead><tr>${head.map((h, i) => cell("th", escapeHtml(h), i)).join("")}</tr></thead>` : "";
  const tbody = `<tbody>${rows.map((r) => `<tr>${r.map((c, i) => cell("td", c, i)).join("")}</tr>`).join("")}</tbody>`;
  return `<div class="sacred-table-scroll"><table class="sacred-table">${thead}${tbody}</table></div>`;
}

/** TreeView: prefijos de caja dibujados con caracteres, como en SRCL. */
export function treeView(nodes = [], { prefix = "", href: _h } = {}) {
  const rows = [];
  const walk = (list, parentLines) => {
    list.forEach((node, i) => {
      const isLast = i === list.length - 1;
      const spacing = parentLines.map((line) => (line ? "│ . " : ". . ")).join("");
      const branch = isLast ? "└───" : "├───";
      const icon = node.children && node.children.length ? "╦ " : " ";
      const label = `${spacing}${branch}${icon}${node.title}`;
      const current = node.current ? " sacred-tree__item--current" : "";
      rows.push(
        node.href
          ? `<a class="sacred-tree__item${current}" href="${escapeHtml(node.href)}">${escapeHtml(label)}</a>`
          : `<div class="sacred-tree__item${current}">${escapeHtml(label)}</div>`
      );
      if (node.children && node.children.length) walk(node.children, [...parentLines, !isLast]);
    });
  };
  walk(nodes, []);
  return `<div class="sacred-tree">${prefix}${rows.join("")}</div>`;
}

export const block = () => '<span class="sacred-block" aria-hidden="true"></span>';
export const row = (children) => `<div class="sacred-row">${raw(children)}</div>`;
export const rowBetween = (children) => `<div class="sacred-row-between">${raw(children)}</div>`;
export const actionBar = (children) => `<div class="sacred-action-bar">${raw(children)}</div>`;

export function barProgress({ value = 0, max = 100, label } = {}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return `<div class="sacred-bar-progress" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}"${attr("aria-label", label)}><span class="sacred-bar-progress__fill" style="width:${pct.toFixed(1)}%"></span></div>`;
}

export { escapeHtml };
