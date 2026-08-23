# Heurísticas de usabilidad

Las 10 de Nielsen, con lo que hay que buscar en cada una y el modo de fallo típico en web moderna.

## 1. Visibilidad del estado del sistema

El usuario debe saber en todo momento qué está pasando.

Busca: acciones sin confirmación visible; cargas asíncronas sin indicador; filtros aplicados que no se ven en pantalla; procesos largos sin progreso; cambios de estado (guardado, seleccionado, enviado) sin acuse.

Fallo típico: una operación que tarda 200-2000ms — demasiado rápido para poner un spinner "de verdad", demasiado lento para parecer instantánea. Es la franja donde la interfaz parece rota. Cúbrela con un cambio de estado inmediato (botón deshabilitado, texto "Cargando…"), no con nada.

Regla práctica: <100ms se percibe instantáneo; hasta 1s se tolera sin indicador pero conviene marcarlo; más de 1s exige feedback explícito; más de 10s exige progreso real y opción de cancelar.

## 2. Correspondencia entre el sistema y el mundo real

El vocabulario y los conceptos deben ser los del usuario, no los de la base de datos.

Busca: etiquetas que exponen nombres de campo internos; jerga técnica innecesaria; iconos con significado inventado; orden de opciones que sigue el esquema de datos en vez de la frecuencia de uso.

Ojo con el dominio: en productos técnicos (radio, finanzas, medicina), la jerga del dominio **es** el lenguaje del usuario. Simplificarla es un error. Lo que no vale es la jerga del *sistema* — `meta.source_id` no es lenguaje de dominio.

## 3. Control y libertad del usuario

Toda acción debe tener salida.

Busca: acciones destructivas sin confirmación ni deshacer; procesos multipaso sin volver atrás; filtros o selecciones que no se pueden limpiar de una; modales que atrapan; navegación que pierde el trabajo en curso.

El deshacer es mejor que la confirmación: interrumpe menos y protege igual. Reserva los diálogos de confirmación para lo irreversible de verdad.

## 4. Consistencia y estándares

Lo mismo debe llamarse y comportarse igual en todas partes; y lo que la plataforma ya define, respétalo.

Busca: el mismo concepto con dos nombres; el mismo control con dos aspectos; botones primarios en posiciones distintas según pantalla; enlaces que no parecen enlaces; controles nativos reimplementados peor (selects, fechas, checkboxes).

Consistencia interna (dentro del producto) y externa (con las convenciones de la web). Romper la externa cuesta más de lo que suele parecer: el usuario trae expectativas de otros mil sitios.

## 5. Prevención de errores

Mejor que un buen mensaje de error es que el error no ocurra.

Busca: campos que aceptan formatos que luego rechazan; acciones peligrosas junto a las frecuentes; ausencia de valores por defecto sensatos; falta de validación en el momento de escribir; opciones aplicables que aparecen deshabilitadas sin explicación.

Prefiere restringir la entrada (selector de fecha en vez de texto libre) a validar después. Y si algo está deshabilitado, di por qué — un control gris sin explicación es un callejón.

## 6. Reconocer mejor que recordar

Lo necesario para actuar debe estar a la vista.

Busca: filtros activos que solo se ven abriendo un desplegable; parámetros de un paso anterior que no se muestran en el siguiente; atajos o sintaxis de búsqueda no documentados en el propio campo; iconos sin etiqueta en acciones poco frecuentes.

Este es el que más se incumple en interfaces de datos: el usuario aplica cuatro filtros, hace scroll, y ya no sabe qué está viendo ni por qué faltan filas.

## 7. Flexibilidad y eficiencia de uso

Acelerar al experto sin estorbar al novato.

Busca: ausencia de atajos de teclado en acciones repetitivas; imposibilidad de guardar o compartir un estado (URL con filtros); falta de acciones en lote; ausencia de valores por defecto que cubran el caso común.

Los aceleradores deben ser invisibles hasta que se buscan: un atajo anunciado en un tooltip, no un botón más en pantalla.

## 8. Diseño estético y minimalista

Cada elemento compite por atención con los demás.

Busca: texto explicativo que nadie lee; adornos sin función; tres llamadas a la acción del mismo peso; densidad visual que no corresponde a densidad de información.

"Minimalista" no significa vacío ni escaso. Significa que **nada compite con lo importante**. Una tabla densa bien jerarquizada cumple esta heurística; una landing con mucho aire y cuatro botones idénticos, no.

## 9. Ayudar a reconocer, diagnosticar y recuperarse de errores

Los mensajes de error deben decir qué pasó, por qué y qué hacer.

Busca: mensajes con códigos técnicos; errores que no señalan el campo culpable; "Ha ocurrido un error" sin más; errores que borran lo escrito; validaciones que aparecen todas de golpe al enviar.

Estructura útil: qué falló + por qué + acción concreta. "No se ha podido cargar el mapa (sin conexión con unpkg.com). Comprueba la red y vuelve a pulsar Mapa."

## 10. Ayuda y documentación

Lo ideal es no necesitarla; lo realista es que sea encontrable en el punto de uso.

Busca: funciones potentes sin ninguna pista de que existen; sintaxis de búsqueda no documentada; ayuda que vive en otra página en vez de junto al control; ejemplos ausentes.

El mejor sitio para la ayuda es el propio control: un placeholder con un ejemplo real vale más que un párrafo en un FAQ.

---

## Heurísticas complementarias

Útiles cuando las 10 clásicas no cubren el caso:

**Ley de Fitts** — El tiempo para alcanzar un objetivo depende de su tamaño y distancia. Las acciones frecuentes van grandes y cerca; las peligrosas, lejos de las frecuentes. Los bordes y esquinas de pantalla son infinitamente "grandes" (el cursor se detiene ahí).

**Ley de Hick** — El tiempo de decisión crece con el número de opciones. Agrupar, ordenar por frecuencia y esconder lo avanzado reduce la carga mejor que reducir funcionalidad.

**Umbral de Doherty** — Por debajo de ~400ms de respuesta, el usuario mantiene el hilo y trabaja más rápido. Por encima, se desengancha. Es el argumento de UX para optimizar rendimiento.

**Efecto de posición serial** — Se recuerdan mejor el primero y el último elemento de una lista. Coloca lo importante en los extremos, no en el medio.

**Ley de Jakob** — Los usuarios pasan la mayor parte del tiempo en *otros* sitios, así que esperan que el tuyo funcione como aquellos. Innova en lo que te diferencia; copia las convenciones en todo lo demás.
