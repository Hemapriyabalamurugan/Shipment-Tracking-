ALTER TABLE shipments
    ADD COLUMN cancelled_by_customer BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN cancellation_reason VARCHAR(1000);