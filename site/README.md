# RADIO://es

Referencia abierta de radioescucha en España: frecuencias de **banda aérea, radioafición, PMR446, marítimo y utilidad**, repositorio de **SDR**, **mapa** y **generador de memorias para CHIRP**.

Los datos se editan en una base de datos de **Notion** que actúa como CRM y se compilan a un sitio estático desplegable en **GitHub Pages**. Sin framework ni build pesado: HTML/CSS/JS puro con un pequeño script de Node.

## Qué incluye y qué no

Incluye solo **escucha pasiva** de frecuencias publicadas en fuentes oficiales o de bandas de uso común (AIP de ENAIRE, plan de bandas de radioaficionado, CNAF, PMR446/LPD433, marítimo VHF/AIS). **No** incluye canales tácticos de fuerzas de seguridad ni redes reservadas — el script de sync además los descarta por lista negra aunque aparecieran en Notion.

Las frecuencias marcadas `AIP✓` están contrastadas con el AIP en vigor; el resto proceden de fuentes comunitarias y deben verificarse.

## Estructura

```
radio-es/
├── data/frequencies.json      # los datos (fuente de verdad del sitio)
├── src/template.html          # plantilla; el build inyecta el JSON
├── scripts/
│   ├── build.js               # genera dist/index.html
│   ├── sync-notion.js         # actualiza el JSON desde Notion
│   └── serve.js               # servidor local de previsualización
├── .github/workflows/
│   ├── deploy.yml             # despliegue automático en GitHub Pages
│   └── sync-notion.yml        # sync opcional desde Notion
└── package.json
```

## Uso local

```bash
npm run build     # genera dist/
npm run dev       # build + servidor en http://localhost:4173
```

No hace falta instalar dependencias: todo usa Node 18+ nativo.

## Desplegar en GitHub Pages

1. Crea un repositorio y sube esta carpeta (`git init && git add . && git commit && git push`).
2. En **Settings → Pages**, elige **Source: GitHub Actions**.
3. Cada push a `main` reconstruye y publica el sitio con el workflow `deploy.yml`.

Para dominio propio, crea `public/CNAME` con tu dominio.

## Sincronizar desde Notion

El sitio funciona con el snapshot de `data/frequencies.json` sin tocar Notion. Para traer cambios hechos en Notion:

```bash
NOTION_TOKEN=secret_xxx node scripts/sync-notion.js
npm run build
```

Necesitas una **integración interna de Notion** con acceso a la base de datos "radio". El data source id ya viene por defecto; se puede cambiar con `NOTION_DATA_SOURCE_ID`. Para automatizarlo, añade `NOTION_TOKEN` como secret del repositorio y usa el workflow `sync-notion.yml`.

## Generador CHIRP

Selecciona frecuencias (o un preset: banda aérea, radioafición, PMR446 ×16, marítimo) y descarga un CSV en el formato genérico de CHIRP: nombre normalizado, modo, paso automático (AM 25 kHz / NFM 12.5 kHz) y notas en el comentario. En CHIRP: **Archivo → Importar**.

## Mapa

El botón *mapa* carga Leaflet bajo demanda y sitúa sobre un mapa oscuro las entradas con coordenadas (aeropuertos, repetidores, radiofaros). Respeta los filtros activos. Las coordenadas son aproximadas y solo sirven para situar la estación.

## Licencia

MIT para el código. Los datos de frecuencias proceden de fuentes públicas citadas; verifica siempre contra el AIP/CNAF en vigor.
