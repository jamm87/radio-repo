# Sitio web — Radio España

Generador del sitio estático que publica todo el contenido del repositorio:
frecuencias, repetidores, curso HAREC, plan de bandas, guías y referencia.

Sin framework, sin bundler y sin dependencias: HTML, CSS y JS generados por un
script de Node 18+.

## Uso

```bash
npm run build     # genera dist/
npm run dev       # build + servidor en http://localhost:4173
npm run serve     # solo servidor (sobre el dist ya generado)
npm run sync      # actualiza ../data/frequencies.json desde Notion
```

> El explorador de frecuencias y el de repetidores cargan sus datos por `fetch`,
> así que hay que **servir** `dist/` (con `npm run dev`), no abrir el HTML
> directamente desde el disco.

## Estructura

```
site/
├── src/
│   ├── styles/
│   │   ├── sacred.css     # SRCL (www-sacred) portado a CSS plano
│   │   └── radio.css      # Capa del proyecto: layout y piezas propias
│   ├── lib/
│   │   ├── markdown.js    # Markdown -> HTML, sin dependencias
│   │   ├── components.js  # Componentes SRCL como funciones que devuelven HTML
│   │   ├── layout.js      # Armazón de página: nav, índice, TOC, pie
│   │   └── data.js        # Normaliza los JSON de ../data y aplica la política
│   ├── pages/paginas.js   # Constructores del cuerpo de cada página
│   └── client/
│       ├── app.js         # Tema claro/oscuro, tintes, índice plegable
│       └── explorador.js  # Filtros, orden, selección, mapa y export CHIRP
├── scripts/
│   ├── build.js           # Orquesta todo y escribe dist/
│   └── serve.js           # Servidor local con índices de directorio
└── public/                # favicon, CNAME opcional
```

## Qué genera

`dist/` con 34 páginas de URL limpia (`/curso/parte1/tema1/`), los estilos y el
cliente en `dist/assets/`, los datos en `dist/data/*.json`, más `404.html`,
`sitemap.xml`, `robots.txt` y `.nojekyll`.

La URL base del sitemap se puede fijar al compilar:

```bash
SITE_URL=https://ejemplo.org node scripts/build.js
```

## Cómo se añade contenido

1. **Una página nueva de texto:** crea el Markdown en `content/` y añádelo a la
   lista correspondiente (`GUIAS` o `REFERENCIA`) en `scripts/build.js`. El
   índice lateral, las migas, el índice de la sección y el mapa de enlaces se
   generan solos.
2. **Un tema nuevo del curso:** basta con crear
   `content/curso/parteN/temaM.md`; el build descubre los ficheros, ordena por
   número y encadena la navegación anterior/siguiente.
3. **Enlaces entre documentos:** escríbelos como rutas relativas a ficheros
   `.md`; el build las reescribe a las URLs del sitio.

## Sistema de componentes

`src/styles/sacred.css` es un port a CSS plano de
[SRCL / www-sacred](https://github.com/internet-development/www-sacred) (MIT).
Al tocarlo conviene respetar dos reglas del sistema original:

- La rejilla horizontal se mide en `ch` y la vertical en múltiplos de
  `calc(var(--theme-line-height-base) * 1rem)`. Nunca en píxeles sueltos.
- Los colores salen de la paleta ANSI (`--ansi-*`) y se consumen siempre a
  través de los tokens `--theme-*`.

A diferencia del original, que pone las clases de tema en `<body>`, aquí van en
`<html>` para poder aplicarlas antes del primer pintado y evitar el parpadeo.

## Tema y tinte

El tema se resuelve en el `<head>`: la elección guardada en `localStorage`
(`radio-theme`) o, si no hay ninguna, `prefers-color-scheme`, que además se
sigue en vivo. El conmutador `◐` de la cabecera lo cambia y lo persiste. Los
siete tintes OKLCH del sistema se eligen con las muestras de color y se guardan
en `radio-tint`.

## Datos

`src/lib/data.js` lee `../data/frequencies.json` (curadas) y
`../data/frecuencias.json` (ampliadas), descarta lo no publicable y las
categorías de seguridad y defensa, unifica categorías, deduce la banda a partir
de la frecuencia y deduplica. De `../data/repetidores_balizas_ure.json` convierte
además el locator Maidenhead a coordenadas para el mapa.

## Desplegar en GitHub Pages

1. **Settings → Pages**, elige **Source: GitHub Actions**.
2. Cada push a `main` reconstruye y publica con `.github/workflows/deploy.yml`.

Para dominio propio, crea `public/CNAME` con tu dominio.

## Sincronizar desde Notion

```bash
NOTION_TOKEN=secret_xxx node scripts/sync-notion.js
npm run build
```

Necesitas una integración interna de Notion con acceso a la base de datos
«radio». El data source id viene por defecto; se cambia con
`NOTION_DATA_SOURCE_ID`.

## Licencia

MIT para el código. Los datos proceden de fuentes públicas citadas; verifica
siempre contra el AIP y el CNAF en vigor.
