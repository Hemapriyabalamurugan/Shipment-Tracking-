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
    ADD COLUMN reset_token VARCHAR(255) NOT NULL;

-- Token must be unique
ALTER TABLE password_reset_tokens
    ADD CONSTRAINT uk_password_reset_token
        UNIQUE (reset_token);

-- Only one active reset token per user
ALTER TABLE password_reset_tokens
    ADD CONSTRAINT uk_password_reset_user
        UNIQUE (user_id);

-- Faster token lookup when user opens reset link
CREATE INDEX idx_password_reset_token
    ON password_reset_tokens(reset_token);