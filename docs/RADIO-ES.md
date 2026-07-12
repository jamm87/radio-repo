# RADIO://es

Proyecto de referencia de **radioescucha en España**: frecuencias de banda aérea, radioafición, PMR446, marítimo y utilidad; repositorio de SDR; generador de memorias CHIRP; y documentación del plan de bandas y los repetidores nacionales.

El contenido se edita en una base de datos de **Notion** (que actúa como CRM) y se publica como sitio estático en **GitHub Pages**.

---

## Estructura del repositorio

```
radio-es/
├── web/                         # Sitio web desplegable (GitHub Pages)
│   ├── src/template.html        # Plantilla; el build inyecta los datos
│   ├── data/frequencies.json    # Datos que alimentan la web
│   ├── scripts/                 # build.js, sync-notion.js, serve.js
│   ├── .github/workflows/       # Despliegue y sync automáticos
│   └── package.json
│
├── data/                        # Conjuntos de datos completos
│   ├── frecuencias_consolidado.json    # 1.690 frecuencias, todas las fuentes
│   └── repetidores_balizas_ure.json    # 285 repetidores y balizas de la URE
│
├── docs/                        # Documentos de referencia
│   ├── frecuencias_radio_es.xlsx       # Hoja de cálculo maestra
│   └── plan_bandas_radioaficionado_ES.md   # Plan de bandas (CNAF/IARU)
│
└── scripts/                     # Utilidades de extracción/generación
    ├── parse_ure.py             # Parser de PDFs de repetidores URE
    └── gen_excel.py             # Generador del Excel maestro
```

---

## Componentes

### 1. Web (`web/`)

Sitio estático en HTML/CSS/JS puro, sin framework. Incluye buscador, filtros (categoría, banda, zona, modo, estado), mapa Leaflet opcional y **generador de memorias CHIRP** (con presets de banda aérea, radioafición, PMR446 y marítimo). Estética monospace tipo pantalla de escáner.

```bash
cd web
npm run build     # genera web/dist/
npm run dev       # build + servidor en http://localhost:4173
```

No requiere dependencias externas (Node 18+ nativo). Para desplegar: subir a un repo, activar **Settings → Pages → Source: GitHub Actions**. Cada push a `main` reconstruye y publica.

Ver `web/README.md` para el detalle de despliegue y sincronización con Notion.

### 2. Datos (`data/`)

- **`frecuencias_consolidado.json`** — Todas las frecuencias recopiladas de las cuatro fuentes documentales (escáner Madrid, plan de bandas LaRadioCB, listado general, y el dataset curado del proyecto), cada una con su clasificación de **publicabilidad** (SI / DUDOSO / NO) y motivo.
- **`repetidores_balizas_ure.json`** — Listado nacional de la URE: 285 repetidores y balizas (28/50/144/432/1200 MHz + ATV) con callsign, frecuencia, shift, modo, canal, subtono CTCSS, locator, altitud y titular.

### 3. Documentos (`docs/`)

- **`frecuencias_radio_es.xlsx`** — Hoja de cálculo maestra con tres pestañas:
  - *Frecuencias*: 1.690 entradas, filtrables, con columna **Publicable** codificada por color.
  - *Repetidores y balizas*: los 285 de la URE con todos sus campos técnicos.
  - *Resumen*: totales por publicabilidad, fuente y categoría, más la nota metodológica.
- **`plan_bandas_radioaficionado_ES.md`** — Plan de bandas de radioaficionado (CNAF/IARU), con una parte de referencia rápida (tablas) y otra extendida (atribución, potencias, notas del Reglamento y CNAF, banda por banda).

### 4. Scripts (`scripts/`)

Utilidades de reproducibilidad para regenerar los datos a partir de las fuentes originales:
- **`parse_ure.py`** — extrae repetidores y balizas de los PDF/HTML de la URE.
- **`gen_excel.py`** — construye el Excel maestro a partir de los JSON consolidados.

---

## Criterio de publicabilidad

La columna **Publicable** protege frente a problemas legales al difundir listados:

- **SÍ** — Frecuencias publicadas oficialmente (AIP de ENAIRE) o de bandas de uso común (radioafición, CB, PMR446, LPD433, marítimo). Publicables sin reparos.
- **DUDOSO** — Emergencias sanitarias, protección civil, transporte, utilities y "uso desconocido". Revisar caso a caso antes de publicar.
- **NO** — Fuerzas de seguridad, defensa, seguridad privada, redes cifradas (TETRA/SIRDEE) e infraestructura crítica. **No publicar.**

El CNAF advierte de no monitorizar comunicaciones de seguridad sin autorización; su contenido no debe divulgarse. Las frecuencias aeronáuticas cambian con los ciclos AIRAC: verificar contra el AIP vigente antes de darlas por fiables.

---

## Fuentes

AIP de ENAIRE · CNAF (Cuadro Nacional de Atribución de Frecuencias) · URE (repetidores y plan de bandas) · escanerfrecuencias.es · sdr-es.com · LaRadioCB.

## Licencia

Código MIT. Los datos de frecuencias proceden de fuentes públicas citadas; verificar siempre contra el AIP/CNAF vigente.
