# touch-monorepo

📅 Apr 5, 2025

## INITIAL OUTLINE by AI

Thank you for sharing the PowerPoint presentation. I can see this is a sophisticated beverage dispensing system with temperature control and multiple customization options. Let me break down the key components and database requirements I see:

1. The system has 11 independent elements/stations, where:
   - Elements 1-10 are beverage dispensers
   - Element 11 is a simple on/off switch
   - Elements 2-9 can be selected as a group
   - Elements 1 and 10 are independent but compatible with others

2. The core parameters for each beverage are:
   - Beverage Type (with subtypes, e.g., Beer: Rubia/Negra)
   - Volume (2L, 1.5L, 1.25L, 1L, 75cl, 50cl, 33cl, 25cl)
   - Container Type (Plástico, Vidrio, Metal)
   - Initial Temperature (from probe, with manual adjustment)
   - Final Temperature (preset with manual adjustment)

3. Temperature-Time Tables:
   - Tables 1XXX for element 1
   - Tables 2XXX for elements 2-9
   - Tables 3XXX for element 10
   - Each combination of parameters links to specific temperature-time tables

4. Input Data Table shown has the following structure:
   - Tipo Bebida (Beverage Type)
   - Subnivel Bebida (Beverage Subtype)
   - Volumen (Volume)
   - Tipo de envase (Container Type)
   - Temp Consumo (Consumption Temperature)
   - Temp Congelación (Freezing Temperature)
   - Tabla 1, 2, 3 (Reference tables for timing)

Based on this, I can propose a database schema. Would you like me to proceed with creating the schema definitions? I'm thinking we'll need:

1. A `beverages` table for drink types and subtypes
2. A `container_types` table
3. A `volumes` table
4. A `beverage_configurations` table (for valid combinations)
5. A `temperature_time_tables` table
6. An `elements` table (for the 11 stations)
7. A `running_orders` table (for active dispensing jobs)

Would you like me to proceed with creating these schema definitions? I can use either SQL or Prisma schema format, depending on your preference.
