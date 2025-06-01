# Sistema de Perfiles de Temperatura V2

## Descripción General

El sistema utiliza tablas pre-calculadas de temperatura-tiempo para determinar los tiempos de enfriamiento/calentamiento de bebidas. Cada combinación de tipo de bebida, volumen y material del contenedor está vinculada a un perfil de temperatura que contiene valores de tiempo para diferentes elementos.

## Estructura del Perfil de Temperatura

Cada fila en `temperature_profiles` contiene:
- `id`: Formato `temp_+X.Y` (ej., `temp_+10.0`)
- `temperature`: Punto de temperatura objetivo
- `time_a`: Valor de tiempo para elemento 1
- `time_b`: Valor de tiempo para elementos 2-9
- `time_c`: Valor de tiempo para elemento 10

## Cálculo de Duración

1. **Encontrar Perfiles de Temperatura más Cercanos**:

   ```typescript
   const initialTempRow = findClosestTemperature(profiles, initialTemp);
   const finalTempRow = findClosestTemperature(profiles, finalTemp);
   ```

2. **Obtener Valores de Tiempo**:

   ```typescript
   // Los valores de tiempo dependen del elemento (1-10) que se está usando
   const initialTime = getTimeValue(initialTempRow, elementNumber);
   const finalTime = getTimeValue(finalTempRow, elementNumber);
   ```

3. **Calcular Duración**:

   ```typescript
   // Ejemplo: Temp inicial 24.2°C -> 24°C, Temp final -1°C
   const duration = Math.abs(finalTime - initialTime);
   ```

## Selección de Elementos

Los valores de tiempo se seleccionan según el número de elemento:
- Elemento 1: Usa `time_a`
- Elementos 2-9: Usan `time_b`
- Elemento 10: Usa `time_c`

## Restricciones de Temperatura

1. **Temperatura Inicial**:
   - Por defecto: 25°C (ambiente)
   - Mínimo: 0°C
   - Máximo: 40°C (de perfiles de temperatura)

2. **Temperatura Final**:
   - Por defecto: De la temperatura de consumo recomendada del tipo de bebida
   - Mínimo: De la temperatura de congelación del tipo de bebida
   - Máximo: Valor actual de temperatura inicial

## Seguimiento de Estado

El proceso de control de temperatura tiene varios estados:
- `pending`: Estado inicial
- `in_progress`: Cálculo iniciado
- `completed`: Proceso finalizado con éxito
- `error`: Proceso fallido

## Mejoras Futuras

1. Monitoreo de temperatura en tiempo real
2. Selección dinámica de elementos basada en la posición del contenedor
3. Control de temperatura en múltiples fases
4. Integración con sistema de control de hardware
5. Optimización de curva de temperatura
