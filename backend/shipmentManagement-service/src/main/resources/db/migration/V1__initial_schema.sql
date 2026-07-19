-- ============================================================================
-- V1__INITIAL_SCHEMA.SQL
-- PART 1 : AUTHENTICATION + CORE TABLES
-- Logistics Management Platform
-- PostgreSQL
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- AUTO UPDATE updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- ============================================================================
-- USERS
-- ============================================================================

CREATE TABLE users
(
    id                  BIGSERIAL PRIMARY KEY,

    email               VARCHAR(255) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,

    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,

    phone               VARCHAR(20),

    role                VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',

    profile_image       TEXT,
    address             TEXT,
    company_name        TEXT,
    company_id          BIGINT,

    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    last_login          TIMESTAMP,

    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_user_role
        CHECK
            (
                role IN
                (
                    'CUSTOMER',
                    'BUSINESS_CLIENT',
                    'LOGISTICS_OPERATOR',
                    'SUPPORT_AGENT',
                    'ADMIN'
                )
            )
);

INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    phone,
    role,
    is_active
)
VALUES (
           'manojchini545@gmail.com',
           '$2a$10$3KM.Zfw0.NCuSCrDWBXyE.AeSFgceML613zJrGc8.8mLwnbxCTs7e',
           'Manoj',
           'Chini',
           '8116959362',
           'ADMIN',
           TRUE
       );

-- ============================================================================
-- COMPANIES
-- ============================================================================

CREATE TABLE companies
(
    id                  BIGSERIAL PRIMARY KEY,

    company_name        VARCHAR(255) NOT NULL,

    contact_person      VARCHAR(255),

    email               VARCHAR(255),

    phone               VARCHAR(30),

    gst_number          VARCHAR(50),

    tax_id              VARCHAR(100),

    website             VARCHAR(255),

    address             TEXT,

    city                VARCHAR(100),

    state               VARCHAR(100),

    postal_code         VARCHAR(20),

    country             VARCHAR(100) DEFAULT 'INDIA',

    is_active           BOOLEAN DEFAULT TRUE,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD CONSTRAINT fk_users_company
FOREIGN KEY(company_id)
REFERENCES companies(id)
ON DELETE SET NULL;

-- ============================================================================
-- VEHICLES
-- ============================================================================

CREATE TABLE vehicles
(
    id                  BIGSERIAL PRIMARY KEY,

    vehicle_number      VARCHAR(50) NOT NULL UNIQUE,

    vehicle_type        VARCHAR(50) NOT NULL,

    manufacturer        VARCHAR(100),

    model               VARCHAR(100),

    registration_number VARCHAR(100),

    capacity_kg         DECIMAL(10,2),

    current_driver_id   BIGINT,

    fuel_percentage     DECIMAL(5,2),

    average_speed       DECIMAL(6,2),

    status              VARCHAR(50) DEFAULT 'AVAILABLE',

    last_service_date   DATE,

    next_service_date   DATE,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_vehicle_status
        CHECK
        (
            status IN
            (
                'AVAILABLE',
                'ON_DELIVERY',
                'MAINTENANCE',
                'OUT_OF_SERVICE'
            )
        ),

    CONSTRAINT chk_capacity
        CHECK
        (
            capacity_kg IS NULL
            OR capacity_kg > 0
        )
);

ALTER TABLE vehicles
ADD CONSTRAINT fk_vehicle_driver
FOREIGN KEY(current_driver_id)
REFERENCES users(id)
ON DELETE SET NULL;

-- ============================================================================
-- VERIFICATION TOKENS
-- ============================================================================

CREATE TABLE verification_tokens
(
    id                  BIGSERIAL PRIMARY KEY,

    user_id             BIGINT NOT NULL,

    otp VARCHAR(10) NOT NULL,
    type                VARCHAR(30) NOT NULL,
    used                BOOLEAN DEFAULT FALSE,

    expires_at          TIMESTAMP NOT NULL,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_verification_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- PASSWORD RESET TOKENS
-- ============================================================================

CREATE TABLE password_reset_tokens
(
    id                  BIGSERIAL PRIMARY KEY,

    user_id             BIGINT NOT NULL,

    otp                 VARCHAR(10) NOT NULL,

--     used                BOOLEAN DEFAULT FALSE,
    verified            BOOLEAN DEFAULT FALSE,
--     expires_at          TIMESTAMP NOT NULL,
    expiry_time         TIMESTAMP NOT NULL,


    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_reset_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_password_reset_otp
    ON password_reset_tokens(otp);

-- ============================================================================
-- REFRESH TOKENS
-- ============================================================================

CREATE TABLE refresh_tokens
(
    id                  BIGSERIAL PRIMARY KEY,

    user_id             BIGINT NOT NULL,

    token               TEXT NOT NULL UNIQUE,

    expires_at          TIMESTAMP NOT NULL,

    revoked             BOOLEAN DEFAULT FALSE,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_refresh_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- USER ACTIVITY LOGS
-- ============================================================================

CREATE TABLE user_activity_logs
(
    id                  BIGSERIAL PRIMARY KEY,

    user_id             BIGINT,

    action              VARCHAR(100),

    module              VARCHAR(100),

    description         TEXT,

    ip_address          VARCHAR(100),

    user_agent          TEXT,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_users_role
ON users(role);

CREATE INDEX idx_users_company
ON users(company_id);

CREATE INDEX idx_vehicle_driver
ON vehicles(current_driver_id);

CREATE INDEX idx_company_name
ON companies(company_name);

CREATE INDEX idx_refresh_token_user
ON refresh_tokens(user_id);

CREATE INDEX idx_verification_user
ON verification_tokens(user_id);

CREATE INDEX idx_password_reset_user
ON password_reset_tokens(user_id);

CREATE INDEX idx_activity_user
ON user_activity_logs(user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE
ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_companies_updated_at
BEFORE UPDATE
ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_vehicles_updated_at
BEFORE UPDATE
ON vehicles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- SHIPMENTS
-- ============================================================================

CREATE TABLE shipments
(
    id                          BIGSERIAL PRIMARY KEY,

    tracking_number             VARCHAR(50) NOT NULL UNIQUE,

    customer_id                 BIGINT NOT NULL,
    business_client_id          BIGINT,
    driver_id                   BIGINT,
--     vehicle_id                  BIGINT,

    ----------------------------------------------------
    -- Sender Information
    ----------------------------------------------------

    sender_name                 VARCHAR(255) NOT NULL,
    sender_phone                VARCHAR(20),
    sender_email                VARCHAR(255),

    sender_address              TEXT NOT NULL,
    sender_city                 VARCHAR(100),
    sender_state                VARCHAR(100),
    sender_postal_code          VARCHAR(20),
    sender_country              VARCHAR(100) DEFAULT 'INDIA',

    ----------------------------------------------------
    -- Receiver Information
    ----------------------------------------------------

    receiver_name               VARCHAR(255) NOT NULL,
    receiver_phone              VARCHAR(20) NOT NULL,
    receiver_email              VARCHAR(255),

    receiver_address            TEXT NOT NULL,
    receiver_city               VARCHAR(100),
    receiver_state              VARCHAR(100),
    receiver_postal_code        VARCHAR(20),
    receiver_country            VARCHAR(100) DEFAULT 'INDIA',

    ----------------------------------------------------
    -- Package
    ----------------------------------------------------

    package_type                VARCHAR(50),

    package_description         TEXT,

    package_weight_kg           DECIMAL(10,2),

--     package_length_cm           DECIMAL(10,2),
--
--     package_width_cm            DECIMAL(10,2),
--
--     package_height_cm           DECIMAL(10,2),

    declared_value              DECIMAL(12,2),

    fragile                     BOOLEAN DEFAULT FALSE,

    insured                     BOOLEAN DEFAULT FALSE,

    cod_amount                  DECIMAL(12,2) DEFAULT 0,

    ----------------------------------------------------
    -- Shipment Details
    ----------------------------------------------------

    shipment_type               VARCHAR(50) DEFAULT 'STANDARD',

    priority                    VARCHAR(20) DEFAULT 'NORMAL',

    status                      VARCHAR(50) DEFAULT 'CREATED',

    delivery_attempts           INT DEFAULT 0,

    ----------------------------------------------------
    -- Live Location
    ----------------------------------------------------

    current_latitude            DECIMAL(10,8),

    current_longitude           DECIMAL(11,8),

    ----------------------------------------------------
    -- Timeline
    ----------------------------------------------------

    scheduled_pickup_at         TIMESTAMP,

    picked_up_at                TIMESTAMP,

    estimated_delivery_at       TIMESTAMP,

    delivered_at                TIMESTAMP,

    cancelled_at                TIMESTAMP,

    ----------------------------------------------------
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    ----------------------------------------------------

    CONSTRAINT fk_shipment_customer
        FOREIGN KEY(customer_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_shipment_business
        FOREIGN KEY(business_client_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_shipment_driver
        FOREIGN KEY(driver_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

--     CONSTRAINT fk_shipment_vehicle
--         FOREIGN KEY(vehicle_id)
--         REFERENCES vehicles(id)
--         ON DELETE SET NULL,

    ----------------------------------------------------

    CONSTRAINT chk_package_weight
        CHECK(package_weight_kg IS NULL OR package_weight_kg > 0),

    CONSTRAINT chk_cod_amount
        CHECK(cod_amount >= 0),

    CONSTRAINT chk_declared_value
        CHECK(declared_value IS NULL OR declared_value >= 0),

    ----------------------------------------------------

--     CONSTRAINT chk_package_type
--     CHECK
--     (
--         package_type IN
--         (
--             'DOCUMENT',
--             'BOX',
--             'PARCEL',
--             'PALLET'
--         )
--         OR package_type IS NULL
--     ),

    CONSTRAINT chk_priority
    CHECK
    (
        priority IN
        (
            'LOW',
            'NORMAL',
            'HIGH',
            'URGENT'
        )
    ),

    CONSTRAINT chk_shipment_type
    CHECK
    (
        shipment_type IN
        (
            'STANDARD',
            'EXPRESS',
            'SAME_DAY',
            'OVERNIGHT'
        )
    ),

    CONSTRAINT chk_shipment_status
    CHECK
    (
        status IN
        (
            'CREATED',
            'PICKED_UP',
            'IN_TRANSIT',
            'ARRIVED_AT_HUB',
            'OUT_FOR_DELIVERY',
            'DELIVERED',
            'FAILED_DELIVERY',
            'RETURNED',
            'CANCELLED'
        )
    ),
        CONSTRAINT chk_latitude
        CHECK (
            current_latitude IS NULL
        OR current_latitude BETWEEN -90 AND 90
        ),

    CONSTRAINT chk_longitude
        CHECK (
            current_longitude IS NULL
                OR current_longitude BETWEEN -180 AND 180
            )

);

-- ============================================================================
-- TRACKING EVENTS
-- ============================================================================

CREATE TABLE tracking_events
(
    id                      BIGSERIAL PRIMARY KEY,

    shipment_id             BIGINT NOT NULL,

    recorded_by             BIGINT,

    event_type              VARCHAR(50) NOT NULL,

    shipment_status         VARCHAR(50) NOT NULL,

    latitude                DECIMAL(10,8),

    longitude               DECIMAL(11,8),

    address                 TEXT,

    remarks                 TEXT,
--     extra down there
    created_by BIGINT
        REFERENCES users(id),

    event_time              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tracking_shipment
        FOREIGN KEY(shipment_id)
        REFERENCES shipments(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tracking_user
        FOREIGN KEY(recorded_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_tracking_status
    CHECK
    (
        shipment_status IN
        (
            'CREATED',
            'PICKED_UP',
            'IN_TRANSIT',
            'ARRIVED_AT_HUB',
            'OUT_FOR_DELIVERY',
            'DELIVERED',
            'FAILED_DELIVERY',
            'RETURNED',
            'CANCELLED'
        )
    ),
        CONSTRAINT chk_tracking_latitude
        CHECK (
            latitude IS NULL
        OR latitude BETWEEN -90 AND 90
        ),

    CONSTRAINT chk_tracking_longitude
        CHECK (
            longitude IS NULL
                OR longitude BETWEEN -180 AND 180
            )

);

-- ============================================================================
-- DELIVERY ASSIGNMENTS
-- ============================================================================

CREATE TABLE delivery_assignments
(
    id                      BIGSERIAL PRIMARY KEY,

    shipment_id             BIGINT NOT NULL,

    driver_id               BIGINT NOT NULL,

    vehicle_id              BIGINT,

    assigned_by             BIGINT,

    assigned_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    accepted_at             TIMESTAMP,

    rejected_at             TIMESTAMP,

    completed_at            TIMESTAMP,

    cancellation_reason     TEXT,

    status                  VARCHAR(50) DEFAULT 'ASSIGNED',

    CONSTRAINT fk_assignment_shipment
        FOREIGN KEY(shipment_id)
        REFERENCES shipments(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_driver
        FOREIGN KEY(driver_id)
        REFERENCES users(id),

--     CONSTRAINT fk_assignment_vehicle
--         FOREIGN KEY(vehicle_id)
--         REFERENCES vehicles(id),

    CONSTRAINT fk_assignment_admin
        FOREIGN KEY(assigned_by)
        REFERENCES users(id),

    CONSTRAINT chk_assignment_status
    CHECK
    (
        status IN
        (
            'ASSIGNED',
            'ACCEPTED',
            'REJECTED',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED'
        )
    )
);

-- ============================================================================
-- DRIVER LOCATIONS
-- ============================================================================

CREATE TABLE driver_locations
(
    id                      BIGSERIAL PRIMARY KEY,

    driver_id               BIGINT NOT NULL,

    vehicle_id              BIGINT,

    latitude                DECIMAL(10,8) NOT NULL,

    longitude               DECIMAL(11,8) NOT NULL,

    speed_kmh               DECIMAL(6,2),

    heading                 DECIMAL(6,2),

    accuracy                DECIMAL(8,2),

    battery_level           DECIMAL(5,2),

    recorded_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_driver_location_driver
        FOREIGN KEY(driver_id)
        REFERENCES users(id)
        ON DELETE CASCADE

--     CONSTRAINT fk_driver_location_vehicle
--         FOREIGN KEY(vehicle_id)
--         REFERENCES vehicles(id)
--         ON DELETE SET NULL
);

-- ============================================================================
-- ROUTES
-- ============================================================================

CREATE TABLE routes
(
    id                      BIGSERIAL PRIMARY KEY,

    shipment_id             BIGINT NOT NULL UNIQUE,

    start_location          TEXT NOT NULL,

    end_location            TEXT NOT NULL,

    distance_km             DECIMAL(10,2),

    estimated_duration_min  INT,

    traffic_delay_min       INT DEFAULT 0,

    planned_route_json      JSONB,

    actual_route_json       JSONB,

    started_at              TIMESTAMP,

    completed_at            TIMESTAMP,

    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_route_distance
        CHECK (
            distance_km IS NULL
                OR distance_km > 0
            ),


            CONSTRAINT fk_route_shipment
        FOREIGN KEY(shipment_id)
        REFERENCES shipments(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- PROOF OF DELIVERY
-- ============================================================================

CREATE TABLE proofs_of_delivery
(
    id                      BIGSERIAL PRIMARY KEY,

    shipment_id             BIGINT NOT NULL UNIQUE,

    signature_data          TEXT,

    recipient_name          VARCHAR(255),

    recipient_phone         VARCHAR(20),

    photo_url               TEXT,

    delivery_notes          TEXT,

    verified_by             BIGINT,

    verification_status     VARCHAR(50) DEFAULT 'PENDING',

    verified_at             TIMESTAMP,

    captured_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pod_shipment
        FOREIGN KEY(shipment_id)
        REFERENCES shipments(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pod_verified_by
        FOREIGN KEY(verified_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_pod_status
    CHECK
    (
        verification_status IN
        (
            'PENDING',
            'VERIFIED',
            'REJECTED'
        )
    )
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER trg_shipments_updated_at
BEFORE UPDATE
ON shipments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_shipments_tracking_number
ON shipments(tracking_number);

CREATE INDEX idx_shipments_customer
ON shipments(customer_id);

CREATE INDEX idx_shipments_driver
ON shipments(driver_id);

-- CREATE INDEX idx_shipments_vehicle
-- ON shipments(vehicle_id);

CREATE INDEX idx_shipments_status
ON shipments(status);

CREATE INDEX idx_tracking_events_shipment
ON tracking_events(shipment_id);

CREATE INDEX idx_tracking_events_time
ON tracking_events(event_time DESC);

CREATE INDEX idx_assignments_driver
ON delivery_assignments(driver_id);

CREATE INDEX idx_driver_locations_driver
ON driver_locations(driver_id);

CREATE INDEX idx_driver_locations_time
ON driver_locations(recorded_at DESC);

CREATE INDEX idx_routes_shipment
ON routes(shipment_id);

CREATE INDEX idx_pod_shipment
ON proofs_of_delivery(shipment_id);


-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications
(
    id                  BIGSERIAL PRIMARY KEY,

    user_id             BIGINT NOT NULL,

    shipment_id         BIGINT,

    channel             VARCHAR(30) NOT NULL,

    title               VARCHAR(255) NOT NULL,

    message             TEXT NOT NULL,

    priority            VARCHAR(20) DEFAULT 'NORMAL',

    is_read             BOOLEAN DEFAULT FALSE,

    read_at             TIMESTAMP,

    sent_at             TIMESTAMP,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_notification_shipment
        FOREIGN KEY(shipment_id)
        REFERENCES shipments(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_notification_channel
    CHECK
    (
        channel IN
        (
            'EMAIL',
            'SMS',
            'PUSH',
            'IN_APP'
        )
    ),

    CONSTRAINT chk_notification_priority
    CHECK
    (
        priority IN
        (
            'LOW',
            'NORMAL',
            'HIGH'
        )
    )
);

-- ============================================================================
-- SUPPORT TICKETS
-- ============================================================================

CREATE TABLE support_tickets
(
    id                      BIGSERIAL PRIMARY KEY,

    ticket_number           VARCHAR(50) UNIQUE NOT NULL,

    customer_id             BIGINT NOT NULL,

    shipment_id             BIGINT,

    assigned_to             BIGINT,

    subject                 VARCHAR(255) NOT NULL,

    description             TEXT,

    category                VARCHAR(50),

    priority                VARCHAR(20) DEFAULT 'NORMAL',

    status                  VARCHAR(30) DEFAULT 'OPEN',

    resolved_at             TIMESTAMP,

    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_customer
        FOREIGN KEY(customer_id)
        REFERENCES users(id),

    CONSTRAINT fk_ticket_assigned
        FOREIGN KEY(assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_ticket_shipment
        FOREIGN KEY(shipment_id)
        REFERENCES shipments(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_ticket_status
    CHECK
    (
        status IN
        (
            'OPEN',
            'IN_PROGRESS',
            'WAITING_CUSTOMER',
            'RESOLVED',
            'CLOSED'
        )
    )
);

-- ============================================================================
-- TICKET MESSAGES
-- ============================================================================

CREATE TABLE ticket_messages
(
    id                  BIGSERIAL PRIMARY KEY,

    ticket_id           BIGINT NOT NULL,

    sender_id           BIGINT NOT NULL,

    message             TEXT NOT NULL,

    attachment_url      TEXT,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_message_ticket
        FOREIGN KEY(ticket_id)
        REFERENCES support_tickets(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_message_sender
        FOREIGN KEY(sender_id)
        REFERENCES users(id)
);

-- ============================================================================
-- INVOICES
-- ============================================================================

CREATE TABLE invoices
(
    id                      BIGSERIAL PRIMARY KEY,

    invoice_number          VARCHAR(50) UNIQUE NOT NULL,

    shipment_id             BIGINT,

    customer_id             BIGINT NOT NULL,

    company_id              BIGINT,

    subtotal                DECIMAL(12,2) NOT NULL,

    tax                     DECIMAL(12,2) DEFAULT 0,

    discount                DECIMAL(12,2) DEFAULT 0,

    total_amount            DECIMAL(12,2) NOT NULL,

    payment_status          VARCHAR(30) DEFAULT 'PENDING',

    payment_method          VARCHAR(50),

    issued_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    due_date                TIMESTAMP,

    paid_at                 TIMESTAMP,

    CONSTRAINT fk_invoice_customer
        FOREIGN KEY(customer_id)
        REFERENCES users(id),

    CONSTRAINT fk_invoice_company
        FOREIGN KEY(company_id)
        REFERENCES companies(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_invoice_shipment
        FOREIGN KEY(shipment_id)
        REFERENCES shipments(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_payment_status
    CHECK
    (
        payment_status IN
        (
            'PENDING',
            'PAID',
            'FAILED',
            'REFUNDED'
        )
    )
);

-- =========================================================================================
-- ANALYTICS_PART
-- ========================================================================================
CREATE TABLE analytics_summary (
                                   id BIGSERIAL PRIMARY KEY,
                                   report_date DATE NOT NULL,
                                   total_users INT,
                                   total_shipments INT,
                                   delivered_shipments INT,
                                   pending_shipments INT,
                                   failed_deliveries INT,
                                   active_drivers INT,
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ============================================================================
-- DELAY LOGS
-- ============================================================================

CREATE TABLE delay_logs
(
    id                          BIGSERIAL PRIMARY KEY,

    shipment_id                 BIGINT NOT NULL,

    predicted_delay_minutes     INT,

    actual_delay_minutes        INT,

    reason                      TEXT,

    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_delay_shipment
        FOREIGN KEY(shipment_id)
        REFERENCES shipments(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_notifications_user
ON notifications(user_id);

CREATE INDEX idx_notifications_shipment
ON notifications(shipment_id);

CREATE INDEX idx_notifications_read
ON notifications(is_read);

CREATE INDEX idx_support_customer
ON support_tickets(customer_id);

CREATE INDEX idx_support_status
ON support_tickets(status);

CREATE INDEX idx_support_assigned
ON support_tickets(assigned_to);

CREATE INDEX idx_ticket_messages_ticket
ON ticket_messages(ticket_id);

CREATE INDEX idx_invoice_customer
ON invoices(customer_id);

CREATE INDEX idx_invoice_company
ON invoices(company_id);

CREATE INDEX idx_invoice_shipment
ON invoices(shipment_id);

CREATE INDEX idx_delay_logs_shipment
ON delay_logs(shipment_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER trg_support_ticket_updated_at
BEFORE UPDATE
ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
