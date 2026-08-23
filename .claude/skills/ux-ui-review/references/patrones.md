# Patrones de componente y sus modos de fallo

Consulta la sección del componente que estés auditando. Cada apartado lista lo que debe cumplirse y el fallo que aparece una y otra vez.

## Tablas de datos densas

Lo que hay que resolver: orientarse en muchas filas, encontrar unas pocas, y actuar sobre ellas.

- **Cabecera fija** al hacer scroll, o el usuario pierde el significado de las columnas a las 30 filas. Cuidado: `position: sticky` deja de funcionar si un ancestro tiene `overflow` distinto de `visible` — es el fallo más común y más difícil de diagnosticar.
- **Un solo scroll.** Una caja con `max-height` + `overflow-y` dentro de una página que también scrollea crea dos recorridos de longitudes muy distintas; al agotarse el interior el navegador encadena al exterior y la página salta. Si necesitas scroll interno, que sea el único de la vista (altura completa, `overscroll-behavior: contain`).
- **Alineación por tipo.** Números a la derecha y con cifras tabulares (`font-variant-numeric: tabular-nums`); texto a la izquierda. Comparar columnas de números mal alineados es imposible.
- **Densidad alta es correcta aquí.** No apliques espaciados de landing page. Lo que sí hace falta es una separación de filas legible (línea sutil o zebra) y `hover` que recorra la fila entera.
- **La ordenación se ve.** Indicador de columna y dirección activos, y `aria-sort` en el `th`. Sin indicador, el usuario no sabe si su clic hizo algo.
- **Selección con estado visible** y contador ("3 de 964 seleccionados"). El "seleccionar todo" debe decir qué selecciona: ¿lo visible, lo filtrado o todo? Es una fuente clásica de exportaciones equivocadas.
- **Volumen.** Por encima de unas 500 filas en el DOM, la interacción se degrada. Opciones: paginación (previsible, enlazable), scroll infinito (fluido pero rompe el pie de página y la orientación) o virtualización (rápida pero rompe Ctrl+F del navegador). En herramientas técnicas, la paginación suele ganar por ser predecible.
- **En móvil**, una tabla ancha no se convierte en tarjetas automáticamente: decide. O scroll horizontal explícito (con sombra que indique que hay más), o vista de tarjetas con los 3-4 campos clave.

## Buscadores

- **El campo dice qué busca.** Un `placeholder` con un ejemplo real ("LEMD, APRS, 145.500") enseña la sintaxis mejor que cualquier ayuda aparte. Pero el placeholder no sustituye a la etiqueta.
- **Búsqueda incremental con debounce** de 100-200ms. Menos, y se dispara por cada tecla; más, y se siente lenta.
- **Normaliza** acentos, mayúsculas y signos. Que "codigo q" encuentre "Código Q" no es un lujo.
- **Resultado vacío útil.** Debe decir qué se buscó, por qué no hay nada y qué hacer: quitar un filtro concreto, corregir la ortografía, o probar un término más amplio.
- **Estado de la búsqueda en la URL.** Permite compartir, volver atrás y recargar sin perder el trabajo. Barato de implementar y muy visible.
- **Botón de limpiar** dentro del campo cuando tiene contenido (`type="search"` lo da gratis en algunos navegadores, pero no en todos).

## Autocompletado / sugerencias

El patrón con más modos de fallo de todos.

- **Teclado completo:** flechas para navegar, `Enter` para elegir, `Esc` para cerrar (y una segunda pulsación para limpiar), `Tab` para salir sin elegir.
- **La opción resaltada se anuncia.** Foco en el input y `aria-activedescendant` apuntando a la opción activa (ver `accesibilidad.md`). Sin eso, el lector de pantalla no dice nada al mover las flechas.
- **El resaltado se ve** y hace scroll dentro de la lista si se sale (`scrollIntoView({block:"nearest"})`).
- **Cerrar al hacer clic fuera**, no solo al perder el foco. El `blur` con `setTimeout` funciona pero es frágil: si el retardo es corto, el clic en una sugerencia se pierde; si es largo, la lista se queda colgada. `mousedown` en el documento es más robusto.
- **Agrupa y etiqueta por tipo** si mezclas entidades distintas (nombres, categorías, bandas). Sin etiqueta de grupo, el usuario no entiende por qué "VHF 2m" aparece junto a "Madrid Torre".
- **Límite y orden sensatos.** 5-10 sugerencias; primero las coincidencias por prefijo, luego por contenido. Una lista de 50 no ayuda.
- **Resalta la parte coincidente** del texto: explica por qué está ahí cada sugerencia.
- **No robes el `Enter`.** Si el usuario no ha resaltado nada, `Enter` debe buscar lo escrito, no elegir la primera sugerencia.

## Filtros facetados

- **Los filtros activos se ven fuera del control.** Chips o resumen con lo aplicado y cómo quitarlo uno a uno. Un `select` con valor elegido no basta: el usuario hace scroll y ya no lo ve. Es el incumplimiento nº1 de "reconocer mejor que recordar".
- **Contador de resultados visible y en directo**, junto a los filtros. Es la confirmación de que el filtro hizo algo.
- **Recuentos por opción** ("VHF 2m (312)") cuando sea barato calcularlos: convierten el filtrado en exploración y evitan callejones sin salida.
- **Evita los cero-resultados** deshabilitando o marcando las opciones que no darían nada con la combinación actual.
- **Limpiar todo** siempre disponible, y que limpie de verdad todo (incluidos los conmutadores y la búsqueda), no solo los desplegables.
- **No apliques filtro al abrir un desplegable** en móvil hasta que se confirme, si eso provoca recargas caras.

## Formularios

- Etiqueta visible encima del campo (más rápido de leer en columna que a la izquierda, y sobrevive al móvil).
- Agrupa por afinidad con `fieldset`/`legend`; un formulario largo sin secciones se abandona.
- Valida al salir del campo (`blur`), no en cada tecla; y muestra el error junto al campo, no en una lista arriba.
- Un solo botón primario. Las acciones secundarias (cancelar) no compiten en peso visual.
- Marca los campos **opcionales**, no los obligatorios, cuando la mayoría son obligatorios (menos ruido).
- Nunca deshabilites el botón de envío por validación sin explicar qué falta: el usuario se queda sin saber qué mirar.

## Navegación

- **El sitio dice dónde estás.** Estado activo en el enlace de sección (`aria-current="page"`), y migas de pan en jerarquías de más de dos niveles.
- **La navegación no se mueve** entre páginas. Un menú cuyo orden cambia obliga a releerlo cada vez.
- **En móvil**, la navegación principal no puede depender de `hover`. Y el menú hamburguesa esconde: úsalo cuando no quepa, no por defecto.
- **Índice de página** (tabla de contenidos) en documentos largos, con la sección actual resaltada al hacer scroll.
- **Máximo 7±2 elementos** por nivel. Si hay más, agrupa.

## Estados

Los tres estados que casi siempre faltan:

- **Vacío por primera vez** (aún no hay datos): explica qué aparecerá aquí y ofrece la acción que lo llena. No es lo mismo que "sin resultados".
- **Vacío por filtro** (hay datos pero ninguno pasa el filtro): di qué filtro los está quitando y ofrece quitarlo.
- **Error**: qué falló, por qué, y el botón de reintentar. Que el usuario no tenga que recargar la página entera.

Y el que se hace mal:

- **Carga.** Un esqueleto (skeleton) que respeta la forma final evita el salto de layout; un spinner centrado no. Para cargas cortas, cambiar el texto del botón basta. Reserva siempre el espacio del contenido que va a llegar, o la página saltará (CLS).

## Botones y acciones

- El texto dice qué hace, no el genérico: "Descargar CSV" mejor que "Aceptar".
- Si la acción depende de una selección, dilo en el propio botón ("Exportar 3 seleccionadas") — evita exportar lo que no era.
- Un icono solo, sin texto, únicamente en acciones universalmente conocidas (cerrar, buscar); siempre con `aria-label`.
- Las acciones destructivas se separan de las frecuentes y llevan confirmación o deshacer.
- El botón cambia de estado al pulsarse (deshabilitado + texto "Enviando…"), o el usuario pulsa dos veces.

## Mapas

- **Carga bajo demanda**, con espacio reservado y mensaje mientras llega la biblioteca.
- Deshabilita el zoom con rueda por defecto si el mapa está embebido en una página que scrollea: si no, el usuario intenta bajar y hace zoom.
- Los marcadores necesitan leyenda si el color codifica algo, y alternativa no visual: los datos deben estar también en la tabla.
- Comprueba el tema: los tiles claros sobre interfaz oscura (o al revés) delatan que el mapa no participa del sistema de diseño.
