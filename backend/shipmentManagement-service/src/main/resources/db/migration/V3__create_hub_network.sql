CREATE TABLE hub (

                     id BIGSERIAL PRIMARY KEY,

                     hub_name VARCHAR(100) NOT NULL,

                     city VARCHAR(100) NOT NULL,

                     state VARCHAR(100) NOT NULL,

                     region VARCHAR(50) NOT NULL,

                     latitude DOUBLE PRECISION,

                     longitude DOUBLE PRECISION,

                     active BOOLEAN DEFAULT TRUE
);

INSERT INTO hub
(hub_name, city, state, region, latitude, longitude)
VALUES

    ('Srinagar Hub','Srinagar','Jammu & Kashmir','North',34.0837,74.7973),

    ('Chandigarh Hub','Chandigarh','Chandigarh','North',30.7333,76.7794),

    ('Delhi Hub','New Delhi','Delhi','North',28.6139,77.2090),

    ('Jaipur Hub','Jaipur','Rajasthan','North',26.9124,75.7873),

    ('Lucknow Hub','Lucknow','Uttar Pradesh','North',26.8467,80.9462),

    ('Kanpur Hub','Kanpur','Uttar Pradesh','North',26.4499,80.3319),

    ('Dehradun Hub','Dehradun','Uttarakhand','North',30.3165,78.0322),

    ('Patna Hub','Patna','Bihar','East',25.5941,85.1376),

    ('Ranchi Hub','Ranchi','Jharkhand','East',23.3441,85.3096),

    ('Kolkata Hub','Kolkata','West Bengal','East',22.5726,88.3639),

    ('Siliguri Hub','Siliguri','West Bengal','East',26.7271,88.3953),

    ('Guwahati Hub','Guwahati','Assam','North-East',26.1445,91.7362),

    ('Bhubaneswar Hub','Bhubaneswar','Odisha','East',20.2961,85.8245),

    ('Raipur Hub','Raipur','Chhattisgarh','Central',21.2514,81.6296),

    ('Bhopal Hub','Bhopal','Madhya Pradesh','Central',23.2599,77.4126),

    ('Indore Hub','Indore','Madhya Pradesh','Central',22.7196,75.8577),

    ('Nagpur Hub','Nagpur','Maharashtra','Central',21.1458,79.0882),

    ('Ahmedabad Hub','Ahmedabad','Gujarat','West',23.0225,72.5714),

    ('Surat Hub','Surat','Gujarat','West',21.1702,72.8311),

    ('Vadodara Hub','Vadodara','Gujarat','West',22.3072,73.1812),

    ('Mumbai Hub','Mumbai','Maharashtra','West',19.0760,72.8777),

    ('Pune Hub','Pune','Maharashtra','West',18.5204,73.8567),

    ('Nashik Hub','Nashik','Maharashtra','West',19.9975,73.7898),

    ('Hyderabad Hub','Hyderabad','Telangana','South',17.3850,78.4867),

    ('Vijayawada Hub','Vijayawada','Andhra Pradesh','South',16.5062,80.6480),

    ('Bengaluru Hub','Bengaluru','Karnataka','South',12.9716,77.5946),

    ('Mysuru Hub','Mysuru','Karnataka','South',12.2958,76.6394),

    ('Chennai Hub','Chennai','Tamil Nadu','South',13.0827,80.2707),

    ('Coimbatore Hub','Coimbatore','Tamil Nadu','South',11.0168,76.9558),

    ('Kochi Hub','Kochi','Kerala','South',9.9312,76.2673);


CREATE TABLE hub_connection (

                                id BIGSERIAL PRIMARY KEY,

                                from_hub_id BIGINT NOT NULL,

                                to_hub_id BIGINT NOT NULL,

                                distance_km INTEGER,

                                FOREIGN KEY (from_hub_id) REFERENCES hub(id),

                                FOREIGN KEY (to_hub_id) REFERENCES hub(id)
);
INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km) VALUES

-- North to South Backbone
(1,2,570),   -- Srinagar -> Chandigarh
(2,3,250),   -- Chandigarh -> Delhi
(3,4,280),   -- Delhi -> Jaipur
(4,16,660),  -- Jaipur -> Indore
(16,17,500), -- Indore -> Nagpur
(17,24,500), -- Nagpur -> Hyderabad
(24,26,570), -- Hyderabad -> Bengaluru
(26,28,350), -- Bengaluru -> Chennai
(28,30,690); -- Chennai -> Kochi


INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km) VALUES

-- West Corridor
(4,18,660),   -- Jaipur -> Ahmedabad
(18,20,110),  -- Ahmedabad -> Vadodara
(20,19,150),  -- Vadodara -> Surat
(19,21,280),  -- Surat -> Mumbai
(21,22,150),  -- Mumbai -> Pune
(22,23,210),  -- Pune -> Nashik
(22,17,710);  -- Pune -> Nagpur

INSERT INTO hub_connection (from_hub_id, to_hub_id, distance_km) VALUES

-- East Corridor
(5,8,530),    -- Lucknow -> Patna
(8,9,330),    -- Patna -> Ranchi
(9,10,410),   -- Ranchi -> Kolkata
(10,11,560),  -- Kolkata -> Siliguri
(11,12,470),  -- Siliguri -> Guwahati

-- Central to East
(17,14,285),  -- Nagpur -> Raipur
(14,13,285),  -- Raipur -> Bhubaneswar
(13,10,440);  -- Bhubaneswar -> Kolkata


