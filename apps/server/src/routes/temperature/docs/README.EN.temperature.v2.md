# Temperature Profile System V2

## Overview

The system uses pre-calculated temperature-time tables to determine cooling/heating times for beverages. Each combination of drink type, volume, and container material is linked to three time tables.

## Temperature Profile Tables

Each row in `temperature_profiles` contains:
- `id`: Format `temp_+X.Y` (e.g., `temp_+10.0`)
- `temperature`: Target temperature point
- `timeA`: Time value for element 1
- `timeB`: Time value for elements 2-9
- `timeC`: Time value for element 10

## Time Calculation Logic

1. **Table Selection**:
   - Element 1 uses timeA column
   - Elements 2-9 use timeB column
   - Element 10 uses timeC column

2. **Duration Calculation**:

   ```typescript
   // Example: Initial temp 24.2°C -> 24°C, Final temp -1°C
   const duration = timeAtInitialTemp - timeAtFinalTemp;
   ```

## Temperature Constraints

1. **Initial Temperature**:
   - Default: Ambient probe reading
   - Min: 0°C
   - Max: 40°C

2. **Final Temperature**:
   - Default: From drink configuration (`defaultTempConsume`)
   - Min: From drink configuration (`defaultTempFreeze`)
   - Max: Current initial temperature

## Element Behavior

- Elements 1-10: Temperature control elements
- Element 11: Independent on/off switch
- Elements can be selected individually or in groups:
  - Elements 2-9: Can be selected together (ALL button)
  - Elements 1 and 10: Individual selection only

## Operation Flow

1. Select drink parameters (type, volume, container)
2. System identifies appropriate temperature profile tables
3. User sets/confirms temperatures
4. System calculates duration using appropriate time column
5. Elements activate for calculated duration
6. System cuts power and sounds alarm when complete
