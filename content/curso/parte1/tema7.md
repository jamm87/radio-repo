> **Fuente:** contenido adaptado de [eaharec.com](https://eaharec.com/parte1/tema7.html) — proyecto de código abierto (licencia MIT).
> Repositorio original: [https://github.com/t00mas/eaharec](https://github.com/t00mas/eaharec).
> Basado en el Anexo II de la Orden IET/1311/2013 (CEPT T/R 61-02).


# Tema 7: Propagación

Propagación de ondas electromagnéticas y factores que la afectan

## Atenuación de la señal

### Propagación en espacio libre

La atenuación aumenta con la distancia y la frecuencia:

Atenuación (dB) = 32.4 + 20 log f(MHz) + 20 log d(km) 

Al duplicar la distancia, la señal se reduce 6 dB (1/4 de potencia).

### Relación señal/ruido (S/N)

Determina la calidad de recepción. Depende de:

  * Potencia de la señal recibida
  * Ruido externo (atmosférico, artificial, galáctico)
  * Ruido interno del receptor

## La ionosfera

Región de la atmósfera (60-600 km) donde los gases están ionizados por radiación solar. Permite la propagación a larga distancia en HF.

### Capas de la ionosfera

Capa| Altura| Características  
---|---|---  
D | 60-90 km | Solo de día. Absorbe frecuencias bajas. Desaparece de noche.  
E | 90-140 km | Presente de día, débil de noche. Refracta frecuencias medias.  
Es (E esporádica) | ~100 km | Irregular, puede refractar VHF. Más común en verano.  
F1 | 140-200 km | Solo de día, se fusiona con F2 de noche.  
F2 | 200-600 km | Principal capa para HF. Presente día y noche.  
  
### Influencia del Sol

  * **Ciclo solar (11 años):** Mayor actividad = mejor propagación en frecuencias altas
  * **Variación diaria:** Ionización máxima al mediodía local
  * **Variación estacional:** Diferencias entre verano e invierno
  * **Tormentas solares:** Pueden causar perturbaciones o apagones de propagación

## Frecuencias críticas

### Frecuencia crítica (foF2)

Máxima frecuencia que puede ser reflejada por una capa en incidencia vertical.

### MUF (Maximum Usable Frequency)

Máxima frecuencia utilizable para una distancia determinada.

MUF = foF2 × sec(θ)  
θ = ángulo de incidencia

Típicamente MUF ≈ 3 × foF2 para distancias largas.

### FOT (Frequency of Optimum Traffic)

Frecuencia óptima de trabajo. Aproximadamente 85% de la MUF. Proporciona margen de seguridad.

### LUF (Lowest Usable Frequency)

Frecuencia mínima utilizable. Por debajo hay demasiada absorción (especialmente en capa D de día).

## Modos de propagación

### Onda de tierra (ground wave)

  * Se propaga siguiendo la superficie terrestre
  * Predominante en MF y frecuencias bajas de HF
  * Alcance limitado (100-500 km típico)
  * Más eficaz sobre mar que sobre tierra
  * Usada en 160m y 80m de día

### Onda de espacio (sky wave)

  * Refractada por la ionosfera
  * Permite comunicaciones a larga distancia (DX)
  * Predominante en HF
  * Varía con hora, estación y ciclo solar

### Ángulo de radiación

Ángulo de la onda respecto al horizonte:

  * **Ángulo bajo (5-15°):** DX, saltos largos
  * **Ángulo alto (>30°):** Comunicaciones regionales, NVIS

### Distancia de salto (skip distance)

Distancia mínima para comunicación ionosférica. Existe una zona de silencio entre la cobertura de onda de tierra y el primer salto ionosférico.

### Saltos múltiples

La señal puede reflejarse varias veces entre ionosfera y tierra, permitiendo alcances de miles de kilómetros.

### Desvanecimiento (fading)

Variación de la intensidad de señal debido a:

  * Interferencia entre ondas por múltiples trayectos
  * Cambios en la ionosfera
  * Rotación de la polarización

## Propagación troposférica

La troposfera (0-10 km) afecta principalmente a VHF y superiores.

### Línea de visión directa

Horizonte radioeléctrico (km) ≈ 4.12 × √h (metros)  
Algo mayor que el horizonte óptico por refracción

### Influencia de la altura de antena

Mayor altura = mayor alcance. Fundamental en VHF/UHF.

### Inversión de temperatura

Cuando una capa de aire caliente queda sobre aire frío, se forma un conducto que puede extender enormemente el alcance en VHF/UHF.

### Propagación por conducto (ducting)

  * Las ondas quedan atrapadas en capas atmosféricas
  * Alcances de cientos o miles de km en VHF
  * Más frecuente en verano y sobre el mar

## Modos especiales de propagación

### Capa E esporádica

  * Nubes de ionización intensa a ~100 km
  * Puede reflejar señales de VHF (hasta 144 MHz, a veces más)
  * Impredecible, más común en verano
  * Duración variable (minutos a horas)

### Reflexión por auroras

  * Señales reflejadas por la ionización de las auroras boreales/australes
  * Produce señales distorsionadas (flutter)
  * Útil en VHF, especialmente en latitudes altas

### Dispersión por meteoritos (meteor scatter)

  * Los meteoritos crean estelas ionizadas al entrar en la atmósfera
  * Reflexiones breves (segundos) en VHF
  * Útil para comunicaciones de ~1000-2000 km
  * Mejor durante lluvias de meteoritos

### Reflexión lunar (EME - Earth-Moon-Earth)

  * La señal viaja a la Luna y vuelve
  * Retardo ~2.5 segundos
  * Requiere equipos potentes y antenas de alta ganancia
  * Pérdidas de ~250 dB

## Ruido

### Ruido atmosférico

Generado por tormentas eléctricas. Predominante en frecuencias bajas. Mayor en zonas tropicales.

### Ruido galáctico

Radiación de fondo del universo. Notable en VHF cuando se apunta al centro de la galaxia.

### Ruido artificial

Fuentes: motores, líneas eléctricas, electrónica, fuentes conmutadas, LED. Principal limitante en zonas urbanas.

### Ruido térmico

Generado por la agitación térmica de los electrones. Presente en todos los conductores.

## Predicción de propagación

### Índices solares

  * **SFI (Solar Flux Index):** Flujo solar a 2800 MHz. Mayor = mejor propagación HF alta.
  * **SSN (Sunspot Number):** Número de manchas solares.
  * **K-index:** Perturbación geomagnética (0-9). Bajo = condiciones estables.
  * **A-index:** Media diaria de perturbación.

### Cálculo básico

Para estimar la banda adecuada:

  * Calcular la hora solar en el punto medio del trayecto
  * Considerar el índice SFI y la estación del año
  * Usar programas de predicción (VOACAP, etc.)
  * Experiencia y observación de las condiciones
