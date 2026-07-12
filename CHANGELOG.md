# Registro de cambios

## v2.2 — Portal Radio España + tema claro/oscuro

- Reestructurado como monorepo del portal **Radio España**: `content/curso/` (temario HAREC adaptado de eaharec.com, MIT), `data/` (fuente de verdad), `site/` (web), `tools/` y `docs/`; workflows movidos a la raíz para que GitHub Actions los ejecute.
- Rediseño del sitio: sistema de **tokens de tema con modo claro y oscuro** (sigue `prefers-color-scheme`, conmutador `◐` persistente en localStorage, sin parpadeo al cargar), sombras y paleta tipo editor de código en claro, tiles del mapa acordes al tema, enlace al curso HAREC en la navegación.
- Licencia unificada: MIT con atribuciones (curso de eaharec.com; datos de fuentes públicas).

## v2.1 — Consolidación documental

- Añadido el **plan de bandas de radioaficionado** (CNAF/IARU) como documento Markdown, con sección de referencia rápida y sección extendida (atribución, potencias, notas del Reglamento y CNAF por banda).
- Incorporado el **listado nacional de repetidores y balizas de la URE** (285 entradas: 28/50/144/432/1200 MHz + ATV) al Excel maestro y como JSON independiente.
- Excel maestro ampliado a **1.690 frecuencias** con columna de publicabilidad (SI / DUDOSO / NO) y hoja de resumen.

## v2.0 — Web pública + generador CHIRP

- Rebranding a referencia pública (RADIO://es), sin datos personales.
- Generador de memorias **CHIRP** con presets (banda aérea, radioafición, PMR446 ×16, marítimo).
- Guía de inicio, marco legal y estética monospace tipo escáner.
- Mapa Leaflet opcional sobre entradas con coordenadas.
- Empaquetado como sitio estático desplegable en GitHub Pages, con sync opcional desde Notion.

## v1.0 — Prototipo

- Web conectada a base de datos Notion como CRM.
- Frecuencias de banda aérea (Madrid), radioafición, PMR446 y SDR.
- Dial de bandas interactivo, filtros y alta de entradas.
