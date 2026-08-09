-- Connect Dehradun <-> Delhi
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    (
        (SELECT id FROM hub WHERE hub_name = 'Dehradun Hub'),
        (SELECT id FROM hub WHERE hub_name = 'Delhi Hub'),
        250
    ),
    (
        (SELECT id FROM hub WHERE hub_name = 'Delhi Hub'),
        (SELECT id FROM hub WHERE hub_name = 'Dehradun Hub'),
        250
    );

-- Connect Mysuru <-> Bengaluru
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km)
VALUES
    (
        (SELECT id FROM hub WHERE hub_name = 'Mysuru Hub'),
        (SELECT id FROM hub WHERE hub_name = 'Bengaluru Hub'),
        145
    ),
    (
        (SELECT id FROM hub WHERE hub_name = 'Bengaluru Hub'),
        (SELECT id FROM hub WHERE hub_name = 'Mysuru Hub'),
        145
    );