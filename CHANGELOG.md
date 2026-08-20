# Registro de cambios

## v3.0 — Web única con todo el proyecto

- **Todo el contenido en una sola web de 34 páginas**: frecuencias, repetidores, curso HAREC (19 temas), plan de bandas, guías de escucha, código Q, enlaces y marco legal, con índice lateral común, migas de pan, índice de página y navegación entre temas.
- **Contenido de Notion consolidado en el repositorio**: las páginas de propagación, escucha digital con SDR, DMR/TETRA, diccionario de siglas y enlaces de interés pasan a `content/guias/`, `content/referencia/` y `content/enlaces.md`, y son la fuente del sitio.
- **Sistema de componentes SRCL** ([www-sacred](https://github.com/internet-development/www-sacred), MIT) portado a CSS plano en `site/src/styles/sacred.css`: tokens de la paleta ANSI, rejilla en `ch`, temas claro y oscuro y los siete tintes OKLCH del original.
- **Generador propio sin dependencias**: renderizador Markdown (tablas, listas de definición, citas, código), constructores de página, mapa de enlaces entre documentos y servidor local con índices de directorio.
- **Explorador de datos unificado** para frecuencias y repetidores: búsqueda, filtros por facetas, orden por columna, selección, estado reflejado en la URL, mapa bajo demanda y exportación a CHIRP. En repetidores, el CSV sale con duplex, desplazamiento y subtono CTCSS.
- **Datos normalizados en el build**: 964 frecuencias únicas tras deduplicar, con categorías y zonas unificadas y banda deducida de la frecuencia; los 285 repetidores de la URE con el locator Maidenhead convertido a coordenadas.
- La política de publicación se aplica en el build: fuera lo no publicable y fuera las categorías de seguridad y defensa.

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
