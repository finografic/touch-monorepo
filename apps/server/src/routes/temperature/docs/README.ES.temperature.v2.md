# Sistema de Perfiles de Temperatura V2

## Descripción General

El sistema utiliza tablas pre-calculadas de temperatura-tiempo para determinar los tiempos de enfriamiento/calentamiento de bebidas. Cada combinación de tipo de bebida, volumen y material del contenedor está vinculada a tres tablas de tiempo.

## Tablas de Perfiles de Temperatura

Cada fila en `temperature_profiles` contiene:
- `id`: Formato `temp_+X.Y` (ej., `temp_+10.0`)
- `temperature`: Punto de temperatura objetivo
- `timeA`: Valor de tiempo para elemento 1
- `timeB`: Valor de tiempo para elementos 2-9
- `timeC`: Valor de tiempo para elemento 10

## Lógica de Cálculo de Tiempo

1. **Selección de Tabla**:
   - Elemento 1 usa columna timeA
   - Elementos 2-9 usan columna timeB
   - Elemento 10 usa columna timeC

2. **Cálculo de Duración**:

   ```typescript
   // Ejemplo: Temp inicial 24.2°C -> 24°C, Temp final -1°C
   const duracion = tiempoTempInicial - tiempoTempFinal;
   ```

## Restricciones de Temperatura

1. **Temperatura Inicial**:
   - Por defecto: Lectura de sonda ambiental
   - Mínimo: 0°C
   - Máximo: 40°C

2. **Temperatura Final**:
   - Por defecto: De configuración de bebida (`defaultTempConsume`)
   - Mínimo: De configuración de bebida (`defaultTempFreeze`)
   - Máximo: Temperatura inicial actual

## Comportamiento de Elementos

- Elementos 1-10: Elementos de control de temperatura
- Elemento 11: Interruptor independiente on/off
- Los elementos pueden seleccionarse individual o grupalmente:
  - Elementos 2-9: Pueden seleccionarse juntos (botón TODOS)
  - Elementos 1 y 10: Solo selección individual

## Flujo de Operación

1. Seleccionar parámetros de bebida (tipo, volumen, contenedor)
2. Sistema identifica tablas de perfil de temperatura apropiadas
3. Usuario establece/confirma temperaturas
4. Sistema calcula duración usando columna de tiempo apropiada
5. Elementos se activan por la duración calculada
6. Sistema corta energía y suena alarma al completar
