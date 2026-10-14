-- ============================================================================
-- CONVERT PASSWORD RESET FROM OTP TO RESET LINK TOKEN
-- ============================================================================

-- Old OTP reset records should no longer be valid
DELETE FROM password_reset_tokens;

-- Remove old OTP index
DROP INDEX IF EXISTS idx_password_reset_otp;

-- Remove old OTP-specific columns
ALTER TABLE password_reset_tokens
DROP COLUMN IF EXISTS otp,
    DROP COLUMN IF EXISTS verified;

-- Add secure reset-link token
ALTER TABLE password_reset_tokens
    ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);

ALTER TABLE password_reset_tokens
    ALTER COLUMN reset_token SET NOT NULL;

-- Constraints and index
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_password_reset_token') THEN
        ALTER TABLE password_reset_tokens ADD CONSTRAINT uk_password_reset_token UNIQUE (reset_token);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_password_reset_user') THEN
        ALTER TABLE password_reset_tokens ADD CONSTRAINT uk_password_reset_user UNIQUE (user_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_password_reset_token
    ON password_reset_tokens(reset_token);