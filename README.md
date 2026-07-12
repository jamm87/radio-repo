# Radio España

Portal abierto sobre radio en España, con dos áreas que se apoyan entre sí:

- **📚 Aprender — Curso HAREC** ([content/curso/](content/curso/README.md))
  Temario completo para la preparación del examen de radioaficionado (certificado
  HAREC, CEPT T/R 61-02). Adaptado del proyecto [eaharec.com](https://github.com/t00mas/eaharec) (MIT).

- **📡 Operar / Escuchar — RADIO://es** ([site/](site/README.md))
  Referencia de radioescucha: frecuencias, repetidores y balizas, plan de bandas,
  mapa y generador de memorias CHIRP. Web estática desplegable en GitHub Pages.

## Estructura del repositorio

```
radio-repo/
├── content/curso/     # Temario HAREC en Markdown (19 temas)
├── data/              # Fuente de verdad de datos (frecuencias, repetidores)
├── site/              # Sitio web único (build → GitHub Pages)
├── tools/             # Utilidades Python (parseo URE, generación Excel)
├── docs/              # Material de referencia (xlsx, csv, plan de bandas)
├── .github/workflows/ # Despliegue en Pages y sync desde Notion
├── LICENSE            # MIT + atribuciones
└── CHANGELOG.md
```

## Desarrollo local

```bash
cd site
npm run build     # genera site/dist/ (lee data/frequencies.json de la raíz)
npm run dev       # build + servidor en http://localhost:4173
```

No requiere dependencias externas (Node 18+ nativo).

## Licencia

MIT. Ver [LICENSE](LICENSE) para las atribuciones de contenido de terceros
(el curso procede de eaharec.com; los datos, de fuentes públicas citadas).
