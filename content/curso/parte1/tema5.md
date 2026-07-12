> **Fuente:** contenido adaptado de [eaharec.com](https://eaharec.com/parte1/tema5.html) — proyecto de código abierto (licencia MIT).
> Repositorio original: [https://github.com/t00mas/eaharec](https://github.com/t00mas/eaharec).
> Basado en el Anexo II de la Orden IET/1311/2013 (CEPT T/R 61-02).


# Tema 5: Transmisores

Tipos, diagramas de bloques, etapas y características

## 5.1 Tipos de transmisores

### Sin conversión de frecuencia

El oscilador genera directamente la frecuencia de salida. Simple, pero limitado a frecuencias bajas y difícil de cambiar de banda.

### Con conversión de frecuencia

Genera la señal en una frecuencia intermedia y luego la convierte a la frecuencia final mediante mezcla con un oscilador local. Permite:

  * Mayor flexibilidad de frecuencia
  * Mejor filtrado de emisiones no deseadas
  * Uso de filtros de banda lateral a frecuencia fija

## 5.2 Diagramas de bloques

### Transmisor CW (A1A)

Oscilador → Buffer → Excitador → Amplificador de potencia → Filtro de salida → Antena  
                                    ↑  
                                Manipulador 

La señal se enciende/apaga con el manipulador (keying).

### Transmisor SSB (J3E)

Micrófono → Amplificador AF → Modulador balanceado ← Oscilador de portadora  
                                    ↓  
                               Filtro de banda lateral  
                                    ↓  
Mezclador ← VFO/Sintetizador → Amplificadores → Filtro → Antena 

### Transmisor FM (F3E)

Micrófono → Amplificador/Limitador AF → Modulador de frecuencia  
                                                             ↓  
                           Oscilador VCO modulado  
                                                             ↓  
(Multiplicadores) → Amplificador de potencia → Filtro → Antena 

## 5.3 Etapas del transmisor

### Oscilador

  * Genera la frecuencia base o portadora
  * Tipos: VFO, cristal, sintetizador PLL/DDS
  * Requisito fundamental: estabilidad

### Mezclador

  * Combina señal modulada en FI con oscilador local
  * Genera la frecuencia de transmisión final
  * Seguido de filtro para seleccionar producto deseado

### Buffer/Preamplificador

  * Aísla el oscilador de las etapas siguientes
  * Evita variaciones de frecuencia por cambios de carga
  * Proporciona ganancia inicial

### Excitador (driver)

  * Amplifica la señal hasta el nivel necesario para excitar el PA
  * Puede incluir varias etapas

### Multiplicador de frecuencia

  * Multiplica la frecuencia por 2, 3, etc.
  * Usado en transmisores FM y para alcanzar frecuencias altas
  * Amplificador en clase C sintonizado al armónico deseado

### Amplificador de potencia (PA)

  * Etapa final que genera la potencia de salida
  * Clase C para CW/FM (sintonizado), clase AB para SSB (lineal)
  * Transistores bipolares, MOSFET o válvulas
  * Requiere disipación de calor adecuada

### Filtro de salida

  * Filtro paso bajo para eliminar armónicos
  * Típicamente filtro en π (pi)
  * Diferente para cada banda

### Moduladores

#### Modulador de frecuencia

  * Varía la frecuencia del oscilador según el audio
  * Métodos: varicap en oscilador, modulación directa de VCO

#### Modulador de fase

  * Varía la fase de la señal según el audio
  * Indirectamente produce FM (PM con preénfasis)

#### Modulador de banda lateral única

  * **Método del filtro:** Modulador balanceado + filtro de cristal
  * **Método de desfase:** Red de desfase de 90° + suma/resta

### Filtros de cristal

  * Alta selectividad para separar bandas laterales
  * Frecuencias típicas: 455 kHz, 9 MHz, 10.7 MHz
  * Anchos de banda típicos: 2.1-2.7 kHz para SSB

## 5.4 Características de los transmisores

### Estabilidad de frecuencia

Variación máxima de frecuencia en el tiempo. Especificada en Hz o ppm. Afectada por temperatura, tensión y envejecimiento.

### Ancho de banda de radiofrecuencia

Rango de frecuencias ocupado por la emisión. Depende del modo:

Modo| Ancho de banda típico  
---|---  
CW| 100-500 Hz  
SSB| 2.4-3 kHz  
AM| 6-9 kHz  
FM (voz)| 10-16 kHz  
  
### Bandas laterales

  * **USB (Upper Side Band):** Banda lateral superior. Usada en HF >10 MHz
  * **LSB (Lower Side Band):** Banda lateral inferior. Usada en HF <10 MHz

### Margen de audiofrecuencia

Rango de frecuencias de audio que el transmisor procesa. Típico: 300-3000 Hz para voz.

### Efectos no lineales

#### Armónicos

Múltiplos de la frecuencia fundamental generados por no linealidad (2f, 3f, 4f...). Deben ser filtrados.

#### Distorsión por intermodulación (IMD)

Productos de mezcla de componentes de la propia señal. Causa "splatter" en SSB. Se especifica en dB bajo la señal.

### Impedancia de salida

Típicamente 50Ω. Debe coincidir con la impedancia de la línea de transmisión/antena.

### Potencia de salida

  * Potencia entregada a una carga adaptada
  * Se mide en vatios (W)
  * Límites legales según la autorización

### Rendimiento

η = Psalida RF / Pentrada DC × 100% 

Típico: clase A ~25%, clase AB ~50%, clase C ~70-80%

### Desviación de frecuencia (FM)

Variación máxima de frecuencia respecto a la portadora. Típico: ±5 kHz para FM banda estrecha.

### Índice de modulación

FM: β = Δf / fmoduladora  
AM: m = (Vmax \- Vmin) / (Vmax \+ Vmin) 

### Emisiones no deseadas

Emisiones no esenciales (spurious)
    Emisiones en frecuencias distintas a las necesarias: armónicos, productos de mezcla parásitos, etc.

Emisiones fuera de banda
    Emisiones inmediatamente adyacentes al canal, causadas por modulación.

### Radiación por estructura

Emisión RF directa desde la carcasa o cables del transmisor, no a través de la antena. Debe minimizarse con buen apantallamiento y filtrado.

## 5.5 Transceptores y repetidores

### Transceptores

Equipo que integra transmisor y receptor. Comparten:

  * Oscilador local / sintetizador
  * Filtros (en algunos diseños)
  * Display y controles
  * Fuente de alimentación

### Repetidores VHF/UHF

Estaciones que reciben en una frecuencia y retransmiten simultáneamente en otra.

Desplazamiento (offset/shift)
    Diferencia entre frecuencia de entrada y salida. Típico: ±600 kHz en 2m, ±1.6/7.6 MHz en 70cm.

Tono de acceso (CTCSS)
    Subtono que activa el repetidor. Evita activaciones falsas.

### Ubicación de repetidores

  * Lugares elevados para máxima cobertura
  * Requieren aislamiento entre antenas TX/RX
  * Duplexor o cavidades para separar TX/RX
  * Consideraciones de interferencia y coordinación
