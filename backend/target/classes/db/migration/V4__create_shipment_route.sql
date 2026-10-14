CREATE TABLE shipment_route (

                                id BIGSERIAL PRIMARY KEY,

                                shipment_id BIGINT NOT NULL,

                                hub_id BIGINT NOT NULL,

                                stop_order INT NOT NULL,

                                reached BOOLEAN DEFAULT FALSE,

                                reached_at TIMESTAMP,

                                FOREIGN KEY (hub_id)
                                    REFERENCES hub(id)
);