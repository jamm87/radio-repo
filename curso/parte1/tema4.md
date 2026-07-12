> **Fuente:** contenido adaptado de [eaharec.com](https://eaharec.com/parte1/tema4.html) — proyecto de código abierto (licencia MIT).
> Repositorio original: [https://github.com/t00mas/eaharec](https://github.com/t00mas/eaharec).
> Basado en el Anexo II de la Orden IET/1311/2013 (CEPT T/R 61-02).


# Tema 4: Receptores

Tipos, diagramas de bloques, etapas y características de receptores

## 4.1 Tipos de receptores

### Receptor superheterodino

El tipo más común. Convierte la señal recibida a una frecuencia intermedia (FI) fija donde se realiza la mayor parte de la amplificación y filtrado.

Simple conversión
    Una sola frecuencia intermedia. Más sencillo pero puede tener problemas con la imagen.

Doble conversión
    Dos frecuencias intermedias. Primera FI alta (mejor rechazo de imagen), segunda FI baja (mejor selectividad). Usado en receptores de calidad.

**Principio:** fFI = |fseñal \- fOL| 

### Receptor de conversión directa

El oscilador local está a la misma frecuencia que la señal recibida. La señal se convierte directamente a audio. Simple, pero sensible a ruido del oscilador y requiere buena estabilidad.

## 4.2 Diagramas de bloques

### Receptor superheterodino básico

Antena → Amplificador RF → Mezclador → Filtro FI → Amplificador FI → Detector → Amplificador AF → Altavoz  
                                    ↑  
                                   VFO/Sintetizador 

### Receptor CW (A1A)

Incluye BFO (oscilador de batido) para generar el tono audible:

... → Detector de producto ← BFO → Amplificador AF → Altavoz 

### Receptor AM (A3E)

Usa detector de envolvente (diodo):

... → Detector de envolvente → Amplificador AF → Altavoz 

### Receptor SSB (J3E)

Requiere BFO para reponer la portadora suprimida:

... → Detector de producto ← BFO → Amplificador AF → Altavoz 

### Receptor FM (F3E)

Incluye limitador antes del discriminador:

... → Limitador → Discriminador FM → Amplificador AF → Altavoz 

## 4.3 Etapas del receptor

### Amplificador de radiofrecuencia (RF)

  * Primera etapa después de la antena
  * Amplifica señales débiles
  * Proporciona selectividad inicial (preselección)
  * Mejora la figura de ruido del receptor
  * Protege al mezclador de señales fuertes

### Oscilador local

  * **VFO (Variable Frequency Oscillator):** Oscilador LC ajustable manualmente
  * **Sintetizador PLL/DDS:** Controlado digitalmente, alta estabilidad
  * Determina la frecuencia de recepción

### Mezclador

  * Combina señal RF con oscilador local
  * Genera frecuencia intermedia: FI = |fRF \- fOL|
  * Tipos: diodos, transistores, circuitos integrados
  * Parámetro crítico: punto de intercepción (IP3)

### Filtro de FI

  * Determina la selectividad del receptor
  * Tipos: LC, cerámicos, cristal, mecánicos, DSP
  * Anchos de banda típicos: CW ~500Hz, SSB ~2.4kHz, AM ~6kHz, FM ~15kHz

### Amplificador de FI

  * Proporciona la mayor parte de la ganancia
  * Trabaja a frecuencia fija (mejor optimización)
  * Controlado por AGC

### Limitador (solo FM)

  * Elimina variaciones de amplitud
  * La información en FM está en la frecuencia, no en la amplitud
  * Reduce ruido impulsivo y variaciones de nivel

### Detector

  * Extrae la información de audio de la señal de FI
  * Tipo depende del modo de emisión

### BFO (Beat Frequency Oscillator)

  * Necesario para CW y SSB
  * Genera la portadora que falta
  * Ajustable para USB/LSB y pitch de CW

### Amplificador de audiofrecuencia (AF)

  * Amplifica la señal de audio para el altavoz
  * Control de volumen
  * Puede incluir filtros de audio

### AGC (Control Automático de Ganancia)

  * Mantiene nivel de salida constante con señales variables
  * Evita saturación con señales fuertes
  * Mejora inteligibilidad con fading
  * Constantes de tiempo: rápido, lento, off

### S-meter (medidor de señal)

  * Indica intensidad de la señal recibida
  * Escala S1-S9, luego dB sobre S9
  * Derivado de la tensión de AGC

### Silenciador (squelch)

  * Silencia el audio cuando no hay señal
  * Elimina ruido de fondo molesto en FM
  * Ajustable por umbral

## 4.4 Características de los receptores

### Selectividad

Capacidad de separar señales en frecuencias adyacentes. Se mide por el ancho de banda a -6dB y la forma del filtro.

Factor de forma = BW-60dB / BW-6dB  
Ideal ≈ 1, típico 1.5-2.5

### Canal adyacente

Rechazo de señales en canales contiguos. Importante en bandas congestionadas.

### Sensibilidad

Capacidad de recibir señales débiles. Se especifica como:

  * Mínima señal para relación S/N determinada (típico: 10dB S/N)
  * MDS (Minimum Discernible Signal)

### Ruido y figura de ruido

Ruido interno
    Generado por los propios componentes del receptor (térmico, shot, flicker).

Figura de ruido (NF)
    Degradación de la relación S/N causada por el receptor. En dB. Menor = mejor.

### Estabilidad de frecuencia

Constancia de la frecuencia del oscilador local. Importante para SSB y modos digitales. Afectada por temperatura, tensión, envejecimiento.

### Frecuencia imagen

Frecuencia espuria que también produce la misma FI:

fimagen = fseñal ± 2 × fFI

Se rechaza mediante filtros de entrada y/o FI alta.

### Desensibilización y bloqueo

Desensibilización
    Reducción de sensibilidad por presencia de señal fuerte cercana en frecuencia.

Bloqueo
    Caso extremo donde una señal muy fuerte satura el receptor.

### Intermodulación

Señales espurias generadas por mezcla de dos o más señales fuertes en las etapas no lineales del receptor.

Productos de 3er orden: 2f₁ - f₂, 2f₂ - f₁  
Pueden caer dentro de la banda de recepción

Se caracteriza por el **IP3** (punto de intercepción de 3er orden). Mayor IP3 = mejor comportamiento.

### Modulación cruzada

La modulación de una señal fuerte aparece superpuesta a la señal deseada. Causada por no linealidad.
