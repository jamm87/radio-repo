> **Fuente:** contenido adaptado de [eaharec.com](https://eaharec.com/parte1/tema10.html) — proyecto de código abierto (licencia MIT).
> Repositorio original: [https://github.com/t00mas/eaharec](https://github.com/t00mas/eaharec).
> Basado en el Anexo II de la Orden IET/1311/2013 (CEPT T/R 61-02).


# Tema 10: Seguridad

Precauciones de seguridad eléctrica y RF en estaciones de radioaficionado

## 10.1 Seguridad eléctrica

### Peligros de la corriente eléctrica

La corriente eléctrica puede causar:

  * Fibrilación cardíaca (potencialmente mortal a partir de ~30 mA)
  * Quemaduras internas y externas
  * Tetanización muscular (incapacidad de soltar el conductor)
  * Parada respiratoria

### Factores de riesgo

  * Intensidad de corriente (más peligrosa que tensión alta)
  * Duración del contacto
  * Trayectoria de la corriente por el cuerpo
  * Frecuencia (50-60 Hz es especialmente peligrosa)
  * Condiciones de humedad

### Precauciones básicas

  * Desconectar la alimentación antes de trabajar en equipos
  * Descargar condensadores de alta tensión (pueden retener carga)
  * Trabajar con una sola mano cuando sea posible
  * Usar calzado aislante
  * No trabajar en equipos energizados si no es imprescindible
  * Conocer la ubicación del interruptor general

## 10.2 Instalación eléctrica

### Protecciones generales

  * **Interruptor general:** Permite cortar toda la alimentación
  * **Magnetotérmicos:** Protegen contra sobrecargas y cortocircuitos
  * **Diferencial (ID):** Detecta fugas de corriente a tierra. Típico: 30 mA

### Protección de los equipos

  * Fusibles adecuados a la potencia
  * Varistores o supresores de picos
  * Fuentes de alimentación con protecciones integradas

### Protección contra contactos de personas

  * Carcasas conectadas a tierra
  * Aislamiento de partes activas
  * Barreras y envolventes
  * Señalización de peligro

### Cableado

  * Sección adecuada para la corriente
  * Cables en buen estado, sin empalmes descubiertos
  * Evitar cables sueltos o pisados
  * Usar regletas y conexiones seguras

## 10.3 Puesta a tierra

### Funciones de la toma de tierra

  * **Seguridad:** Deriva corrientes de fuga, activa el diferencial
  * **RF:** Referencia de potencial, plano de tierra para antenas
  * **Protección atmosférica:** Disipa descargas de rayos

### Requisitos

  * Resistencia de tierra baja (idealmente <10Ω)
  * Conductor de sección suficiente (mínimo 6 mm² Cu para seguridad)
  * Conexiones sólidas y protegidas contra corrosión
  * Electrodos: picas, placas enterradas o mallas

### Tierra de RF

  * Conexión corta y directa (evitar inductancia)
  * Trenza de cobre o conductor ancho
  * Para antenas: radiales o plano de tierra adecuado

## 10.4 Antenas y líneas de alimentación

### Seguridad mecánica

  * Instalación sólida que soporte viento
  * Alejamiento de líneas eléctricas (mínimo 1.5× altura del mástil)
  * Protección contra caídas durante instalación
  * Tensores y riostras adecuados

### Riesgos de RF

  * Quemaduras por contacto con antenas energizadas
  * Exposición a campos electromagnéticos intensos
  * Mantener distancia de seguridad durante transmisión

### Líneas de alimentación

  * Proteger la entrada al edificio
  * Usar pasamuros aislados
  * Instalar descargadores de gas en la entrada

## 10.5 Protección contra descargas atmosféricas

### Peligros de los rayos

  * Impacto directo (potencialmente mortal)
  * Inducción electromagnética en cables
  * Sobretensiones que destruyen equipos
  * Incendios

### Medidas de protección

#### Pararrayos

  * Punta captadora por encima de las antenas
  * Conductor de bajada de sección gruesa (≥50 mm² Cu)
  * Conexión directa a tierra dedicada

#### Descargadores de antena

  * Descargadores de gas en la entrada del cable coaxial
  * Derivan sobretensiones a tierra
  * Deben estar bien conectados a tierra

#### Protecciones adicionales

  * Varistores y supresores en líneas de alimentación
  * Desconectar equipos durante tormentas si es posible
  * Desconectar la antena del equipo

### Toma de tierra específica

  * Baja impedancia a alta frecuencia
  * Conexiones robustas y cortas
  * Unificación de tierras (seguridad, RF y pararrayos al mismo sistema)

## 10.6 Seguridad RF

### Efectos de la exposición a RF

  * Efecto térmico (calentamiento de tejidos)
  * Mayor riesgo en ojos y tejidos poco vascularizados
  * Límites establecidos por normativa (ICNIRP)

### Precauciones

  * No tocar antenas durante transmisión
  * Mantener distancia de antenas de alta potencia
  * Especial cuidado con antenas direccionales
  * Reducir potencia si hay personas cerca

## 10.7 Resumen de buenas prácticas

  * Instalar protecciones eléctricas adecuadas (diferencial, magnetotérmicos)
  * Mantener buena toma de tierra
  * No trabajar en equipos energizados
  * Proteger la instalación contra rayos
  * Mantener distancia de antenas durante transmisión
  * Usar potencia mínima necesaria
  * Verificar periódicamente el estado de la instalación
  * Conocer procedimientos de emergencia (RCP, corte de corriente)
