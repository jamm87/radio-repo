> **Fuente:** contenido adaptado de [eaharec.com](https://eaharec.com/parte1/tema3.html) — proyecto de código abierto (licencia MIT).
> Repositorio original: [https://github.com/t00mas/eaharec](https://github.com/t00mas/eaharec).
> Basado en el Anexo II de la Orden IET/1311/2013 (CEPT T/R 61-02).


# Tema 3: Circuitos

Combinaciones de componentes, filtros, fuentes, amplificadores y osciladores

## 3.1 Combinación de componentes

### Resistencias en serie

Rtotal = R₁ + R₂ + R₃ + ... 

### Resistencias en paralelo

1/Rtotal = 1/R₁ + 1/R₂ + 1/R₃ + ...  
Para dos resistencias: Rtotal = (R₁ × R₂) / (R₁ + R₂)

### Condensadores en serie

1/Ctotal = 1/C₁ + 1/C₂ + 1/C₃ + ...  
(Fórmula inversa a resistencias)

### Condensadores en paralelo

Ctotal = C₁ + C₂ + C₃ + ... 

### Bobinas en serie (sin acoplamiento mutuo)

Ltotal = L₁ + L₂ + L₃ + ... 

### Bobinas en paralelo (sin acoplamiento mutuo)

1/Ltotal = 1/L₁ + 1/L₂ + 1/L₃ + ... 

### Impedancia

Z = √(R² + X²)  
X = XL \- XC (reactancia neta)

### Comportamiento a altas frecuencias

  * **Resistencias:** presentan inductancia parásita (terminales) y capacidad parásita
  * **Condensadores:** presentan inductancia en serie (ESL) y resistencia (ESR)
  * **Bobinas:** presentan capacidad parásita entre espiras, autorresonancia

## 3.2 Filtros

### Circuitos sintonizados

#### Circuito LC serie (resonancia serie)

A la frecuencia de resonancia, la impedancia es mínima (solo R).

f0 = 1 / (2π√(LC)) 

#### Circuito LC paralelo (resonancia paralela)

A la frecuencia de resonancia, la impedancia es máxima.

f0 = 1 / (2π√(LC)) 

### Factor de calidad Q

Q = f0 / BW = XL / R = XC / R 

Q alto → banda estrecha, mayor selectividad.

### Ancho de banda

BW = f0 / Q 

### Tipos de filtros

Tipo| Función| Aplicación  
---|---|---  
Paso bajo| Deja pasar frecuencias bajas, atenúa altas| Eliminar armónicos, audio  
Paso alto| Deja pasar frecuencias altas, atenúa bajas| Eliminar DC, zumbido  
Paso banda| Deja pasar un rango de frecuencias| Selectividad en receptores  
Rechazo de banda (notch)| Atenúa un rango específico| Eliminar interferencias  
  
### Filtros en Pi y en T

  * **Filtro en Pi (π):** Dos condensadores en paralelo con bobina en serie. Común en salida de transmisores.
  * **Filtro en T:** Dos bobinas en serie con condensador en paralelo.

### Filtros de cuarzo

Cristales de cuarzo como elementos resonantes. Q extremadamente alto (10.000-100.000). Usados para filtros de FI en receptores SSB/CW.

### Filtros digitales

Implementados mediante DSP:

  * **FIR (Finite Impulse Response):** Respuesta finita, fase lineal, estables
  * **IIR (Infinite Impulse Response):** Respuesta infinita, más eficientes, pueden ser inestables

## 3.3 Fuentes de alimentación

### Rectificadores

Tipo| Descripción| Rizado  
---|---|---  
Media onda| Un diodo, usa solo semiciclo positivo| Alto (frecuencia = f red)  
Onda completa (toma central)| Dos diodos, transformador con toma central| Menor (f = 2× f red)  
Puente de diodos| Cuatro diodos, usa ambos semiciclos| Menor (f = 2× f red)  
  
### Filtrado

Condensadores electrolíticos de gran capacidad para reducir el rizado. A veces combinados con bobinas (filtro LC).

Vrizado ≈ Icarga / (f × C) 

### Estabilización (regulación)

  * **Zener:** Regulación simple, baja potencia
  * **Reguladores integrados:** 78xx (positivo), 79xx (negativo). Ejemplo: 7812 = +12V
  * **Reguladores ajustables:** LM317, LM337

### Fuentes conmutadas (switching)

Convierten DC a alta frecuencia, transforman y rectifican. Ventajas: alta eficiencia, menor tamaño/peso.

Consideraciones
     **Aislamiento:** Transformador de alta frecuencia proporciona aislamiento galvánico.  
**EMC:** Generan ruido RF, requieren filtrado y apantallamiento adecuados. 

## 3.4 Amplificadores

### Ganancia

Ganancia de tensión: Av = Vsalida / Ventrada  
Ganancia de potencia: Ap = Psalida / Pentrada  
En dB: G(dB) = 10 log(Pout/Pin) = 20 log(Vout/Vin) 

### Respuesta en frecuencia y ancho de banda

Rango de frecuencias donde la ganancia se mantiene dentro de -3dB del valor máximo.

### Clases de amplificadores

Clase| Ángulo de conducción| Rendimiento| Distorsión| Uso  
---|---|---|---|---  
A| 360°| ~25-50%| Baja| Audio, pequeña señal  
AB| 180°-360°| ~50-70%| Media| Audio potencia  
B| 180°| ~70%| Alta (cruce)| Push-pull audio  
C| <180°| ~80%| Alta| RF potencia (sintonizado)  
  
### Distorsión

Distorsión armónica
    Generación de armónicos de la señal de entrada. Se especifica como THD (Total Harmonic Distortion).

Distorsión por intermodulación (IMD)
    Con dos o más señales de entrada, aparecen productos en frecuencias suma y diferencia. Crítica en transmisores y receptores.

### Sobrecarga de etapas

Cuando la señal excede el rango lineal del amplificador, se produce recorte (clipping) y distorsión severa. En transmisores causa splatter (interferencia a canales adyacentes).

## 3.5 Detectores/Demoduladores

### Detectores de AM

  * **Detector de envolvente:** Diodo + RC. Simple, para AM convencional (A3E).
  * **Detector de producto:** Mezclador con oscilador local. Para SSB y CW.

### Oscilador de batido (BFO)

Oscilador local necesario para demodular CW y SSB. Genera la portadora que falta.

### Demoduladores de FM

  * **Detector de pendiente:** Usa la pendiente de un circuito sintonizado descentrado.
  * **Discriminador (Foster-Seeley):** Dos circuitos sintonizados, mejor linealidad.
  * **Detector de relación (ratio detector):** Insensible a variaciones de amplitud.
  * **PLL:** Detector moderno, muy lineal.

## 3.6 Osciladores

### Condiciones de oscilación (Barkhausen)

  1. Ganancia del lazo ≥ 1 (|Aβ| ≥ 1)
  2. Desfase total del lazo = 0° (o múltiplo de 360°)

### Realimentación

  * **Oscilación intencionada:** Realimentación positiva controlada para generar señal.
  * **Oscilación no intencionada:** Realimentación parásita en amplificadores. Causa inestabilidad.

### Factores que afectan la frecuencia

  * Valores de L y C del circuito resonante
  * Capacidades parásitas
  * Temperatura (afecta a componentes)
  * Tensión de alimentación
  * Carga

### Osciladores LC

  * **Hartley:** Bobina con toma central
  * **Colpitts:** Divisor capacitivo
  * **Clapp:** Variante de Colpitts, mejor estabilidad

### Osciladores a cristal

Cristal de cuarzo como elemento resonante. Muy alta estabilidad (partes por millón).

Oscilador de sobretonos (overtone)
    Usa armónicos mecánicos del cristal para frecuencias más altas (3º, 5º, 7º sobretono).

### VCO (Voltage Controlled Oscillator)

Oscilador cuya frecuencia varía con una tensión de control. Usa varicap. Fundamental en sintetizadores PLL.

### Ruido de fase

Fluctuaciones aleatorias de la fase/frecuencia del oscilador. Importante en sistemas de comunicaciones. Aparece como "faldas" alrededor de la portadora en el analizador de espectros.

## 3.7 Sintetizadores de frecuencia (PLL)

### Lazo de enganche de fase (PLL)

Sistema realimentado que sincroniza un VCO con una referencia estable.

### Componentes del PLL

  * **Detector de fase:** Compara fase del VCO con la referencia
  * **Filtro de lazo:** Filtra el error, determina respuesta del sistema
  * **VCO:** Genera la frecuencia de salida
  * **Divisor programable:** Divide la frecuencia del VCO por N

### Funcionamiento

fsalida = N × freferencia

Cambiando N (divisor programable) se obtienen diferentes frecuencias de salida, todas con la estabilidad de la referencia (cristal).

### Aplicaciones

  * Sintetizadores de frecuencia en transceivers
  * Demoduladores FM
  * Recuperación de reloj en sistemas digitales

## 3.8 Circuitos con procesadores digitales de señal (DSP)

### Filtros digitales

  * **IIR:** Eficientes, pueden emular filtros analógicos clásicos
  * **FIR:** Fase lineal, siempre estables, más predecibles

### Síntesis digital directa (DDS)

Genera formas de onda mediante tabla de valores y conversor D/A. Permite cambios de frecuencia instantáneos, muy baja fase de ruido.

### Otros circuitos DSP

  * Moduladores y demoduladores digitales
  * Reducción de ruido
  * Cancelación de interferencias
  * Ecualización automática
