# Temperature Profile System V2

## Overview

The system uses pre-calculated temperature-time tables to determine cooling/heating times for beverages. Each combination of drink type, volume, and container material is linked to a temperature profile that contains time values for different elements.

## Temperature Profile Structure

Each row in `temperature_profiles` contains:
- `id`: Format `temp_+X.Y` (e.g., `temp_+10.0`)
- `temperature`: Target temperature point
- `time_a`: Time value for element 1
- `time_b`: Time value for elements 2-9
- `time_c`: Time value for element 10

## Duration Calculation

1. **Find Closest Temperature Profiles**:

   ```typescript
   const initialTempRow = findClosestTemperature(profiles, initialTemp);
   const finalTempRow = findClosestTemperature(profiles, finalTemp);
   ```

2. **Get Time Values**:

   ```typescript
   // Time values depend on which element (1-10) is being used
   const initialTime = getTimeValue(initialTempRow, elementNumber);
   const finalTime = getTimeValue(finalTempRow, elementNumber);
   ```

3. **Calculate Duration**:

   ```typescript
   // Example: Initial temp 24.2°C -> 24°C, Final temp -1°C
   const duration = Math.abs(finalTime - initialTime);
   ```

## Element Selection

Time values are selected based on element number:
- Element 1: Uses `time_a`
- Elements 2-9: Use `time_b`
- Element 10: Uses `time_c`

## Temperature Constraints

1. **Initial Temperature**:
   - Default: 25°C (ambient)
   - Min: 0°C
   - Max: 40°C (from temperature profiles)

2. **Final Temperature**:
   - Default: From drink type's recommended consumption temperature
   - Min: From drink type's freeze temperature
   - Max: Current initial temperature value

## Status Tracking

Temperature control process has several states:
- `pending`: Initial state
- `in_progress`: Calculation started
- `completed`: Process finished successfully
- `error`: Process failed

## Future Improvements

1. Real-time temperature monitoring
2. Dynamic element selection based on container position
3. Multiple phase temperature control
4. Integration with hardware control system
5. Temperature curve optimization
