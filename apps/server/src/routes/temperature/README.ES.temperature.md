# Sistema de Cálculo de Temperatura

## Descripción General

El sistema de cálculo de temperatura determina cuánto tiempo llevará calentar o enfriar una bebida a la temperatura deseada. Tiene en cuenta múltiples factores, incluyendo el tipo de bebida, el material del contenedor y el volumen.

## Esquema de Base de Datos

### Tablas Principales

#### `drink_types` (Tipos de Bebida)

- Configuración base para cada tipo de bebida
- Campos clave:
  - `default_consumption_temp`: Temperatura ideal de servicio
  - `default_freeze_temp`: Temperatura segura de congelación
  - `has_subtypes`: Indica si este tipo de bebida tiene variantes

#### `drink_subtypes` (Subtipos de Bebida)

- Variantes de tipos de bebida (por ejemplo, diferentes estilos de cerveza)
- Referencia a `drink_types` mediante `drink_type_id`
- Puede sobrescribir la configuración de temperatura del tipo principal

#### `container_types` (Tipos de Contenedor)

- Diferentes materiales de contenedor
- Campos clave:
  - `thermal_conductivity`: Qué tan bien el material conduce la temperatura
  - Valores más altos = cambio de temperatura más rápido

#### `volumes` (Volúmenes)

- Tamaños disponibles de contenedor
- Campos clave:
  - `value_in_ml`: Volumen en mililitros
  - `cooling_factor`: Cómo el volumen afecta el tiempo de enfriamiento/calentamiento
  - Volúmenes más grandes típicamente tienen factores de enfriamiento más altos = tiempos más largos

#### `drink_configs` (Configuraciones de Bebida)

Tabla central de configuración que vincula todo:
- Referencias:
  - `drink_type_id` (requerido)
  - `drink_subtype_id` (opcional)
  - `container_type_id`
  - `volume_id`
- Restricciones de temperatura:
  - `min_consumption_temp`
  - `max_consumption_temp`
  - `default_consumption_temp`
- Referencias a tablas de tiempo:
  - `time_table_id_1`: Para enfriamiento
  - `time_table_id_2`: Para calentamiento
  - `time_table_id_3`: Para casos especiales

## Lógica de Cálculo

### Cálculo de Tiempo Base

```typescript
const tempDiff = Math.abs(targetTemp - initialTemp);
const baseTime = tempDiff * 60; // 1 minuto por grado
```

### Factores de Ajuste

El tiempo base se modifica por dos factores clave:

1. **Factor de Volumen** (`cooling_factor`)
   - Volúmenes más grandes tardan más en cambiar de temperatura
   - El factor aumenta con el volumen
   - Definido en la tabla `volumes`

2. **Factor del Contenedor** (`thermal_conductivity`)
   - Diferentes materiales conducen el calor a diferentes velocidades
   - Mayor conductividad = cambio de temperatura más rápido
   - Definido en la tabla `container_types`

### Cálculo Final

```typescript
const estimatedSeconds = baseTime * volumeFactor * containerFactor;
```

## Endpoint de API

### POST `/temperature/calculate`

#### Cuerpo de la Solicitud

```typescript
{
  drinkTypeId: string;
  drinkSubtypeId?: string;
  containerTypeId: string;
  volumeId: string;
  initialTemp: number;
  targetTemp: number;
}
```

#### Respuesta

```typescript
{
  estimatedDurationSeconds: number;
  phases: Array<{
    durationSeconds: number;
    startTemp: number;
    endTemp: number;
    description: string;
  }>;
  timeTableId: string;
  recommendations: string[];
}
```

## Validación

1. **Validación de Configuración**
   - Verifica que todos los IDs referenciados existan
   - Comprueba que la configuración esté activa
   - Asegura que la combinación de tipo/subtipo de bebida sea válida

2. **Validación de Rango de Temperatura**
   - Asegura que la temperatura objetivo esté dentro del rango permitido:

   ```typescript
   if (targetTemp < config.min_consumption_temp ||
       targetTemp > config.max_consumption_temp) {
     // Error: Temperatura fuera de rango
   }
   ```

## Selección de Tabla de Tiempo

El sistema selecciona la tabla de tiempo apropiada según la operación:
- Enfriamiento: Usa `time_table_id_1`
- Calentamiento: Usa `time_table_id_2`
- Casos especiales: Usa `time_table_id_3`

## Factores de Ejemplo

### Materiales de Contenedor (valores típicos)

- Vidrio: Conductividad térmica más baja
- Metal: Conductividad térmica más alta
- Plástico: Conductividad térmica media

### Volúmenes

- 33cl: Factor de enfriamiento base
- 50cl: Factor de enfriamiento más alto
- 2L: Factor de enfriamiento más alto

## Mejoras Futuras

Las posibles mejoras podrían incluir:
1. Curvas de temperatura más sofisticadas
2. Consideración de temperatura ambiente
3. Múltiples fases de enfriamiento/calentamiento
4. Aprendizaje automático basado en datos reales de enfriamiento
5. Ajuste de temperatura en tiempo real
