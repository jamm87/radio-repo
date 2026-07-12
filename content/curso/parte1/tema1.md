> **Fuente:** contenido adaptado de [eaharec.com](https://eaharec.com/parte1/tema1.html) — proyecto de código abierto (licencia MIT).
> Repositorio original: [https://github.com/t00mas/eaharec](https://github.com/t00mas/eaharec).
> Basado en el Anexo II de la Orden IET/1311/2013 (CEPT T/R 61-02).


# Tema 1: Teoría de la electricidad, electromagnetismo y radio

Conceptos fundamentales de electricidad y radioelectricidad

## 1.1 Conductividad

### Conductores, semiconductores y aislantes

Los materiales se clasifican según su capacidad para conducir la corriente eléctrica:

Conductores
    Materiales con electrones libres que permiten el paso fácil de la corriente. Ejemplos: cobre, aluminio, plata, oro.

Semiconductores
    Materiales cuya conductividad está entre conductores y aislantes. Su resistividad varía con la temperatura y la luz. Ejemplos: silicio, germanio.

Aislantes (dieléctricos)
    Materiales que impiden o dificultan el paso de la corriente. Ejemplos: vidrio, plástico, aire, cerámica.

### Magnitudes eléctricas fundamentales

Magnitud | Símbolo | Unidad | Definición  
---|---|---|---  
Intensidad | I | Amperio (A) | Flujo de carga eléctrica por unidad de tiempo  
Voltaje (tensión) | V o U | Voltio (V) | Diferencia de potencial entre dos puntos  
Resistencia | R | Ohmio (Ω) | Oposición al paso de la corriente  
Potencia | P | Vatio (W) | Energía por unidad de tiempo  
  
### Ley de Ohm

Relación fundamental entre voltaje, intensidad y resistencia:

**V = I × R**  
Donde: V = voltaje (V), I = intensidad (A), R = resistencia (Ω)

Formas despejadas:

I = V / R  
R = V / I 

### Leyes de Kirchhoff

Primera Ley (Ley de nodos o corrientes)
    La suma de las corrientes que entran a un nodo es igual a la suma de las corrientes que salen. ΣIentrada = ΣIsalida

Segunda Ley (Ley de mallas o tensiones)
    La suma algebraica de las tensiones en un circuito cerrado es igual a cero. ΣV = 0

### Potencia eléctrica

**P = V × I**  
Combinando con la Ley de Ohm:  
P = I² × R  
P = V² / R 

### Energía eléctrica

**E = P × t**  
Donde: E = energía (J o Wh), P = potencia (W), t = tiempo (s o h)

### Capacidad de una batería

Se expresa en **amperios-hora (Ah)**. Indica la cantidad de carga que puede suministrar.

Capacidad (Ah) = Intensidad (A) × Tiempo (h)  
Una batería de 100 Ah puede suministrar 1A durante 100h, o 10A durante 10h (aproximadamente)

## 1.2 Fuentes de alimentación - Conceptos básicos

Fuerza electromotriz (fem)
    Energía por unidad de carga que suministra una fuente. Se mide en voltios.

Diferencia de potencial
    Tensión entre dos puntos del circuito.

Resistencia interna (ri)
    Resistencia propia de la fuente que causa pérdidas.

Tensión en terminales
    Vterminales = fem - I × ri

Corriente de cortocircuito
    Icc = fem / ri (máxima corriente cuando la carga es cero)

### Conexión de fuentes en serie

Las tensiones se suman: Vtotal = V₁ + V₂ + V₃ + ...

La resistencia interna total se suma: rtotal = r₁ + r₂ + r₃ + ...

### Conexión de fuentes en paralelo

La tensión permanece igual (deben tener el mismo voltaje).

La capacidad se suma y la resistencia interna disminuye.

## 1.3 Campo eléctrico

El campo eléctrico es la región del espacio donde una carga experimenta una fuerza.

Intensidad del campo eléctrico (E)
    Fuerza por unidad de carga. Se mide en **voltios por metro (V/m)**.

E = V / d  
Donde: E = intensidad de campo (V/m), V = tensión (V), d = distancia (m)

### Aislamiento de campos eléctricos

Los campos eléctricos pueden ser bloqueados mediante materiales conductores (jaula de Faraday). Una malla metálica o carcasa conductora conectada a tierra protege el interior de campos eléctricos externos.

## 1.4 Campo magnético

Todo conductor por el que circula corriente genera un campo magnético a su alrededor.

### Campo magnético en conductores

La dirección del campo magnético sigue la **regla de la mano derecha** : con el pulgar en la dirección de la corriente, los dedos indican la dirección del campo magnético.

### Aislamiento de campos magnéticos

Los campos magnéticos son más difíciles de aislar que los eléctricos. Se utilizan materiales de alta permeabilidad magnética (mu-metal, hierro dulce) para desviar las líneas de campo.

## 1.5 Campo electromagnético

### Ondas de radio como ondas electromagnéticas

Las ondas de radio son ondas electromagnéticas compuestas por campos eléctricos y magnéticos perpendiculares entre sí y a la dirección de propagación.

### Velocidad de propagación

**c = 299.792.458 m/s ≈ 3 × 10⁸ m/s** (en el vacío) 

### Relación entre frecuencia y longitud de onda

**c = f × λ**  
λ = c / f  
f = c / λ  
Donde: c = velocidad de la luz, f = frecuencia (Hz), λ = longitud de onda (m)

Banda | Frecuencia | Longitud de onda  
---|---|---  
160 m| 1,8 - 2 MHz| ≈ 160 m  
80 m| 3,5 - 4 MHz| ≈ 80 m  
40 m| 7 - 7,3 MHz| ≈ 40 m  
20 m| 14 - 14,35 MHz| ≈ 20 m  
2 m| 144 - 146 MHz| ≈ 2 m  
70 cm| 430 - 440 MHz| ≈ 70 cm  
  
### Polarización

La polarización indica la orientación del campo eléctrico:

  * **Polarización horizontal:** campo eléctrico paralelo al suelo
  * **Polarización vertical:** campo eléctrico perpendicular al suelo
  * **Polarización circular:** el campo eléctrico rota (derecha o izquierda)

## 1.6 Señales sinusoidales

### Valores característicos

Valor instantáneo
    Valor de la señal en un instante determinado: v(t) = Vmax × sen(ωt)

Valor máximo (Vmax o Vp)
    Amplitud máxima de la señal (valor pico).

Valor pico a pico (Vpp)
    Diferencia entre el valor máximo y mínimo: Vpp = 2 × Vmax

Valor eficaz (Vrms o Vef)
    Valor equivalente de corriente continua que produce el mismo efecto de calentamiento.  
**V rms = Vmax / √2 ≈ 0,707 × Vmax**

Valor medio
    Para una onda completa es cero. Para media onda: Vmedio = 2 × Vmax / π ≈ 0,637 × Vmax

### Período y frecuencia

f = 1 / T  
T = 1 / f  
Donde: f = frecuencia en Hertzios (Hz), T = período en segundos (s)

El **Hercio (Hz)** es la unidad de frecuencia: 1 Hz = 1 ciclo por segundo.

Prefijo| Símbolo| Valor  
---|---|---  
kilo| kHz| 10³ Hz  
mega| MHz| 10⁶ Hz  
giga| GHz| 10⁹ Hz  
  
### Diferencia de fase

Desfase angular entre dos señales de la misma frecuencia, medido en grados (°) o radianes (rad).

  * Señales **en fase:** desfase = 0°
  * Señales en **cuadratura:** desfase = 90°
  * Señales en **oposición de fase:** desfase = 180°

## 1.7 Señales no sinusoidales

### Señal de audio

Señales complejas en el rango de 20 Hz a 20 kHz (espectro audible humano).

### Ondas cuadradas

Señales que alternan entre dos niveles con transiciones rápidas. Contienen la frecuencia fundamental más una serie infinita de armónicos impares.

### Componentes de una señal compleja

  * **Componente continua (DC):** valor medio de la señal
  * **Fundamental:** frecuencia principal de la señal
  * **Armónicos:** múltiplos enteros de la frecuencia fundamental (2f, 3f, 4f...)

### Ruido

Ruido térmico (Johnson-Nyquist)
    Generado por el movimiento aleatorio de electrones en conductores. Presente en todas las resistencias.

Ruido de banda
    Potencia de ruido dentro de un ancho de banda específico.

Densidad de potencia de ruido
    Potencia de ruido por unidad de ancho de banda (W/Hz).

Potencia de ruido térmico: Pn = k × T × B  
k = constante de Boltzmann (1,38 × 10⁻²³ J/K), T = temperatura (K), B = ancho de banda (Hz)

## 1.8 Señales moduladas

La modulación es el proceso de variar una característica de una señal portadora según una señal de información.

### Modulación por onda continua (CW)

La portadora se enciende y apaga según un código (típicamente Morse). Designación: **A1A**.

### Modulación en Amplitud (AM)

La amplitud de la portadora varía según la señal moduladora.

Porcentaje de modulación (m)
    m = (Vmax \- Vmin) / (Vmax \+ Vmin) × 100%  
Debe mantenerse ≤ 100% para evitar sobremodulación.

Bandas laterales
    Frecuencias superior (fc \+ fm) e inferior (fc \- fm) generadas alrededor de la portadora.

Ancho de banda AM
    BW = 2 × fmoduladora máx

### Tipos de AM

  * **A3E (AM doble banda lateral):** portadora + ambas bandas laterales
  * **J3E (SSB - banda lateral única):** una sola banda lateral, portadora suprimida
  * **H3E:** portadora completa + una banda lateral
  * **R3E:** portadora reducida + una banda lateral

La **sobremodulación** (m > 100%) causa distorsión y emisiones fuera de banda. Se evita controlando el nivel de audio de entrada.

### Modulación en Frecuencia (FM) y Fase (PM)

Desviación de frecuencia (Δf)
    Variación máxima de la frecuencia respecto a la portadora.

Índice de modulación (β)
    β = Δf / fm (desviación / frecuencia moduladora)

Ancho de banda FM (regla de Carson)
    BW ≈ 2 × (Δf + fm)

Designación: **F3E** para FM de voz.

### Modulación digital

Tipo| Descripción  
---|---  
FSK| Frequency Shift Keying - dos frecuencias representan 0 y 1  
2PSK (BPSK)| 2 fases (0° y 180°) - 1 bit por símbolo  
4PSK (QPSK)| 4 fases (0°, 90°, 180°, 270°) - 2 bits por símbolo  
QAM| Combina modulación de amplitud y fase - múltiples bits por símbolo  
  
Velocidad binaria (bit rate)
    Número de bits transmitidos por segundo (bps).

Velocidad de símbolo (baud rate)
    Número de cambios de estado por segundo (baudios).

Relación: Velocidad binaria = Velocidad de símbolo × bits por símbolo

### Detección y corrección de errores

  * **CRC (Cyclic Redundancy Check):** detecta errores mediante código de redundancia
  * **FEC (Forward Error Correction):** permite corregir errores sin retransmisión

## 1.9 Potencia y energía

### Potencia de señales sinusoidales

P = Vrms × Irms = Vrms² / R = Irms² × R 

### El decibelio (dB)

Unidad logarítmica para expresar relaciones de potencia:

dB = 10 × log₁₀(P₂ / P₁) 

Relación de potencia| dB  
---|---  
×2| +3 dB  
×10| +10 dB  
×100| +20 dB  
×1000| +30 dB  
÷2| -3 dB  
÷10| -10 dB  
  
### Amplificadores y atenuadores en serie

Los decibelios se suman algebraicamente:

Ganancia total (dB) = G₁ + G₂ + G₃ + ...  
Ejemplo: Amplificador +20 dB + Atenuador -6 dB = +14 dB total

### Adaptación de impedancias

La **máxima transferencia de potencia** se produce cuando la impedancia de la fuente es igual a la impedancia de la carga (Zfuente = Zcarga).

### Rendimiento

η = (Psalida / Pentrada) × 100% 

### Potencia en la cresta de la envolvente (PEP)

Potencia media durante un ciclo de RF en el pico máximo de la envolvente de modulación. Importante en SSB donde la potencia varía con el audio.

## 1.10 Procesado digital de señales (DSP)

### Muestreo y cuantificación

El procesado digital requiere convertir señales analógicas a digitales:

Muestreo
    Tomar valores discretos de la señal a intervalos regulares.

Cuantificación
    Asignar valores numéricos discretos a cada muestra.

### Frecuencia de Nyquist

**f muestreo ≥ 2 × fmáxima de la señal**

Si no se cumple, se produce **aliasing** (solapamiento de frecuencias).

### Filtros

  * **Filtro antisolapamiento:** filtro paso bajo antes del muestreo para eliminar frecuencias superiores a fNyquist
  * **Filtro de reconstrucción:** filtro paso bajo después de la conversión D/A para suavizar la señal

### Conversores

A/D (Analógico a Digital)
    Convierte señal analógica en valores digitales.

D/A (Digital a Analógico)
    Convierte valores digitales en señal analógica.
