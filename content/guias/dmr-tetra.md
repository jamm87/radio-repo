# Escucha digital: DMR y TETRA

Resumen de opciones para escuchar transmisiones digitales (DMR, TETRA) en bandas VHF/UHF.

## Por qué suena a ruido en analógico

En la zona de 470 MHz hay mucho tráfico digital (DMR, TETRA). Un receptor en modo analógico
solo reproduce un ruido tipo motosierra, no voz. Si aparece voz clara y repetitiva, merece
la pena anotar la frecuencia.

## Opción 1: SDR + software (económica)

- **Hardware:** RTL-SDR, aproximadamente 20–30 €
- **DMR:** DSD Plus, o plugin de decodificación DMR para SDRSharp
- **TETRA:** TETRA Live Monitor (Linux)
- **Ventaja:** coste mínimo, muy flexible
- **Inconveniente:** requiere configuración y cadena de software

## Opción 2: receptor dedicado

- **Uniden SDS100:** trae decodificación DMR de fábrica
- **Coste:** en torno a 600 €
- **Ventaja:** funciona sin montaje de software

## Limitación importante

Las redes TETRA de emergencias suelen ir **cifradas**. Ni el SDR ni el Uniden entregarán
audio en esos casos: solo se obtienen metadatos (actividad de portadora, identificadores,
estructura de red).

## Contexto de propagación

| Banda | Rango | Notas |
|---|---|---|
| Banda aérea | 108–137 MHz | AM |
| 2 metros | 144–146 MHz | Radioafición |
| 70 centímetros | 430–440 MHz | Radioafición |
| PMR446 | 446 MHz | Uso libre |
| Móvil profesional | > 440 MHz | Uso privativo con licencia |

En estas bandas domina la refracción troposférica —que amplía el horizonte radioeléctrico
en torno a un 15 %— y los conductos por inversión térmica. La atenuación por lluvia es
despreciable por debajo de unos 10 GHz. Ver [Propagación y bandas de interés](propagacion.md).
