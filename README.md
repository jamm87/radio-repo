# Radio España

Portal abierto sobre radio en España. Reúne en un único sitio web todo lo que
antes estaba repartido entre este repositorio, un espacio de trabajo de Notion y
varias hojas de cálculo:

| Sección | Qué contiene |
|---|---|
| **Frecuencias** | Buscador de 964 frecuencias publicables con filtros, mapa y exportación a CHIRP |
| **Repetidores y balizas** | Listado nacional de la URE (285 entradas) con canal, subtono y posición |
| **Curso HAREC** | Los 19 temas del temario oficial del examen de radioaficionado |
| **Plan de bandas** | Referencia CNAF / IARU Región 1, rápida y extendida |
| **Guías** | Propagación, cadena SDR con portátil, y escucha digital DMR/TETRA |
| **Referencia** | Código Q, enlaces de interés y marco legal de la escucha |

La web se genera como sitio estático con un script de Node **sin dependencias
externas** y se despliega en GitHub Pages.

## Estructura del repositorio

```
radio-repo/
├── content/               # Contenido en Markdown (fuente del sitio)
│   ├── curso/             #   Temario HAREC, 19 temas en dos partes
│   ├── guias/             #   Guías de escucha
│   ├── referencia/        #   Diccionario de siglas y código Q
│   └── enlaces.md         #   Directorio de fuentes y comunidades
├── data/                  # Conjuntos de datos JSON (fuente de verdad)
├── docs/                  # Documentos de referencia (plan de bandas, xlsx)
├── site/                  # Generador y componentes del sitio web
│   ├── src/styles/        #   sacred.css (SRCL portado) + radio.css
│   ├── src/lib/           #   Markdown, componentes, layout y datos
│   ├── src/pages/         #   Constructores de página
│   ├── src/client/        #   Tema, tinte y explorador de datos
│   └── scripts/build.js   #   Genera site/dist/
├── tools/                 # Utilidades Python de extracción
├── .github/workflows/     # Despliegue en Pages y sync desde Notion
├── LICENSE                # MIT + atribuciones
└── CHANGELOG.md
```

## Desarrollo local

```bash
cd site
npm run build     # genera site/dist/ (34 páginas)
npm run dev       # build + servidor en http://localhost:4173
```

Requiere Node 18+ y nada más: ni `npm install`, ni framework, ni bundler.

## Sistema de componentes

La interfaz usa **[SRCL / www-sacred](https://github.com/internet-development/www-sacred)**
(MIT) como sistema de diseño, portado a CSS plano en
[`site/src/styles/sacred.css`](site/src/styles/sacred.css): se conservan sus
tokens de color de la paleta ANSI, la rejilla horizontal en `ch`, la altura de
línea uniforme y el marcado de cada componente (card, badge, action button,
navigation, breadcrumbs, tree view, accordion, tabla, formularios). Los temas
claro y oscuro y los tintes OKLCH son los del sistema original.

## Política de publicación

Solo se publica **escucha pasiva** de frecuencias de bandas de uso común o
publicadas en fuentes oficiales (AIP de ENAIRE, CNAF, plan de bandas IARU/URE,
listados de la URE). Las entradas marcadas como no publicables en los datos de
origen, y cualquier entrada de categorías de seguridad y defensa, quedan fuera
del sitio aunque estén en los ficheros del repositorio. El build aplica ese
filtro antes de escribir nada.

## Licencia

MIT. Ver [LICENSE](LICENSE) para las atribuciones de contenido de terceros:
el curso procede de [eaharec.com](https://eaharec.com) (MIT), el sistema de
componentes de [SRCL](https://github.com/internet-development/www-sacred) (MIT)
y los datos de las fuentes públicas citadas en cada conjunto.
