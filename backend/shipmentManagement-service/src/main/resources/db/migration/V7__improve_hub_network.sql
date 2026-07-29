-- ===========================
-- Improve India Hub Network
-- ===========================

-- West → South
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Pune Hub'),
     (SELECT id FROM hub WHERE hub_name='Hyderabad Hub'),
     560),

    ((SELECT id FROM hub WHERE hub_name='Hyderabad Hub'),
     (SELECT id FROM hub WHERE hub_name='Pune Hub'),
     560);

-- Hyderabad ↔ Chennai
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Hyderabad Hub'),
     (SELECT id FROM hub WHERE hub_name='Chennai Hub'),
     630),

    ((SELECT id FROM hub WHERE hub_name='Chennai Hub'),
     (SELECT id FROM hub WHERE hub_name='Hyderabad Hub'),
     630);

-- Hyderabad ↔ Vijayawada
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Hyderabad Hub'),
     (SELECT id FROM hub WHERE hub_name='Vijayawada Hub'),
     275),

    ((SELECT id FROM hub WHERE hub_name='Vijayawada Hub'),
     (SELECT id FROM hub WHERE hub_name='Hyderabad Hub'),
     275);

-- Vijayawada ↔ Chennai
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Vijayawada Hub'),
     (SELECT id FROM hub WHERE hub_name='Chennai Hub'),
     455),

    ((SELECT id FROM hub WHERE hub_name='Chennai Hub'),
     (SELECT id FROM hub WHERE hub_name='Vijayawada Hub'),
     455);

-- Nagpur ↔ Bhopal
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Nagpur Hub'),
     (SELECT id FROM hub WHERE hub_name='Bhopal Hub'),
     350),

    ((SELECT id FROM hub WHERE hub_name='Bhopal Hub'),
     (SELECT id FROM hub WHERE hub_name='Nagpur Hub'),
     350);

-- Bhopal ↔ Jaipur
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Bhopal Hub'),
     (SELECT id FROM hub WHERE hub_name='Jaipur Hub'),
     590),

    ((SELECT id FROM hub WHERE hub_name='Jaipur Hub'),
     (SELECT id FROM hub WHERE hub_name='Bhopal Hub'),
     590);

-- Lucknow ↔ Delhi
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Lucknow Hub'),
     (SELECT id FROM hub WHERE hub_name='Delhi Hub'),
     555),

    ((SELECT id FROM hub WHERE hub_name='Delhi Hub'),
     (SELECT id FROM hub WHERE hub_name='Lucknow Hub'),
     555);

-- Lucknow ↔ Kanpur
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Lucknow Hub'),
     (SELECT id FROM hub WHERE hub_name='Kanpur Hub'),
     90),

    ((SELECT id FROM hub WHERE hub_name='Kanpur Hub'),
     (SELECT id FROM hub WHERE hub_name='Lucknow Hub'),
     90);

-- Kanpur ↔ Bhopal
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Kanpur Hub'),
     (SELECT id FROM hub WHERE hub_name='Bhopal Hub'),
     585),

    ((SELECT id FROM hub WHERE hub_name='Bhopal Hub'),
     (SELECT id FROM hub WHERE hub_name='Kanpur Hub'),
     585);

-- Indore ↔ Ahmedabad
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Indore Hub'),
     (SELECT id FROM hub WHERE hub_name='Ahmedabad Hub'),
     400),

    ((SELECT id FROM hub WHERE hub_name='Ahmedabad Hub'),
     (SELECT id FROM hub WHERE hub_name='Indore Hub'),
     400);

-- Raipur ↔ Hyderabad
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Raipur Hub'),
     (SELECT id FROM hub WHERE hub_name='Hyderabad Hub'),
     540),

    ((SELECT id FROM hub WHERE hub_name='Hyderabad Hub'),
     (SELECT id FROM hub WHERE hub_name='Raipur Hub'),
     540);

-- Ranchi ↔ Raipur
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Ranchi Hub'),
     (SELECT id FROM hub WHERE hub_name='Raipur Hub'),
     560),

    ((SELECT id FROM hub WHERE hub_name='Raipur Hub'),
     (SELECT id FROM hub WHERE hub_name='Ranchi Hub'),
     560);

-- Kochi ↔ Coimbatore
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Kochi Hub'),
     (SELECT id FROM hub WHERE hub_name='Coimbatore Hub'),
     190),

    ((SELECT id FROM hub WHERE hub_name='Coimbatore Hub'),
     (SELECT id FROM hub WHERE hub_name='Kochi Hub'),
     190);

-- Coimbatore ↔ Bengaluru
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    ((SELECT id FROM hub WHERE hub_name='Coimbatore Hub'),
     (SELECT id FROM hub WHERE hub_name='Bengaluru Hub'),
     365),

    ((SELECT id FROM hub WHERE hub_name='Bengaluru Hub'),
     (SELECT id FROM hub WHERE hub_name='Coimbatore Hub'),
     365);