# DB VIEW: `orders_readable

## from Drizzle Studio

- SQL Console
- Paste below
- Run


## by Name

```sql


CREATE VIEW orders_readable AS
SELECT
  o.id,
  o.mode,
  dt.name AS drink_type_name,
  dst.name AS drink_subtype_name,
  v.name AS volume_name,
  ct.name AS container_type_name,
  cp.name AS temperature_profile_name,
  o.default_temp_consume,
  o.default_temp_freeze,
  o.is_active,
  o.created_at,
  o.updated_at
FROM orders o
JOIN drink_types dt ON o.drink_type_id = dt.id
LEFT JOIN drink_subtypes dst ON o.drink_subtype_id = dst.id
JOIN volumes v ON o.volume_id = v.id
JOIN container_types ct ON o.container_type_id = ct.id
JOIN temperature_profiles tp ON o.temperature_profile_id = tp.id
JOIN cooling_profiles cp ON tp.cooling_profile_id = cp.id;


```


---


## by ID

```sql

CREATE VIEW orders_readable AS
SELECT
  o.id,
    o.mode,
  dt.name AS drink_type,
  dst.name AS drink_subtype,
  v.name AS volume,
  ct.name AS container_type,
  cp.name AS temperature_profile,
  o.default_temp_consume,
  o.default_temp_freeze,
  o.is_active,
  o.created_at,
  o.updated_at
FROM orders o
JOIN drink_types dt ON o.drink_type_id = dt.id
LEFT JOIN drink_subtypes dst ON o.drink_subtype_id = dst.id
JOIN volumes v ON o.volume_id = v.id
JOIN container_types ct ON o.container_type_id = ct.id
JOIN temperature_profiles tp ON o.temperature_profile_id = tp.id
JOIN cooling_profiles cp ON tp.cooling_profile_id = cp.id;

```


