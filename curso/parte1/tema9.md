> **Fuente:** contenido adaptado de [eaharec.com](https://eaharec.com/parte1/tema9.html) — proyecto de código abierto (licencia MIT).
> Repositorio original: [https://github.com/t00mas/eaharec](https://github.com/t00mas/eaharec).
> Basado en el Anexo II de la Orden IET/1311/2013 (CEPT T/R 61-02).


# Tema 9: Interferencia e inmunidad

Compatibilidad electromagnética y medidas contra interferencias

## 9.1 Compatibilidad electromagnética (EMC)

La EMC es la capacidad de un dispositivo de funcionar satisfactoriamente en su entorno electromagnético sin causar perturbaciones intolerables a otros dispositivos.

Emisión
    Energía electromagnética que un dispositivo genera y puede afectar a otros.

Susceptibilidad/Inmunidad
    Capacidad de un dispositivo de funcionar correctamente en presencia de perturbaciones electromagnéticas.

## 9.2 Tipos de interferencias

### Bloqueo

Una señal fuerte satura las etapas de entrada del receptor, reduciendo su sensibilidad o impidiendo la recepción.

### Interferencia con la señal deseada

Señales que caen dentro del ancho de banda de recepción y se superponen a la señal deseada.

### Intermodulación

Dos o más señales fuertes se mezclan en elementos no lineales, produciendo productos espurios que pueden caer en frecuencias de interés.

Productos de 3er orden: 2f₁ - f₂, 2f₂ - f₁  
Problemáticos porque caen cerca de las señales originales

### Detección en circuitos de audio

Señales RF rectificadas por uniones semiconductoras en amplificadores de audio, causando que se escuche la transmisión.

## 9.3 Causas de interferencias

### Intensidad de campo del transmisor

  * Mayor potencia = mayor campo electromagnético
  * Menor distancia = mayor intensidad de campo
  * Antenas directivas concentran el campo

### Emisiones no deseadas del transmisor

#### Emisiones no esenciales (spurious)

  * Armónicos de la frecuencia fundamental
  * Productos de mezcla parásitos
  * Emisiones de osciladores parásitos

#### Emisiones fuera de banda

  * Bandas laterales excesivas por sobremodulación
  * "Splatter" en SSB
  * "Clicks" en CW por flancos demasiado rápidos

### Vías de entrada en equipos afectados

#### Vía antena

La señal interferente entra por la antena del equipo afectado (TV, radio, etc.).

#### Vía cables conectados

  * Cable de alimentación
  * Cables de altavoces
  * Cables de señal

Actúan como antenas captando RF.

#### Radiación directa

El campo RF atraviesa la carcasa del equipo y afecta directamente a los circuitos internos.

## 9.4 Medidas contra las interferencias

### En el transmisor (prevención)

#### Filtrado de salida

  * Filtros paso bajo para eliminar armónicos
  * Filtros de banda para espurios
  * Filtro en π en la salida del PA

#### Blindaje

  * Carcasa metálica cerrada
  * Pasantes de filtro en conexiones

#### Buenas prácticas

  * No sobremodular
  * Usar potencia mínima necesaria
  * Mantener equipo bien ajustado

### En el equipo afectado (eliminación)

#### Filtrado

  * Filtros de red en cable de alimentación
  * Ferritas en cables
  * Filtros paso alto en entrada de antena TV
  * Condensadores de desacoplo

#### Desacoplo

  * Condensadores cerámicos cerca de semiconductores
  * Chokes de RF en líneas de señal

#### Apantallamiento

  * Carcasas metálicas
  * Cables apantallados
  * Mallas sobre cables

### En la instalación

  * Separación física entre transmisor y equipos sensibles
  * Buena toma de tierra
  * Cables de alimentación y RF separados
  * Orientación de antenas

## 9.5 Diagnóstico de interferencias

### Identificar la fuente

  * ¿La interferencia coincide con la transmisión?
  * ¿Se produce en una frecuencia específica o en todas?
  * ¿Afecta a un solo equipo o a varios?

### Determinar la vía de entrada

  * Desconectar antena del equipo afectado
  * Desconectar cables uno a uno
  * Usar equipo a pilas (elimina vía red)

### Aplicar medidas

  * Empezar por la vía más probable
  * Probar filtros y ferritas
  * Documentar qué funciona

## 9.6 Aspectos legales

  * El radioaficionado debe evitar causar interferencias perjudiciales
  * Los equipos deben cumplir normativas de EMC
  * Ante denuncias, colaborar con la inspección
  * Los equipos modernos deben tener cierto nivel de inmunidad (marcado CE)
