CREATE VIEW orders_readable
AS
  SELECT
    o.id,
    o.mode_id AS modeId,
    md.name AS mode,
    dt.name AS drink_type,
    dst.name AS drink_subtype,
    v.name AS volume,
    ct.name AS container_type,
    o.default_temp_consume,
    o.default_temp_freeze,
    o.is_active,
    o.created_at,
    o.updated_at
  FROM orders o
    JOIN modes md ON o.mode_id = md.id
    JOIN drink_types dt ON o.drink_type_id = dt.id
    LEFT JOIN drink_subtypes dst ON o.drink_subtype_id = dst.id
    JOIN volumes v ON o.volume_id = v.id
    JOIN container_types ct ON o.container_type_id = ct.id;

