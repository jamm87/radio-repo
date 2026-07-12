> **Fuente:** contenido adaptado de [eaharec.com](https://eaharec.com/parte1/tema8.html) — proyecto de código abierto (licencia MIT).
> Repositorio original: [https://github.com/t00mas/eaharec](https://github.com/t00mas/eaharec).
> Basado en el Anexo II de la Orden IET/1311/2013 (CEPT T/R 61-02).


# Tema 8: Medidas

Técnicas y equipos de medida en radiocomunicaciones

## 8.1 Medida de corriente y tensión

### Corriente continua (DC)

  * El amperímetro se conecta en **serie** con el circuito
  * Debe tener resistencia interna muy baja
  * Se usa shunt (resistencia de derivación) para ampliar el rango

### Tensión continua (DC)

  * El voltímetro se conecta en **paralelo**
  * Debe tener resistencia interna muy alta
  * Se usa divisor resistivo para ampliar el rango

### Corriente y tensión alterna (AC)

  * Los instrumentos pueden medir valor eficaz (RMS), medio o pico
  * Instrumentos de valor verdadero RMS para ondas no sinusoidales
  * La mayoría de multímetros baratos asumen onda sinusoidal

### Errores en las medidas

  * **Carga del circuito:** El instrumento altera el circuito medido
  * **Error de lectura:** Paralaje, precisión del instrumento
  * **Errores por temperatura:** Los componentes varían con T

### Influencia de la frecuencia

  * Los instrumentos tienen limitación de frecuencia
  * Capacidades e inductancias parásitas afectan a alta frecuencia
  * Usar equipos especificados para RF

### Influencia de la forma de onda

  * Instrumentos de valor medio calibrados para sinusoidales dan error con otras ondas
  * Para señales complejas usar True RMS

### Resistencia interna del instrumento

  * Voltímetro: Alta Z para no cargar (típico: 10MΩ)
  * Amperímetro: Baja Z para no añadir resistencia

## 8.2 Medida de resistencia

  * El óhmetro aplica tensión conocida y mide corriente
  * **Importante:** Circuito sin alimentación al medir
  * Escalas logarítmicas en analógicos
  * Método de 4 hilos para resistencias bajas (elimina resistencia de cables)

## 8.3 Medida de potencia

### Potencia de corriente continua

P = V × I 

Se mide tensión e intensidad y se multiplica.

### Potencia de radiofrecuencia

  * Vatímetros de RF con carga ficticia (dummy load)
  * Vatímetros direccionales (en línea)
  * Medida de potencia media y potencia de pico (PEP)

### Potencia media vs. PEP

Potencia media
    Potencia promediada en el tiempo. Relevante para disipación térmica.

PEP (Peak Envelope Power)
    Potencia en el pico máximo de la envolvente. Relevante para SSB y modos con variación de amplitud.

## 8.4 Medida de ondas estacionarias (ROE/SWR)

### Principio

El medidor de ROE detecta las ondas directa y reflejada en una línea de transmisión.

ROE = (Vmax) / (Vmin) = (Pdirecta \+ Preflejada) / (Pdirecta \- Preflejada) 

### Uso

  1. Conectar entre transmisor y línea/antena
  2. Calibrar con la potencia directa (forward)
  3. Leer ROE en la posición reflejada (reflected)

### Interpretación

ROE| Potencia reflejada| Estado  
---|---|---  
1:1| 0%| Adaptación perfecta  
1.5:1| 4%| Excelente  
2:1| 11%| Bueno  
3:1| 25%| Aceptable  
>3:1| >25%| Requiere ajuste  
  
## 8.5 Forma de onda de la envolvente

La forma de la envolvente de RF muestra la modulación:

  * **CW:** Envolvente rectangular con flancos suaves
  * **AM:** Envolvente que sigue la forma del audio
  * **SSB:** Envolvente variable según el habla
  * **FM:** Envolvente constante (amplitud no varía)

Se observa con osciloscopio para detectar sobremodulación, distorsión, etc.

## 8.6 Medida de frecuencia

  * **Frecuencímetro digital:** Cuenta ciclos en un tiempo conocido
  * **Heterodino:** Comparación con frecuencia conocida
  * **Analizador de espectros:** Muestra frecuencia y amplitud

### Frecuencia de resonancia

Se determina variando la frecuencia hasta encontrar máximo de corriente (serie) o máximo de impedancia (paralelo). Útil para ajustar antenas y filtros.

## 8.7 Equipos de medida

### Polímetro (multímetro)

  * Mide V, I, R (y a menudo capacidad, frecuencia, etc.)
  * **Analógico:** Aguja móvil, bueno para ver variaciones
  * **Digital:** Mayor precisión, más funciones

### Vatímetro de RF

  * Mide potencia en líneas de transmisión
  * Tipos: termopar, bolómetro, diodo
  * Requiere carga adaptada (50Ω) o carga ficticia

### Medidor de ROE

  * Puente direccional que separa ondas directa y reflejada
  * Algunos combinan vatímetro y medidor de ROE

### Frecuencímetro

  * Mide frecuencia con alta precisión
  * Base de tiempo de cristal o GPS
  * Resolución típica: 1 Hz o mejor

### Osciloscopio

  * Muestra forma de onda en función del tiempo
  * Permite medir amplitud, período, forma de señales
  * Diagnóstico de modulación, distorsión
  * Ancho de banda limitado (verificar especificaciones)

### Analizador de espectros

  * Muestra amplitud en función de la frecuencia
  * Detecta armónicos, espurios, ancho de banda ocupado
  * Esencial para verificar pureza espectral de transmisores
  * Parámetros: span, RBW, nivel de referencia

### Analizador de antenas

  * Mide impedancia, ROE, resonancia de antenas
  * Genera señal de prueba y analiza reflexiones
  * Muy útil para ajustar antenas y líneas
