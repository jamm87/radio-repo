> **Fuente:** contenido adaptado de [eaharec.com](https://eaharec.com/parte1/tema2.html) — proyecto de código abierto (licencia MIT).
> Repositorio original: [https://github.com/t00mas/eaharec](https://github.com/t00mas/eaharec).
> Basado en el Anexo II de la Orden IET/1311/2013 (CEPT T/R 61-02).


# Tema 2: Componentes

Componentes electrónicos pasivos y activos

## 2.1 Resistencias

La resistencia es la oposición al paso de la corriente eléctrica. Se mide en ohmios (Ω).

### Tipos de resistencias

  * **Carbón (composición):** baratas, tolerancia 5-20%, uso general
  * **Película de carbón:** mejor estabilidad, tolerancia 1-5%
  * **Película metálica:** alta precisión, tolerancia 0.1-1%, bajo ruido
  * **Bobinadas:** alta potencia, inductivas, no aptas para RF
  * **SMD:** montaje superficial, tamaño reducido

### Código de colores

Color | Dígito | Multiplicador | Tolerancia  
---|---|---|---  
Negro| 0| ×1| —  
Marrón| 1| ×10| ±1%  
Rojo| 2| ×100| ±2%  
Naranja| 3| ×1k| —  
Amarillo| 4| ×10k| —  
Verde| 5| ×100k| ±0.5%  
Azul| 6| ×1M| ±0.25%  
Violeta| 7| ×10M| ±0.1%  
Gris| 8| —| —  
Blanco| 9| —| —  
Oro| —| ×0.1| ±5%  
Plata| —| ×0.01| ±10%  
  
**Lectura (4 bandas):** 1ª cifra | 2ª cifra | multiplicador | tolerancia  
Ejemplo: Marrón-Negro-Rojo-Oro = 10 × 100 = 1000Ω (1kΩ) ±5%

### Característica corriente/tensión

En resistencias ideales, la relación V/I es lineal (Ley de Ohm). La pendiente de la recta es el valor de la resistencia.

### Disipación de potencia

P = I² × R = V² / R 

Las resistencias tienen una potencia nominal máxima (1/4W, 1/2W, 1W, 2W, 5W...). Superarla causa sobrecalentamiento y destrucción.

### Coeficientes de temperatura

PTC (Positive Temperature Coefficient)
    La resistencia aumenta con la temperatura. Ejemplo: metales, termistores PTC.

NTC (Negative Temperature Coefficient)
    La resistencia disminuye con la temperatura. Ejemplo: termistores NTC, semiconductores.

## 2.2 Condensadores

El condensador almacena energía en un campo eléctrico entre dos placas conductoras separadas por un dieléctrico.

### Capacidad

Se mide en **faradios (F)**. El faradio es muy grande, se usan submúltiplos:

  * mF (milifaradio) = 10⁻³ F
  * µF (microfaradio) = 10⁻⁶ F
  * nF (nanofaradio) = 10⁻⁹ F
  * pF (picofaradio) = 10⁻¹² F

### Factores que afectan la capacidad

C = ε × (A / d)  
ε = permitividad del dieléctrico, A = área de placas, d = distancia entre placas

  * Mayor área de placas → mayor capacidad
  * Menor distancia entre placas → mayor capacidad
  * Mayor permitividad del dieléctrico → mayor capacidad

### Reactancia capacitiva

XC = 1 / (2πfC)  
La reactancia disminuye al aumentar la frecuencia

### Relación de fase

En un condensador, la **corriente adelanta 90°** a la tensión.

### Tipos de condensadores

Tipo| Características| Uso  
---|---|---  
Aire| Variable, baja capacidad, sin pérdidas| Sintonía RF  
Mica| Estables, baja tolerancia, RF| Circuitos resonantes  
Plástico (poliéster, polipropileno)| Estables, bajo coste| Filtros, acoplamiento  
Cerámicos| Compactos, amplio rango de valores| Desacoplo, RF  
Electrolíticos| Alta capacidad, polarizados| Filtrado fuentes DC  
  
### Coeficiente de temperatura

Indica cómo varía la capacidad con la temperatura. Importante en circuitos de precisión y osciladores.

### Corriente de fuga

Pequeña corriente que atraviesa el dieléctrico. Mayor en electrolíticos. Importante en circuitos de temporización.

## 2.3 Bobinas (inductores)

La bobina almacena energía en un campo magnético. Se opone a cambios en la corriente.

### Autoinducción

Se mide en **henrios (H)**. Submúltiplos: mH (milihenrio), µH (microhenrio).

### Factores que afectan la inductancia

  * Mayor número de espiras → mayor inductancia (proporcional a N²)
  * Mayor diámetro → mayor inductancia
  * Menor longitud → mayor inductancia
  * Material del núcleo: aire < ferrita < hierro (mayor permeabilidad = mayor L)

### Reactancia inductiva

XL = 2πfL  
La reactancia aumenta con la frecuencia

### Relación de fase

En una bobina, la **tensión adelanta 90°** a la corriente (o la corriente atrasa 90°).

### Factor Q (calidad)

Q = XL / R = 2πfL / R 

Un Q alto indica pocas pérdidas. Importante en circuitos resonantes.

### Efecto pelicular (skin effect)

A altas frecuencias, la corriente circula por la superficie del conductor, aumentando la resistencia efectiva. Se mitiga usando hilo de Litz o conductores huecos.

### Pérdidas

  * Pérdidas en el conductor (resistencia del hilo)
  * Pérdidas en el núcleo (histéresis, corrientes parásitas)
  * Efecto pelicular a altas frecuencias

## 2.4 Transformadores

Dispositivo que transfiere energía entre dos bobinas acopladas magnéticamente. Permite cambiar niveles de tensión y adaptar impedancias.

### Transformador ideal

Pprimario = Psecundario (sin pérdidas)  
V1 × I1 = V2 × I2

### Relación de transformación (n)

n = N1 / N2 = V1 / V2 = I2 / I1

  * n > 1: Transformador reductor (baja la tensión)
  * n < 1: Transformador elevador (sube la tensión)

### Transformación de impedancias

Z1 / Z2 = n²  
La impedancia se transforma con el cuadrado de la relación de espiras

Ejemplo: Un transformador 4:1 en espiras transforma la impedancia en relación 16:1.

### Aplicaciones en radioafición

  * Fuentes de alimentación
  * Adaptación de impedancias (antena-transceptor)
  * Baluns (transformadores de equilibrado)
  * Aislamiento galvánico

## 2.5 Diodos

Semiconductor que permite el paso de corriente en un solo sentido (ánodo → cátodo).

### Tipos y aplicaciones

Tipo| Función| Aplicación  
---|---|---  
Rectificador| Conversión AC→DC| Fuentes de alimentación  
Zener| Regulación de tensión| Estabilizadores, referencias  
LED| Emisión de luz| Indicadores, iluminación  
Varicap (varactor)| Capacidad variable con tensión| Sintonía electrónica, VCO  
Schottky| Conmutación rápida, baja caída| Mezcladores RF, detectores  
PIN| Resistencia variable con corriente| Atenuadores RF, conmutadores  
  
### Tensión inversa máxima (PIV)

Máxima tensión en polarización inversa que soporta sin romperse. Superarla destruye el diodo.

### Corriente de fuga

Pequeña corriente que circula en polarización inversa. Aumenta con la temperatura.

### Caída de tensión directa

  * Silicio: ~0.6-0.7V
  * Germanio: ~0.2-0.3V
  * Schottky: ~0.2-0.4V
  * LED: 1.5-3.5V (según color)

## 2.6 Transistores

### Transistores bipolares (BJT)

Tres terminales: Base (B), Colector (C), Emisor (E). Tipos NPN y PNP.

Factor de amplificación (β o hFE)
    β = IC / IB  
Relación entre corriente de colector y corriente de base. Típicamente 50-300.

### Transistores de efecto campo (FET)

Tres terminales: Puerta (G), Drenador (D), Fuente (S). Controlados por tensión.

  * **JFET:** Unión PN, normalmente ON
  * **MOSFET:** Puerta aislada, alta impedancia de entrada

### Configuraciones de transistores

Configuración BJT| Configuración FET| Características  
---|---|---  
Emisor común | Fuente común | Alta ganancia de tensión y corriente. Inversión de fase. Uso general.  
Base común | Puerta común | Baja impedancia entrada, alta impedancia salida. Estable en RF.  
Colector común (seguidor de emisor) | Drenador común (seguidor de fuente) | Ganancia ≈1, alta impedancia entrada, baja impedancia salida. Buffer.  
  
### Polarización

Establecer el punto de trabajo (punto Q) mediante resistencias de polarización para que el transistor opere en la zona activa.

## 2.7 Otros componentes

### Válvulas termoiónicas

Dispositivos de vacío que controlan el flujo de electrones. Aún usadas en:

  * Amplificadores de potencia RF de alta potencia
  * Equipos de audio de alta fidelidad

Tipos principales
     **Triodo:** Cátodo, rejilla, ánodo. Amplificación.  
**Tetrodo:** \+ rejilla pantalla. Mejor rendimiento RF.  
**Pentodo:** \+ rejilla supresora. Menor capacidad interelectródica. 

### Circuitos integrados

Múltiples componentes (transistores, resistencias, condensadores) en un solo chip.

  * **Analógicos:** Amplificadores operacionales, reguladores, mezcladores
  * **Digitales:** Puertas lógicas, contadores, microprocesadores
  * **Mixtos:** Conversores A/D y D/A, PLLs

### Circuitos digitales - Generalidades

Trabajan con niveles discretos (0 y 1). Familias lógicas:

  * **TTL:** 5V, rápidos, consumo medio
  * **CMOS:** Amplio rango de tensiones, bajo consumo, sensibles a estática

Puertas básicas
    AND, OR, NOT, NAND, NOR, XOR
