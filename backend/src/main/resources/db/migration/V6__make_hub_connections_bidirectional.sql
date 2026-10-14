INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
SELECT
    to_hub_id,
    from_hub_id,
    distance_km
FROM hub_connection
WHERE NOT EXISTS (
    SELECT 1
    FROM hub_connection hc
    WHERE hc.from_hub_id = hub_connection.to_hub_id
      AND hc.to_hub_id = hub_connection.from_hub_id
);