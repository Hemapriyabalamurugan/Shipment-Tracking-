-- 1. ENUMS (Strict value enforcement)


-- Roles defined 
CREATE TYPE user_role AS ENUM (
    'CUSTOMER',
    'BUSINESS_CLIENT',
    'LOGISTICS_OPERATOR',
    'SUPPORT_AGENT',
    'ADMIN'
);

-- Shipment lifecycle statuses
CREATE TYPE shipment_status AS ENUM (
    'CREATED',
    'PICKED_UP',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'FAILED_DELIVERY'
);

-- Notification delivery channels
CREATE TYPE notification_channel AS ENUM (
    'EMAIL',
    'SMS',
    'IN_APP'
);


-- 2. CORE TABLES


-- Users (covers Customer, Business Client, Operator, Admin)
CREATE TABLE users (
    id                  BIGSERIAL PRIMARY KEY,
    email               VARCHAR(255) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    phone               VARCHAR(20),
    role                user_role NOT NULL DEFAULT 'CUSTOMER',
    is_active           BOOLEAN DEFAULT TRUE,
    last_login          TIMESTAMP,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments (core business entity)
CREATE TABLE shipments (
    id                      BIGSERIAL PRIMARY KEY,
    tracking_number         VARCHAR(50) NOT NULL UNIQUE,
    customer_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    business_client_id      BIGINT REFERENCES users(id) ON DELETE SET NULL, -- If a business created it
    driver_id               BIGINT REFERENCES users(id) ON DELETE SET NULL, -- Logistics Operator assigned
    
    -- Sender & Receiver (denormalized for speed, but can be references to address table if needed)
    sender_name             VARCHAR(255) NOT NULL,
    sender_phone            VARCHAR(20),
    receiver_name           VARCHAR(255) NOT NULL,
    receiver_phone          VARCHAR(20) NOT NULL,
    delivery_address        TEXT NOT NULL,
    delivery_city           VARCHAR(100),
    delivery_state          VARCHAR(100),
    delivery_zip            VARCHAR(20),
    delivery_country        VARCHAR(100) DEFAULT 'INDIA',
    
    -- Package details
    package_weight_kg       DECIMAL(10,2),
    -- package_dimensions      VARCHAR(100), -- e.g., "30x20x15 cm"
    package_description     TEXT,
    package_type            VARCHAR(50), -- e.g., "BOX", "PALLET", "DOCUMENT"
    
    -- Status & Timeline
    status                  shipment_status NOT NULL DEFAULT 'CREATED',
    current_location_lat    DECIMAL(10, 8),
    current_location_lng    DECIMAL(11, 8),
    estimated_delivery_date TIMESTAMP,      -- ETA
    actual_delivery_date    TIMESTAMP,
    scheduled_date          TIMESTAMP NOT NULL,
    
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracking Events (history of all status changes + GPS)
CREATE TABLE tracking_events (
    id                  BIGSERIAL PRIMARY KEY,
    shipment_id         BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    status              shipment_status NOT NULL,
    location_lat        DECIMAL(10, 8),
    location_lng        DECIMAL(11, 8),
    location_address    TEXT,                  -- Human-readable address
    event_description   TEXT,                  -- e.g., "Package handed to driver"
    event_timestamp     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 3. ROUTE MANAGEMENT


CREATE TABLE routes (
    id                  BIGSERIAL PRIMARY KEY,
    shipment_id         BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    
    -- Route details
    start_location      TEXT NOT NULL,
    end_location        TEXT NOT NULL,
    distance_km         DECIMAL(10, 2),
    planned_route_json  JSONB,                 -- Store waypoints/polyline from Google Maps
    actual_route_json   JSONB,                 -- Updated during live tracking
    
    -- Traffic & timing
    traffic_delay_minutes INT DEFAULT 0,
    started_at          TIMESTAMP,
    completed_at        TIMESTAMP,
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 4. PROOF OF DELIVERY (POD)


CREATE TABLE proofs_of_delivery (
    id                  BIGSERIAL PRIMARY KEY,
    shipment_id         BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    
    -- Evidence
    signature_data      TEXT,                  -- Base64 or stringified SVG
    photo_url           TEXT,                  -- URL from AWS S3 / Cloudinary
    delivery_notes      TEXT,
    
    -- Verification
    verified_by         BIGINT REFERENCES users(id) ON DELETE SET NULL,
    verification_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    verified_at         TIMESTAMP,
    
    captured_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 5. NOTIFICATIONS


CREATE TABLE notifications (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel             notification_channel NOT NULL,
    title               VARCHAR(255) NOT NULL,
    message             TEXT NOT NULL,
    is_read             BOOLEAN DEFAULT FALSE,
    read_at             TIMESTAMP,
    sent_at             TIMESTAMP,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 6. DELAY & ETA FORECASTING (for analytics)


CREATE TABLE delay_logs (
    id                          BIGSERIAL PRIMARY KEY,
    shipment_id                 BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    predicted_delay_minutes     INT,
    actual_delay_minutes        INT,
    delay_reason                TEXT,          -- e.g., "Traffic", "Weather", "Address issue"
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 7. PERFORMANCE INDEXES (Crucial for speed!)


CREATE INDEX idx_shipments_tracking_number ON shipments (tracking_number);
CREATE INDEX idx_shipments_customer_id    ON shipments (customer_id);
CREATE INDEX idx_shipments_status         ON shipments (status);
CREATE INDEX idx_shipments_driver_id      ON shipments (driver_id);
CREATE INDEX idx_shipments_estimated_delivery_date ON shipments (estimated_delivery_date);

CREATE INDEX idx_tracking_events_shipment_id ON tracking_events (shipment_id);
CREATE INDEX idx_tracking_events_timestamp   ON tracking_events (event_timestamp DESC);

CREATE INDEX idx_routes_shipment_id ON routes (shipment_id);

CREATE INDEX idx_pod_shipment_id ON proofs_of_delivery (shipment_id);

CREATE INDEX idx_notifications_user_id   ON notifications (user_id);
CREATE INDEX idx_notifications_is_read   ON notifications (is_read);
CREATE INDEX idx_notifications_created_at ON notifications (created_at DESC);


-- 8. AUTO-UPDATE TIMESTAMPS (Trigger function)


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

