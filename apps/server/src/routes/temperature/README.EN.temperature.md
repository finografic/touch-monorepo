# Temperature Calculation System

## Overview

The temperature calculation system determines how long it will take to heat or cool a drink to a desired temperature. It takes into account multiple factors including the drink type, container material, and volume.

## Database Schema

### Core Tables

#### `drink_types`

- Base configuration for each type of drink
- Key fields:
  - `default_consumption_temp`: Ideal serving temperature
  - `default_freeze_temp`: Safe freezing temperature
  - `has_subtypes`: Whether this drink type has variants

#### `drink_subtypes`

- Variants of drink types (e.g., different beer styles)
- References `drink_types` via `drink_type_id`
- Can override parent's temperature settings

#### `container_types`

- Different container materials
- Key fields:
  - `thermal_conductivity`: How well the material conducts temperature
  - Higher values = faster temperature change

#### `volumes`

- Available container sizes
- Key fields:
  - `value_in_ml`: Volume in milliliters
  - `cooling_factor`: How volume affects cooling/heating time
  - Larger volumes typically have higher cooling factors = longer times

#### `drink_configs`

Central configuration table linking everything together:
- References:
  - `drink_type_id` (required)
  - `drink_subtype_id` (optional)
  - `container_type_id`
  - `volume_id`
- Temperature constraints:
  - `min_consumption_temp`
  - `max_consumption_temp`
  - `default_consumption_temp`
- Time table references:
  - `time_table_id_1`: For cooling
  - `time_table_id_2`: For heating
  - `time_table_id_3`: For special cases

## Calculation Logic

### Base Time Calculation

```typescript
const tempDiff = Math.abs(targetTemp - initialTemp);
const baseTime = tempDiff * 60; // 1 minute per degree
```

### Adjustment Factors

The base time is modified by two key factors:

1. **Volume Factor** (`cooling_factor`)
   - Larger volumes take longer to change temperature
   - Factor increases with volume
   - Defined in `volumes` table

2. **Container Factor** (`thermal_conductivity`)
   - Different materials conduct heat at different rates
   - Higher conductivity = faster temperature change
   - Defined in `container_types` table

### Final Calculation

```typescript
const estimatedSeconds = baseTime * volumeFactor * containerFactor;
```

## API Endpoint

### POST `/temperature/calculate`

#### Request Body

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

#### Response

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

## Validation

1. **Configuration Validation**
   - Verifies all referenced IDs exist
   - Checks that configuration is active
   - Ensures drink type/subtype combination is valid

2. **Temperature Range Validation**
   - Ensures target temperature is within allowed range:

   ```typescript
   if (targetTemp < config.min_consumption_temp ||
       targetTemp > config.max_consumption_temp) {
     // Error: Temperature out of range
   }
   ```

## Time Table Selection

The system selects the appropriate time table based on the operation:
- Cooling: Uses `time_table_id_1`
- Heating: Uses `time_table_id_2`
- Special cases: Uses `time_table_id_3`

## Example Factors

### Container Materials (typical values)

- Glass: Lower thermal conductivity
- Metal: Higher thermal conductivity
- Plastic: Medium thermal conductivity

### Volumes

- 33cl: Base cooling factor
- 50cl: Higher cooling factor
- 2L: Highest cooling factor

## Future Improvements

Potential enhancements could include:
1. More sophisticated temperature curves
2. Ambient temperature consideration
3. Multiple cooling/heating phases
4. Machine learning based on actual cooling data
5. Real-time temperature adjustment
