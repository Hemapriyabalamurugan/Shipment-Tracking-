CREATE TABLE journey_update (

                                id BIGSERIAL PRIMARY KEY,

                                shipment_id BIGINT NOT NULL,

                                current_hub_id BIGINT NOT NULL,

                                traffic_condition VARCHAR(30) NOT NULL
                                    CONSTRAINT chk_traffic_condition
        CHECK (traffic_condition IN (
            'LOW',
            'MODERATE',
            'HEAVY'
        )
),

                                weather_condition VARCHAR(30) NOT NULL
                                    CONSTRAINT chk_weather_condition
        CHECK (weather_condition IN (
            'CLEAR',
            'RAIN',
            'FOG',
            'STORM'
        )
                                ),

                                road_condition VARCHAR(30) NOT NULL
                                    CONSTRAINT chk_road_condition
        CHECK (road_condition IN (
            'GOOD',
            'UNDER_CONSTRUCTION',
            'ACCIDENT',
            'BLOCKED'
        )
                                ),

                                remarks VARCHAR(500),

                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                CONSTRAINT fk_journey_shipment
                                    FOREIGN KEY (shipment_id)
                                        REFERENCES shipments(id),

                                CONSTRAINT fk_journey_hub
                                    FOREIGN KEY (current_hub_id)
                                        REFERENCES hub(id)
);