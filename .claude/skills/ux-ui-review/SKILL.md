---
name: ux-ui-review
description: Auditoría y diseño de interfaces web con criterios de UX/UI contrastados (heurísticas de Nielsen, WCAG 2.2 AA, patrones de datos densos, rendimiento percibido). Úsalo siempre que se hable de usabilidad, experiencia de usuario, accesibilidad, rediseño, "análisis de usabilidad", "mejorar la interfaz", "esto se usa mal", jerarquía visual, formularios, tablas de datos, navegación, estados vacíos o de carga, contraste, foco de teclado, o cuando alguien pida una v2/rediseño de una pantalla o sitio — aunque no diga las palabras "UX" ni "UI". También aplica al revisar HTML/CSS propio buscando problemas de uso, no solo de código.
---

# Revisión UX/UI

El objetivo no es producir una lista de buenas intenciones, sino **encontrar problemas que le cuestan algo a alguien** y proponer arreglos concretos, ordenados por lo que más duele. Una auditoría que dice "mejorar la jerarquía visual" no sirve; una que dice "el contador de resultados queda fuera de pantalla al filtrar, así que el usuario no ve que su filtro funcionó" sí.

## Cómo trabajar

### 1. Usa el producto antes de opinar

No audites leyendo código. Abre las pantallas y recorre las tareas reales. Si hay navegador disponible (Playwright/Chromium suele estarlo), haz capturas a **360px, 768px y 1280px** como mínimo, y en tema claro y oscuro si el sitio los tiene. Muchos problemas solo existen en un ancho o un tema concreto.

Recorre **tareas**, no páginas: "encontrar la frecuencia del repetidor más cercano y exportarla", no "ver la página de repetidores". Los problemas aparecen en las costuras entre pasos.

Anota fricciones según las encuentres, con el contexto de qué intentabas hacer. Ese contexto es lo que convierte una observación en un hallazgo defendible.

### 2. Pasa los filtros

Cinco pasadas, cada una con una lente distinta. Son deliberadamente distintas porque cada una encuentra cosas que las otras no ven:

**Heurísticas** — Las 10 de Nielsen siguen siendo el mejor rastrillo general. Detalle en `references/heuristicas.md`. Las que más fallan en la práctica: visibilidad del estado del sistema (¿el usuario sabe qué está pasando?), control y libertad (¿puede deshacer?), y reconocer en vez de recordar (¿tiene que memorizar algo entre pantallas?).

**Accesibilidad** — WCAG 2.2 AA como suelo, no como techo. Checklist operativo en `references/accesibilidad.md`. Lo que más se rompe: foco de teclado invisible o perdido, contraste insuficiente en texto secundario, controles sin nombre accesible, y objetivos táctiles por debajo de 24px. Verifícalo con teclado y con el inspector, no de memoria.

**Patrones de componente** — Cada componente frecuente tiene modos de fallo conocidos. Tablas densas, buscadores, filtros facetados, formularios, navegación y estados en `references/patrones.md`. Consúltalo cuando el sitio use uno de ellos: te ahorra redescubrir problemas que ya están catalogados.

**Rendimiento percibido** — La lentitud es un problema de UX antes que de ingeniería. Mira saltos de layout al cargar (CLS), cuánto tarda en verse algo útil (LCP) y si la interfaz responde al teclear o pulsar (INP). Un filtro que tarda 300ms sin feedback se percibe roto aunque funcione.

**Contenido y microcopy** — Las etiquetas, los estados vacíos y los mensajes de error son interfaz. "Sin resultados" es peor que "Sin resultados para «madrid» en banda VHF. Prueba a quitar el filtro de banda." El texto que explica qué hacer a continuación vale más que un rediseño visual.

### 3. Clasifica por severidad, no por esfuerzo

La severidad es del usuario; el esfuerzo es tuyo. Mézclalos y acabarás priorizando lo cómodo en vez de lo importante. Clasifica primero por severidad y luego, dentro de cada nivel, ordena por coste.

- **Bloqueante** — Impide completar la tarea. Nadie puede seguir. (Un control inalcanzable con teclado; un botón que no responde en móvil.)
- **Grave** — La tarea se completa pero con error, retrabajo o abandono probable. (Filtros que no se ven aplicados; export que exporta lo que no era.)
- **Moderado** — Fricción real y repetida, con salida. (Sin atajo de teclado en la acción principal; sin feedback de carga.)
- **Menor** — Pulido. Mejora la percepción de calidad sin cambiar el resultado. (Espaciado inconsistente; icono ambiguo.)

Si dudas entre dos niveles, pregúntate si el usuario se quedaría atascado, se equivocaría, o solo se molestaría. Atascarse es bloqueante, equivocarse es grave, molestarse es moderado.

### 4. Propón el arreglo, no el principio

Cada hallazgo debe llevar un cambio ejecutable: qué elemento, qué comportamiento nuevo, y por qué resuelve el problema. Si el arreglo toca código que puedes leer, cita el fichero y la línea. Si hay varias soluciones razonables, propón una y menciona la alternativa en una frase — no dejes la decisión abierta sin recomendación.

Evita rediseños totales cuando un ajuste puntual resuelve el 80%. Un rediseño se justifica cuando los problemas son estructurales (la arquitectura de información está mal, no el botón).

## Formato del informe

Usa esta estructura. La tabla resumen va primero porque es lo que se lee; el detalle está debajo para quien lo ejecuta.

```markdown
# Auditoría UX/UI — [ámbito]

**Qué se ha probado:** [pantallas, tareas, anchos, temas, navegador]

## Resumen

| # | Hallazgo | Severidad | Dónde | Coste |
|---|----------|-----------|-------|-------|
| 1 | [una línea, el problema no la solución] | Bloqueante | [pantalla/componente] | S/M/L |

## Hallazgos

### 1. [Título del problema] · Bloqueante

**Qué pasa:** [comportamiento observado, en términos de lo que ve el usuario]
**Por qué importa:** [consecuencia concreta: error, abandono, exclusión]
**Cómo se arregla:** [cambio ejecutable, con fichero:línea si aplica]
```

Si el encargo es un rediseño o una "v2" en vez de una auditoría, mantén la sección de hallazgos (justifica los cambios) y añade delante una sección de **principios de la v2**: las 3-5 decisiones estructurales que gobiernan el resto, cada una con el problema que resuelve. Sin esa sección, una v2 es una lista de retoques sin dirección.

## Errores típicos al auditar

**Auditar la estética en vez del uso.** "Los colores son sosos" no es un hallazgo. "El estado activo del filtro usa el mismo gris que el inactivo, así que no se distingue" sí lo es, y de paso es de contraste.

**Inventar usuarios.** No supongas que "los usuarios querrán X" sin base. Apóyate en lo que hace la interfaz, en convenciones establecidas, o en el propio dominio del producto. Si necesitas una suposición, decláralo.

**Recomendar patrones de moda.** Un carrusel, un modal o una IA conversacional no mejoran nada por sí mismos. Cada patrón nuevo debe resolver un problema que hayas identificado antes.

**Ignorar lo que ya funciona.** Di explícitamente qué está bien resuelto. Evita que la siguiente iteración rompa aciertos por no saber que lo eran, y calibra la confianza en el resto del informe.

**Confundir densidad con desorden.** Las herramientas para usuarios expertos (paneles de datos, tablas técnicas) se benefician de la densidad. No apliques criterios de landing page a una tabla de 900 filas que alguien usa a diario.
