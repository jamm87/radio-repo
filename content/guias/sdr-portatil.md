# Escucha digital con SDR y portátil

Guía práctica para decodificar modos digitales (DMR, TETRA) con un portátil modesto y un
receptor SDR económico.

## Requisitos de máquina

La decodificación de voz digital es ligera: lo exigente es el procesado de banda ancha
(FFT, anchos de muestreo altos), no el vócoder.

Un portátil de gama profesional de hace ocho años, tipo ThinkPad con procesador i5 y 8 GB
de RAM, es suficiente para DMR y TETRA con un RTL-SDR. Recomendaciones:

- Disco SSD: ayuda más que la CPU en la fluidez general
- 8 GB de RAM como mínimo cómodo
- Usar puerto USB 2.0 dedicado y cable corto; el RTL-SDR es sensible a hubs y a ruido de USB 3.0
- Reducir el ancho de muestreo si la cascada va a saltos (1.024 o 1.2 Msps basta para un canal de voz)

## Ruta Linux (recomendada)

Es la ruta más limpia y la que mejor documentación tiene para TETRA.

### Base

- **Distribución:** cualquier Debian o Ubuntu con soporte a largo plazo
- **Drivers:** paquete `rtl-sdr`, y poner en lista negra el módulo `dvb_usb_rtl28xxu` para que no secuestre el dongle
- **Comprobación:** la utilidad `rtl_test` debe detectar el dispositivo sin pérdida de muestras

### Receptor

- **GQRX** — sencillo, estable, buen punto de partida
- **SDR++** — más moderno, multiplataforma, interfaz más cómoda

### Decodificación

- **DMR:** DSD-FME, evolución mantenida de DSD. Se alimenta del audio discriminado del receptor mediante un cable de audio virtual (PulseAudio o PipeWire)
- **TETRA:** Osmocom tetra (`osmo-tetra`) o TETRA Live Monitor, que reconstruyen la trama y extraen voz cuando no está cifrada

### Encadenado

El patrón habitual es sacar audio en banda base del receptor a un dispositivo virtual (por
ejemplo un módulo `null-sink` de PulseAudio) y que el decodificador lo tome como entrada.

## Ruta Windows

Válida y algo más rápida de montar, aunque con menos opciones para TETRA.

- **SDRSharp** como receptor
- **DSD Plus** para DMR, o el plugin de decodificación digital de SDRSharp
- **VB-Cable** o **Virtual Audio Cable** para encaminar el audio entre programas

## Limitación importante: cifrado

Las redes TETRA de emergencias suelen ir cifradas. En esos casos **no hay audio recuperable**
ni con SDR ni con receptor dedicado: solo se obtienen metadatos como actividad de portadora,
identificadores de grupo y estructura de red. Conviene tenerlo claro antes de invertir
tiempo o dinero esperando voz.

En modo analógico, cualquier señal digital suena a ruido áspero y rítmico, no a voz. Es la
pista para identificar que hace falta decodificación.

## Guía de compra

| Nivel | Equipo | Precio orientativo | Notas |
|---|---|---|---|
| Entrada | RTL-SDR Blog V4 | 30–40 € | Estándar de facto. 500 kHz (muestreo directo) – 1,7 GHz |
| Gama media | Airspy Mini | ~200 € | Mejor rango dinámico y filtrado |
| Gama media | SDRplay RSP1B | ~150 € | Útil en entornos con señales fuertes cerca |
| Dedicado | Uniden SDS100 | ~600 € | DMR de fábrica, sin cadena de software |

Añadir una antena decente antes que cambiar de receptor: es donde mejor rinde cada euro.

### Criterio

Si el objetivo es explorar y aprender, la ruta SDR con portátil da mucho más por mucho
menos. El receptor dedicado tiene sentido cuando se prioriza comodidad, movilidad y
encendido inmediato.
