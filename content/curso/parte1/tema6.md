> **Fuente:** contenido adaptado de [eaharec.com](https://eaharec.com/parte1/tema6.html) — proyecto de código abierto (licencia MIT).
> Repositorio original: [https://github.com/t00mas/eaharec](https://github.com/t00mas/eaharec).
> Basado en el Anexo II de la Orden IET/1311/2013 (CEPT T/R 61-02).


# Tema 6: Antenas y líneas de transmisión

Tipos de antenas, características y líneas de alimentación

## 6.1 Tipos de antenas

### Dipolo de media onda (λ/2)

Antena fundamental. Dos elementos de λ/4 cada uno.

Longitud total ≈ 143 / f(MHz) metros (con factor de acortamiento)  
Impedancia en el centro: ~73Ω (en espacio libre) 

#### Alimentado en el centro

  * Impedancia baja (~73Ω), buena adaptación a coaxial 50-75Ω
  * Máximo de corriente, mínimo de tensión en punto de alimentación
  * Patrón omnidireccional perpendicular al eje

#### Alimentado en un extremo

  * Impedancia alta (~2500Ω)
  * Requiere adaptador de impedancia
  * Menor rendimiento que alimentación central

### Dipolo plegado (folded dipole)

  * Dos conductores paralelos conectados en los extremos
  * Impedancia ~300Ω (4× dipolo simple)
  * Mayor ancho de banda
  * Usado como elemento de antenas Yagi

### Antena vertical λ/4

  * Cuarto de onda vertical sobre plano de tierra
  * Impedancia ~36Ω (con plano de tierra perfecto)
  * Omnidireccional en azimut
  * Radiación en ángulo bajo, ideal para DX

Longitud ≈ 71.5 / f(MHz) metros 

### Plano de tierra (ground plane)

  * Vertical λ/4 con radiales
  * Radiales horizontales: Z ≈ 36Ω
  * Radiales a 45°: Z ≈ 50Ω (mejor adaptación)
  * Popular en VHF/UHF

### Antena Yagi-Uda

  * Antena directiva con elementos parásitos
  * **Reflector:** ~5% más largo que el dipolo, detrás
  * **Elemento activo:** dipolo o dipolo plegado
  * **Directores:** ~5% más cortos, delante
  * Más elementos = más ganancia y directividad

Ganancia típica: 6-15 dBd según número de elementos  
dBd = dB sobre dipolo

### Antenas de apertura

#### Antena parabólica

  * Reflector parabólico con alimentador en el foco
  * Muy directiva, alta ganancia
  * Usada en microondas y satélites

G ≈ (π × D / λ)² × η  
D = diámetro, η = eficiencia (~0.5-0.7)

#### Bocina (horn)

  * Transición gradual de guiaondas a espacio libre
  * Usada como alimentador de parábolas
  * Ganancia moderada

### Dipolo con trampas

  * Circuitos LC (trampas) a lo largo del dipolo
  * Permiten operación multibanda
  * Cada trampa "acorta" eléctricamente la antena en su frecuencia

## 6.2 Características de las antenas

### Distribución de tensión y corriente

En una antena resonante:

  * **Dipolo λ/2:** Máximo de corriente en el centro, máximo de tensión en los extremos
  * **Vertical λ/4:** Máximo de corriente en la base, máximo de tensión en la punta

### Impedancia en el punto de alimentación

Antena| Impedancia típica  
---|---  
Dipolo λ/2 (centro)| ~73Ω  
Dipolo plegado| ~300Ω  
Vertical λ/4 (plano tierra perfecto)| ~36Ω  
Ground plane (radiales 45°)| ~50Ω  
Yagi (elemento activo)| 20-50Ω  
  
### Impedancia de antenas no resonantes

  * Antena corta (< λ/4): Impedancia **capacitiva**
  * Antena larga (> λ/4): Impedancia **inductiva**

### Polarización

  * **Horizontal:** Dipolo paralelo al suelo, Yagi horizontal
  * **Vertical:** Vertical, ground plane, Yagi vertical
  * **Circular:** Antenas helicoidales, crossed-yagi

Pérdida por desadaptación de polarización: 20-30 dB entre vertical y horizontal.

### Ganancia

dBi
    Ganancia respecto a antena isotrópica (radiador ideal omnidireccional).

dBd
    Ganancia respecto a dipolo de media onda.

dBi = dBd + 2.15 

### Directividad

Concentración de energía en una dirección. Relacionada con la ganancia pero sin considerar pérdidas.

### Eficiencia

Relación entre potencia radiada y potencia entregada. Depende de pérdidas óhmicas, suelo, etc.

### Área de captura (apertura efectiva)

Ae = G × λ² / (4π) 

Área equivalente que "captura" la energía de la onda incidente.

### Potencia Efectiva Radiada (PER/ERP)

PER = Ptransmisor × Gantena  
En dB: PER(dBW) = P(dBW) + G(dBd)

### Relación adelante-atrás (F/B)

Relación entre ganancia máxima (frente) y ganancia en dirección opuesta (espalda). En dB.

### Diagramas de radiación

  * **Plano horizontal (azimut):** Vista desde arriba
  * **Plano vertical (elevación):** Vista lateral
  * Muestran lóbulo principal, lóbulos secundarios, nulos

## 6.3 Líneas de transmisión

### Línea de conductores paralelos (escalerilla)

  * Dos conductores paralelos separados
  * Impedancia típica: 300-600Ω
  * Bajas pérdidas
  * Sensible a objetos cercanos
  * Línea equilibrada (balanceada)

### Cable coaxial

  * Conductor central + malla exterior + dieléctrico
  * Línea no equilibrada (desbalanceada)
  * Insensible al entorno
  * Fácil de instalar

Tipo| Z₀| Pérdidas| Uso  
---|---|---|---  
RG-58| 50Ω| Altas| HF baja potencia, VHF cortas distancias  
RG-213| 50Ω| Medias| HF media potencia  
RG-8/RG-8X| 50Ω| Medias| Uso general  
LMR-400| 50Ω| Bajas| VHF/UHF largas distancias  
RG-59/RG-6| 75Ω| Variables| TV, recepción  
  
### Guiaondas

  * Tubo metálico hueco (rectangular o circular)
  * Para microondas (>1 GHz)
  * Mínimas pérdidas a frecuencias muy altas
  * Dimensiones determinan frecuencia de corte

### Impedancia característica

Z₀ = √(L/C)  
L = inductancia por unidad de longitud, C = capacidad por unidad de longitud

Depende de geometría y materiales, NO de la longitud.

### Factor de velocidad

v = c × VF  
VF típico: 0.66 (polietileno), 0.80 (espuma), 0.95 (aire)

La velocidad de propagación en la línea es menor que en el vacío. Importante para calcular longitudes eléctricas.

### ROE (Relación de Ondas Estacionarias)

ROE = (1 + |Γ|) / (1 - |Γ|) = ZL/Z₀ o Z₀/ZL (el mayor)  
Γ = coeficiente de reflexión

  * ROE = 1:1 → Adaptación perfecta
  * ROE = 2:1 → Aceptable
  * ROE = 3:1 → Desadaptación moderada
  * ROE = ∞ → Cortocircuito o circuito abierto

### Pérdidas en la línea

  * Pérdidas óhmicas (conductor)
  * Pérdidas en el dieléctrico
  * Aumentan con la frecuencia y la longitud
  * Aumentan con la desadaptación (ROE alto)

### Balun

Dispositivo que convierte entre líneas balanceadas y desbalanceadas.

  * **1:1** Solo cambio de balance, no de impedancia
  * **4:1** Transforma impedancia (ej: 200Ω a 50Ω)
  * **Tipos:** Transformador, línea de transmisión (choke balun)

### Línea λ/4 como transformador

Zentrada = Z₀² / Zcarga

Un tramo de λ/4 transforma impedancias. Usado en adaptadores de antena.

### Líneas abiertas y en cortocircuito

  * **λ/4 abierta:** Se comporta como cortocircuito (resonador serie)
  * **λ/4 cortocircuito:** Se comporta como circuito abierto (resonador paralelo)
  * Usadas como stubs para filtros y adaptación

### Acoplador/sintonizador de antena (ATU)

  * Adapta impedancia entre transmisor y línea/antena
  * Redes típicas: L, Pi, T
  * NO reduce pérdidas en la línea por desadaptación
  * Permite usar antenas no resonantes
