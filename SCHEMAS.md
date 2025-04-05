# Touch Monorepo - Database Schemas

## Overview

The database schema is designed for a beverage dispensing system with temperature control. The system consists of 11 elements (dispensing stations), where elements 1-10 are beverage dispensers and element 11 is a simple on/off switch.

## Schema Relationships

```mermaid
erDiagram
    BeverageTypes ||--o{ BeverageSubtypes : "has subtypes"
    BeverageTypes ||--o{ BeverageConfigs : "used in"
    BeverageSubtypes ||--o{ BeverageConfigs : "used in"
    ContainerTypes ||--o{ BeverageConfigs : "used in"
    Volumes ||--o{ BeverageConfigs : "used in"

    TemperatureTables ||--o{ TemperatureTableEntries : "contains"
    BeverageConfigs ||--o{ TemperatureTables : "references"

    Elements ||--o{ RunningOrders : "executes"
    BeverageConfigs ||--o{ RunningOrders : "configures"

    BeverageTypes {
        string id PK
        string name
        string displayName
        boolean hasSubtypes
        integer defaultConsumptionTemp
        integer defaultFreezeTemp
    }

    BeverageSubtypes {
        string id PK
        string beverageTypeId FK
        string name
        string displayName
        integer consumptionTemp
        integer freezeTemp
    }

    ContainerTypes {
        string id PK
        string name
        string displayName
        integer thermalConductivity
    }

    Volumes {
        string id PK
        string name
        integer valueInMl
        integer sortOrder
        float coolingFactor
    }

    BeverageConfigs {
        string id PK
        string beverageTypeId FK
        string beverageSubtypeId FK
        string containerTypeId FK
        string volumeId FK
        string timeTableId1
        string timeTableId2
        string timeTableId3
    }

    TemperatureTables {
        string id PK
        string tableNumber
        integer elementType
    }

    TemperatureTableEntries {
        string id PK
        string tableId FK
        float temperature
        float timeMinutes
        integer sortOrder
    }

    Elements {
        string id PK
        integer elementNumber
        integer elementType
        string position
        integer voltage
        string currentOrderId FK
    }

    RunningOrders {
        string id PK
        string elementId FK
        string beverageConfigId FK
        integer startTemp
        integer targetTemp
        string status
    }
```

## Core Schemas

### `beverage_types.schema.ts`

Primary schema for beverage categorization:
- **Main Types Table**: Basic beverages (Cerveza, Vino, Licor, etc.)
  - Name and localized display name
  - Temperature defaults (-10°C to 30°C for consumption)
  - Flag for subtypes existence
- **Subtypes Table**: Variants of main types (e.g., Cerveza: Rubia, Negra)
  - References parent beverage type
  - Can override parent's temperature settings
  - Maintains same validation patterns

### `container_types.schema.ts`

Defines available container materials:
- Three main types: Plástico, Vidrio, Metal
- Includes thermal conductivity factor for cooling calculations
- Affects cooling time calculations in combination with volume

### `volumes.schema.ts`

Manages available container sizes:
- Standardized volumes (2L, 1.5L, 1.25L, 1L, 75cl, 50cl, 33cl, 25cl)
- Normalizes all volumes to milliliters for calculations
- Includes cooling factor for volume-based timing adjustments
- Maintains sort order for display purposes

### `beverage_configs.schema.ts`

Links core entities and defines valid combinations:
- Connects beverage types/subtypes with containers and volumes
- Stores temperature ranges and defaults
- References time-temperature tables (1XXX, 2XXX, 3XXX series)
- Enforces valid combinations through foreign key relationships

## Operational Schemas

### `temperature_tables.schema.ts`

Manages temperature-time relationships:
- **Tables Table**: Metadata for temperature-time mappings
  - Table numbers (1XXX, 2XXX, 3XXX format)
  - Element type association (1, 2-9, or 10)
- **Entries Table**: Actual temperature-time data points
  - Temperature in Celsius
  - Time in minutes (decimal precision)
  - Maintains ordered sequence of entries

### `elements.schema.ts`

Controls the 11 dispensing stations:
- Element types (Single: 1,10; Group: 2-9; Switch: 11)
- Physical properties (probe ID, voltage: 12V/24V)
- Current state tracking (in use, remaining time)
- Grid position for UI display
- Temperature probe readings and timestamps

### `running_orders.schema.ts`

Tracks active dispensing operations:
- Links elements to beverage configurations
- Monitors temperatures (start, target, current)
- Manages timing (estimated vs actual)
- Status tracking (pending, running, completed, failed)
- Error handling and logging

## Common Features

All schemas include:
- CUID-based primary keys
- Active status flags
- Creation and update timestamps
- Zod validation schemas
- Standard operations structure (select/insert/patch)

## Relationships

- Elements 1-10 use different temperature table series (1XXX, 2XXX, 3XXX)
- Beverage configs link to multiple temperature tables
- Running orders connect elements to specific beverage configurations
- Elements maintain current order references while active

## Validation

Each schema includes Zod validation for:
- Temperature ranges (-20°C to 40°C)
- Time limits (up to 120 minutes for standard operations)
- Required relationships and foreign keys
- Format-specific fields (e.g., table numbers, positions)
