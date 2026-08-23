# Accesibilidad — checklist operativo (WCAG 2.2 AA)

No es la norma completa: es lo que se rompe de verdad, ordenado por frecuencia con la que aparece. Verifica con el navegador y el teclado, no de memoria.

## Teclado

Es la prueba más rentable: recorre toda la página con `Tab` sin tocar el ratón.

- **Todo lo operable es alcanzable.** Cada control interactivo debe recibir foco. Los `div` con `onclick` no lo reciben: usa `button`, o añade `tabindex="0"` + manejo de `Enter`/`Espacio` + `role`.
- **El foco se ve siempre.** Nunca `outline: none` sin sustituto. El indicador necesita ≥3:1 de contraste con el fondo adyacente y debe rodear el control (WCAG 2.2 añade *Focus Appearance*, 2.4.11).
- **El orden sigue la lectura.** El orden de tabulación debe coincidir con el orden visual. Si no coincide, normalmente es que el CSS reordena (`order`, `row-reverse`, posicionamiento absoluto) — arregla el DOM, no lo parchees con `tabindex` positivos (nunca uses `tabindex` > 0).
- **No hay trampas de foco.** Desde cualquier control se puede salir con teclado. Los modales son la excepción legítima: atrapan el foco a propósito, pero deben cerrarse con `Esc` y devolver el foco al disparador.
- **Salto al contenido.** Un enlace "saltar al contenido" al principio, visible al enfocarlo, evita tabular por toda la navegación en cada página.
- **Nada depende del hover.** Si algo solo aparece al pasar el ratón, no existe para teclado ni para táctil. Debe aparecer también con foco.

## Contraste y color

- **Texto normal ≥ 4.5:1** contra su fondo. **Texto grande** (≥24px, o ≥18.66px en negrita) **≥ 3:1**.
- **Controles y bordes informativos ≥ 3:1** (1.4.11): el borde de un input, el estado activo de un chip, el trazo de un icono con significado.
- **El texto atenuado es el sospechoso habitual.** Los grises "secundarios" (metadatos, ayudas, placeholders) suelen quedarse en 3:1 o menos. Mídelos.
- **El color nunca es el único portador de información** (1.4.1). Un estado marcado solo por color se pierde para daltonismo y en pantallas malas. Acompáñalo de forma, icono, texto o peso.
- **Comprueba ambos temas.** Una paleta clara válida no garantiza que la oscura lo sea. Si hay variantes de tinte, comprueba la peor.

## Objetivos táctiles

- **Mínimo 24×24 px** de área objetivo (2.5.8, AA en WCAG 2.2), con separación suficiente si son menores. 44×44 es el estándar cómodo en móvil.
- Cuidado con los iconos de cierre, los "×" de los chips y las casillas de tabla: son los que más se quedan cortos.
- El área clicable puede ser mayor que el elemento visible (padding, pseudo-elemento) — es la solución cuando el diseño exige un icono pequeño.

## Nombres accesibles y semántica

- **Todo control tiene nombre.** Un botón con solo un icono necesita `aria-label` o texto oculto visualmente. Un input necesita `<label for>` asociado (el `placeholder` **no** es una etiqueta: desaparece al escribir y muchos lectores no lo anuncian).
- **Usa el elemento nativo.** `<button>`, `<a href>`, `<select>`, `<input type="checkbox">` traen gratis foco, teclado, semántica y comportamiento de plataforma. Reimplementarlos con `div` + ARIA casi siempre sale peor.
- **Encabezados jerárquicos y sin saltos.** Un solo `h1` por página; no saltes de `h2` a `h4`. Los lectores de pantalla navegan por encabezados: son la tabla de contenidos real.
- **Puntos de referencia.** `header`, `nav`, `main`, `footer` (o roles equivalentes) permiten saltar por zonas. Un `main` por página.
- **Estado en ARIA solo si no hay nativo.** `aria-pressed` para botones de alternancia, `aria-expanded` para desplegables, `aria-current="page"` para el enlace activo. Y mantenlos sincronizados: un `aria-pressed` que no cambia miente al usuario.

## Contenido dinámico

- **Los cambios que no llevan el foco se anuncian.** Un contador de resultados que cambia al filtrar necesita `aria-live="polite"` en su contenedor (o `role="status"`), o el usuario de lector no se entera.
- **Anuncia con moderación.** `aria-live="assertive"` interrumpe: resérvalo para errores. Y no pongas `live` en contenedores que se reescriben enteros a cada tecla — se convierte en ruido.
- **Autocompletado y comboboxes** son de lo más difícil de hacer accesible. El patrón mínimo: `role="combobox"` + `aria-expanded` + `aria-controls` en el input, `role="listbox"` en la lista, `role="option"` + `aria-selected` en cada opción, y `aria-activedescendant` apuntando a la opción resaltada (el foco se queda en el input). Sin `aria-activedescendant`, el usuario de lector no sabe qué está seleccionando con las flechas.

## Movimiento y tiempo

- **Respeta `prefers-reduced-motion`.** Desactiva o reduce animaciones, parallax y transiciones grandes cuando esté activo.
- **Nada parpadea más de 3 veces por segundo** (riesgo de convulsiones).
- **Sin límites de tiempo** o ajustables. Un mensaje que desaparece solo debe poder releerse.

## Formularios

- Etiqueta visible y asociada en cada campo.
- Errores identificados por texto junto al campo, no solo por borde rojo; el campo lleva `aria-invalid` y `aria-describedby` apuntando al mensaje.
- No borres lo escrito al fallar la validación (WCAG 2.2 *Redundant Entry*, 3.3.7: no vuelvas a pedir lo que ya se dio).
- `autocomplete` con el token correcto en datos personales: ahorra tecleo a todo el mundo y es decisivo para quien usa entrada por voz o conmutadores.

## Cómo verificar sin herramientas externas

1. **Tab por toda la página.** ¿Llegas a todo? ¿Ves siempre dónde estás? ¿Sale el foco de todas partes?
2. **Zoom al 200%** (y ancho de 320px). ¿Se puede usar sin scroll horizontal? WCAG exige reflow a 320px de ancho equivalente.
3. **Inspector de contraste** del navegador sobre el texto más claro de cada tema.
4. **Desactiva el CSS.** El orden del contenido resultante debe seguir teniendo sentido: es aproximadamente lo que oye un lector de pantalla.
5. **Árbol de accesibilidad** en DevTools: revisa que cada control tenga un nombre y un rol correctos.
